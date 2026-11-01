# Technical Master Document (TMD)

## 1. Technology Stack
*   **Backend / API:** Python 3.10+, FastAPI (Asynchronous API framework)
*   **Frontend:** React.js, AG Grid (Sponsor Tool for high-density data tables)
*   **AI / LLM:** Google Gemini API (Gemini 2.0 / 1.5 Flash / Pro) as primary synthesis model (with OpenAI/Claude adapter support)
*   **Vector & Document Store:** Elastic (Sponsor Tool for indexing merchant data)
*   **Hosting / Deployment:** Render (Sponsor Tool for hosting backend/webhooks)

## 2. PayPal Integration Points
The project MUST meaningfully integrate the following PayPal Sandbox capabilities:
*   **Webhooks:** `CUSTOMER.DISPUTE.CREATED` listener to trigger the autonomous workflow.
*   **Disputes API (GET):** `GET /v1/customer/disputes/{dispute_id}` to fetch dispute reason codes, amounts, and buyer messages.
*   **Disputes API (POST):** `POST /v1/customer/disputes/{dispute_id}/provide-evidence` to submit the AI-generated payload.

## 3. AI / RAG Implementation (Elastic + LLM)
1.  **Ingestion:** Mock merchant data (receipts, tracking APIs, CRM chats) is indexed in Elastic.
2.  **Retrieval:** Backend uses the transaction ID from the PayPal webhook to query Elastic for all related documents.
3.  **Synthesis:** The LLM is prompted with the raw documents and the PayPal reason code. It outputs a strictly formatted JSON payload mapping evidence to PayPal's required `evidence_type` categories (e.g., `PROOF_OF_FULFILLMENT`, `RETURN_POLICY`).

## 4. Sponsor Tool Utilization
*   **Elastic:** Core database for the RAG pipeline.
*   **AG Grid:** Enterprise-grade grid on the frontend to display dispute queues, AI actions, and win/loss statuses.
*   **Render:** Cloud platform ensuring the webhook endpoint is publicly accessible to PayPal.