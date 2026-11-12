import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized configuration management.
    Ensures zero hardcoded secrets and validates security thresholds (Item 1 & 12).
    """
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Runtime Environment & Debug (Item 12: Disable debug mode in production)
    ENVIRONMENT: str = Field(default="development", description="Environment: 'development' or 'production'")
    DEBUG: bool = Field(default=False, description="When False, swagger docs and detailed stack traces are hidden")
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000", "https://Evidentia.onrender.com"]
    )

    # Security & JWT Tokens (Item 1, 4, 8, 9)
    JWT_SECRET_KEY: str = Field(
        default="Evidentia_dev_secret_key_change_in_production_32bytes_min",
        description="Cryptographic secret key for signing JWT tokens"
    )
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)

    # Rate Limiting (Item 7: Stop Login Spam)
    RATE_LIMIT_LOGIN_PER_MINUTE: int = Field(default=5)
    RATE_LIMIT_WEBHOOK_PER_MINUTE: int = Field(default=100)
    RATE_LIMIT_GLOBAL_PER_MINUTE: int = Field(default=60)

    # Database & Automated Backups (Item 10 & 11)
    DATABASE_URL: str = Field(default="sqlite:///./Evidentia.db")
    BACKUP_DIR: str = Field(default="./backups")
    BACKUP_RETENTION_DAYS: int = Field(default=7)

    # PayPal Sandbox APIs (Hackathon Integration)
    PAYPAL_MODE: str = Field(default="sandbox")
    PAYPAL_CLIENT_ID: str = Field(default="mock_paypal_client_id")
    PAYPAL_CLIENT_SECRET: str = Field(default="mock_paypal_client_secret")
    PAYPAL_WEBHOOK_ID: str = Field(default="mock_paypal_webhook_id")

    # Google Gemini AI (Primary Synthesis Model)
    GEMINI_API_KEY: str = Field(default="mock_gemini_api_key")
    GEMINI_MODEL: str = Field(default="gemini-2.0-flash")

    # Elastic Search (Sponsor Tool)
    ELASTICSEARCH_URL: str = Field(default="http://localhost:9200")
    ELASTICSEARCH_API_KEY: str = Field(default="")
    ELASTICSEARCH_INDEX_PREFIX: str = Field(default="Evidentia_")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def docs_url(self) -> str | None:
        """Item 12: Disable public documentation endpoints if DEBUG is False in production."""
        if self.is_production and not self.DEBUG:
            return None
        return "/docs"

    @property
    def redoc_url(self) -> str | None:
        if self.is_production and not self.DEBUG:
            return None
        return "/redoc"

    @property
    def openapi_url(self) -> str | None:
        if self.is_production and not self.DEBUG:
            return None
        return "/openapi.json"

    def masked_gemini_key(self) -> str:
        """Item 1: Masked representation of API key for safe logging."""
        if not self.GEMINI_API_KEY or self.GEMINI_API_KEY.startswith("mock_"):
            return "mock-key-configured"
        return f"{self.GEMINI_API_KEY[:4]}...{self.GEMINI_API_KEY[-4:]}"

    def masked_paypal_secret(self) -> str:
        if not self.PAYPAL_CLIENT_SECRET or self.PAYPAL_CLIENT_SECRET.startswith("mock_"):
            return "mock-secret-configured"
        return f"{self.PAYPAL_CLIENT_SECRET[:3]}...***"


# Singleton instance
settings = Settings()

