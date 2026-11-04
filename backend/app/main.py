import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import init_db, SessionLocal
from app.models.db_models import User
from app.core.security import hash_password
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.error_handlers import (
    unhandled_exception_handler,
    http_exception_handler,
    validation_exception_handler
)
from app.services.backup_service import start_daily_backup_scheduler, backup_service

# Import API routers
from app.api.auth import router as auth_router
from app.api.disputes import router as disputes_router
from app.api.webhooks import router as webhooks_router
from app.api.simulate import router as simulate_router
from app.api.stream import router as stream_router
from app.api.admin import router as admin_router

logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("disputemind")


def seed_initial_demo_users():
    """Seeds baseline admin and merchant accounts with salted hashed passwords."""
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            admin_user = User(
                email="admin@disputemind.ai",
                hashed_password=hash_password("AdminSecurePass2026!"),  # Item 9: Salted Hash
                merchant_id="MERC-ADMIN-GLOBAL",
                company_name="DisputeMind Global Operations",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            logger.info("[INIT] Seeded default secure administrator account: admin@disputemind.ai")

        # Check if demo merchant exists
        merchant = db.query(User).filter(User.email == "merchant@shop.com").first()
        if not merchant:
            demo_merchant = User(
                email="merchant@shop.com",
                hashed_password=hash_password("MerchantPass2026!"),  # Item 9: Salted Hash
                merchant_id="MERC-DEFAULT-001",
                company_name="Apex Electronics Store",
                role="merchant",
                is_active=True
            )
            db.add(demo_merchant)
            logger.info("[INIT] Seeded default merchant account: merchant@shop.com (MERC-DEFAULT-001)")

        db.commit()
    except Exception as e:
        logger.error(f"[INIT ERROR] Failed to seed demo users: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    logger.info("Initializing DisputeMind AI Backend...")
    init_db()  # Item 10: Lock database & create tables
    seed_initial_demo_users()  # Seed demo accounts with salted hashes
    
    # Item 11: Create startup backup and launch daily backup scheduler
    backup_service.create_backup()
    scheduler_task = asyncio.create_task(start_daily_backup_scheduler())

    yield

    # Shutdown Sequence
    scheduler_task.cancel()
    logger.info("DisputeMind AI Backend shutdown complete.")


# Item 12: Disable debug mode in production (hides docs_url, redoc_url, and openapi_url if not in debug)
app = FastAPI(
    title="DisputeMind AI API",
    description="Autonomous Chargeback & Dispute Defense Agent for PayPal Merchants",
    version="1.0.0",
    docs_url=settings.docs_url,
    redoc_url=settings.redoc_url,
    openapi_url=settings.openapi_url,
    lifespan=lifespan
)

# Item 8: Attach Security Headers Middleware (HTTPS, HSTS, CSP, X-Frame-Options)
app.add_middleware(SecurityHeadersMiddleware)

# Cross-Origin Resource Sharing (CORS) with origin restrictions
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Retry-After"]
)

# Item 14: Register Global Exception Handlers (Hide stack traces & sanitize error output)
app.add_exception_handler(Exception, unhandled_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Register API Routers
app.include_router(auth_router)
app.include_router(disputes_router)
app.include_router(webhooks_router)
app.include_router(simulate_router)
app.include_router(stream_router)
app.include_router(admin_router)


@app.get("/health", tags=["Health & Status"])
async def health_check():
    """Sanitized health check endpoint revealing zero sensitive keys."""
    return {
        "status": "healthy",
        "service": "DisputeMind AI Core",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "debug_mode": settings.DEBUG,
        "paypal_mode": settings.PAYPAL_MODE,
        "ai_model": settings.GEMINI_MODEL
    }

