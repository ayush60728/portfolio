import React, { useState, useRef, useEffect, useCallback } from 'react';
import ScreenViewport from './ScreenViewport';
import { useGameInput } from '../hooks/useGameInput';
import SpriteVideo from './SpriteVideo';

export default function ConsoleShell({ playSound }) {
  const [scanlines, setScanlines] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const bootTimersRef = useRef([]);

  // Clean up boot timers
  const clearBootTimers = useCallback(() => {
    bootTimersRef.current.forEach(clearTimeout);
    bootTimersRef.current = [];
  }, []);

  // Wire keyboard → console controls (guard against input focus)
  const handleGameInput = useCallback((action) => {
    // Don't handle game inputs when a text field is focused
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    if (activeTag === 'input' || activeTag === 'textarea') return;
    if (!isOn) return;

    switch (action) {
      case 'UP':    navigateDpad('up'); break;
      case 'DOWN':  navigateDpad('down'); break;
      case 'LEFT':  navigateDpad('left'); break;
      case 'RIGHT': navigateDpad('right'); break;
      case 'A':     handleButtonA(); break;
      case 'B':     handleButtonB(); break;
      default: break;
    }
  }, [isOn]);

  useGameInput(handleGameInput);

  const navigateDpad = (direction) => {
    playSound(640, 'square', 0.09);
    window.dispatchEvent(new CustomEvent('dpad', { detail: { direction } }));
  };

  const handleButtonA = () => {
    playSound(640, 'square', 0.09);
    window.dispatchEvent(new CustomEvent('actionBtn', { detail: { type: 'A' } }));
  };

  const handleButtonB = () => {
    playSound(640, 'square', 0.09);
    window.dispatchEvent(new CustomEvent('actionBtn', { detail: { type: 'B' } }));
  };

  const handleSelectButton = () => {
    if (!isOn) return;
    playSound(480, 'sawtooth', 0.08);
    setScanlines(!scanlines);
  };

  const handleStartButton = () => {
    if (!isOn) return;
    
    if (!isStarted) {
      playSound(400, 'square', 0.1);
      setIsStarted(true);
      setIsBooting(true);
      
      // Schedule boot sounds/transitions with cleanup tracking
      const t1 = setTimeout(() => {
        playSound(1200, 'sine', 0.25); 
      }, 2200);
      
      const t2 = setTimeout(() => {
        setIsBooting(false);
      }, 4700);

      bootTimersRef.current = [t1, t2];
    } else {
      playSound(700, 'sine', 0.08);
    }
  };

  const togglePower = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    if (!nextState) {
      playSound(240, 'sine', 0.15);
      setIsStarted(false);
      setIsBooting(false);
      clearBootTimers();
    } else {
      playSound(640, 'sine', 0.15);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearBootTimers();
  }, [clearBootTimers]);

  return (
    <section className="relative w-full h-full flex justify-center items-center" aria-label="Retro console portfolio">
      <div 
        className="relative w-full h-full flex flex-col max-w-[580px] sm:max-w-[660px] md:max-w-[720px] bg-gradient-to-b from-lilac-400 via-console-shell to-lilac-700 rounded-[52px] sm:rounded-[60px] p-4 sm:p-5 pb-8 sm:pb-12 shadow-shell-outer border-2 border-purple-300/40"
      >
        {/* Power Controls Header */}
        <div className="flex items-center justify-between px-5 pb-3 sm:pb-4 text-[10px] font-pixel text-purple-950/80 select-none">
          <div className="flex items-center gap-3">
            <span 
              className="font-sans italic text-[16px] text-[#2c1754] tracking-[0.15em] uppercase"
              style={{ 
                fontWeight: 900,
                WebkitTextStroke: '0.6px #2c1754',
                textShadow: '0px 1px 0px rgba(255, 255, 255, 0.4)'
              }}
            >
              POWER
            </span>
            
            <button 
              className="relative w-11 h-5 bg-[#181726] rounded-full border-t-2 border-slate-800 shadow-inner flex items-center px-0.5 cursor-pointer overflow-hidden group"
              onClick={togglePower}
              aria-label={isOn ? 'Turn power off' : 'Turn power on'}
              aria-pressed={isOn}
            >
              <div className="absolute inset-0 flex justify-between px-1.5 items-center pointer-events-none opacity-50">
                <span className="text-[6px] font-mono font-bold text-red-500">O</span>
                <span className="text-[6px] font-mono font-bold text-retro-mint">I</span>
              </div>
              <div className={`relative z-10 w-5 h-4 rounded-full border border-purple-950/50 shadow-sm transition-transform duration-200 flex items-center justify-center ${isOn ? 'translate-x-[20px] bg-retro-mint' : 'translate-x-0 bg-red-600'}`}>
                <div className="flex gap-[1px]">
                  <div className="w-[1px] h-2 bg-black/20"></div>
                  <div className="w-[1px] h-2 bg-black/20"></div>
                </div>
              </div>
            </button>

            {/* LED Status Light */}
            <div
              className={`relative w-3.5 h-3.5 rounded-full transition-all ml-2 border border-purple-950/40 ${isOn ? 'bg-retro-mint shadow-[0_0_15px_#34d399,inset_0_2px_3px_#ffffff] animate-pulse' : 'bg-red-700 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]'}`}
              role="status"
              aria-label={isOn ? 'Power on' : 'Power off'}
            >
              <span className="absolute top-[2px] left-[2px] w-1 h-1 bg-white/70 rounded-full pointer-events-none"></span>
            </div>
          </div>
        </div>

        {/* Screen Bezel */}
        <div className="relative flex-1 bg-console-bezel rounded-[30px] p-3.5 sm:p-5 shadow-bezel-inner border border-slate-700/60 overflow-hidden flex flex-col min-h-[250px]">
          <div className="screen-glare absolute inset-0 rounded-[28px] z-30 pointer-events-none"></div>
          <div className={`scanlines-overlay absolute inset-0 z-20 pointer-events-none rounded-[26px] transition-opacity ${scanlines && isOn ? 'opacity-75' : 'opacity-0'}`}></div>
          
          <div className="relative flex-1 w-full">
            <ScreenViewport playSound={playSound} isOn={isOn} isStarted={isStarted} isBooting={isBooting} />
          </div>
          
          {/* Black Screen Overlay for Power Off State */}
          <div className={`absolute inset-0 bg-[#070b14] rounded-[28px] z-40 pointer-events-none transition-opacity duration-300 ${isOn ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>

        {/* Controls Area */}
        <div className="mt-2 sm:mt-4 px-2 sm:px-4 shrink-0 relative">
          {/* SELECT / START */}
          <div className="flex justify-center items-center gap-8 sm:gap-10 mb-0 select-none translate-y-1 sm:translate-y-2 z-10 relative">
            <div className="flex flex-col items-center">
              <button 
                onClick={handleSelectButton}
                aria-label="Select button — toggle scanlines"
                className="w-16 sm:w-20 h-6 sm:h-[26px] bg-slate-800 hover:bg-slate-700 active:bg-slate-950 active:scale-95 rounded-full -rotate-[20deg] shadow-md border-2 border-slate-950/60 cursor-pointer transition-all" 
              />
              <span 
                className="mt-2.5 sm:mt-3 font-sans italic text-[14px] sm:text-[16px] text-[#2c1754] tracking-[0.1em] uppercase"
                style={{ fontWeight: 900, WebkitTextStroke: '0.5px #2c1754', textShadow: '0px 1px 0px rgba(255, 255, 255, 0.4)' }}
              >
                SELECT
              </span>
            </div>
            <div className="flex flex-col items-center">
              <button 
                onClick={handleStartButton}
                aria-label="Start button"
                className="w-16 sm:w-20 h-6 sm:h-[26px] bg-slate-800 hover:bg-slate-700 active:bg-slate-950 active:scale-95 rounded-full -rotate-[20deg] shadow-md border-2 border-slate-950/60 cursor-pointer transition-all" 
              />
              <span 
                className="mt-2.5 sm:mt-3 font-sans italic text-[14px] sm:text-[16px] text-[#2c1754] tracking-[0.1em] uppercase"
                style={{ fontWeight: 900, WebkitTextStroke: '0.5px #2c1754', textShadow: '0px 1px 0px rgba(255, 255, 255, 0.4)' }}
              >
                START
              </span>
            </div>
          </div>

          {/* D-Pad and A/B Buttons */}
          <div className="relative flex items-center justify-between h-[150px] sm:h-[155px] select-none px-2 sm:px-6 mt-3 sm:mt-5">
            {/* D-Pad */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="relative w-28 h-28 scale-[1.35] sm:scale-[1.45] origin-center">
                <div className="absolute left-9 top-0 w-10 h-28 bg-console-dpad rounded-md shadow-dpad-btn border border-black/40"></div>
                <div className="absolute top-9 left-0 w-28 h-10 bg-console-dpad rounded-md shadow-dpad-btn border border-black/40"></div>
                <div className="absolute top-9 left-9 w-10 h-10 bg-[#22212b] rounded-full shadow-inner pointer-events-none flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#181720]"></div>
                </div>
                
                <button aria-label="D-pad up" className="btn-tactile absolute top-0 left-9 w-10 h-9 rounded-t-md hover:bg-slate-700 active:bg-console-dpadActive flex items-center justify-center text-slate-500 hover:text-white transition-colors" onClick={() => { if (!isOn) return; navigateDpad('up'); }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                </button>
                <button aria-label="D-pad down" className="btn-tactile absolute bottom-0 left-9 w-10 h-9 rounded-b-md hover:bg-slate-700 active:bg-console-dpadActive flex items-center justify-center text-slate-500 hover:text-white transition-colors" onClick={() => { if (!isOn) return; navigateDpad('down'); }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                </button>
                <button aria-label="D-pad left" className="btn-tactile absolute top-9 left-0 w-9 h-10 rounded-l-md hover:bg-slate-700 active:bg-console-dpadActive flex items-center justify-center text-slate-500 hover:text-white transition-colors" onClick={() => { if (!isOn) return; navigateDpad('left'); }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"></path></svg>
                </button>
                <button aria-label="D-pad right" className="btn-tactile absolute top-9 right-0 w-9 h-10 rounded-r-md hover:bg-slate-700 active:bg-console-dpadActive flex items-center justify-center text-slate-500 hover:text-white transition-colors" onClick={() => { if (!isOn) return; navigateDpad('right'); }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path></svg>
                </button>
              </div>
            </div>

            {/* A/B Buttons */}
            <div className="flex items-center gap-7 sm:gap-9 transform -rotate-15 -translate-y-2 pr-2 sm:pr-4">
              <div className="flex flex-col items-center">
                <button aria-label="Button B — go back" className="btn-tactile w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-console-wine hover:bg-console-wineHover active:bg-console-wineActive text-purple-200 text-sm font-bold shadow-btn-wine border-t border-red-300/30 flex items-center justify-center cursor-pointer transition-transform" onClick={() => { if (!isOn) return; handleButtonB(); }}></button>
                <span 
                  className="mt-2 font-sans italic text-[18px] sm:text-[20px] text-[#2c1754] tracking-widest uppercase"
                  style={{ fontWeight: 900, WebkitTextStroke: '0.7px #2c1754', textShadow: '0px 1.5px 0px rgba(255, 255, 255, 0.4)' }}
                >
                  B
                </span>
              </div>
              <div className="flex flex-col items-center -translate-y-5 sm:-translate-y-7">
                <button aria-label="Button A — confirm" className="btn-tactile w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-console-wine hover:bg-console-wineHover active:bg-console-wineActive text-purple-200 text-sm font-bold shadow-btn-wine border-t border-red-300/30 flex items-center justify-center cursor-pointer transition-transform" onClick={() => { if (!isOn) return; handleButtonA(); }}></button>
                <span 
                  className="mt-2 font-sans italic text-[18px] sm:text-[20px] text-[#2c1754] tracking-widest uppercase"
                  style={{ fontWeight: 900, WebkitTextStroke: '0.7px #2c1754', textShadow: '0px 1.5px 0px rgba(255, 255, 255, 0.4)' }}
                >
                  A
                </span>
              </div>
            </div>
          </div>

          {/* Speaker Grill */}
          <div className="absolute -bottom-1 sm:bottom-1 right-6 sm:right-10 flex gap-2.5 sm:gap-3 opacity-85" aria-hidden="true">
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
            <span className="speaker-grill-slot w-2.5 sm:w-3 h-9 sm:h-10 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Animated Mascot (Right Side) */}
      <SpriteVideo isOn={isOn} />
    </section>
  );
}
