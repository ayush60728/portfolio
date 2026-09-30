import React from 'react';

export default function MyselfTab() {
  return (
    <div className="w-full h-full flex items-start pt-6 px-3">
      <div className="flex gap-4 w-full justify-between">
        
        {/* Left: Text Info */}
        <div className="flex-1 flex flex-col gap-3 font-pixel text-[13px]">
          {/* Name */}
          <div className="flex gap-1">
            <span className="text-slate-500 tracking-wider">NAME:</span>
            <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
              AYUSH
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-slate-700/50"></div>

          {/* Role */}
          <div className="flex gap-1">
            <span className="text-slate-500 tracking-wider">ROLE:</span>
            <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
              DEVELOPER
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-slate-700/50"></div>

          {/* Bio */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-slate-500 tracking-wider">BIO:</span>
            <p className="text-slate-300 leading-relaxed tracking-wide text-[11px] break-words">
              I build playful web experiences and like exploring the space between code, design, and games.
            </p>
          </div>
        </div>

        {/* Right: Portrait Frame */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="relative w-[140px] h-[140px] border-2 border-[#7a5ea6] bg-[#0d0f1a] rounded-sm p-1 shadow-[0_0_10px_rgba(122,94,166,0.3)]">
            {/* Pixel art avatar placeholder */}
            <div className="w-full h-full bg-[#0f1320] rounded-sm overflow-hidden flex items-center justify-center relative">
              {/* Simple pixel face */}
              <div className="relative w-16 h-16">
                {/* Head */}
                <div className="absolute top-0 left-3 w-10 h-10 bg-[#c4956a] rounded-sm"></div>
                {/* Hair */}
                <div className="absolute top-0 left-3 w-10 h-3 bg-[#2a1f14] rounded-t-sm"></div>
                <div className="absolute top-0 left-2 w-3 h-6 bg-[#2a1f14] rounded-l-sm"></div>
                {/* Eyes */}
                <div className="absolute top-4 left-5 w-2 h-2 bg-[#1a1a2e] rounded-full"></div>
                <div className="absolute top-4 left-9 w-2 h-2 bg-[#1a1a2e] rounded-full"></div>
                {/* Eye shine */}
                <div className="absolute top-[15px] left-[21px] w-[3px] h-[3px] bg-white/80 rounded-full"></div>
                <div className="absolute top-[15px] left-[37px] w-[3px] h-[3px] bg-white/80 rounded-full"></div>
                {/* Mouth */}
                <div className="absolute top-7 left-6 w-4 h-[2px] bg-[#8b5e3c] rounded-full"></div>
                {/* Body/Shirt */}
                <div className="absolute top-10 left-2 w-12 h-7 bg-[#1e3a5f] rounded-t-sm"></div>
                {/* Collar */}
                <div className="absolute top-10 left-5 w-6 h-2 bg-[#0f2940]" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
              </div>
              {/* Scanline overlay on portrait */}
              <div className="absolute inset-0 opacity-20" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
              }}></div>
            </div>
          </div>
          {/* Decorative label under portrait */}
          <span className="font-pixel text-[7px] text-slate-600 tracking-[0.3em] uppercase">portrait</span>
        </div>

      </div>
    </div>
  );
}
