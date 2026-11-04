import uuid
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Set
import jwt
from app.config import settings

# Thread-safe in-memory revoked token set (JTI blacklist)
REVOKED_TOKENS: Set[str] = set()

# Safe PBKDF2 + SHA256 Salted Hasher (Item 9: Hash passwords securely without vulnerable dependencies)
PBKDF2_ROUNDS = 200_000


def hash_password(password: str) -> str:
    """
    Item 9: Securely hash a password using PBKDF2-HMAC-SHA256 with 200,000 rounds and a 16-byte random salt.
    Format: pbkdf2_sha256$<rounds>$<hex_salt>$<hex_hash>
    """
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    salt = secrets.token_bytes(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ROUNDS)
    return f"pbkdf2_sha256${PBKDF2_ROUNDS}${salt.hex()}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Item 9: Verify a password against its salted hash in constant time to prevent timing attacks.
    """
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        rounds = int(parts[1])
        salt = bytes.fromhex(parts[2])
        expected_key = bytes.fromhex(parts[3])
        actual_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, rounds)
        return hmac.compare_digest(actual_key, expected_key)
    except Exception:
        return False


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Item 4: Create a cryptographically signed JWT token with sub, merchant_id, role, exp, and jti.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    jti = str(uuid.uuid4())
    to_encode.update({
        "exp": expire,
        "iat": now,
        "jti": jti
    })
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Item 4: Decode and validate JWT token signature, expiration, and revocation status.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        jti = payload.get("jti")
        if jti and jti in REVOKED_TOKENS:
            return None
        return payload
    except jwt.PyJWTError:
        return None


def revoke_token(token: str) -> bool:
    """
    Revoke a JWT token by adding its JTI to the revocation list upon logout.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": False}
        )
        jti = payload.get("jti")
        if jti:
            REVOKED_TOKENS.add(jti)
            return True
        return False
    except jwt.PyJWTError:
        return False
