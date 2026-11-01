# Project Memory & Context Context

## Project Genesis
This project was conceived for the "Build What's Next with PayPal and AI" hackathon (Deadline: Oct 31).

## Pivot History
*   **Initial Idea:** "HeritageBridge" - A cultural storyteller for indigenous artisans.
*   **Pivot Reason:** The user requested to remove the "cultural touch" and brainstorm a new idea.
*   **Current Idea:** "DisputeMind AI" - An autonomous chargeback defense agent.
*   **Justification:** DisputeMind AI aligns much stronger with B2B e-commerce pain points, showcases complex API orchestrations (Webhooks + Disputes API), and makes a highly compelling business case (saving time and recovering lost revenue), which maximizes the "Potential Impact" judging criteria.

## Core Architectural Decisions
*   **Python/FastAPI:** Chosen for native async support, making it ideal for handling webhooks and parallel AI processing.
*   **Elastic (Sponsor):** Chosen as the vector/search database to simulate a merchant's internal logistics and CRM database for RAG operations.
*   **AG Grid (Sponsor):** Chosen to handle the frontend UI, specifically because enterprise merchants require dense data tables to manage dispute queues.
*   **Render (Sponsor):** Chosen for rapid deployment and providing a stable public URL for PayPal webhooks.

## Current State
All foundational planning documents (PRD, RMD, TMD, Architecture, Rules, Design, Tasks) have been generated. The next phase is active coding and repository initialization.