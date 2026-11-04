import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status


class SlidingWindowRateLimiter:
    """
    Item 7: Stop Login Spam and brute force attacks via sliding window rate limiting.
    Tracks request timestamps per client identifier (IP address, user account, or endpoint).
    """

    def __init__(self):
        # Maps key -> list of Unix timestamps
        self.history: Dict[str, List[float]] = defaultdict(list)
        # Account lockout tracking: email -> failed count and locked_until timestamp
        self.failed_logins: Dict[str, List[float]] = defaultdict(list)
        self.locked_accounts: Dict[str, float] = {}

    def _cleanup_old_entries(self, timestamps: List[float], window_seconds: int, now: float) -> List[float]:
        cutoff = now - window_seconds
        return [ts for ts in timestamps if ts > cutoff]

    def check_rate_limit(
        self,
        key: str,
        max_requests: int,
        window_seconds: int = 60
    ) -> None:
        """
        Enforce rate limit for a given key.
        Raises HTTP 429 if limit is exceeded.
        """
        now = time.time()
        valid_ts = self._cleanup_old_entries(self.history[key], window_seconds, now)
        self.history[key] = valid_ts

        if len(valid_ts) >= max_requests:
            retry_after = int(window_seconds - (now - valid_ts[0])) if valid_ts else window_seconds
            retry_after = max(1, retry_after)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds}s.",
                headers={"Retry-After": str(retry_after)}
            )

        self.history[key].append(now)

    def record_failed_login(self, email: str, max_failures: int = 5, lock_duration_seconds: int = 900) -> None:
        """
        Item 7: Track repeated failed login attempts.
        Locks account for 15 minutes after 5 consecutive failures.
        """
        now = time.time()
        self.failed_logins[email] = self._cleanup_old_entries(self.failed_logins[email], lock_duration_seconds, now)
        self.failed_logins[email].append(now)

        if len(self.failed_logins[email]) >= max_failures:
            self.locked_accounts[email] = now + lock_duration_seconds

    def check_account_lockout(self, email: str) -> None:
        now = time.time()
        locked_until = self.locked_accounts.get(email)
        if locked_until and now < locked_until:
            remaining = int(locked_until - now)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Account temporarily locked due to multiple failed login attempts. Retry in {remaining}s.",
                headers={"Retry-After": str(remaining)}
            )
        elif locked_until and now >= locked_until:
            del self.locked_accounts[email]
            self.failed_logins[email] = []

    def reset_failed_login(self, email: str) -> None:
        self.failed_logins.pop(email, None)
        self.locked_accounts.pop(email, None)


# Global singleton rate limiter instance
limiter = SlidingWindowRateLimiter()


def rate_limit(max_requests: int = 60, window_seconds: int = 60):
    """FastAPI Dependency for route-level rate limiting by client IP."""
    async def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown_client"
        endpoint = request.url.path
        key = f"{client_ip}:{endpoint}"
        limiter.check_rate_limit(key, max_requests=max_requests, window_seconds=window_seconds)
    return dependency
