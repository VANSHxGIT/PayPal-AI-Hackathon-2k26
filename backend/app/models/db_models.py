import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, Index
from app.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    """
    Item 4 & 5: Proper login architecture with multi-tenant isolation and RBAC.
    """
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)  # Item 9: Never stored plain text
    merchant_id = Column(String(64), index=True, nullable=False)  # Item 5: Tenant identifier
    company_name = Column(String(255), nullable=False)
    role = Column(String(32), default="merchant", nullable=False)  # Item 3: "merchant" or "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("idx_user_email_active", "email", "is_active"),
    )


class DisputeRecord(Base):
    """
    Item 5: Tenant-isolated dispute defense record.
    Merchants only query rows matching their merchant_id.
    """
    __tablename__ = "disputes"

    id = Column(String(64), primary_key=True)  # PayPal Dispute ID (e.g. PP-D-99214) or internal UUID
    merchant_id = Column(String(64), index=True, nullable=False)  # Item 5: Strict tenant barrier
    transaction_id = Column(String(64), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="USD", nullable=False)
    reason = Column(String(64), nullable=False)  # e.g. MERCHANDISE_OR_SERVICE_NOT_RECEIVED
    status = Column(String(32), default="PROCESSING", nullable=False)  # AUTO_DEFENDED, MANUAL_REVIEW, etc.
    buyer_name = Column(String(255), nullable=True)
    buyer_message = Column(Text, nullable=True)
    
    # AI & Defense Package Details
    evidence_type = Column(String(64), nullable=True)  # PROOF_OF_FULFILLMENT, RETURN_POLICY
    tracking_number = Column(String(128), nullable=True)
    carrier_name = Column(String(64), nullable=True)
    ai_defense_notes = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)
    paypal_response_code = Column(Integer, nullable=True)
    execution_time_seconds = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now, nullable=False)

    __table_args__ = (
        Index("idx_dispute_merchant_status", "merchant_id", "status"),
        Index("idx_dispute_txn_id", "transaction_id"),
    )


class MerchantOrder(Base):
    """
    Simulated internal merchant ERP records used for RAG evidence synthesis.
    """
    __tablename__ = "merchant_orders"

    order_id = Column(String(64), primary_key=True)
    merchant_id = Column(String(64), index=True, nullable=False)
    transaction_id = Column(String(64), index=True, nullable=False)
    buyer_name = Column(String(255), nullable=False)
    buyer_email = Column(String(255), nullable=False)
    shipping_address = Column(Text, nullable=False)
    carrier = Column(String(64), nullable=False)
    tracking_number = Column(String(128), nullable=False)
    delivery_status = Column(String(64), default="DELIVERED", nullable=False)
    signature_name = Column(String(255), nullable=True)
    item_summary = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    delivery_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)


class MerchantChat(Base):
    """
    Customer support CRM chat transcripts for evidence corroboration.
    """
    __tablename__ = "merchant_chats"

    ticket_id = Column(String(64), primary_key=True)
    merchant_id = Column(String(64), index=True, nullable=False)
    transaction_id = Column(String(64), index=True, nullable=False)
    transcript = Column(Text, nullable=False)
    customer_sentiment = Column(String(32), default="NEUTRAL")
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)


class AuditLog(Base):
    """
    Security audit trails for monitoring access and dispute actions.
    """
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String(64), index=True, nullable=True)
    user_id = Column(String(36), nullable=True)
    action = Column(String(64), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(64), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
