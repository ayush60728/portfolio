import React, { useState, useEffect, useRef } from 'react';

const PROJECTS = [
  {
    id: 'agent',
    title: 'Desktop Agent',
    type: 'Local AI',
    stack: 'Python • Ollama • Qwen3',
    desc: 'Self-learning desktop resolver converting natural language to JSON actions.',
    features: [
      'Tiered search & JSON caching for instant local path/folder retrieval.',
      'Integrated local Qwen3 LLM via Ollama for natural language to strict JSON schema execution.',
      'Optimized latency by ~10x using decoding constraints and persistent warm-loading.'
    ],
    github: 'https://github.com/ayush60728/Agent'
  },
  {
    id: 'aquatrace',
    title: 'AquaTrace',
    type: 'Chrome Ext',
    stack: 'Manifest V3 • Tokenizer',
    desc: 'Tracks and estimates water/energy/CO2 footprint of AI conversations.',
    features: [
      'Local token counting via GPT Tokenizer for ChatGPT, Claude, Gemini, and DeepSeek.',
      'Calculates real-time environmental footprints based on research estimates.',
      'Includes daily budget alerts, local data exports, and persistent statistics.'
    ],
    github: 'https://github.com/ayush60728/AquaTrace',
    launch: 'https://chromewebstore.google.com/detail/aquatrace/lmjgniffadnhnpphojncpmaojpiflbcn'
  },
  {
    id: 'synapse',
    title: 'Synapse',
    type: 'P2P Platform',
    stack: 'React 19 • Node.js • WebRTC',
    desc: 'Real-time skill exchange with virtual escrow wallets and 1:1 meeting rooms.',
    features: [
      'Engineered a virtual SKILL_CREDIT escrow wallet with MongoDB Transactions.',
      'Built dynamic 1:1 meeting rooms via WebRTC/Jitsi and Socket.io.',
      'Implemented strict Zod validation, rate limiting, and Multer/ImageKit uploads.'
    ],
    github: 'https://github.com/ayush60728'
  },
  {
    id: 'mf',
    title: 'Mind & Fitness',
    type: 'AI Web App',
    stack: 'React • Gemini API • MediaPipe',
    desc: 'AI coaching assistant with computer vision-based exercise posture analysis.',
    features: [
      'Integrated Gemini API for AI-driven nutrition analysis and personalized coaching.',
      'Developed posture validation and rep tracking using MediaPipe Pose.',
      'Combined real-time computer vision geometry with rule-based form evaluation.'
    ],
    github: 'https://github.com/ayush60728/Tracker-with-posture-detection-',
    launch: 'https://mf-frontend-qs7c.onrender.com'
  }
];

export default function ProjectsTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleDpad = (e) => {
      const { direction } = e.detail;
      setSelectedIndex((prev) => {
        let next = prev;
        if (direction === 'up' && prev > 0) next = prev - 1;
        if (direction === 'down' && prev < PROJECTS.length - 1) next = prev + 1;
        
        // Auto-scroll to selected card
        if (next !== prev && cardRefs.current[next]) {
          cardRefs.current[next].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return next;
      });
    };

    window.addEventListener('dpad', handleDpad);
    return () => window.removeEventListener('dpad', handleDpad);
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full flex flex-col pt-4 px-4 overflow-y-auto custom-scrollbar pb-10"
    >
      <div className="flex flex-col gap-3">
        {PROJECTS.map((proj, idx) => (
          <div 
            key={proj.id} 
            ref={el => cardRefs.current[idx] = el}
            onClick={() => setSelectedIndex(idx)}
            className={`flex flex-col border p-3 cursor-pointer transition-all duration-200 ${
              selectedIndex === idx 
                ? 'border-retro-neonCyan bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.2),inset_0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]' 
                : 'border-slate-700/80 bg-[#0a0d16] opacity-70 hover:opacity-90'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-pixel text-[11px] tracking-wide ${selectedIndex === idx ? 'text-retro-neonCyan' : 'text-slate-300'}`}>
                {proj.title}
              </span>
              <span className="font-pixel text-[8px] text-slate-500 bg-[#0d121f] px-1.5 py-0.5 border border-slate-700/80">
                {proj.type}
              </span>
            </div>
            <p className={`font-sans text-[11px] mb-3 leading-relaxed ${selectedIndex === idx ? 'text-slate-300' : 'text-slate-400'}`}>
              {proj.desc}
            </p>
            {selectedIndex === idx && proj.features && (
              <ul className="list-square list-inside font-sans text-[10px] text-slate-400 mb-4 space-y-1.5 ml-1">
                {proj.features.map((feat, i) => (
                  <li key={i} className="leading-relaxed"><span className="text-retro-neonCyan mr-1">►</span>{feat}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-between items-end mt-auto">
              <span className="font-pixel text-[8px] text-retro-amber/80 tracking-widest">
                [{proj.stack}]
              </span>
              {selectedIndex === idx && (
                <div className="flex gap-2">
                  {proj.github && (
                    <a 
                      href={proj.github} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-[9px] text-white bg-slate-800/80 border border-slate-500 px-2 py-1 hover:bg-slate-600 hover:text-white transition-colors shadow-sm"
                    >
                      GITHUB
                    </a>
                  )}
                  {proj.launch && (
                    <a 
                      href={proj.launch} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-[9px] text-white bg-retro-mint/20 border border-retro-mint px-2 py-1 hover:bg-retro-mint hover:text-black transition-colors shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                    >
                      LAUNCH
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
