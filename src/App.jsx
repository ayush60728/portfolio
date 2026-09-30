import React, { useState, useRef } from 'react';
import ConsoleShell from './components/ConsoleShell';
import BootSequence from './components/BootSequence';

export default function App() {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [booted, setBooted] = useState(false);

  // Web Audio Context setup
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const triggerRetroBeep = (freq = 440, type = 'square', duration = 0.07) => {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn('Audio Context interaction prevented:', err);
    }
  };

  const toggleAudio = () => {
    setSfxEnabled(prev => {
      const next = !prev;
      if (next) triggerRetroBeep(880, 'sine', 0.1);
      return next;
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#070912] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[48rem] h-[32rem] bg-purple-900/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-[36rem] h-[36rem] bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-[42rem] h-[30rem] bg-cyan-900/15 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f243818_1px,transparent_1px),linear-gradient(to_bottom,#1f243818_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
        {!booted ? (
          <BootSequence onComplete={() => setBooted(true)} />
        ) : (
          <ConsoleShell playSound={triggerRetroBeep} />
        )}
      </main>

      <footer className="relative z-10 border-t border-purple-950/40 bg-slate-950/90 py-2 text-center text-xs text-slate-500 font-mono shrink-0">
        <p>© {new Date().getFullYear()} AYUSH KUMAR — Built with React, Tailwind & Web Audio Synth.</p>
      </footer>
    </div>
  );
}
