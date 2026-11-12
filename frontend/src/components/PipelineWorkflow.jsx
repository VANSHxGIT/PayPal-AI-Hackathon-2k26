import React from 'react';
import { CheckIcon } from './Icons';

/**
 * Pipeline Workflow Section — Wise Design
 * White canvas cards on Fog background, Forest Ink section header.
 * 4-stage balanced left/right column spec breakdown.
 */
export const PipelineWorkflow = () => {
  const steps = [
    {
      num: '01',
      badge: 'EVENT CAPTURE',
      title: 'Real-time Webhook Interception',
      stack: 'FastAPI + PayPal Webhook Gateway',
      latency: '100ms',
      challenge: 'When a customer opens a chargeback, a 10-day dispute timer begins immediately. Traditional merchant teams take 48 to 72 hours just to discover and triage inbound chargebacks from internal ticketing queues.',
      solution: 'Evidentia registers directly with the PayPal Developer Webhook bus. Inbound CUSTOMER.DISPUTE.CREATED payloads are cryptographically verified via SHA256 signatures and instantly ingested into the state machine.',
      safeguard: 'Idempotent event processing prevents replay attacks and race conditions.',
    },
    {
      num: '02',
      badge: 'DATA RETRIEVAL',
      title: 'Logistics Evidence RAG via Elastic',
      stack: 'Elasticsearch Hybrid Vector Retrieval',
      latency: '1.14s',
      challenge: 'Merchants lose winnable claims because carrier proofs of delivery are trapped across fragmented warehouse portals, FedEx dashboards, and Zendesk chat transcripts — gathering them manually takes 35+ minutes per case.',
      solution: 'The dispute orchestrator queries the merchant Elastic index by transaction ID, automatically retrieving carrier tracking numbers, physical delivery timestamps, GPS coordinates, and customer chat acknowledgments.',
      safeguard: 'Row-level tenant isolation ensures queries are cryptographically restricted to the authorized merchant.',
    },
    {
      num: '03',
      badge: 'LEGAL SYNTHESIS',
      title: 'PayPal Chapter 11 Defense Brief',
      stack: 'Google Gemini 2.0 Flash',
      latency: '4.82s',
      challenge: 'Generic or emotional contestations submitted by frustrated merchants are routinely rejected. Submissions must strictly satisfy PayPal Seller Protection guidelines (Chapter 11).',
      solution: 'Gemini 2.0 Flash ingests the retrieved delivery telemetry and synthesizes a formal legal defense brief. The output cites specific carrier signatures, confirmed shipping addresses, and applicable PayPal policy clauses.',
      safeguard: 'Pydantic v2 validation ensures zero hallucination: every claim references verified logistics data.',
    },
    {
      num: '04',
      badge: 'INSTANT SETTLEMENT',
      title: 'Autonomous PayPal REST Submission',
      stack: 'PayPal Disputes REST API (OAuth2)',
      latency: '0.90s',
      challenge: 'Merchant teams frequently miss submission deadlines due to weekend closures or staff shortages. Once a deadline passes, PayPal automatically refunds the buyer and assesses non-refundable chargeback penalty fees.',
      solution: 'The evidence package is formatted into the official PayPal REST JSON schema and dispatched directly to POST /v1/customer/disputes/{id}/provide-evidence. The merchant ledger updates synchronously.',
      safeguard: 'Capital is recovered in an average total time of 6.96 seconds from webhook receipt.',
    },
  ];

  return (
    /* White canvas section */
    <section className="py-20 px-6 md:px-8 max-w-page mx-auto" id="pipeline">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between mb-12 gap-4 pb-8" style={{ borderBottom: '2px solid #163300' }}>
        <div>
          <div className="badge-forest mb-3 inline-flex">Architecture</div>
          <h2 className="font-black text-obsidian" style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.95, letterSpacing: '-2px', fontWeight: 900 }}>
            The autonomous<br />defense engine.
          </h2>
        </div>
        <p className="text-charcoal max-w-xs" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Total pipeline latency: <strong style={{ color: '#163300' }}>6.96 seconds</strong> from webhook to PayPal submission.
        </p>
      </div>

      {/* 4-Step Cards on Fog */}
      <div className="space-y-4">
        {steps.map((s) => (
          <div
            key={s.num}
            className="rounded-[16px] overflow-hidden"
            style={{ background: '#f9fbf7', border: '1px solid rgba(14,15,12,0.1)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(14,15,12,0.1)' }}>

              {/* Left Column: Stage Identity */}
              <div className="lg:col-span-5 p-7 space-y-4" style={{ borderRight: '1px solid rgba(14,15,12,0.1)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-forest-ink" style={{ fontSize: 40, letterSpacing: '-2px', lineHeight: 1 }}>{s.num}</span>
                  <span className="badge-forest" style={{ fontSize: 10 }}>{s.badge}</span>
                </div>
                <h3 className="font-black text-obsidian" style={{ fontSize: 22, letterSpacing: '-0.6px', lineHeight: 1.15, fontWeight: 900 }}>
                  {s.title}
                </h3>
                <div className="space-y-2 font-mono" style={{ fontSize: 12 }}>
                  {[
                    ['Integration', s.stack],
                    ['Avg. Latency', s.latency],
                    ['Verification', 'CRYPTOGRAPHIC PASS'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(14,15,12,0.07)' }}>
                      <span className="text-pebble">{k}</span>
                      <span style={{ color: v === s.latency ? '#054d28' : '#163300', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Problem & Solution */}
              <div className="lg:col-span-7 p-7 space-y-5">
                <div>
                  <div className="font-semibold uppercase tracking-wide mb-2" style={{ fontSize: 11, color: '#cb272f' }}>The Merchant Challenge</div>
                  <p className="text-charcoal leading-relaxed" style={{ fontSize: 14 }}>{s.challenge}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(14,15,12,0.08)', paddingTop: 16 }}>
                  <div className="font-semibold uppercase tracking-wide mb-2" style={{ fontSize: 11, color: '#054d28' }}>Evidentia Autonomous Action</div>
                  <p className="text-obsidian font-medium leading-relaxed" style={{ fontSize: 14 }}>{s.solution}</p>
                </div>
                <div
                  className="flex items-center gap-3 rounded-full px-4 py-2.5"
                  style={{ background: '#e2f6d5', fontSize: 12 }}
                >
                  <CheckIcon className="w-4 h-4 text-spruce flex-shrink-0" />
                  <span className="text-forest-ink font-medium"><strong>Guarantee:</strong> {s.safeguard}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
