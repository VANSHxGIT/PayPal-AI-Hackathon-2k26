import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Interactive 3D Merchant Shield Card — Wise Design Language
 * Forest Ink surface, Lime Voltage accents, pill EMV chip geometry.
 * Rotates on scroll + mouse tilt with RAF-throttled updates.
 */
export const InteractiveCard3D = ({
  merchantName = "Apex Global Fulfillment",
  merchantId = "MERC-DEFAULT-001",
  protectedVolume = "$148,920.00",
  activePhase = "AUTONOMOUS MONITORING"
}) => {
  const cardRef = useRef(null);
  const rafId = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const onScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      rafId.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [onScroll]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    setMouse({ x: nx * 16, y: -ny * 16 });
  };

  const rotY = -Math.min(scrollY * 0.07, 42) + mouse.x;
  const rotX =  Math.min(scrollY * 0.035, 22) + mouse.y;
  const tz   =  Math.min(scrollY * 0.04, 36);

  return (
    <div
      className="w-full max-w-[440px] select-none"
      style={{ perspective: '900px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <div
        ref={cardRef}
        className="relative w-full h-[240px] rounded-[28px] p-6 flex flex-col justify-between overflow-hidden cursor-crosshair"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${tz}px)`,
          transition: 'transform 0.14s cubic-bezier(0.2,0.8,0.2,1)',
          transformStyle: 'preserve-3d',
          background: '#163300',
          boxShadow: 'rgba(0,0,0,0.25) 0px 20px 48px 0px',
        }}
      >
        {/* Subtle textured overlay — fine crosshatch at 10% */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 rounded-[28px]"
          style={{
            backgroundImage: 'linear-gradient(to right,#9fe870 1px,transparent 1px),linear-gradient(to bottom,#9fe870 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Row: Brand + Status */}
        <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lime-voltage" />
            <span className="text-lime-voltage font-black text-sm tracking-tight uppercase">DisputeMind</span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full text-lime-voltage/70 border border-lime-voltage/30" style={{ fontSize: 11 }}>
            PAYPAL SANDBOX
          </span>
        </div>

        {/* Middle: EMV Chip + Volume */}
        <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(32px)' }}>
          {/* Physical EMV Chip geometry */}
          <div
            className="w-10 h-7 rounded-[6px] grid grid-cols-2 gap-px p-1 relative overflow-hidden"
            style={{ background: '#C2A366', border: '1px solid #9B7D3A' }}
          >
            <div className="border border-[#8B6B2A] rounded-sm" />
            <div className="border border-[#8B6B2A] rounded-sm" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#8B6B2A]" />
          </div>

          <div className="text-right">
            <div className="text-lime-voltage/60 text-micro font-mono uppercase tracking-widest">Capital Protected</div>
            <div className="text-white font-black text-2xl tracking-tight leading-none mt-1">{protectedVolume}</div>
          </div>
        </div>

        {/* Bottom: Merchant Info */}
        <div
          className="relative z-10 pt-3 flex items-end justify-between"
          style={{ transform: 'translateZ(24px)', borderTop: '1px solid rgba(159,232,112,0.2)' }}
        >
          <div>
            <div className="text-lime-voltage/50 font-mono uppercase tracking-widest" style={{ fontSize: 9 }}>Authorized Merchant</div>
            <div className="text-white font-semibold text-sm truncate max-w-[200px] mt-0.5">{merchantName}</div>
            <div className="text-lime-voltage/40 font-mono tracking-widest mt-0.5" style={{ fontSize: 10 }}>{merchantId}</div>
          </div>
          <div className="text-right">
            <div className="text-lime-voltage/50 font-mono uppercase tracking-widest" style={{ fontSize: 9 }}>State</div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-voltage animate-pulse" />
              <span className="text-lime-voltage font-semibold font-mono tracking-wide" style={{ fontSize: 10 }}>{activePhase}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
