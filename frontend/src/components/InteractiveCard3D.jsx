import React, { useState, useRef } from 'react';

/**
 * Interactive 3D Merchant Security Card
 * Inspired by Maxim Mukhanov's interactive tactile 3D styling and Scrolltide's periwinkle banking card.
 * Tracks cursor coordinates to dynamically tilt in 3D perspective space.
 */
export const InteractiveCard3D = ({
  merchantName = "Apex Electronics Ltd",
  merchantId = "MERC-DEFAULT-001",
  protectedVolume = "$148,920.00"
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation limits (-12deg to 12deg)
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div 
      className="perspective-1000 w-full max-w-[420px] select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="preserve-3d relative w-full h-[240px] bg-periwinkle-dark border border-periwinkle/40 p-6 flex flex-col justify-between overflow-hidden cursor-crosshair text-white rounded-[4px]"
      >
        {/* Dynamic Light Sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            opacity: glare.opacity
          }}
        />

        {/* Card Header: Institutional Branding & Status */}
        <div className="flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-white/90" />
            <span className="font-serif tracking-widest text-xs uppercase text-white/90 font-semibold">
              DisputeMind Private
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-wider px-2 py-0.5 bg-black/30 border border-white/20 text-white/80">
            PAYPAL SANDBOX VERIFIED
          </div>
        </div>

        {/* Tactile EMV Chip & Merchant Telemetry */}
        <div className="flex items-center justify-between my-2" style={{ transform: 'translateZ(30px)' }}>
          {/* Microchip */}
          <div className="w-10 h-8 bg-[#C2A366] border border-[#8B703C] p-1 grid grid-cols-2 gap-0.5 relative rounded-[2px]">
            <div className="border border-[#725B2C] h-full" />
            <div className="border border-[#725B2C] h-full" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#725B2C]" />
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono tracking-wider text-white/60 uppercase">Protected Capital</div>
            <div className="font-mono text-lg font-semibold tracking-tight text-white">{protectedVolume}</div>
          </div>
        </div>

        {/* Card Footer: Identification & Adjudication Key */}
        <div className="border-t border-white/10 pt-3 flex items-end justify-between" style={{ transform: 'translateZ(25px)' }}>
          <div>
            <div className="text-[10px] font-mono tracking-wider text-white/60 uppercase">Authorized Merchant</div>
            <div className="text-xs font-medium tracking-wide text-white truncate max-w-[200px]">{merchantName}</div>
            <div className="text-[10px] font-mono text-white/50 tracking-widest mt-0.5">{merchantId}</div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono text-white/60 uppercase">Defense Protocol</div>
            <div className="text-[10px] font-mono text-emerald-300 font-semibold tracking-wider">
              AUTO-DEFENSE ARMED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

