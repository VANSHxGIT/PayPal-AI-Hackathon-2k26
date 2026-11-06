import React, { useState } from 'react';
import { CloseIcon, FileTextIcon, ShieldIcon } from './Icons';

/**
 * Institutional Evidence Inspector
 * Dual-panel review console comparing verified logistics telemetry (Elastic) against
 * Gemini legal synthesis and PayPal REST payload.
 */
export const EvidenceInspector = ({ dispute, onClose, onRunDefense, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('defense'); // 'defense' or 'payload'

  if (!dispute) return null;

  const mockPayload = {
    evidence_type: dispute.evidence_type || "PROOF_OF_DELIVERY",
    evidence_info: {
      tracking_info: [
        {
          carrier_name: dispute.carrier_name || "FEDEX",
          tracking_number: dispute.tracking_number || "9400111899562849201928"
        }
      ]
    },
    notes: dispute.ai_defense_notes || "Warehouse fulfillment telemetry confirms shipment was delivered to the PayPal confirmed address with signature proof. All terms under PayPal Merchant Protection are verified."
  };

  return (
    <div className="w-full bg-surface-light border border-borderline p-6 mt-6 rounded-[2px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-borderline gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-ink-muted">Adjudication Inspector</span>
            <span className="font-mono text-xs text-borderline">/</span>
            <span className="font-mono text-xs font-semibold text-ink">{dispute.id}</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-ink mt-1">
            PayPal Dispute Representation Case
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRunDefense(dispute)}
            disabled={isProcessing}
            className="px-4 py-1.5 bg-periwinkle-dark text-white font-mono text-xs font-medium hover:bg-periwinkle disabled:opacity-50 border border-periwinkle/60 rounded-[2px]"
          >
            {isProcessing ? "PROCESSING DEFENSE..." : "EXECUTE DEFENSE CYCLE"}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink border border-borderline bg-surface-card rounded-[2px]"
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
          <span className="text-ink-muted uppercase block text-[10px]">Claim Amount</span>
          <span className="font-semibold text-ink">${Number(dispute.amount).toFixed(2)} USD</span>
        </div>
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">Dispute Reason</span>
          <span className="font-semibold text-ink">{dispute.reason.replace(/_/g, " ")}</span>
        </div>
        <div>
          <span className="text-ink-muted uppercase block text-[10px]">Confidence Index</span>
          <span className="font-semibold text-emerald-700">{dispute.confidence_score ? `${(dispute.confidence_score * 100).toFixed(1)}%` : "98.5%"}</span>
        </div>
      </div>

      {/* Dual Panel Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Panel: Verified Merchant Logistics & CRM Telemetry (Elastic) */}
        <div className="bg-canvas-subtle/50 border border-borderline p-5 rounded-[2px]">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <span className="font-mono text-xs font-semibold uppercase text-ink flex items-center gap-2">
              <FileTextIcon className="w-3.5 h-3.5 text-ink-muted" />
              Retrieved Merchant Evidence (Elastic Store)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-canvas border border-borderline text-ink-muted">
              RAG INDEX: VERIFIED
            </span>
          </div>

          <div className="mt-4 space-y-4 text-xs font-mono">
            <div>
              <span className="text-ink-muted block text-[10px] uppercase">Carrier Telemetry</span>
              <div className="bg-surface-card p-3 border border-borderline mt-1">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Carrier:</span>
                  <span className="font-semibold text-ink">{dispute.carrier_name || "FEDEX"}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-ink-muted">Tracking ID:</span>
                  <span className="text-ink">{dispute.tracking_number || "9400111899562849201928"}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-ink-muted">Delivery Status:</span>
                  <span className="text-emerald-800 font-semibold">DELIVERED WITH SIGNATURE</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-ink-muted">Recipient Signature:</span>
                  <span className="text-ink">A. Mercer</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-ink-muted block text-[10px] uppercase">Customer Support Chat Excerpt</span>
              <div className="bg-surface-card p-3 border border-borderline mt-1 text-ink-secondary leading-relaxed">
                "[Oct 28 15:30] Customer: FedEx just dropped off the package at my front porch. Thanks."
              </div>
            </div>

            <div>
              <span className="text-ink-muted block text-[10px] uppercase">Applicable Merchant Policy</span>
              <div className="bg-surface-card p-3 border border-borderline mt-1 text-ink-secondary leading-relaxed">
                "Section 4.2: Delivery fulfilled upon official carrier signature confirmation at confirmed PayPal shipping address."
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Gemini Legal Defense & PayPal Schema */}
        <div className="bg-canvas-subtle/50 border border-borderline p-5 rounded-[2px]">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-ink flex items-center gap-2">
                <ShieldIcon className="w-3.5 h-3.5 text-periwinkle" />
                Synthesized Legal Representation
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <button
                onClick={() => setActiveTab('defense')}
                className={`px-2 py-0.5 border ${activeTab === 'defense' ? 'bg-periwinkle-dark text-white border-periwinkle-dark' : 'bg-surface-card text-ink-muted border-borderline'}`}
              >
                STATEMENT
              </button>
              <button
                onClick={() => setActiveTab('payload')}
                className={`px-2 py-0.5 border ${activeTab === 'payload' ? 'bg-periwinkle-dark text-white border-periwinkle-dark' : 'bg-surface-card text-ink-muted border-borderline'}`}
              >
                PAYPAL JSON
              </button>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === 'defense' ? (
              <div className="bg-surface-card p-4 border border-borderline text-xs font-mono text-ink-secondary leading-relaxed space-y-3">
                <div className="text-[10px] text-ink-muted uppercase pb-2 border-b border-borderline flex justify-between">
                  <span>PayPal Evidence Type</span>
                  <span className="font-semibold text-ink">{dispute.evidence_type || "PROOF_OF_DELIVERY"}</span>
                </div>
                <p className="whitespace-pre-line text-ink">
                  {dispute.ai_defense_notes || (
                    `RE: Contest of Dispute ${dispute.id} for Transaction ${dispute.transaction_id}.

The buyer claims the item was not received; however, warehouse fulfillment and carrier records definitively refute this claim. Order ORD-55901 was dispatched via FedEx Priority under Tracking Number 9400111899562849201928.

Official carrier telemetry confirms the shipment was successfully delivered to 742 Evergreen Terrace and personally signed for by 'A. Mercer'. Furthermore, merchant CRM records confirm the customer acknowledged receipt on delivery day.

All fulfillment requirements under PayPal Merchant Protection have been fully satisfied. We respectfully request immediate closure in seller's favor.`
                  )}
                </p>
                <div className="pt-2 border-t border-borderline flex items-center justify-between text-[10px] text-ink-muted">
                  <span>ENGINE: GOOGLE GEMINI 2.0 FLASH</span>
                  <span className="text-emerald-700 font-semibold">ADJUDICATION STATUS: COMPLIANT</span>
                </div>
              </div>
            ) : (
              <pre className="bg-surface-dark text-slate-200 p-4 border border-hairline-dark text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[300px]">
                {JSON.stringify(mockPayload, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
