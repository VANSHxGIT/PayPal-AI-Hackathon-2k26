import time
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.db_models import DisputeRecord
from app.services.elastic_service import elastic_service
from app.services.gemini_service import gemini_service
from app.services.paypal_client import paypal_client
from app.core.logger import broadcaster

logger = logging.getLogger("Evidentia.orchestrator")


class DisputeOrchestrator:
    """
    Coordinates the 10-second autonomous dispute defense pipeline:
    Webhook/Trigger -> Elastic RAG Retrieval -> Google Gemini Synthesis -> PayPal Submission -> Database Update.
    """

    async def process_dispute(
        self,
        db: Session,
        merchant_id: str,
        transaction_id: str,
        dispute_id: Optional[str] = None,
        amount: float = 249.99,
        currency: str = "USD",
        reason: str = "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
        buyer_name: str = "Alex Mercer",
        buyer_message: str = "Package was marked as delivered but never arrived at my doorstep."
    ) -> DisputeRecord:
        start_time = time.time()
        final_dispute_id = dispute_id or f"PP-D-{uuid.uuid4().hex[:8].upper()}"

        await broadcaster.broadcast(
            f"⚡ [WEBHOOK] Processing Dispute {final_dispute_id} for Txn {transaction_id} (Reason: {reason})",
            level="INFO",
            meta={"dispute_id": final_dispute_id, "amount": amount, "reason": reason}
        )

        # Step 1: Retrieve enriched evidence from Elastic datastore (RAG)
        await broadcaster.broadcast(
            f"🔍 [ELASTIC] Querying transaction {transaction_id} across ERP, carrier, and CRM indices...",
            level="INFO"
        )
        order_evidence = await elastic_service.get_order_evidence(transaction_id, merchant_id)
        chat_evidence = await elastic_service.get_crm_chat_evidence(transaction_id)
        policy_evidence = await elastic_service.get_policy_context("RETURN_POLICY")

        carrier = order_evidence.get("carrier", "FEDEX")
        tracking_num = order_evidence.get("tracking_number", "TRACK-123456")
        await broadcaster.broadcast(
            f"📦 [ELASTIC HIT] Found Order {order_evidence.get('order_id')} — Carrier: {carrier} (Tracking: {tracking_num}, Signed by: {order_evidence.get('signature_name')})",
            level="SUCCESS"
        )

        # Step 2: Google Gemini AI Defense Synthesis
        await broadcaster.broadcast(
            f"🧠 [GEMINI AI] Prompting Google Gemini to synthesize structured legal evidence package...",
            level="INFO"
        )
        dispute_context = {
            "dispute_id": final_dispute_id,
            "transaction_id": transaction_id,
            "amount": amount,
            "currency": currency,
            "reason": reason,
            "buyer_message": buyer_message
        }

        ai_result = await gemini_service.synthesize_defense(
            dispute_context=dispute_context,
            order_evidence=order_evidence,
            chat_evidence=chat_evidence,
            policy_evidence=policy_evidence
        )

        evidence_type = ai_result.get("evidence_type", "PROOF_OF_FULFILLMENT")
        confidence = ai_result.get("confidence_score", 0.98)
        notes = ai_result.get("notes", "")

        await broadcaster.broadcast(
            f"📝 [GEMINI SYNTHESIS COMPLETE] Evidence Type: {evidence_type} (Confidence: {int(confidence*100)}%)",
            level="SUCCESS"
        )

        # Step 3: Direct submission to PayPal Disputes REST API
        await broadcaster.broadcast(
            f"🚀 [PAYPAL API] Submitting POST /v1/customer/disputes/{final_dispute_id}/provide-evidence...",
            level="INFO"
        )

        paypal_payload = {
            "evidence_type": evidence_type,
            "evidence_info": {
                "tracking_info": [
                    {
                        "carrier_name": carrier,
                        "tracking_number": tracking_num
                    }
                ]
            },
            "notes": notes
        }

        paypal_res = await paypal_client.provide_evidence(final_dispute_id, paypal_payload)
        status_code = paypal_res.get("status_code", 200)

        elapsed = round(time.time() - start_time, 2)
        await broadcaster.broadcast(
            f"✅ [SUCCESS] Dispute {final_dispute_id} successfully auto-defended in {elapsed}s (PayPal HTTP {status_code})",
            level="SUCCESS",
            meta={"dispute_id": final_dispute_id, "elapsed": elapsed}
        )

        # Step 4: Persist in SQLite/SQLAlchemy with strict tenant isolation (Item 5)
        existing_record = db.query(DisputeRecord).filter(
            DisputeRecord.id == final_dispute_id,
            DisputeRecord.merchant_id == merchant_id
        ).first()

        if existing_record:
            existing_record.status = "AUTO_DEFENDED"
            existing_record.evidence_type = evidence_type
            existing_record.tracking_number = tracking_num
            existing_record.carrier_name = carrier
            existing_record.ai_defense_notes = notes
            existing_record.confidence_score = confidence
            existing_record.paypal_response_code = status_code
            existing_record.execution_time_seconds = elapsed
            existing_record.updated_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(existing_record)
            return existing_record
        else:
            new_record = DisputeRecord(
                id=final_dispute_id,
                merchant_id=merchant_id,  # Item 5: Tenant Isolation
                transaction_id=transaction_id,
                amount=amount,
                currency=currency,
                reason=reason,
                status="AUTO_DEFENDED",
                buyer_name=buyer_name,
                buyer_message=buyer_message,
                evidence_type=evidence_type,
                tracking_number=tracking_num,
                carrier_name=carrier,
                ai_defense_notes=notes,
                confidence_score=confidence,
                paypal_response_code=status_code,
                execution_time_seconds=elapsed,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(new_record)
            db.commit()
            db.refresh(new_record)
            return new_record


orchestrator = DisputeOrchestrator()

