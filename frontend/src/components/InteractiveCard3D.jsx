import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Interactive 3D Merchant Security Card
 * Optimized with requestAnimationFrame for smooth 60fps rotation on scroll and mouse tilt.
 */
export const InteractiveCard3D = ({
  merchantName = "Apex Global Fulfillment",
  merchantId = "MERC-DEFAULT-001",
  protectedVolume = "$148,920.00",
  activePhase = "AUTONOMOUS MONITORING"
}) => {
  const cardRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      rafId.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setMouseOffset({
      x: ((x - centerX) / centerX) * 14,
      y: -((y - centerY) / centerY) * 14
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const scrollRotationY = Math.min(scrollY * 0.08, 45);
  const scrollRotationX = Math.min(scrollY * 0.04, 25);
  const scrollTranslateZ = Math.min(scrollY * 0.05, 40);

  const totalRotateX = scrollRotationX + mouseOffset.y;
  const totalRotateY = -scrollRotationY + mouseOffset.x;

  return (
    <div 
      className="perspective-1000 w-full max-w-[440px] select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${totalRotateX}deg) rotateY(${totalRotateY}deg) translateZ(${scrollTranslateZ}px)`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className="preserve-3d relative w-full h-[250px] bg-[#111722] border border-[#26354D] p-6 flex flex-col justify-between overflow-hidden cursor-crosshair text-white rounded-[2px]"
      >
        {/* Subtle metallic hairline grid accent */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Card Header: Institutional Branding & Status */}
        <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(24px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-accent" />
            <span className="font-serif tracking-widest text-xs uppercase text-slate-100 font-semibold">
              DisputeMind Private
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-wider px-2 py-0.5 bg-black/60 border border-[#2D3E5A] text-slate-300">
            PAYPAL API VERIFIED
          </div>
        </div>

        {/* Tactile EMV Microchip & Capital Protected Metric */}
        <div className="flex items-center justify-between my-2 relative z-10" style={{ transform: 'translateZ(34px)' }}>
          <div className="w-11 h-8 bg-[#C2A366] border border-[#8B703C] p-1 grid grid-cols-2 gap-0.5 relative rounded-[1px]">
            <div className="border border-[#725B2C] h-full" />
            <div className="border border-[#725B2C] h-full" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#725B2C]" />
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Capital Under Shield</div>
            <div className="font-mono text-xl font-semibold tracking-tight text-white">{protectedVolume}</div>
          </div>
        </div>

        {/* Card Footer: Authorized Merchant & Active Defense Telemetry */}
        <div className="border-t border-[#1F2C40] pt-3 flex items-end justify-between relative z-10" style={{ transform: 'translateZ(28px)' }}>
          <div>
            <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Merchant Entity</div>
            <div className="text-xs font-semibold tracking-wide text-slate-200 truncate max-w-[210px]">{merchantName}</div>
            <div className="text-[10px] font-mono text-slate-400 tracking-widest mt-0.5">{merchantId}</div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Active State</div>
            <div className="text-[10px] font-mono text-accent-emerald font-semibold tracking-wider flex items-center gap-1.5 justify-end">
              <span className="w-1.5 h-1.5 bg-accent-emerald inline-block" />
              {activePhase}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
