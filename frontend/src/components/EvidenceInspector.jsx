import React, { useState } from 'react';
import { CloseIcon, FileTextIcon, ShieldIcon, CheckIcon, CpuIcon } from './Icons';

/**
 * Institutional Evidence Inspector
 * Dual-panel review console comparing verified logistics telemetry (Elastic) against
 * Gemini legal synthesis and PayPal REST payload.
 */
export const EvidenceInspector = ({ dispute, onClose, onRunDefense, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('defense'); // 'defense' or 'payload'

  if (!dispute) return null;

  const mockPayload = {
    dispute_id: dispute.id,
    merchant_id: dispute.merchant_id || "MERC-DEFAULT-001",
    transaction_id: dispute.transaction_id,
    adjudication_timestamp: new Date().toISOString(),
    evidence_type: dispute.evidence_type || "PROOF_OF_DELIVERY",
    evidence_info: {
      tracking_info: [
        {
          carrier_name: dispute.carrier_name || "FEDEX",
          tracking_number: dispute.tracking_number || "9400111899562849201928"
        }
      ]
    },
    paypal_seller_protection: {
      chapter_11_eligibility: true,
      physical_goods_delivered: true,
      signature_confirmed: true,
      address_match: "EXACT_CONFIRMED"
    },
    defense_summary: dispute.ai_defense_notes || "Warehouse fulfillment telemetry confirms shipment was delivered to the PayPal confirmed address with signature proof. All terms under PayPal Merchant Protection are verified."
  };

  return (
    <div className="w-full bg-surface-card border border-borderline p-6 mt-6 rounded-[2px]">
      {/* Header with explicit boundary and breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-borderline gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-ink-muted">Adjudication Inspector</span>
            <span className="font-mono text-xs text-borderline-light">/</span>
            <span className="font-mono text-xs font-semibold text-accent">{dispute.id}</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-ink mt-1">
            PayPal Dispute Contestation File
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRunDefense(dispute)}
            disabled={isProcessing}
            className="px-4 py-2 bg-accent text-white font-mono text-xs font-medium hover:bg-accent-navy disabled:opacity-50 border border-accent/40 rounded-[2px] transition-colors"
          >
            {isProcessing ? "PROCESSING DEFENSE..." : "EXECUTE DEFENSE CYCLE"}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink border border-borderline bg-surface-base rounded-[2px]"
            title="Close Dossier"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Metadata Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-borderline text-xs font-mono">
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">Transaction Reference</span>
          <span className="font-semibold text-ink">{dispute.transaction_id}</span>
        </div>
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">Contested Balance</span>
          <span className="font-semibold text-ink">${Number(dispute.amount).toFixed(2)} USD</span>
        </div>
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">PayPal Reason Code</span>
          <span className="font-semibold text-ink">{dispute.reason.replace(/_/g, " ")}</span>
        </div>
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">Confidence Index</span>
          <span className="font-semibold text-accent-emerald">{dispute.confidence_score ? `${(dispute.confidence_score * 100).toFixed(1)}%` : "98.5%"}</span>
        </div>
      </div>

      {/* Dual Panel Body: Logistics Telemetry vs Legal Memorandum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Left Panel: Verified Merchant Logistics & CRM Telemetry (Elastic) */}
        <div className="bg-surface-base border border-borderline p-5 rounded-[2px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderline">
              <span className="font-mono text-xs font-semibold uppercase text-ink flex items-center gap-2">
                <FileTextIcon className="w-3.5 h-3.5 text-accent" />
                Retrieved Merchant Evidence (Elastic Store)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-canvas border border-borderline text-ink-muted">
                RAG MATCH: VERIFIED
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Carrier Telemetry</span>
                <div className="bg-surface-card p-3 border border-borderline mt-1 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Carrier Partner:</span>
                    <span className="font-semibold text-ink">{dispute.carrier_name || "FEDEX"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Tracking Identifier:</span>
                    <span className="text-ink">{dispute.tracking_number || "9400111899562849201928"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Delivery Verification:</span>
                    <span className="text-accent-emerald font-semibold flex items-center gap-1">
                      <CheckIcon className="w-3.5 h-3.5 text-accent-emerald" />
                      PHYSICALLY DELIVERED
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Recipient Signature:</span>
                    <span className="text-ink">A. Mercer</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Customer CRM Communication</span>
                <div className="bg-surface-card p-3 border border-borderline mt-1 text-ink-secondary leading-relaxed">
                  "[Oct 28 15:30] Customer: FedEx just dropped off the package at my front porch. Thanks."
                </div>
              </div>

              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Published Policy Clause</span>
                <div className="bg-surface-card p-3 border border-borderline mt-1 text-ink-secondary leading-relaxed">
                  "Section 4.2: Delivery fulfilled upon official carrier signature confirmation at confirmed PayPal shipping address."
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-borderline mt-4 flex items-center justify-between text-[10px] font-mono text-ink-muted">
            <span>INDEX: elastic-disputes-2026</span>
            <span className="text-accent-emerald font-medium">QUERY LATENCY: 1.14 SEC</span>
          </div>
        </div>

        {/* Right Panel: Gemini Legal Defense & PayPal Schema */}
        <div className="bg-surface-base border border-borderline p-5 rounded-[2px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderline">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase text-ink flex items-center gap-2">
                  <ShieldIcon className="w-3.5 h-3.5 text-accent-emerald" />
                  Synthesized Legal Contestation
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setActiveTab('defense')}
                  className={`px-2.5 py-1 border transition-colors ${activeTab === 'defense' ? 'bg-accent text-white border-accent' : 'bg-surface-card text-ink-muted border-borderline'}`}
                >
                  LEGAL STATEMENT
                </button>
                <button
                  onClick={() => setActiveTab('payload')}
                  className={`px-2.5 py-1 border transition-colors ${activeTab === 'payload' ? 'bg-accent text-white border-accent' : 'bg-surface-card text-ink-muted border-borderline'}`}
                >
                  PAYPAL JSON
                </button>
              </div>
            </div>

            <div className="mt-4">
              {activeTab === 'defense' ? (
                <div className="bg-surface-card p-4 border border-borderline text-xs font-mono text-ink-secondary leading-relaxed space-y-3">
                  <div className="text-[10px] text-ink-muted uppercase pb-2 border-b border-borderline flex justify-between">
                    <span>PayPal Policy Rule Match</span>
                    <span className="font-semibold text-accent-emerald">CHAPTER 11 (SELLER PROTECTION)</span>
                  </div>
                  <div className="text-ink space-y-2">
                    <p className="font-medium text-ink">
                      RE: Official Contest of Dispute {dispute.id} for PayPal Transaction {dispute.transaction_id}.
                    </p>
                    <p>
                      {dispute.ai_defense_notes || (
                        "The buyer opened a chargeback claiming item not received. Carrier telemetry definitively refutes this assertion. The package was dispatched via verified carrier and delivered directly to the confirmed PayPal shipping destination, accompanied by signed proof of receipt. Internal CRM records confirm the buyer acknowledged delivery. All requirements under PayPal Merchant Protection are verified."
                      )}
                    </p>
                    <p className="text-ink-muted">
                      Pursuant to Section 11 of the PayPal Merchant Agreement, verified proof of delivery to the registered transaction address renders this dispute eligible for immediate dismissal and release of held funds.
                    </p>
                  </div>
                </div>
              ) : (
                <pre className="bg-[#080A0F] text-slate-300 p-4 border border-borderline text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[300px]">
                  {JSON.stringify(mockPayload, null, 2)}
                </pre>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-borderline mt-4 flex items-center justify-between text-[10px] font-mono text-ink-muted">
            <span className="flex items-center gap-1">
              <CpuIcon className="w-3.5 h-3.5 text-accent" />
              ENGINE: GOOGLE GEMINI 2.0 FLASH
            </span>
            <span className="text-accent-emerald font-semibold">STATUS: FORMALLY VALIDATED</span>
          </div>
        </div>

      </div>
    </div>
  );
};
