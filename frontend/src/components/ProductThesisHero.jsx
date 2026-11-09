import React from 'react';
import { InteractiveCard3D } from './InteractiveCard3D';
import { RefreshIcon, ArrowRightIcon, ShieldIcon } from './Icons';

/**
 * Product Thesis Hero Component (Augustus + Overtake Inspiration)
 * Features the authoritative 3-line thesis, real-time capital ticker,
 * and the scroll-interactive 3D merchant card.
 */
export const ProductThesisHero = ({
  totalProtected,
  onSimulateDispute,
  isProcessing,
  onJumpToTerminal
}) => {
  return (
    <section id="thesis" className="border-b border-borderline py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Authoritative 3-Line Thesis (Augustus Style) (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-card border border-borderline text-[11px] font-mono text-ink-muted rounded-[1px]">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span className="font-semibold text-ink">PAYPAL AND AI HACKATHON</span>
            <span className="text-borderline-light">/</span>
            <span>AUTONOMOUS AGENT SPECIFICATION</span>
          </div>

          {/* The 3-Line Core Thesis */}
          <div className="space-y-4">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-ink leading-tight tracking-tight">
              PayPal chargebacks drain merchant margins through manual friction and missed deadlines.
            </h1>
            
            <p className="font-display text-base sm:text-lg text-ink-secondary leading-relaxed font-normal">
              DisputeMind AI connects to PayPal webhooks, retrieves carrier proofs of delivery via Elastic RAG, and synthesizes legal contestations with Gemini 2.0.
            </p>

            <p className="font-mono text-sm sm:text-base text-accent-emerald font-medium tracking-tight">
              Sub-7-second autonomous submission. 98.5% capital recovery rate. Zero human intervention required.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onSimulateDispute}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-accent text-white font-mono text-xs font-semibold hover:bg-accent-navy disabled:opacity-50 border border-accent/40 rounded-[2px] flex items-center gap-2 transition-colors"
            >
              <RefreshIcon className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? "SIMULATING DISPUTE..." : "SIMULATE INBOUND DISPUTE"}
            </button>

            <button
              onClick={onJumpToTerminal}
              className="px-5 py-2.5 bg-surface-card text-ink-secondary hover:text-ink font-mono text-xs font-medium border border-borderline rounded-[2px] flex items-center gap-2 transition-colors"
            >
              <span>INSPECT LIVE TERMINAL</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* High-Impact Proof Metrics Ticker (Overtake Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-borderline font-mono">
            <div className="bg-surface-card border border-borderline p-3 rounded-[1px]">
              <span className="text-[10px] text-ink-muted uppercase block">Mean SLA</span>
              <span className="text-lg font-bold text-ink">6.96 SEC</span>
              <span className="text-[10px] text-accent-emerald block mt-0.5">Automated REST</span>
            </div>

            <div className="bg-surface-card border border-borderline p-3 rounded-[1px]">
              <span className="text-[10px] text-ink-muted uppercase block">Capital Shield</span>
              <span className="text-lg font-bold text-ink">
                ${(totalProtected / 1000).toFixed(1)}k USD
              </span>
              <span className="text-[10px] text-accent block mt-0.5">Active Monitored</span>
            </div>

            <div className="bg-surface-card border border-borderline p-3 rounded-[1px]">
              <span className="text-[10px] text-ink-muted uppercase block">Win Ratio</span>
              <span className="text-lg font-bold text-accent-emerald">98.5%</span>
              <span className="text-[10px] text-ink-muted block mt-0.5">Chapter 11 Match</span>
            </div>

            <div className="bg-surface-card border border-borderline p-3 rounded-[1px]">
              <span className="text-[10px] text-ink-muted uppercase block">Labor Saved</span>
              <span className="text-lg font-bold text-ink">36.5 HRS</span>
              <span className="text-[10px] text-accent-emerald block mt-0.5">Per 50 Disputes</span>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Scroll-Rotating 3D Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="w-full flex items-center justify-between pb-2 mb-4 text-ink-muted font-mono text-[10px] uppercase border-b border-borderline">
            <span className="flex items-center gap-1.5">
              <ShieldIcon className="w-3 h-3 text-accent" />
              Autonomous Merchant Security Token
            </span>
            <span>SCROLL & TILT ENABLED</span>
          </div>

          <InteractiveCard3D
            merchantName="Apex Global Fulfillment"
            merchantId="MERC-DEFAULT-001"
            protectedVolume={`$${totalProtected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            activePhase={isProcessing ? "SYNTHESIZING CONTESTATION" : "AUTONOMOUS MONITORING"}
          />

          <div className="w-full mt-4 p-3 bg-surface-card border border-borderline text-[11px] font-mono text-ink-muted flex items-center justify-between rounded-[1px]">
            <span>SANDBOX GATEWAY: api-m.sandbox.paypal.com</span>
            <span className="text-accent-emerald font-semibold">ONLINE</span>
          </div>
        </div>

      </div>
    </section>
  );
};
