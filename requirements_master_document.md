# Requirements Master Document (RMD)

## 1. Functional Requirements
*   **F1 (Webhook Listener):** The system shall expose a public POST endpoint to receive PayPal Webhooks. It must validate the payload and return a 200 OK immediately to prevent retries.
*   **F2 (Dispute Parsing):** The system shall parse the incoming webhook to extract the `dispute_id` and the original `transaction_id`.
*   **F3 (Data Retrieval):** The system shall query the Elastic datastore using the `transaction_id` to retrieve all associated order metadata, tracking numbers, and customer communications.
*   **F4 (AI Processing):** The system shall pass retrieved data to an LLM with a system prompt designed to generate a PayPal-compliant evidence package.
*   **F5 (Evidence Submission):** The system shall POST the generated evidence to the PayPal Disputes API.
*   **F6 (Dashboard UI):** The frontend shall display a real-time list of disputes, their current status (e.g., `WAITING_FOR_BUYER_RESPONSE`, `RESOLVED`), and the evidence submitted by the AI.

## 2. Non-Functional Requirements
*   **Performance:** The end-to-end automated process (Webhook receipt to Evidence Submission) must complete in under 15 seconds.
*   **Reliability:** The system must gracefully handle PayPal API rate limits and LLM timeouts.
*   **Security:** API keys (PayPal Client ID/Secret, LLM Keys, Elastic credentials) must be managed via `.env` variables and never hardcoded.

## 3. Submission Requirements (Hackathon Rules)
*   Must include a text description explaining features.
*   Must include a functional demo (clear setup instructions or hosted URL).
*   Must explicitly identify how AI and PayPal are used.
*   Must be a public repository (GitHub) with an Open Source license in the root directory.
*   Must include a YouTube demo video under 3 minutes showing end-to-end functionality.