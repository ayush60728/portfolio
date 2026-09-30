import React, { useState, useEffect } from 'react';
import BootSequence from './BootSequence';
import MyselfTab from './MyselfTab';

export default function ScreenViewport({ playSound, isOn, isStarted, isBooting }) {
  const [time, setTime] = useState('');
  const [battery, setBattery] = useState({ level: 100, charging: false });
  const [activeTab, setActiveTab] = useState(0);

  // Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery Status API Effect
  useEffect(() => {
    let batteryRef = null;

    const updateBattery = (b) => {
      setBattery({
        level: Math.round(b.level * 100),
        charging: b.charging,
      });
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then((b) => {
        batteryRef = b;
        updateBattery(b);
        b.addEventListener('levelchange', () => updateBattery(b));
        b.addEventListener('chargingchange', () => updateBattery(b));
      }).catch(() => {});
    }

    return () => {
      if (batteryRef) {
        batteryRef.removeEventListener('levelchange', () => updateBattery(batteryRef));
        batteryRef.removeEventListener('chargingchange', () => updateBattery(batteryRef));
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-console-screenBg rounded-[20px] border border-slate-800 flex flex-col overflow-hidden shadow-inner z-10 select-none">
      
      {/* Top Status Bar (Always visible when ON) */}
      <div className="absolute top-4 left-5 cursor-default transition-all duration-300 text-slate-400/80 hover:text-retro-mint hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] z-30">
        <span className="font-pixel text-[14px] tracking-widest drop-shadow-md">{time}</span>
      </div>

      <div className="absolute top-4 right-5 flex items-center gap-1.5 cursor-default text-slate-400/80 transition-all duration-300 hover:text-retro-mint hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] z-30">
        {battery.charging && (
          <svg className="w-3.5 h-3.5 animate-pulse text-retro-mint drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        )}
        <div className="flex items-center opacity-90 drop-shadow-md">
          <div className="w-7 h-[14px] border-2 border-current rounded-sm p-[1.5px] flex items-center">
            <div className={`h-full transition-colors duration-300 ${battery.level <= 20 && !battery.charging ? 'bg-red-500 animate-pulse' : 'bg-current'}`} style={{ width: `${battery.level}%` }}></div>
          </div>
          <div className="w-[2px] h-2 bg-current rounded-r-sm"></div>
        </div>
      </div>
      <div className="absolute top-12 left-4 right-4 h-[1px] bg-slate-700/50 z-20 shadow-[0_1px_0_rgba(255,255,255,0.03)]"></div>

      {/* STATE 1: Waiting for START */}
      {isOn && !isStarted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="font-pixel text-slate-400/80 retro-blinker tracking-widest text-[12px] mt-8">
            &gt; PRESS START
          </span>
        </div>
      )}

      {/* STATE 2 & 3: Application Running */}
      {isStarted && (
        <div className="absolute inset-0">
          
          {/* Vertical Divider Line */}
          <div className="absolute top-12 bottom-4 left-[126px] w-[1px] bg-slate-700/50 z-10 shadow-[1px_0_0_rgba(255,255,255,0.03)]"></div>

          {/* Sidebar Menu (Always visible when started, but locked during boot) */}
          <div className="absolute top-[4.5rem] bottom-8 left-4 w-[105px] flex flex-col justify-between z-20">
            {['MYSELF', 'PROJECTS', 'SKILLS', 'TERMINAL'].map((item, idx) => (
              <div 
                key={item}
                onClick={() => {
                  if (!isBooting) {
                    setActiveTab(idx);
                    if (playSound) playSound(600, 'square', 0.05);
                  }
                }}
                className={`relative pl-2 pr-1 py-2 w-full cursor-pointer font-pixel text-[9px] sm:text-[10px] tracking-widest transition-all ${
                  activeTab === idx 
                    ? 'text-white border border-[#7a5ea6] bg-[#1e1536]'
                    : 'text-slate-600 border border-transparent hover:text-slate-400'
                } ${isBooting ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
              >
                <span className="relative z-10">{item}</span>
                {activeTab === idx && !isBooting && (
                  <div className="absolute -right-[5.5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#1e1536] border-t border-r border-[#7a5ea6] rotate-45 z-10"></div>
                )}
              </div>
            ))}
          </div>

          {/* Right Main Content Area */}
          <div className="absolute top-12 bottom-0 left-[127px] right-0 overflow-hidden flex items-center justify-center">
            {isBooting ? (
              <BootSequence onComplete={() => {}} />
            ) : (
              <div className="w-full h-full animate-content-fade">
                {activeTab === 0 && <MyselfTab />}
                {activeTab === 1 && <p className="font-pixel text-white text-sm p-6">PROJECTS CONTENT</p>}
                {activeTab === 2 && <p className="font-pixel text-white text-sm p-6">SKILLS CONTENT</p>}
                {activeTab === 3 && <p className="font-pixel text-white text-sm p-6">TERMINAL CONTENT</p>}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
