import React, { useState } from 'react';
import { InteractiveCard3D } from './components/InteractiveCard3D';
import { DisputeLedger } from './components/DisputeLedger';
import { EvidenceInspector } from './components/EvidenceInspector';
import { TermsOfServiceModal, PrivacyPolicyModal, AboutUsModal } from './components/LegalAndAboutModals';
import { RefreshIcon } from './components/Icons';

const INITIAL_DISPUTES = [
  {
    id: "PP-D-99214",
    merchant_id: "MERC-DEFAULT-001",
    transaction_id: "TXN-829104",
    amount: 249.99,
    currency: "USD",
    reason: "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
    status: "AUTO_DEFENDED",
    carrier_name: "FEDEX",
    tracking_number: "9400111899562849201928",
    evidence_type: "PROOF_OF_DELIVERY",
    confidence_score: 0.985,
    execution_time_seconds: 6.82,
    ai_defense_notes: "Carrier telemetry confirms parcel was delivered to the registered shipping address and signed for by 'A. Mercer'. Furthermore, merchant CRM records confirm the customer acknowledged receipt on delivery day. All conditions under PayPal Merchant Protection are satisfied."
  },
  {
    id: "PP-D-48102",
    merchant_id: "MERC-DEFAULT-001",
    transaction_id: "TXN-491023",
    amount: 499.50,
    currency: "USD",
    reason: "UNAUTHORIZED_TRANSACTION",
    status: "AUTO_DEFENDED",
    carrier_name: "UPS",
    tracking_number: "1Z9999999999999999",
    evidence_type: "PROOF_OF_FULFILLMENT",
    confidence_score: 0.991,
    execution_time_seconds: 7.45,
    ai_defense_notes: "Transaction was shipped directly to the confirmed PayPal buyer address. Carrier telemetry confirms physical delivery with signature 'S. Connor'. Under PayPal Seller Protection rules, verified physical delivery to the confirmed address protects seller against unauthorized transaction claims."
  },
  {
    id: "PP-D-31904",
    merchant_id: "MERC-DEFAULT-001",
    transaction_id: "TXN-109284",
    amount: 185.00,
    currency: "USD",
    reason: "NOT_AS_DESCRIBED",
    status: "AUTO_DEFENDED",
    carrier_name: "FEDEX",
    tracking_number: "789012341092",
    evidence_type: "RETURN_POLICY",
    confidence_score: 0.978,
    execution_time_seconds: 6.12,
    ai_defense_notes: "Buyer opened dispute without requesting return authorization under merchant's published 14-day policy. Warehouse logs confirm item dispatched exactly matches description and SKU specifications."
  }
];

