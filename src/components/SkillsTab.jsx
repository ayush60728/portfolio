import React, { useEffect, useRef, useState } from 'react';
import { skillsData } from '../data/portfolio';

const CATEGORY_DETAILS = [
  {
    eyebrow: 'CORE LANGUAGE LAYER',
    description: 'The building blocks I use to turn ideas into reliable product logic.',
    accent: 'text-retro-mint',
    border: 'border-retro-mint/70',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.13)]',
  },
  {
    eyebrow: 'INTERFACE LAYER',
    description: 'Interfaces with motion, clarity, and a little personality.',
    accent: 'text-retro-neonCyan',
    border: 'border-retro-neonCyan/70',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.13)]',
  },
  {
    eyebrow: 'SERVICE LAYER',
    description: 'APIs, data flows, and practical foundations behind the experience.',
    accent: 'text-[#c4a7ff]',
    border: 'border-[#9b84d6]/70',
    glow: 'shadow-[0_0_20px_rgba(155,132,214,0.16)]',
  },
  {
    eyebrow: 'WORKFLOW LAYER',
    description: 'The tools and systems that keep experiments moving into production.',
    accent: 'text-retro-amber',
    border: 'border-retro-amber/70',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.12)]',
  },
  {
    eyebrow: 'EXPERIMENT LAYER',
    description: 'Models, vision, and intelligent features built for useful outcomes.',
    accent: 'text-retro-pink',
    border: 'border-retro-pink/70',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.13)]',
  },
];

const formatNumber = (index) => String(index + 1).padStart(2, '0');

export default function SkillsTab({ isFocused }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const categoryRefs = useRef([]);
  const selectedCategory = skillsData[selectedIndex];
  const selectedDetails = CATEGORY_DETAILS[selectedIndex] || CATEGORY_DETAILS[0];

  const scrollToOverview = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleContentNav = (event) => {
      if (!isFocused) return;

      const { direction } = event.detail;
      setSelectedIndex((previousIndex) => {
        let nextIndex = previousIndex;
        if (direction === 'up') nextIndex = Math.max(previousIndex - 1, 0);
        if (direction === 'down') nextIndex = Math.min(previousIndex + 1, skillsData.length - 1);

        if (nextIndex !== previousIndex) {
          requestAnimationFrame(() => {
            containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            categoryRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
        return nextIndex;
      });
    };

    window.addEventListener('contentNav', handleContentNav);
    return () => window.removeEventListener('contentNav', handleContentNav);
  }, [isFocused]);

  const selectCategory = (index) => {
    setSelectedIndex(index);
    scrollToOverview();
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-x-hidden overflow-y-auto custom-scrollbar bg-[#080c15]"
      aria-label="Skills dashboard"
    >
      <div className="relative min-h-full px-3 pb-8 pt-3 sm:px-4">
        <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
          <div className="absolute -right-14 top-10 h-36 w-36 rounded-full bg-retro-mint/10 blur-3xl" />
          <div className="absolute -left-20 bottom-24 h-40 w-40 rounded-full bg-retro-neonCyan/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>

        <header className="relative flex items-end justify-between gap-3 border-b border-slate-700/70 pb-3">
          <div>
            <p className="font-pixel text-[7px] tracking-[0.22em] text-retro-mint [text-shadow:0_0_7px_rgba(52,211,153,0.45)]">
              SKILL SYSTEM / 05 DOMAINS
            </p>
            <h2 className="mt-2 font-sans text-[18px] font-extrabold tracking-tight text-slate-100 sm:text-[20px]">
              Capabilities
            </h2>
          </div>
          <span className="shrink-0 rounded-full border border-retro-mint/30 bg-retro-mint/10 px-2 py-1 font-mono text-[8px] font-semibold tracking-wide text-retro-mint">
            LIVE PROFILE
          </span>
        </header>

        <div className="relative flex items-center justify-between py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-500">
          <span>Currently exploring</span>
          <span className={selectedDetails.accent}>{selectedCategory.skills.length} modules loaded</span>
        </div>

        <section
          className={`relative overflow-hidden rounded-xl border bg-gradient-to-br from-[#101b24] via-[#0d141d] to-[#111025] transition-all duration-300 ${selectedDetails.border} ${isFocused ? selectedDetails.glow : 'shadow-none'}`}
          aria-live="polite"
        >
          <div className="h-1 bg-gradient-to-r from-retro-mint via-retro-neonCyan to-lilac-500" />
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`font-mono text-[9px] font-semibold tracking-[0.14em] ${selectedDetails.accent}`}>
                {selectedDetails.eyebrow}
              </span>
              <span className="font-mono text-[9px] text-slate-500">
                {formatNumber(selectedIndex)} / {formatNumber(skillsData.length)}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <h3 className="font-sans text-[22px] font-extrabold leading-tight tracking-tight text-white sm:text-[24px]">
                  {selectedCategory.category}
                </h3>
                <p className="mt-2 max-w-[31rem] font-sans text-[11px] leading-relaxed text-slate-300 sm:text-[12px]">
                  {selectedDetails.description}
                </p>
              </div>
              <div className={`hidden shrink-0 text-right sm:block ${selectedDetails.accent}`}>
                <span className="block font-sans text-[26px] font-extrabold leading-none">
                  {String(selectedCategory.skills.length).padStart(2, '0')}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500">skills</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedCategory.skills.map((skill, skillIndex) => (
                <div
                  key={skill}
                  className="group rounded-lg border border-white/10 bg-[#080c15]/65 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-retro-mint/50 hover:bg-retro-mint/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[11px] font-bold text-slate-200 sm:text-[12px]">{skill}</span>
                    <span className={`h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_7px_currentColor] ${selectedDetails.accent}`} />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`font-mono text-[8px] font-semibold ${selectedDetails.accent}`}>0{skillIndex + 1}</span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="font-mono text-[8px] uppercase tracking-wide text-slate-600">ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-4" aria-label="Choose a skill category">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pixel text-[8px] tracking-[0.14em] text-slate-400">EXPLORE DOMAINS</span>
            <span className="font-mono text-[8px] text-slate-600">↑ / ↓ TO EXPLORE</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {skillsData.map((section, index) => {
              const isSelected = selectedIndex === index;
              const details = CATEGORY_DETAILS[index] || CATEGORY_DETAILS[0];
              return (
                <button
                  key={section.category}
                  ref={(element) => { categoryRefs.current[index] = element; }}
                  type="button"
                  onClick={() => selectCategory(index)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`group flex min-h-[62px] items-start gap-2 rounded-lg border p-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan ${
                    isSelected && isFocused
                      ? `${details.border} bg-white/5 shadow-[0_0_12px_rgba(52,211,153,0.12)]`
                      : isSelected
                        ? 'border-slate-500/80 bg-slate-800/50'
                        : 'border-slate-700/70 bg-[#0b1019]/80 hover:border-slate-500 hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${isSelected ? details.accent : 'text-slate-600'}`}>
                    {formatNumber(index)}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate font-sans text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {section.category}
                    </span>
                    <span className="mt-1 block truncate font-mono text-[9px] font-medium text-slate-400">
                      {section.skills.length} modules
                    </span>
                  </span>
                  <span className={`ml-auto pt-0.5 text-[12px] ${isSelected ? details.accent : 'text-slate-700 group-hover:text-slate-400'}`} aria-hidden="true">
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
