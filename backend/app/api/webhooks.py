import asyncio
import logging
from fastapi import APIRouter, Request, BackgroundTasks, status, Response
from app.database import SessionLocal
from app.services.dispute_orchestrator import orchestrator
from app.core.rate_limiter import limiter
from app.config import settings

router = APIRouter(prefix="/api/webhooks", tags=["PayPal Webhooks"])
logger = logging.getLogger("disputemind.webhook")


def background_process_dispute(
    merchant_id: str,
    transaction_id: str,
    dispute_id: str,
    amount: float,
    currency: str,
    reason: str,
    buyer_name: str,
    buyer_message: str
):
    """Worker task with its own database session."""
    db = SessionLocal()
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(
            orchestrator.process_dispute(
                db=db,
                merchant_id=merchant_id,
                transaction_id=transaction_id,
                dispute_id=dispute_id,
                amount=amount,
                currency=currency,
                reason=reason,
                buyer_name=buyer_name,
                buyer_message=buyer_message
            )
        )
        loop.close()
    except Exception as e:
        logger.error(f"[WEBHOOK WORKER ERROR] Failed to process dispute {dispute_id}: {e}", exc_info=True)
    finally:
        db.close()


@router.post(
    "/paypal",
    status_code=status.HTTP_200_OK,
    summary="PayPal Webhook Receiver (CUSTOMER.DISPUTE.CREATED)"
)
async def paypal_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Requirement F1: Expose public POST endpoint to receive PayPal Webhooks.
    Item 7: Rate limited to prevent webhook denial-of-service.
    Acknowledge with 200 OK immediately and process asynchronously.
    """
    client_ip = request.client.host if request.client else "unknown"
    limiter.check_rate_limit(f"webhook:{client_ip}", max_requests=settings.RATE_LIMIT_WEBHOOK_PER_MINUTE, window_seconds=60)

    try:
        body = await request.json()
    except Exception:
        # Invalid payload
        return Response(status_code=status.HTTP_400_BAD_REQUEST, content="Invalid JSON payload")

    event_type = body.get("event_type")
    logger.info(f"[PAYPAL WEBHOOK] Received event: {event_type} (ID: {body.get('id')})")

    if event_type == "CUSTOMER.DISPUTE.CREATED":
        resource = body.get("resource", {})
        dispute_id = resource.get("dispute_id")
        reason = resource.get("reason", "MERCHANDISE_OR_SERVICE_NOT_RECEIVED")
        dispute_amount = float(resource.get("dispute_amount", {}).get("value", 249.99))
        currency = resource.get("dispute_amount", {}).get("currency_code", "USD")

        # Extract transaction ID
        transactions = resource.get("disputed_transactions", [])
        txn_id = "TXN-829104"
        buyer_name = "Alex Mercer"
        if transactions:
            txn_id = transactions[0].get("seller_transaction_id", txn_id)
            buyer_name = transactions[0].get("buyer", {}).get("name", buyer_name)

        messages = resource.get("messages", [])
        buyer_msg = messages[0].get("content", "Dispute initiated.") if messages else "Dispute initiated."

        # Map to merchant (or fallback to default demo merchant)
        merchant_id = "MERC-DEFAULT-001"

        # Dispatch background autonomous processing
        background_tasks.add_task(
            background_process_dispute,
            merchant_id=merchant_id,
            transaction_id=txn_id,
            dispute_id=dispute_id,
            amount=dispute_amount,
            currency=currency,
            reason=reason,
            buyer_name=buyer_name,
            buyer_message=buyer_msg
        )

    # Always return 200 OK immediately to satisfy PayPal's webhook SLA
    return {"status": "SUCCESS", "message": "Webhook acknowledged."}