export default function App() {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState(INITIAL_DISPUTES[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals state
  const [isTosOpen, setIsTosOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Trigger simulated dispute defense
  const handleSimulateDispute = () => {
    setIsProcessing(true);
    const newId = `PP-D-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAmount = Math.floor(80 + Math.random() * 450) + 0.99;

    const pendingCase = {
      id: newId,
      merchant_id: "MERC-DEFAULT-001",
      transaction_id: newTxn,
      amount: newAmount,
      currency: "USD",
      reason: "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
      status: "PROCESSING",
      carrier_name: "FEDEX",
      tracking_number: `940011189956${Math.floor(10000000 + Math.random() * 90000000)}`,
      evidence_type: "PROOF_OF_DELIVERY",
      confidence_score: 0.985,
      execution_time_seconds: null,
      ai_defense_notes: "Autonomous RAG retrieval active. Synthesizing defense package..."
    };

    setDisputes(prev => [pendingCase, ...prev]);
    setSelectedDispute(pendingCase);

    setTimeout(() => {
      const completedCase = {
        ...pendingCase,
        status: "AUTO_DEFENDED",
        execution_time_seconds: 6.34,
        ai_defense_notes: `Carrier telemetry confirms shipment ${pendingCase.tracking_number} delivered with signed proof of receipt. Internal CRM archives verify conforming merchandise delivered. All requirements under PayPal Merchant Protection are verified.`
      };

      setDisputes(prev => prev.map(d => d.id === newId ? completedCase : d));
      setSelectedDispute(completedCase);
      setIsProcessing(false);
    }, 1800);
  };

  const totalProtected = disputes.reduce((acc, curr) => acc + curr.amount, 148920.00);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-display">
      {/* Top Institutional Header */}
      <header className="border-b border-borderline bg-surface-light px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-ink" />
            <span className="font-serif text-sm tracking-widest font-semibold uppercase text-ink">
              DisputeMind
            </span>
            <span className="text-borderline font-mono text-xs">/</span>
            <span className="font-mono text-[11px] text-ink-muted uppercase">
              PayPal Autonomous Representation
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-ink-secondary">
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-700" />
              <span className="text-[11px] text-ink-muted">SANDBOX: CONNECTED</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-periwinkle" />
              <span className="text-[11px] text-ink-muted">GEMINI 2.0: ARMED</span>
            </div>
            <nav className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-ink text-ink-secondary">
                Methodology
              </button>
              <button onClick={() => setIsTosOpen(true)} className="hover:text-ink text-ink-secondary">
                Terms
              </button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-ink text-ink-secondary">
                Privacy
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        
        {/* Architecture Pipeline Telemetry Strip */}
        <div className="border border-borderline bg-surface-light px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-ink-secondary rounded-[2px] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-periwinkle" />
            <span className="font-semibold text-ink uppercase text-[11px] tracking-wide">Autonomous Adjudication Loop</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted">
            <span className="text-ink font-medium">01 Inbound Webhook</span>
            <span className="text-borderline">/</span>
            <span className="text-ink font-medium">02 Elastic RAG Telemetry</span>
            <span className="text-borderline">/</span>
            <span className="text-ink font-medium">03 Gemini Legal Synthesis</span>
            <span className="text-borderline">/</span>
            <span className="text-ink font-medium">04 PayPal REST Submission</span>
          </div>
        </div>

        {/* Banking Overview Section (Scrolltide U-Banking Inspo + Maxim Mukhanov 3D Card) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Financial Balance & Key Protection Gauges (8 cols) */}
          <div className="lg:col-span-7 bg-surface-light border border-borderline p-6 flex flex-col justify-between rounded-[2px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-borderline">
                <span className="font-mono text-xs text-ink-muted uppercase">Merchant Capital Protection</span>
                <span className="font-mono text-[11px] px-2 py-0.5 bg-canvas border border-borderline text-ink-muted">
                  ACCOUNT: MERC-DEFAULT-001
                </span>
              </div>

              <div className="mt-4">
                <div className="font-mono text-3xl font-semibold tracking-tight text-ink">
                  ${totalProtected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
                <div className="text-xs font-mono text-ink-muted mt-1">
                  Total capital actively monitored and defended under PayPal Merchant Protection.
                </div>
              </div>
            </div>

            {/* Three-State Analytics Gauge (Scrolltide Banking Reference) */}
            <div className="mt-6 pt-4 border-t border-borderline">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-ink-muted uppercase text-[10px]">Capital Adjudication Ratio</span>
                <span className="font-semibold text-emerald-800">98.5% WIN RATIO</span>
              </div>
              <div className="w-full h-2.5 bg-canvas-deep flex overflow-hidden border border-borderline rounded-[1px]">
                <div className="bg-periwinkle-dark h-full w-[92%]" title="Defended & Recovered (92%)" />
                <div className="bg-periwinkle/40 h-full w-[6.5%]" title="Under Adjudication (6.5%)" />
                <div className="bg-slate-400 h-full w-[1.5%]" title="Manual Review (1.5%)" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-ink-muted mt-2">
                <span>Recovered: $138,200.00</span>
                <span>Active Representation: $10,720.00</span>
                <span>Surrendered: $0.00</span>
              </div>
            </div>

            {/* Operational SLA Statistics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-borderline mt-4 text-xs font-mono">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Mean SLA</span>
                <span className="font-semibold text-ink">6.96 SEC</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Autonomous Wins</span>
                <span className="font-semibold text-ink">48 OF 49</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Manual Labor Saved</span>
                <span className="font-semibold text-ink">36.5 HOURS</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive 3D Merchant Security Card (5 cols) */}
          <div className="lg:col-span-5 bg-surface-dark border border-hairline-dark p-6 flex flex-col items-center justify-center rounded-[2px] relative">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-white/70 font-mono text-[10px] uppercase">
              <span>Security Token</span>
              <span>CURSOR TILT ENABLED</span>
            </div>
            
            <InteractiveCard3D
              merchantName="Apex Electronics Store"
              merchantId="MERC-DEFAULT-001"
              protectedVolume={`$${totalProtected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </div>
        </section>

        {/* Action Strip & Dispute Ledger Section */}
        <section className="bg-surface-light border border-borderline p-6 rounded-[2px]">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-borderline gap-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">
                Active Dispute Ledger
              </h2>
              <p className="font-mono text-xs text-ink-muted mt-0.5">
                Real-time queue of intercepted PayPal chargeback notices and evidence submissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateDispute}
                disabled={isProcessing}
                className="px-4 py-2 bg-ink text-white font-mono text-xs font-medium hover:bg-ink-secondary disabled:opacity-50 border border-ink rounded-[2px] flex items-center gap-2"
              >
                <RefreshIcon className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? "SIMULATING DISPUTE..." : "SIMULATE INBOUND DISPUTE"}
              </button>
            </div>
          </div>

          {/* AG Grid Dispute Table */}
          <div className="mt-4">
            <DisputeLedger
              disputes={disputes}
              onSelectDispute={(dispute) => setSelectedDispute(dispute)}
              selectedDisputeId={selectedDispute?.id}
            />
          </div>

          {/* Selected Case Inspector */}
          {selectedDispute && (
            <EvidenceInspector
              dispute={selectedDispute}
              onClose={() => setSelectedDispute(null)}
              onRunDefense={handleSimulateDispute}
              isProcessing={isProcessing}
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-borderline bg-surface-light px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-mono text-ink-muted gap-4">
          <div>
            DisputeMind AI. Built for the PayPal and AI Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-ink">Methodology</button>
            <button onClick={() => setIsTosOpen(true)} className="hover:text-ink">Terms of Service</button>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-ink">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Legal & About Modals */}
      <TermsOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <AboutUsModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

