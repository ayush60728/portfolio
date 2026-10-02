import React, { useEffect, useRef } from 'react';

export default function MyselfTab() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleDpad = (e) => {
      if (!scrollRef.current) return;
      const { direction } = e.detail;
      if (direction === 'up') {
        scrollRef.current.scrollBy({ top: -50, behavior: 'smooth' });
      } else if (direction === 'down') {
        scrollRef.current.scrollBy({ top: 50, behavior: 'smooth' });
      }
    };
    window.addEventListener('dpad', handleDpad);
    return () => window.removeEventListener('dpad', handleDpad);
  }, []);

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-4 pt-4 px-3 pb-8">

        {/* Profile Card */}
        <div className="flex gap-4 w-full justify-between">
          {/* Left: Text Info */}
          <div className="flex-1 flex flex-col gap-2.5 font-pixel text-[13px]">
            <div className="flex gap-1">
              <span className="text-slate-500 tracking-wider">NAME:</span>
              <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
                AYUSH
              </span>
            </div>
            <div className="w-full h-[1px] bg-slate-700/50"></div>
            <div className="flex gap-1">
              <span className="text-slate-500 tracking-wider">ROLE:</span>
              <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
                DEVELOPER
              </span>
            </div>
            <div className="w-full h-[1px] bg-slate-700/50"></div>
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-slate-500 tracking-wider">BIO:</span>
              <p className="text-slate-300 font-sans leading-relaxed tracking-wide text-[11px] break-words">
                I build playful web experiences and like exploring the space between code, design, and games.
              </p>
            </div>
          </div>

          {/* Right: Portrait Frame */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-[120px] h-[120px] border-2 border-retro-neonCyan/70 bg-[#0d0f1a] rounded-sm p-1 shadow-[0_0_15px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(34,211,238,0.2)] animate-[pulse_3s_ease-in-out_infinite]">
              <div className="w-full h-full bg-[#0f1320] rounded-sm overflow-hidden flex items-center justify-center relative">
                {/* Pixel art avatar */}
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-3 w-10 h-10 bg-[#c4956a] rounded-sm"></div>
                  <div className="absolute top-0 left-3 w-10 h-3 bg-[#2a1f14] rounded-t-sm"></div>
                  <div className="absolute top-0 left-2 w-3 h-6 bg-[#2a1f14] rounded-l-sm"></div>
                  <div className="absolute top-4 left-5 w-2 h-2 bg-[#1a1a2e] rounded-full"></div>
                  <div className="absolute top-4 left-9 w-2 h-2 bg-[#1a1a2e] rounded-full"></div>
                  <div className="absolute top-[15px] left-[21px] w-[3px] h-[3px] bg-white/80 rounded-full"></div>
                  <div className="absolute top-[15px] left-[37px] w-[3px] h-[3px] bg-white/80 rounded-full"></div>
                  <div className="absolute top-7 left-6 w-4 h-[2px] bg-[#8b5e3c] rounded-full"></div>
                  <div className="absolute top-10 left-2 w-12 h-7 bg-[#1e3a5f] rounded-t-sm"></div>
                  <div className="absolute top-10 left-5 w-6 h-2 bg-[#0f2940]" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
                </div>
                {/* Scanline overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                }}></div>
              </div>
            </div>
            <span className="font-pixel text-[7px] text-slate-600 tracking-[0.3em] uppercase">portrait</span>
          </div>
        </div>

        {/* Simple Divider */}
        <div className="w-full h-[1px] bg-slate-700/50 my-2"></div>

        {/* Contact Links */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2.5 font-sans text-[11px]">
            <a href="https://github.com/ayush60728" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-retro-neonCyan transition-colors flex items-center gap-2">
              <span className="text-retro-neonCyan text-[9px]">►</span> github.com/ayush60728
            </a>
            <span className="text-slate-400 flex items-center gap-2">
              <span className="text-retro-neonCyan text-[9px]">►</span> ayushkumar44344@gmail.com
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
