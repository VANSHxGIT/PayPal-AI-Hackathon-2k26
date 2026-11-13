# Evidentia — Autonomous PayPal Chargeback Defense Agent

Evidentia is a full-stack prototype built for the PayPal + AI Hackathon. It simulates a merchant dispute-defense operating system that listens for PayPal dispute webhooks, retrieves shipping and CRM evidence, asks Google Gemini to synthesize a seller defense narrative, and submits a structured evidence package back to PayPal.

The project currently includes a FastAPI backend, a React + Vite frontend, SQLite persistence, security and rate-limiting controls, backup automation, and a live SSE terminal for demo visibility.

## Overview

The core workflow is:

1. A PayPal dispute event arrives via the webhook endpoint.
2. The backend extracts the dispute, amount, reason, and transaction metadata.
3. The orchestrator queries a mock merchant evidence store for order, carrier, and CRM data.
4. Gemini synthesizes a PayPal-aligned evidence note and selects an evidence type.
5. The backend submits the packaged evidence to the PayPal sandbox API.
6. The dispute record is stored in SQLite and shown in the merchant dashboard.

This is designed as a demo-ready, secure, and operationally realistic foundation rather than a placeholder concept.

## Current Project Status

The codebase has moved past the initial concept stage and now contains the production-style backend and frontend pieces expected for a real hackathon demo:

- Secure authentication with JWT-based login/session lifecycle
- Password hashing using PBKDF2 + salt
- Role-based admin access control and tenant filtering
- Pydantic validation for API payloads
- Sliding-window rate limiting and failed-login lockouts
- Security headers middleware and sanitized error responses
- SQLite database models, migrations-by-create-all, and backup pruning
- Live SSE event stream for webhook and defense pipeline updates
- React dashboard with dispute ledger, evidence inspector, and simulated pipeline flow
- Mock merchant data for shipping, delivery proof, and CRM chat evidence

## Architecture Summary

### Backend

The Python backend is in `backend/app` and is built with FastAPI.

Main modules:

- `backend/app/main.py` — application startup, middleware registration, and router inclusion
- `backend/app/config.py` — environment settings and security-related configuration
- `backend/app/database.py` — SQLAlchemy engine setup and SQLite hardening pragmas
- `backend/app/models/db_models.py` — user and dispute data models
- `backend/app/models/schemas.py` — API request/response validation
- `backend/app/api/auth.py` — registration, login, logout, and profile endpoints
- `backend/app/api/disputes.py` — dispute listing, lookup, and evidence inspection routes
- `backend/app/api/webhooks.py` — PayPal webhook listener and async processing trigger
- `backend/app/api/simulate.py` — sandbox dispute simulation endpoint
- `backend/app/api/stream.py` — SSE log stream for live terminal
- `backend/app/api/admin.py` — admin-only analytics and backup access
- `backend/app/core/security.py` — JWT and password utility functions
- `backend/app/core/rate_limiter.py` — request throttling and account lockout logic
- `backend/app/core/dependencies.py` — JWT auth and admin enforcement
- `backend/app/core/security_headers.py` — HSTS/CSP/X-Frame-Options enforcement
- `backend/app/core/error_handlers.py` — sanitized API error formatting
- `backend/app/core/logger.py` — live broadcast/logging component for SSE
- `backend/app/services/dispute_orchestrator.py` — end-to-end workflow orchestration
- `backend/app/services/elastic_service.py` — mock Elastic/RAG retrieval layer
- `backend/app/services/gemini_service.py` — AI defense synthesis with deterministic fallback logic
- `backend/app/services/paypal_client.py` — PayPal OAuth and dispute submission client
- `backend/app/services/backup_service.py` — SQLite backup creation and retention cleanup

### Frontend

The frontend is in `frontend/src` and is implemented with React + Vite.

Key files:

- `frontend/src/App.jsx` — main merchant dashboard and simulation orchestration
- `frontend/src/components/ProductThesisHero.jsx` — hero banner and metrics
- `frontend/src/components/PipelineWorkflow.jsx` — four-stage architecture summary
- `frontend/src/components/DisputeLedger.jsx` — AG Grid dispute table
- `frontend/src/components/EvidenceInspector.jsx` — raw evidence vs AI defense viewer
- `frontend/src/components/JudgeEvaluationMatrix.jsx` — criteria and security compliance panel
- `frontend/src/components/LegalAndAboutModals.jsx` — legal text and methodology modals
- `frontend/src/components/InteractiveCard3D.jsx` — animated merchant security card
- `frontend/src/components/Icons.jsx` — custom UI icon set
- `frontend/src/index.css` — main app styling

### Deployment and Environment

- `render.yaml` — Render deployment spec for the backend
- `main.py` — root-level app entry for cloud or uvicorn direct startup
- `.env.example` — example environment variables for local configuration

