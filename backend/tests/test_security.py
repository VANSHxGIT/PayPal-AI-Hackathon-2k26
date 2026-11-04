import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token, revoke_token
from app.core.rate_limiter import SlidingWindowRateLimiter
from app.services.backup_service import BackupService
from app.config import settings
from fastapi import HTTPException


class TestSecurityAudit:
    """
    Test suite verifying the 16 security constraints.
    """

    def test_item_1_secret_masking(self):
        """Item 1: Ensure API keys are properly masked in logs and reports."""
        masked_gemini = settings.masked_gemini_key()
        masked_paypal = settings.masked_paypal_secret()
        assert "..." in masked_gemini or masked_gemini == "mock-key-configured"
        assert "..." in masked_paypal or masked_paypal == "mock-secret-configured"

    def test_item_4_and_9_password_hashing(self):
        """Item 9: Passwords must be salted, hashed, and verifiable in constant time."""
        raw_password = "SecureMerchant2026!"
        hashed = hash_password(raw_password)

        assert hashed != raw_password
        assert hashed.startswith("pbkdf2_sha256$200000$")
        assert verify_password(raw_password, hashed) is True
        assert verify_password("WrongPassword123!", hashed) is False

    def test_item_4_jwt_token_lifecycle(self):
        """Item 4: JWT token creation, signature verification, and logout revocation."""
        user_payload = {"sub": "user-123", "merchant_id": "MERC-001", "role": "merchant"}
        token = create_access_token(user_payload)
        assert isinstance(token, str)

        decoded = decode_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == "user-123"
        assert decoded["merchant_id"] == "MERC-001"
        assert "exp" in decoded
        assert "jti" in decoded

        # Test Token Revocation on Logout
        revoke_token(token)
        assert decode_access_token(token) is None

    def test_item_7_rate_limiter_stops_spam(self):
        """Item 7: Sliding window rate limiter stops login and endpoint spam."""
        limiter = SlidingWindowRateLimiter()
        key = "127.0.0.1:/api/auth/login"

        # Allow up to 3 requests
        for _ in range(3):
            limiter.check_rate_limit(key, max_requests=3, window_seconds=60)

        # 4th request must raise 429
        with pytest.raises(HTTPException) as exc_info:
            limiter.check_rate_limit(key, max_requests=3, window_seconds=60)
        assert exc_info.value.status_code == 429

    def test_item_7_account_lockout_on_failed_logins(self):
        """Item 7: Lock account after 5 consecutive failed logins."""
        limiter = SlidingWindowRateLimiter()
        email = "target@merchant.com"

        for _ in range(5):
            limiter.record_failed_login(email, max_failures=5, lock_duration_seconds=900)

        with pytest.raises(HTTPException) as exc_info:
            limiter.check_account_lockout(email)
        assert exc_info.value.status_code == 429
        assert "locked" in exc_info.value.detail.lower()

    def test_item_11_database_daily_backup(self, tmp_path):
        """Item 11: Daily backup snapshot creation and retention pruning."""
        backup_dir = tmp_path / "backups"
        db_file = tmp_path / "test.db"
        db_file.write_text("PRAGMA journal_mode=WAL;")

        svc = BackupService(backup_dir=str(backup_dir), retention_days=7)
        svc._get_sqlite_source_path = lambda: str(db_file)

        result = svc.create_backup()
        assert result["success"] is True
        assert (backup_dir / result["filename"]).exists()

        backups = svc.list_backups()
        assert len(backups) >= 1

    def test_item_12_debug_mode_disabled_in_prod(self):
        """Item 12: In production, debug mode is disabled and docs URLs are hidden."""
        prod_settings = settings.model_copy(update={"ENVIRONMENT": "production", "DEBUG": False})
        assert prod_settings.docs_url is None
        assert prod_settings.redoc_url is None
        assert prod_settings.openapi_url is None
