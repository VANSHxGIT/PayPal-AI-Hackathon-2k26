import React, { useState } from 'react';
import { ProductThesisHero } from './components/ProductThesisHero';
import { PipelineWorkflow } from './components/PipelineWorkflow';
import { DisputeLedger } from './components/DisputeLedger';
import { EvidenceInspector } from './components/EvidenceInspector';
import { JudgeEvaluationMatrix } from './components/JudgeEvaluationMatrix';
import { TermsOfServiceModal, PrivacyPolicyModal, AboutUsModal } from './components/LegalAndAboutModals';
import { RefreshIcon, ShieldIcon, CpuIcon, DatabaseIcon } from './components/Icons';

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
  const [simulationPhase, setSimulationPhase] = useState("");

  // Modals state
  const [isTosOpen, setIsTosOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Trigger simulated dispute defense with staged step updates
  const handleSimulateDispute = () => {
    setIsProcessing(true);
    setSimulationPhase("PHASE 1: Intercepting PayPal Webhook...");
    
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
      setSimulationPhase("PHASE 2: Querying Carrier & CRM Proof via Elastic...");
    }, 600);

    setTimeout(() => {
      setSimulationPhase("PHASE 3: Gemini 2.0 Synthesizing Chapter 11 Legal Brief...");
    }, 1200);

    setTimeout(() => {
      setSimulationPhase("PHASE 4: Submitting Formal Evidence to PayPal REST API...");
    }, 1800);

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
      setSimulationPhase("");
    }, 2400);
  };

  const totalProtected = disputes.reduce((acc, curr) => acc + curr.amount, 148920.00);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-display">
      
      {/* Top Institutional Header (Overtake & Augustus Style) */}
      <header className="sticky top-0 z-40 border-b border-borderline bg-canvas-subtle/95 backdrop-blur-sm px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Punchy Description */}
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-accent" />
            <span className="font-serif text-sm tracking-widest font-bold uppercase text-ink">
              Evidentia
            </span>
            <span className="text-borderline-light font-mono text-xs">/</span>
            <span className="font-mono text-[11px] text-ink-muted uppercase hidden sm:inline">
              Autonomous PayPal Chargeback Defense
            </span>
          </div>

          {/* Jump Tabs to Key Sections */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-mono text-ink-muted">
            <button onClick={() => scrollToSection('thesis')} className="hover:text-ink transition-colors">
              01. Thesis
            </button>
            <button onClick={() => scrollToSection('pipeline')} className="hover:text-ink transition-colors">
              02. Architecture
            </button>
            <button onClick={() => scrollToSection('terminal')} className="hover:text-ink transition-colors">
              03. Live Terminal
            </button>
            <button onClick={() => scrollToSection('judges')} className="hover:text-ink transition-colors">
              04. Judge Matrix
            </button>
          </nav>

          {/* Real-time Status Badges & Legal Modals */}
          <div className="flex items-center gap-4 font-mono text-xs text-ink-muted">
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-surface-card border border-borderline text-[10px]">
              <span className="w-1.5 h-1.5 bg-accent-emerald inline-block" />
              <span>SANDBOX: CONNECTED</span>
            </div>
            
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-surface-card border border-borderline text-[10px]">
              <span className="w-1.5 h-1.5 bg-accent inline-block" />
              <span>GEMINI 2.0: ARMED</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-ink text-ink-secondary">
                Methodology
              </button>
              <button onClick={() => setIsTosOpen(true)} className="hover:text-ink text-ink-secondary">
                Terms
              </button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-ink text-ink-secondary">
                Privacy
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Structural Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 space-y-12">
        
        {/* Section 01: The Product Thesis (Augustus 3-Line Pitch + Rotating 3D Card) */}
        <ProductThesisHero
          totalProtected={totalProtected}
          onSimulateDispute={handleSimulateDispute}
          isProcessing={isProcessing}
          onJumpToTerminal={() => scrollToSection('terminal')}
        />

        {/* Section 02: Balanced Pipeline Breakdown (Kraftline Symmetrical Specification) */}
        <PipelineWorkflow />

        {/* Section 03: Interactive Live Adjudication Terminal (The Working Product) */}
        <section id="terminal" className="border-b border-borderline py-12 md:py-16">
          
          {/* Terminal Explanatory Header */}
          <div className="bg-surface-card border border-borderline p-6 rounded-[2px]">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-borderline gap-4">
              <div>
                <div className="flex items-center gap-2 text-ink-muted font-mono text-xs uppercase mb-1">
                  <span className="w-1.5 h-1.5 bg-accent-emerald inline-block" />
                  <span>Working Product Demonstration</span>
                  <span className="text-borderline-light">/</span>
                  <span>Sponsor Tool Integrations</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
                  Live Adjudication Terminal
                </h2>
                <p className="font-mono text-xs text-ink-muted mt-1 max-w-3xl">
                  Real-time queue of intercepted PayPal chargeback claims. Click any transaction row to inspect the retrieved logistics proof of delivery and Gemini legal contestation dossier.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulateDispute}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-accent text-white font-mono text-xs font-semibold hover:bg-accent-navy disabled:opacity-50 border border-accent/40 rounded-[2px] flex items-center gap-2 transition-colors"
                >
                  <RefreshIcon className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? "SIMULATING DISPUTE..." : "SIMULATE INBOUND DISPUTE"}
                </button>
              </div>
            </div>

            {/* Live Pipeline Step Indicator (visible during simulation) */}
            {isProcessing && (
              <div className="mt-4 p-3 bg-surface-base border border-accent/40 text-xs font-mono text-accent-cyan flex items-center gap-3 rounded-[1px]">
                <RefreshIcon className="w-4 h-4 animate-spin text-accent-cyan" />
                <span className="font-semibold">{simulationPhase}</span>
              </div>
            )}

            {/* High-Density Dispute Table (AG Grid) */}
            <div className="mt-6">
              <DisputeLedger
                disputes={disputes}
                onSelectDispute={(dispute) => setSelectedDispute(dispute)}
                selectedDisputeId={selectedDispute?.id}
              />
            </div>

            {/* Deep Evidence Dossier Inspector */}
            {selectedDispute && (
              <EvidenceInspector
                dispute={selectedDispute}
                onClose={() => setSelectedDispute(null)}
                onRunDefense={handleSimulateDispute}
                isProcessing={isProcessing}
              />
            )}
          </div>

        </section>

        {/* Section 04: Judge Evaluation Matrix & Security Rubric */}
        <JudgeEvaluationMatrix />

      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-borderline bg-canvas-subtle px-6 py-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-mono text-ink-muted gap-4">
          <div>
            Evidentia. Autonomous Chargeback Defense Agent built for the PayPal and AI Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-ink transition-colors">Methodology</button>
            <button onClick={() => setIsTosOpen(true)} className="hover:text-ink transition-colors">Terms of Service</button>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-ink transition-colors">Privacy Policy</button>
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
