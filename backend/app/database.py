import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Item 10: Lock Database — SQLite with WAL mode, foreign keys, and safe connection pooling
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

# Apply SQLite hardening pragmas
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        # Item 10: Lock Database — Enable Write-Ahead Logging for high concurrency & corruption resistance
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Database dependency ensuring clean session lifecycle, rollback on error, and proper close.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Create all database tables and enforce file security permissions."""
    Base.metadata.create_all(bind=engine)
    
    # Item 10: Lock Database — Restrict database file permissions (read/write for owner only)
    if settings.DATABASE_URL.startswith("sqlite:///"):
        db_path = settings.DATABASE_URL.replace("sqlite:///", "")
        if os.path.exists(db_path):
            try:
                os.chmod(db_path, 0o600)
            except Exception:
                pass  # Handled gracefully on Windows systems where POSIX chmod is limited
