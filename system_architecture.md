# System Architecture & Data Flow

## 1. High-Level Architecture
The system follows an event-driven microservices architecture utilizing a modern Python backend and a React frontend.

```text
[ PayPal Sandbox ] --- (Webhook) ---> [ FastAPI Webhook Receiver ]
                                                |
[ React + AG Grid] <--- (REST APIs) ---> [ FastAPI Core Logic ]
                                                |
                                       +--------+--------+
                                       |                 |
                             [ Elastic Database ]  [ LLM Provider (OpenAI) ]
```

## 2. Sequence of Operations (The "Golden Path")
1.  **Trigger:** A buyer initiates a dispute in the PayPal Sandbox.
2.  **Notification:** PayPal fires `CUSTOMER.DISPUTE.CREATED` to the Render-hosted FastAPI server.
3.  **Enrichment:** FastAPI calls `GET /v1/customer/disputes/{id}` for full context.
4.  **Retrieval:** FastAPI queries Elastic for `transaction_id`. Elastic returns mock shipping and CRM data.
5.  **Synthesis:** FastAPI sends the dispute context and Elastic data to the LLM. The LLM generates the legal defense and maps the data to PayPal's JSON schema.
6.  **Action:** FastAPI calls `POST /v1/customer/disputes/{id}/provide-evidence` with the AI payload.
7.  **Update:** The database state updates. The AG Grid frontend polls or receives a WebSocket update, reflecting the automated defense to the merchant.