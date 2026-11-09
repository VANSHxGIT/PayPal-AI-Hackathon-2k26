import React from 'react';
import { CpuIcon, DatabaseIcon, ShieldIcon, CheckIcon } from './Icons';

/**
 * Pipeline Workflow Component (Kraftline Inspiration)
 * Symmetrical, balanced 2-column breakdown detailing each stage of the autonomous dispute defense.
 * Explicitly sets structural boundaries and explains both the merchant problem and the automated solution.
 */
export const PipelineWorkflow = () => {
  const steps = [
    {
      num: "01",
      title: "Real-time Webhook Interception",
      stack: "FastAPI + PayPal Webhook Gateway",
      latency: "100ms",
      badge: "EVENT CAPTURE",
      problem: "When a customer opens a chargeback, the 10-day dispute timer begins immediately. Traditional merchant teams take 48 to 72 hours just to discover and triage inbound chargebacks from internal ticketing queues.",
      solution: "DisputeMind registers directly with the PayPal Developer Webhook bus. Inbound CUSTOMER.DISPUTE.CREATED payloads are cryptographically verified via PayPal SHA256 signatures and instantly ingested into the state machine.",
      safeguard: "Idempotent event processing prevents replay attacks and locks against race conditions."
    },
    {
      num: "02",
      title: "Logistics & CRM Evidence RAG",
      stack: "Elasticsearch Hybrid Vector Retrieval",
      latency: "1.14s",
      badge: "DATA RETRIEVAL",
      problem: "Merchants lose winnable claims because carrier proofs of delivery are trapped across fragmented warehouse portals, FedEx/UPS dashboards, and Zendesk chat transcripts. Gathering these documents manually takes 35+ minutes per case.",
      solution: "Our dispute orchestrator queries the merchant's private Elastic index by transaction ID. It automatically retrieves carrier tracking numbers, physical delivery timestamps, GPS delivery coordinates, and customer chat acknowledgments.",
      safeguard: "Row-level tenant isolation ensures queries are cryptographically restricted to the merchant's authorized records."
    },
    {
      num: "03",
      title: "PayPal Chapter 11 Defense Synthesis",
      stack: "Google Gemini 2.0 Flash Reasoning Engine",
      latency: "4.82s",
      badge: "LEGAL SYNTHESIS",
      problem: "Generic or emotional contestations submitted by frustrated merchants are routinely rejected by institutional PayPal adjudicators. Submissions must strictly satisfy PayPal Seller Protection guidelines (Chapter 11).",
      solution: "Gemini 2.0 Flash ingests the retrieved delivery telemetry and synthesizes a formal, authoritative legal defense brief. The output cites specific carrier signatures, confirmed shipping addresses, and applicable PayPal policy clauses.",
      safeguard: "Strict Pydantic v2 validation ensures zero hallucination: every claim made in the brief references verified logistics data."
    },
    {
      num: "04",
      title: "Autonomous PayPal REST Submission",
      stack: "PayPal Disputes REST API (OAuth2)",
      latency: "0.90s",
      badge: "INSTANT SETTLEMENT",
      problem: "Merchant teams frequently miss submission deadlines due to weekend closures, holiday backlogs, or staff shortages. Once a deadline passes, PayPal automatically refunds the buyer and assesses non-refundable chargeback penalty fees.",
      solution: "The generated evidence package and tracking documentation are formatted into the official PayPal REST JSON schema and dispatched directly to POST /v1/customer/disputes/{id}/provide-evidence.",
      safeguard: "The merchant ledger is updated synchronously, securing the merchant's capital in an average time of 6.96 seconds."
    }
  ];

  return (
    <section id="pipeline" className="border-b border-borderline py-12 md:py-16">
      
      {/* Section Header with Clear Boundaries */}
      <div className="flex flex-wrap items-end justify-between pb-6 border-b border-borderline gap-4">
        <div>
          <div className="flex items-center gap-2 text-ink-muted font-mono text-xs uppercase mb-1">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span>Architecture Breakdown</span>
            <span className="text-borderline-light">/</span>
            <span>Kraftline Balanced Specification</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            The Autonomous Dispute Defense Engine
          </h2>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          TOTAL PIPELINE LATENCY: <span className="font-semibold text-accent-emerald">6.96 SECONDS</span>
        </div>
      </div>

      {/* Balanced 4-Stage Sequential Stack */}
      <div className="mt-8 space-y-6">
        {steps.map((step) => (
          <div 
            key={step.num}
            className="bg-surface-card border border-borderline p-6 rounded-[2px] transition-colors"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Stage Identifier & Stack Telemetry (5 cols) */}
              <div className="lg:col-span-5 space-y-3 pb-4 lg:pb-0 lg:border-r lg:border-borderline lg:pr-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {step.num}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-canvas border border-borderline text-ink-muted">
                    {step.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-ink">
                  {step.title}
                </h3>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-borderline">
                    <span className="text-ink-muted">Integration:</span>
                    <span className="text-ink font-medium">{step.stack}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-borderline">
                    <span className="text-ink-muted">Mean Execution Latency:</span>
                    <span className="text-accent-emerald font-semibold">{step.latency}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-muted">Verification Gate:</span>
                    <span className="text-accent font-medium">CRYPTOGRAPHIC PASS</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Balanced Operational Analysis (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h4 className="font-mono text-[11px] text-accent-amber font-semibold uppercase tracking-wider mb-1">
                    The Merchant Challenge
                  </h4>
                  <p className="text-xs font-mono text-ink-secondary leading-relaxed">
                    {step.problem}
                  </p>
                </div>

                <div className="pt-2 border-t border-borderline">
                  <h4 className="font-mono text-[11px] text-accent-emerald font-semibold uppercase tracking-wider mb-1">
                    DisputeMind Autonomous Action
                  </h4>
                  <p className="text-xs font-mono text-ink leading-relaxed">
                    {step.solution}
                  </p>
                </div>

                <div className="p-3 bg-surface-base border border-borderline text-[11px] font-mono text-ink-muted flex items-center gap-2 rounded-[1px]">
                  <CheckIcon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span><strong>Security Guarantee:</strong> {step.safeguard}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

