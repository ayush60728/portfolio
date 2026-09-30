import React, { useEffect, useState, useMemo } from 'react';

export default function BootSequence({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [showRain, setShowRain] = useState(false);
  const [dissolvedLetters, setDissolvedLetters] = useState(new Set());
  const [bursts, setBursts] = useState([]);
  const [textGlow, setTextGlow] = useState(false);

  const titleText = 'AYUSH';
  const subText = 'welcomes you';
  const allLetters = [
    ...titleText.split('').map((c, i) => `t-${i}`),
    ...subText.split('').map((c, i) => `s-${i}`)
  ];

  // Rain drops with trails
  const rainDrops = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 0.7 + Math.random() * 0.5,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      trailLength: 8 + Math.floor(Math.random() * 16),
    }));
  }, []);

  // Spawn burst particles at a letter's position
  const spawnBurst = (key) => {
    const isTitle = key.startsWith('t-');
    const idx = parseInt(key.split('-')[1]);
    
    // Approximate center position of the letter (% of container)
    let cx, cy;
    if (isTitle) {
      // Title letters are ~42px each, centered
      const totalW = titleText.length * 36;
      cx = 50 + ((idx * 36 + 18) - totalW / 2) / 5;
      cy = 45;
    } else {
      const totalW = subText.length * 8;
      cx = 50 + ((idx * 8 + 4) - totalW / 2) / 5;
      cy = 55;
    }

    const newBurst = Array.from({ length: 4 }).map((_, bi) => ({
      id: `${key}-${bi}-${Date.now()}`,
      cx, cy,
      tx: (Math.random() - 0.5) * 40,
      ty: (Math.random() - 0.5) * 30,
      size: 2 + Math.random() * 2,
    }));
    setBursts(prev => [...prev, ...newBurst]);

    // Clean up old bursts after animation
    setTimeout(() => {
      setBursts(prev => prev.filter(b => !newBurst.find(nb => nb.id === b.id)));
    }, 500);
  };

  useEffect(() => {
    // Phase 0 → 1: Dot expands into text
    const t1 = setTimeout(() => setPhase(1), 500);
    // Phase 1 → 2: Subtitle appears
    const t2 = setTimeout(() => setPhase(2), 1700);

    // Brief glow pulse on text before rain hits
    const tGlow = setTimeout(() => setTextGlow(true), 2000);

    // 0.5s after subtitle → rain begins
    const tRain = setTimeout(() => {
      setShowRain(true);

      // Dissolve letters: title first (left to right), then subtitle (random)
      const titleKeys = titleText.split('').map((_, i) => `t-${i}`);
      const subKeys = subText.split('').map((_, i) => `s-${i}`).sort(() => Math.random() - 0.5);
      const dissolveOrder = [...titleKeys, ...subKeys];

      dissolveOrder.forEach((key, idx) => {
        setTimeout(() => {
          setDissolvedLetters(prev => new Set([...prev, key]));
          spawnBurst(key);
        }, 200 + idx * 100);
      });
    }, 2200);

    // End sequence
    const tEnd = setTimeout(() => {
      setPhase(5);
      setShowRain(false);
      setBursts([]);
      if (onComplete) onComplete();
    }, 2200 + allLetters.length * 100 + 800);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(tGlow);
      clearTimeout(tRain); clearTimeout(tEnd);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Phase 0: Pulsing seed dot with expanding ring */}
      {phase === 0 && (
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 bg-retro-mint rounded-full shadow-[0_0_12px_#34d399,0_0_24px_#34d399] animate-pulse"></div>
          <div className="absolute w-8 h-8 rounded-full border border-retro-mint/30 animate-ping"></div>
        </div>
      )}

      {/* Phase 1+: Text that stays until rain dissolves it */}
      {(phase >= 1 && phase < 5) && (
        <div className={`flex flex-col items-center justify-center -translate-y-4 z-10 transition-all duration-500 ${textGlow ? 'drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]' : ''}`}>
          
          {/* AYUSH title */}
          <div className={`overflow-hidden whitespace-nowrap ${phase === 1 ? 'animate-typing-fast' : ''}`}>
            <h1 className="font-pixel text-[38px] sm:text-[42px] leading-none tracking-widest flex">
              {titleText.split('').map((char, i) => {
                const key = `t-${i}`;
                const isDissolved = dissolvedLetters.has(key);
                return (
                  <span
                    key={key}
                    className="inline-block"
                    style={{
                      color: isDissolved ? 'transparent' : '#34d399',
                      textShadow: isDissolved 
                        ? 'none' 
                        : textGlow 
                          ? '0 0 20px rgba(52,211,153,0.8), 0 0 40px rgba(52,211,153,0.4), 0 0 60px rgba(52,211,153,0.2)'
                          : '0 0 12px rgba(52,211,153,0.5), 0 0 25px rgba(52,211,153,0.2)',
                      transform: isDissolved 
                        ? 'translateY(12px) scale(0) rotate(15deg)' 
                        : 'translateY(0) scale(1) rotate(0deg)',
                      opacity: isDissolved ? 0 : 1,
                      filter: isDissolved ? 'blur(6px)' : 'blur(0px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
          </div>

          {/* Decorative line under title */}
          {phase >= 2 && (
            <div className="flex items-center gap-2 mt-2 mb-3"
                 style={{
                   opacity: dissolvedLetters.size > titleText.length ? 0 : 1,
                   transition: 'opacity 0.3s ease',
                 }}>
              <div className="w-6 h-[1px] bg-retro-mint/30"></div>
              <div className="w-1 h-1 bg-retro-mint/50 rounded-full"></div>
              <div className="w-6 h-[1px] bg-retro-mint/30"></div>
            </div>
          )}

          {/* "welcomes you" subtitle */}
          {phase >= 2 && (
            <div className={`overflow-hidden whitespace-nowrap ${phase === 2 && !showRain ? 'animate-typing-fast' : ''}`}>
              <p className="font-pixel text-[11px] tracking-[0.25em] uppercase flex">
                {subText.split('').map((char, i) => {
                  const key = `s-${i}`;
                  const isDissolved = dissolvedLetters.has(key);
                  return (
                    <span
                      key={key}
                      className="inline-block"
                      style={{
                        color: isDissolved ? 'transparent' : '#34d399',
                        textShadow: isDissolved ? 'none' : '0 0 6px rgba(52,211,153,0.4)',
                        transform: isDissolved 
                          ? 'translateY(10px) scale(0) rotate(-10deg)' 
                          : 'translateY(0) scale(1) rotate(0deg)',
                        opacity: isDissolved ? 0 : 1,
                        filter: isDissolved ? 'blur(4px)' : 'blur(0px)',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: char === ' ' ? '0.5em' : 'auto',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========== GREEN DOT RAIN WITH TRAILS ========== */}
      {showRain && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute"
              style={{
                left: `${drop.left}%`,
                top: '-20px',
                animation: `dot-rain ${drop.duration}s linear ${drop.delay}s infinite`,
              }}
            >
              {/* The bright head of the raindrop */}
              <div
                className="rounded-full bg-retro-mint"
                style={{
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  opacity: drop.opacity,
                  boxShadow: `0 0 ${drop.size * 3}px rgba(52,211,153,0.6)`,
                }}
              ></div>
              {/* Fading trail behind the dot */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2"
                style={{
                  width: `${Math.max(1, drop.size - 1)}px`,
                  height: `${drop.trailLength}px`,
                  background: `linear-gradient(to top, rgba(52,211,153,${drop.opacity * 0.5}), transparent)`,
                  borderRadius: '1px',
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* ========== HIT BURST PARTICLES ========== */}
      {bursts.length > 0 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {bursts.map((b) => (
            <div
              key={b.id}
              className="absolute rounded-full bg-retro-mint"
              style={{
                left: `${b.cx}%`,
                top: `${b.cy}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                boxShadow: '0 0 6px #34d399, 0 0 12px rgba(52,211,153,0.4)',
                '--btx': `${b.tx}px`,
                '--bty': `${b.ty}px`,
                animation: `burst-fly 0.45s cubic-bezier(0.2, 0.8, 0.3, 1) forwards`,
              }}
            ></div>
          ))}
        </div>
      )}

    </div>
  );
}
