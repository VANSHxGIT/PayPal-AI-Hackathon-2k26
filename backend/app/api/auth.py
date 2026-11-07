import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import User
from app.models.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse
from app.core.security import hash_password, verify_password, create_access_token, revoke_token
from app.core.dependencies import get_current_user, oauth2_scheme
from app.core.rate_limiter import limiter
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication & Access"])


@router.post(
    "/register",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new merchant account"
)
async def register(
    request: Request,
    payload: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Item 4 & 6: Validate form, stop registration spam, and securely hash password.
    """
    client_ip = request.client.host if request.client else "unknown"
    limiter.check_rate_limit(f"register:{client_ip}", max_requests=5, window_seconds=60)

    # Check for existing email
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Generate unique merchant identifier for multi-tenancy (Item 5)
    merchant_id = f"MERC-{uuid.uuid4().hex[:8].upper()}"

    # Item 9: Hash password with salt
    hashed = hash_password(payload.password)

    new_user = User(
        email=payload.email.lower(),
        hashed_password=hashed,
        merchant_id=merchant_id,
        company_name=payload.company_name,
        role=payload.role,
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate merchant and obtain JWT token"
)
async def login(
    request: Request,
    payload: UserLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Item 4 & 7: Stop login spam, prevent brute force attacks, and issue signed JWT.
    """
    client_ip = request.client.host if request.client else "unknown"
    normalized_email = payload.email.lower()

    # Item 7: Check account lockout and IP-based rate limiting
    limiter.check_account_lockout(normalized_email)
    limiter.check_rate_limit(
        f"login:{client_ip}",
        max_requests=settings.RATE_LIMIT_LOGIN_PER_MINUTE,
        window_seconds=60
    )

    user = db.query(User).filter(User.email == normalized_email, User.is_active == True).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        # Item 7: Record failed attempt and trigger lockout if limit reached
        limiter.record_failed_login(normalized_email, max_failures=5, lock_duration_seconds=900)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Reset failure counter on successful authentication
    limiter.reset_failed_login(normalized_email)

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token_payload = {
        "sub": user.id,
        "email": user.email,
        "merchant_id": user.merchant_id,
        "role": user.role,
        "company_name": user.company_name
    }
    token = create_access_token(token_payload)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        merchant_id=user.merchant_id,
        role=user.role,
        company_name=user.company_name
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current authenticated user profile"
)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Item 4 & 9: Safe user representation without revealing password hash.
    """
    return current_user


@router.post(
    "/logout",
    summary="Revoke current JWT access token"
)
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Item 4: Revokes token JTI from server validation.
    """
    revoke_token(token)
    return {"success": True, "message": "Successfully logged out and session revoked."}

