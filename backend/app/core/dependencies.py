from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_access_token
from app.models.db_models import User

# OAuth2 scheme extracting Bearer token from Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Item 4: Validate JWT Bearer token and retrieve the authenticated user.
    Enforces expiration, cryptographic signature, and revocation checks.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or session has expired.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise credentials_exception

    return user


async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Item 3: Lock admin page.
    Strictly checks that the authenticated user possesses the 'admin' role.
    Raises 403 Forbidden for non-administrators.
    """
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Administrator privileges are required to access this resource."
        )
    return current_user


async def get_current_merchant_id(
    current_user: User = Depends(get_current_user)
) -> str:
    """
    Item 5: Enforce that users only see their data.
    Provides the merchant_id of the authenticated user to scope all database operations.
    """
    return current_user.merchant_id
