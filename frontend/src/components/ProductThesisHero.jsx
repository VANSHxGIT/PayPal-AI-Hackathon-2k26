import React from 'react';
import { InteractiveCard3D } from './InteractiveCard3D';
import { RefreshIcon, ArrowRightIcon, ZapIcon, TrendingUpIcon, ShieldIcon } from './Icons';

/**
 * Hero Section — Wise Design Language applied to Evidentia
 * Massive 900-weight display type, Forest Ink dominance, single Lime Voltage CTA.
 * White canvas top, alternates to Fog card strip, finishes with Forest Ink dark.
 */
export const ProductThesisHero = ({ totalProtected, onSimulateDispute, isProcessing, onJumpToTerminal }) => {
  const stats = [
    { label: 'Mean SLA', value: '6.96s', sub: 'Automated REST' },
    { label: 'Capital Shield', value: `$${(totalProtected / 1000).toFixed(0)}k`, sub: 'Under active guard' },
    { label: 'Win Ratio', value: '98.5%', sub: 'Chapter 11 eligible' },
    { label: 'Hours Saved', value: '36.5h', sub: 'Per 50 disputes' },
  ];

  return (
    <>
      {/* ---- Hero: White canvas ---- */}
      <section className="pt-24 pb-16 px-6 md:px-8 max-w-page mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Display Headline Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Pill badge */}
            <div className="badge-forest inline-flex">
              PayPal and AI Hackathon 2026
            </div>

            {/* Aggressive display headline — Wise 900 weight */}
            <div className="space-y-3">
              <h1 className="text-obsidian font-black leading-none tracking-tight" style={{ fontSize: 'clamp(52px, 7vw, 88px)', lineHeight: 0.9, letterSpacing: '-3px', fontWeight: 900 }}>
                Chargebacks<br />
                <span style={{ color: '#163300' }}>defended</span><br />
                <span style={{ color: '#9fe870', WebkitTextStroke: '2px #163300' }}>autonomously.</span>
              </h1>
            </div>

            {/* Sub-headline: 25px Inter, Charcoal, balanced */}
            <p className="text-charcoal" style={{ fontSize: 20, lineHeight: 1.5, letterSpacing: '-0.2px', maxWidth: 540 }}>
              Evidentia connects to PayPal webhooks, retrieves carrier delivery proofs via Elastic,
              and synthesizes legal contestations with Gemini 2.0 — in under 7 seconds.
            </p>

            {/* Proof statement — Forest Ink, weight 700 */}
            <p className="font-bold" style={{ fontSize: 16, color: '#054d28', letterSpacing: '-0.1px' }}>
              Sub-7-second autonomous submission. 98.5% capital recovery rate. Zero human effort.
            </p>

            {/* CTAs: filled lime pill + text link */}
            <div className="flex flex-wrap items-center gap-5">
              <button onClick={onSimulateDispute} disabled={isProcessing} className="btn-lime text-base">
                <RefreshIcon className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Simulating...' : 'Simulate Dispute'}
              </button>
              <button
                onClick={onJumpToTerminal}
                className="text-forest-ink font-semibold underline underline-offset-2"
                style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                See live terminal
              </button>
            </div>
          </div>

          {/* Right: Scroll-rotating 3D Security Card */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            <div className="text-pebble font-medium flex justify-between w-full max-w-[440px]" style={{ fontSize: 12 }}>
              <span>Merchant Security Token — tilt to interact</span>
              <span>SANDBOX ACTIVE</span>
            </div>
            <InteractiveCard3D
              merchantName="Apex Global Fulfillment"
              merchantId="MERC-DEFAULT-001"
              protectedVolume={`$${totalProtected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              activePhase={isProcessing ? 'SYNTHESIZING' : 'MONITORING'}
            />
            {/* PayPal gateway status strip */}
            <div
              className="w-full max-w-[440px] rounded-full px-5 py-2.5 flex items-center justify-between font-mono"
              style={{ background: '#e2f6d5', fontSize: 12 }}
            >
              <span className="text-forest-ink">api-m.sandbox.paypal.com</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-spruce" />
                <span className="font-semibold text-spruce">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats Band: Fog surface ---- */}
      <section style={{ background: '#e8ebe6' }}>
        <div className="max-w-page mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(14,15,12,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1 px-8 py-6" style={{ background: '#f0f4ee' }}>
                <span className="text-pebble font-medium uppercase tracking-wide" style={{ fontSize: 11 }}>{s.label}</span>
                <span className="font-black text-obsidian" style={{ fontSize: 36, letterSpacing: '-1.5px', lineHeight: 1 }}>{s.value}</span>
                <span className="font-medium" style={{ fontSize: 13, color: '#054d28' }}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