## Key Features Implemented

### 1. Secure Payment-Defense Workflow

The application models a realistic dispute pipeline with:

- PayPal webhook ingestion for `CUSTOMER.DISPUTE.CREATED`
- dispute evidence collection from seller-side records
- AI-generated defense synthesis using Google Gemini
- post-back evidence payload submission to PayPal sandbox
- SQLite-backed persistence of dispute outcomes

### 2. Merchant Authentication and Access Control

The backend includes:

- user registration with role selection (`merchant` or `admin`)
- JWT issuance and expiration metadata
- token revocation support on logout
- strict tenant filtering by `merchant_id`
- admin-only endpoints protecting privileged actions

### 3. Security Hardening

The current codebase explicitly implements several recommended controls:

- salted password hashing with PBKDF2-HMAC-SHA256
- rate limiting for login and webhook traffic
- failed-login account lockout
- secure CORS settings and API headers
- validation with Pydantic models and strict schema constraints
- hidden docs and trace behavior in production mode
- sanitized exception responses with request reference IDs

### 4. Live Demo Experience

The frontend includes:

- a simulated dispute button
- real-time terminal updates via SSE
- a dispute ledger with filters and status badges
- evidence comparison between raw records and AI output
- tabs for scoring rubric and security matrix

### 5. Operational Reliability

The codebase also includes:

- automatic database backup creation with retention pruning
- SQLite WAL configuration and file permission hardening
- background scheduler for recurring backup runs
- mock data fallback when external services are absent

## Updated Repository Structure

```text
.
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── main.py
├── render.yaml
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── disputes.py
│   │   │   ├── simulate.py
│   │   │   ├── stream.py
│   │   │   └── webhooks.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py
│   │   │   ├── error_handlers.py
│   │   │   ├── logger.py
│   │   │   ├── rate_limiter.py
│   │   │   ├── security.py
│   │   │   └── security_headers.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── db_models.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── backup_service.py
│   │   │   ├── dispute_orchestrator.py
│   │   │   ├── elastic_service.py
│   │   │   ├── gemini_service.py
│   │   │   └── paypal_client.py
│   │   └── tests/
│   │       └── test_security.py
│   └── app/
│       └── __pycache__/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── dist/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── components/
│           ├── DisputeLedger.jsx
│           ├── EvidenceInspector.jsx
│           ├── Icons.jsx
│           ├── InteractiveCard3D.jsx
│           ├── JudgeEvaluationMatrix.jsx
│           ├── LegalAndAboutModals.jsx
│           ├── PipelineWorkflow.jsx
│           └── ProductThesisHero.jsx
└── project_context.md
```

## Environment Setup

The project expects a root-level `.env` file because the backend configuration loads it from the repository root.

Copy the sample file:

```bash
cp .env.example .env
```

Example variables:

```env
ENVIRONMENT=development
DEBUG=true
PORT=8000
HOST=0.0.0.0
DATABASE_URL=sqlite:///./Evidentia.db
JWT_SECRET_KEY=replace_with_a_secure_secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=mock_paypal_client_id
PAYPAL_CLIENT_SECRET=mock_paypal_client_secret
GEMINI_API_KEY=mock_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
ELASTICSEARCH_URL=http://localhost:9200
```

## Quick Start

### 1) Install backend dependencies

```bash
cd backend
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
```

### 2) Start the backend

From the `backend` directory:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs are available at:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

### 3) Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs at:

- `http://localhost:5173`

## Available API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Disputes

- `GET /api/disputes`
- `GET /api/disputes/{dispute_id}`
- `GET /api/disputes/{dispute_id}/evidence-inspector`

### Webhooks and Simulation

- `POST /api/webhooks/paypal`
- `POST /api/simulate/dispute`

### Streaming and Admin

- `GET /api/stream/logs`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `POST /api/admin/backups/create`
- `GET /api/admin/backups`
- `GET /api/admin/security-status`

## Demo Workflow

1. Open the dashboard in the browser.
2. Click the simulation button in the hero/bar area.
3. Watch the SSE terminal for webhook, retrieval, synthesis, and PayPal activity.
4. Inspect the updated dispute row in the AG Grid ledger.
5. Open the evidence inspector to compare raw evidence with AI legal synthesis.

## Validation Notes

The backend contains security and infrastructure checks in `backend/tests/test_security.py` covering:

- secret masking
- password hashing and JWT lifecycle
- rate limiting
- lockout logic
- database backup creation
- production debug-mode behavior

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Summary

The codebase is now a working, demo-ready chargeback defense application with real security controls, operational flows, and a polished UI — not just a concept document. The README reflects the current implementation rather than the original early-stage architecture notes.
