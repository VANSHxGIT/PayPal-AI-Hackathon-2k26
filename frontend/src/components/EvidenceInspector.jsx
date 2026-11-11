import React, { useState } from 'react';
import { CloseIcon, FileTextIcon, ShieldIcon, CheckIcon, CpuIcon } from './Icons';

/**
 * Evidence Inspector — Wise Light Design
 * Paper/Fog surface, Forest Ink headings, Lime Voltage accents.
 */
export const EvidenceInspector = ({ dispute, onClose, onRunDefense, isProcessing }) => {
  const [tab, setTab] = useState('defense');

  if (!dispute) return null;

  const mockPayload = {
    dispute_id: dispute.id,
    merchant_id: dispute.merchant_id || 'MERC-DEFAULT-001',
    transaction_id: dispute.transaction_id,
    adjudication_timestamp: new Date().toISOString(),
    evidence_type: dispute.evidence_type || 'PROOF_OF_DELIVERY',
    evidence_info: {
      tracking_info: [{ carrier_name: dispute.carrier_name || 'FEDEX', tracking_number: dispute.tracking_number || '9400111899562849201928' }],
    },
    paypal_seller_protection: {
      chapter_11_eligibility: true,
      physical_goods_delivered: true,
      signature_confirmed: true,
      address_match: 'EXACT_CONFIRMED',
    },
    defense_summary: dispute.ai_defense_notes || 'Delivery verified.',
  };

  return (
    <div className="mt-6 rounded-[28px] overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(14,15,12,0.12)' }}>
      {/* Inspector Header */}
      <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(14,15,12,0.1)', background: '#f9fbf7' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-lime">Adjudication Inspector</span>
            <span className="text-pebble text-caption">/</span>
            <span className="font-mono font-bold text-forest-ink text-caption">{dispute.id}</span>
          </div>
          <h3 className="font-black text-obsidian" style={{ fontSize: 22, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            PayPal Dispute Contestation File
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onRunDefense(dispute)} disabled={isProcessing} className="btn-lime text-sm">
            {isProcessing ? 'Processing...' : 'Execute Defense Cycle'}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-pebble"
            style={{ background: '#e8ebe6' }}
            title="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Metadata Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 px-8 py-5" style={{ borderBottom: '1px solid rgba(14,15,12,0.1)', background: '#fff' }}>
        {[
          { label: 'Transaction', value: dispute.transaction_id },
          { label: 'Contested Balance', value: `$${Number(dispute.amount).toFixed(2)} USD` },
          { label: 'PayPal Reason', value: dispute.reason.replace(/_/g, ' ') },
          { label: 'Confidence Index', value: dispute.confidence_score ? `${(dispute.confidence_score * 100).toFixed(1)}%` : '98.5%', highlight: true },
        ].map((m, i) => (
          <div key={i} className="px-0 py-0 md:pl-6 first:pl-0" style={{ borderLeft: i > 0 ? '1px solid rgba(14,15,12,0.1)' : 'none' }}>
            <div className="text-pebble font-medium uppercase tracking-wide" style={{ fontSize: 11 }}>{m.label}</div>
            <div
              className="font-bold mt-1"
              style={{ fontSize: 15, letterSpacing: '-0.3px', color: m.highlight ? '#054d28' : '#163300' }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        {/* Left: Elastic Evidence */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: '#f9fbf7', border: '1px solid rgba(14,15,12,0.1)' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(14,15,12,0.1)' }}>
            <div className="flex items-center gap-2 text-forest-ink font-bold" style={{ fontSize: 13 }}>
              <FileTextIcon className="w-4 h-4" />
              Elastic Evidence Store
            </div>
            <span className="badge-lime" style={{ fontSize: 10 }}>RAG VERIFIED</span>
          </div>

          <div className="p-5 space-y-4 font-mono" style={{ fontSize: 13 }}>
            <div>
              <div className="text-pebble uppercase tracking-wide mb-2" style={{ fontSize: 10 }}>Carrier Telemetry</div>
              <div className="rounded-[10px] p-4 space-y-2" style={{ background: '#fff', border: '1px solid rgba(14,15,12,0.08)' }}>
                {[
                  ['Carrier', dispute.carrier_name || 'FEDEX'],
                  ['Tracking ID', dispute.tracking_number || '9400111899562849201928'],
                  ['Delivery Status', 'PHYSICALLY DELIVERED', '#054d28'],
                  ['Recipient Signature', 'A. Mercer'],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-pebble">{k}</span>
                    <span style={{ color: c || '#163300', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-pebble uppercase tracking-wide mb-2" style={{ fontSize: 10 }}>CRM Transcript</div>
              <div className="rounded-[10px] p-4 text-charcoal leading-relaxed" style={{ background: '#fff', border: '1px solid rgba(14,15,12,0.08)', fontSize: 12 }}>
                "[Oct 28 15:30] Customer: FedEx just dropped off the package. Thanks."
              </div>
            </div>
            <div>
              <div className="text-pebble uppercase tracking-wide mb-2" style={{ fontSize: 10 }}>Policy Clause</div>
              <div className="rounded-[10px] p-4 text-charcoal leading-relaxed" style={{ background: '#fff', border: '1px solid rgba(14,15,12,0.08)', fontSize: 12 }}>
                "Section 4.2: Delivery fulfilled upon official carrier signature confirmation at confirmed PayPal shipping address."
              </div>
            </div>
          </div>

          <div className="px-5 py-3 flex justify-between items-center font-mono text-pebble" style={{ borderTop: '1px solid rgba(14,15,12,0.08)', fontSize: 11 }}>
            <span>INDEX: elastic-disputes-2026</span>
            <span style={{ color: '#054d28', fontWeight: 600 }}>1.14s</span>
          </div>
        </div>

        {/* Right: Gemini Legal Defense */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: '#f9fbf7', border: '1px solid rgba(14,15,12,0.1)' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(14,15,12,0.1)' }}>
            <div className="flex items-center gap-2 text-forest-ink font-bold" style={{ fontSize: 13 }}>
              <ShieldIcon className="w-4 h-4" />
              Gemini 2.0 Legal Synthesis
            </div>
            <div className="flex items-center gap-1 font-mono" style={{ fontSize: 11 }}>
              {['defense', 'payload'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-3 py-1 rounded-full font-semibold transition-colors"
                  style={{
                    background: tab === t ? '#163300' : '#e8ebe6',
                    color: tab === t ? '#9fe870' : '#454745',
                    fontSize: 11,
                  }}
                >
                  {t === 'defense' ? 'STATEMENT' : 'PAYPAL JSON'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5" style={{ minHeight: 280 }}>
            {tab === 'defense' ? (
              <div className="rounded-[10px] p-5 font-mono text-charcoal leading-relaxed space-y-3" style={{ background: '#fff', border: '1px solid rgba(14,15,12,0.08)', fontSize: 12 }}>
                <div className="flex justify-between items-center pb-3 font-semibold text-pebble uppercase tracking-wide" style={{ fontSize: 10, borderBottom: '1px solid rgba(14,15,12,0.08)' }}>
                  <span>PayPal Policy Rule</span>
                  <span style={{ color: '#054d28' }}>CHAPTER 11 — SELLER PROTECTION</span>
                </div>
                <p style={{ color: '#163300', fontWeight: 600, fontSize: 13 }}>
                  RE: Contest of Dispute {dispute.id} for Transaction {dispute.transaction_id}.
                </p>
                <p style={{ color: '#454745', lineHeight: 1.7 }}>
                  {dispute.ai_defense_notes || "The buyer opened a chargeback claiming item not received. Carrier telemetry definitively refutes this assertion. The package was dispatched via verified carrier and delivered directly to the confirmed PayPal shipping destination with signed proof of receipt. All requirements under PayPal Merchant Protection are verified."}
                </p>
                <p style={{ color: '#868685', fontSize: 11 }}>
                  Pursuant to Section 11 of the PayPal Merchant Agreement, verified proof of delivery renders this dispute eligible for immediate dismissal.
                </p>
              </div>
            ) : (
              <pre className="rounded-[10px] p-5 overflow-x-auto leading-relaxed" style={{ background: '#163300', color: '#9fe870', fontSize: 11, fontFamily: 'IBM Plex Mono', maxHeight: 300 }}>
                {JSON.stringify(mockPayload, null, 2)}
              </pre>
            )}
          </div>

          <div className="px-5 py-3 flex justify-between items-center font-mono text-pebble" style={{ borderTop: '1px solid rgba(14,15,12,0.08)', fontSize: 11 }}>
            <span className="flex items-center gap-1.5">
              <CpuIcon className="w-3.5 h-3.5" />
              GEMINI 2.0 FLASH
            </span>
            <span style={{ color: '#054d28', fontWeight: 600 }}>FORMALLY VALIDATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
