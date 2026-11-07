import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class UserRegisterRequest(BaseModel):
    """
    Item 6: Check every form — strictly validate user registration inputs.
    """
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=8, max_length=128, description="Minimum 8 characters with letters and numbers")
    company_name: str = Field(min_length=2, max_length=100)
    role: str = Field(default="merchant", pattern="^(merchant|admin)$")

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Za-z]", v) or not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one letter and one number.")
        return v

    @field_validator("company_name")
    @classmethod
    def sanitize_company_name(cls, v: str) -> str:
        # Strip potential HTML or script injection
        clean = re.sub(r"[<>]", "", v.strip())
        if not clean:
            raise ValueError("Company name contains invalid characters.")
        return clean


class UserLoginRequest(BaseModel):
    """
    Item 6: Check every form — login request schema.
    """
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    merchant_id: str
    role: str
    company_name: str


class UserProfileResponse(BaseModel):
    """
    Item 9: Safe user representation — NEVER leaks hashed_password!
    """
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    merchant_id: str
    company_name: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None


class DisputeResponse(BaseModel):
    """
    Dispute model for UI consumption with tenant isolation.
    """
    model_config = ConfigDict(from_attributes=True)

    id: str
    merchant_id: str
    transaction_id: str
    amount: float
    currency: str
    reason: str
    status: str
    buyer_name: Optional[str] = None
    buyer_message: Optional[str] = None
    evidence_type: Optional[str] = None
    tracking_number: Optional[str] = None
    carrier_name: Optional[str] = None
    ai_defense_notes: Optional[str] = None
    confidence_score: float = 0.0
    execution_time_seconds: Optional[float] = None
    created_at: datetime
    updated_at: datetime


class DisputeSimulateRequest(BaseModel):
    """
    Payload for initiating a simulated dispute in the sandbox.
    """
    model_config = ConfigDict(extra="forbid")

    dispute_id: Optional[str] = Field(default=None, pattern=r"^[A-Za-z0-9\-_]{5,64}$")
    transaction_id: str = Field(pattern=r"^[A-Za-z0-9\-_]{5,64}$")
    amount: float = Field(gt=0, le=100000.0)
    currency: str = Field(default="USD", pattern=r"^[A-Z]{3}$")
    reason: str = Field(
        default="MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
        pattern=r"^(MERCHANDISE_OR_SERVICE_NOT_RECEIVED|UNAUTHORIZED_TRANSACTION|NOT_AS_DESCRIBED)$"
    )
    buyer_name: Optional[str] = Field(default="Alex Mercer", max_length=100)
    buyer_message: Optional[str] = Field(
        default="Package was marked as delivered but never arrived at my doorstep.",
        max_length=500
    )


class TrackingInfoItem(BaseModel):
    carrier_name: str
    tracking_number: str


class PayPalEvidencePayload(BaseModel):
    """
    Official PayPal POST /v1/customer/disputes/{id}/provide-evidence schema.
    """
    evidence_type: str = Field(
        pattern=r"^(PROOF_OF_FULFILLMENT|PROOF_OF_DELIVERY|RETURN_POLICY|REFUND_POLICY|CUSTOMER_COMMUNICATION)$"
    )
    evidence_info: Optional[dict] = None
    notes: str = Field(min_length=10, max_length=2000)


class WebhookEventPayload(BaseModel):
    """
    Schema for validating incoming PayPal Webhook payloads.
    """
    id: str
    event_type: str
    resource_type: str
    resource: dict

