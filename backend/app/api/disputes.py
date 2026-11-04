from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import DisputeRecord, User
from app.models.schemas import DisputeResponse
from app.core.dependencies import get_current_user
from app.services.elastic_service import elastic_service

router = APIRouter(prefix="/api/disputes", tags=["Dispute Command Center"])


@router.get(
    "",
    response_model=List[DisputeResponse],
    summary="List disputes with strict tenant isolation"
)
async def list_disputes(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Item 5: Make sure users only see their data.
    Merchants only receive disputes belonging to their merchant_id.
    Admins can see all disputes.
    """
    query = db.query(DisputeRecord)

    # Item 5: Multi-Tenant Barrier
    if current_user.role.lower() != "admin":
        query = query.filter(DisputeRecord.merchant_id == current_user.merchant_id)

    if status_filter:
        query = query.filter(DisputeRecord.status == status_filter.upper())

    disputes = query.order_by(DisputeRecord.created_at.desc()).all()
    return disputes


@router.get(
    "/{dispute_id}",
    response_model=DisputeResponse,
    summary="Get single dispute by ID (Tenant Protected)"
)
async def get_dispute(
    dispute_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Item 5: Multi-Tenant IDOR defense.
    Rejects requests for disputes belonging to another merchant with 404 Not Found.
    """
    query = db.query(DisputeRecord).filter(DisputeRecord.id == dispute_id)

    if current_user.role.lower() != "admin":
        query = query.filter(DisputeRecord.merchant_id == current_user.merchant_id)

    dispute = query.first()
    if not dispute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispute record not found or access denied."
        )

    return dispute


@router.get(
    "/{dispute_id}/evidence-inspector",
    summary="Inspect raw Elastic evidence vs. Gemini AI synthesis"
)
async def inspect_evidence(
    dispute_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Powers the Evidence Inspector Modal:
    Left Pane: Raw Elastic Merchant Logistics & CRM Logs
    Right Pane: Gemini-Synthesized Legal Narrative & PayPal Payload
    """
    query = db.query(DisputeRecord).filter(DisputeRecord.id == dispute_id)
    if current_user.role.lower() != "admin":
        query = query.filter(DisputeRecord.merchant_id == current_user.merchant_id)

    dispute = query.first()
    if not dispute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispute not found or access denied."
        )

    # Retrieve raw evidence from Elastic datastore
    raw_order = await elastic_service.get_order_evidence(dispute.transaction_id, dispute.merchant_id)
    raw_chat = await elastic_service.get_crm_chat_evidence(dispute.transaction_id)
    raw_policy = await elastic_service.get_policy_context("RETURN_POLICY")

    return {
        "dispute_id": dispute.id,
        "merchant_id": dispute.merchant_id,
        "transaction_id": dispute.transaction_id,
        "status": dispute.status,
        "raw_evidence": {
            "order_metadata": raw_order,
            "crm_chat_logs": raw_chat,
            "merchant_policy": raw_policy
        },
        "ai_synthesis": {
            "evidence_type": dispute.evidence_type,
            "tracking_number": dispute.tracking_number,
            "carrier_name": dispute.carrier_name,
            "confidence_score": dispute.confidence_score,
            "defense_notes": dispute.ai_defense_notes,
            "execution_time_seconds": dispute.execution_time_seconds
        }
    }
