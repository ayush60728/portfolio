import React, { useState, useEffect, useCallback, useRef } from 'react';
import BootSequence from './BootSequence';
import MyselfTab from './MyselfTab';
import ProjectsTab from './ProjectsTab';
import SkillsTab from './SkillsTab';
import TerminalTab from './TerminalTab';

const TAB_NAMES = ['MYSELF', 'PROJECTS', 'SKILLS', 'TERMINAL'];

export default function ScreenViewport({ playSound, isOn, isStarted, isBooting }) {
  const [time, setTime] = useState('');
  const [battery, setBattery] = useState({ level: 100, charging: false });
  const [activeTab, setActiveTab] = useState(0);
  const sidebarRef = useRef(null);

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

  // Battery Status API Effect — fixed listener cleanup
  useEffect(() => {
    let batteryRef = null;
    let disposed = false;

    const onLevelChange = () => {
      if (batteryRef && !disposed) {
        setBattery({
          level: Math.round(batteryRef.level * 100),
          charging: batteryRef.charging,
        });
      }
    };
    const onChargingChange = onLevelChange;

    if ('getBattery' in navigator) {
      navigator.getBattery().then((b) => {
        if (disposed) return;
        batteryRef = b;
        onLevelChange();
        b.addEventListener('levelchange', onLevelChange);
        b.addEventListener('chargingchange', onChargingChange);
      }).catch(() => {});
    }

    return () => {
      disposed = true;
      if (batteryRef) {
        batteryRef.removeEventListener('levelchange', onLevelChange);
        batteryRef.removeEventListener('chargingchange', onChargingChange);
      }
    };
  }, []);

  // D-pad left/right switches tabs; up/down is handled inside each tab's scroll
  useEffect(() => {
    if (!isStarted || isBooting) return;

    const handleDpad = (e) => {
      // Don't switch tabs if the terminal input is focused
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const { direction } = e.detail;
      if (direction === 'right') {
        setActiveTab((prev) => {
          const next = Math.min(prev + 1, TAB_NAMES.length - 1);
          if (next !== prev && playSound) playSound(600, 'square', 0.05);
          return next;
        });
      } else if (direction === 'left') {
        setActiveTab((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev && playSound) playSound(600, 'square', 0.05);
          return next;
        });
      }
    };

    window.addEventListener('dpad', handleDpad);
    return () => window.removeEventListener('dpad', handleDpad);
  }, [isStarted, isBooting, playSound]);

  const handleTabClick = useCallback((idx) => {
    if (!isBooting) {
      setActiveTab(idx);
      if (playSound) playSound(600, 'square', 0.05);
    }
  }, [isBooting, playSound]);

  const handleTabKeyDown = useCallback((e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(idx);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(idx + 1, TAB_NAMES.length - 1);
      const items = sidebarRef.current?.querySelectorAll('[role="tab"]');
      items?.[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(idx - 1, 0);
      const items = sidebarRef.current?.querySelectorAll('[role="tab"]');
      items?.[prev]?.focus();
    }
  }, [handleTabClick]);

  return (
    <div
      className="absolute inset-0 bg-console-screenBg rounded-[20px] border border-slate-800 flex flex-col overflow-hidden shadow-inner z-10 select-none"
      role="region"
      aria-label="Console screen"
    >
      {/* Top Status Bar */}
      <div className="absolute top-4 left-5 cursor-default transition-all duration-300 text-slate-400/80 hover:text-retro-mint hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] z-30">
        <span className="font-pixel text-[14px] tracking-widest drop-shadow-md" aria-label={`Time: ${time}`}>{time}</span>
      </div>

      <div className="absolute top-4 right-5 flex items-center gap-1.5 cursor-default text-slate-400/80 transition-all duration-300 hover:text-retro-mint hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] z-30" aria-label={`Battery: ${battery.level}%${battery.charging ? ', charging' : ''}`}>
        {battery.charging && (
          <svg className="w-3.5 h-3.5 animate-pulse text-retro-mint drop-shadow-md" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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

          {/* Sidebar Menu */}
          <nav
            ref={sidebarRef}
            className="absolute top-[4.5rem] bottom-8 left-4 w-[105px] flex flex-col justify-between z-20"
            role="tablist"
            aria-label="Navigation"
            aria-orientation="vertical"
          >
            {TAB_NAMES.map((item, idx) => (
              <div
                key={item}
                role="tab"
                tabIndex={activeTab === idx ? 0 : -1}
                aria-selected={activeTab === idx}
                aria-controls={`tabpanel-${item.toLowerCase()}`}
                onClick={() => handleTabClick(idx)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`relative pl-2 pr-1 py-2 w-full cursor-pointer font-pixel text-[9px] sm:text-[10px] tracking-widest transition-all outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan ${
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
          </nav>

          {/* Right Main Content Area */}
          <div
            className="absolute top-12 bottom-0 left-[127px] right-0 overflow-hidden"
            role="tabpanel"
            id={`tabpanel-${TAB_NAMES[activeTab].toLowerCase()}`}
            aria-labelledby={TAB_NAMES[activeTab]}
          >
            {isBooting ? (
              <BootSequence onComplete={() => {}} />
            ) : (
              <div className="w-full h-full animate-content-fade">
                {activeTab === 0 && <MyselfTab />}
                {activeTab === 1 && <ProjectsTab />}
                {activeTab === 2 && <SkillsTab />}
                {activeTab === 3 && <TerminalTab />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
