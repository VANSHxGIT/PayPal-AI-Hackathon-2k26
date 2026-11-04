from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import User
from app.models.schemas import DisputeSimulateRequest, DisputeResponse
from app.core.dependencies import get_current_user
from app.services.dispute_orchestrator import orchestrator

router = APIRouter(prefix="/api/simulate", tags=["Sandbox Demo Simulation"])


@router.post(
    "/dispute",
    response_model=DisputeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Simulate an incoming PayPal dispute for live video demonstration"
)
async def simulate_dispute(
    payload: DisputeSimulateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Executes the end-to-end autonomous defense pipeline on demand.
    Item 5: Scopes dispute directly to current_user.merchant_id.
    """
    record = await orchestrator.process_dispute(
        db=db,
        merchant_id=current_user.merchant_id,  # Tenant Isolation
        transaction_id=payload.transaction_id,
        dispute_id=payload.dispute_id,
        amount=payload.amount,
        currency=payload.currency,
        reason=payload.reason,
        buyer_name=payload.buyer_name or "Alex Mercer",
        buyer_message=payload.buyer_message or "Package marked delivered but not received."
    )
    return record
