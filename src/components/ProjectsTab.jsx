import React, { useEffect, useRef, useState } from 'react';
import { profileData, projectsData } from '../data/portfolio';

const formatProjectNumber = (index) => String(index + 1).padStart(2, '0');

export default function ProjectsTab({ isFocused }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);
  const projectRefs = useRef([]);
  const selectedProject = projectsData[selectedIndex];

  useEffect(() => {
    const handleContentNav = (event) => {
      if (!isFocused) return;

      const { direction } = event.detail;
      setSelectedIndex((previousIndex) => {
        let nextIndex = previousIndex;
        if (direction === 'up') nextIndex = Math.max(previousIndex - 1, 0);
        if (direction === 'down') nextIndex = Math.min(previousIndex + 1, projectsData.length - 1);

        if (nextIndex !== previousIndex) {
          requestAnimationFrame(() => {
            projectRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
        return nextIndex;
      });
    };

    window.addEventListener('contentNav', handleContentNav);
    return () => window.removeEventListener('contentNav', handleContentNav);
  }, [isFocused]);

  const selectProject = (index) => {
    setSelectedIndex(index);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-x-hidden overflow-y-auto custom-scrollbar bg-[#080c15]"
      aria-label="Project showcase"
    >
      <div className="relative min-h-full px-3 pb-8 pt-3 sm:px-4">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -right-16 top-14 h-32 w-32 rounded-full bg-retro-neonCyan/10 blur-3xl" />
          <div className="absolute -left-20 bottom-16 h-40 w-40 rounded-full bg-retro-mint/5 blur-3xl" />
        </div>

        <header className="relative flex items-end justify-between gap-3 border-b border-slate-700/70 pb-3">
          <div>
            <p className="font-pixel text-[7px] tracking-[0.22em] text-retro-mint [text-shadow:0_0_7px_rgba(52,211,153,0.45)]">
              WORK / INDEX
            </p>
            <h2 className="mt-2 font-sans text-[18px] font-extrabold tracking-tight text-slate-100 sm:text-[20px]">
              Selected projects
            </h2>
          </div>
          <a
            href={profileData.github.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 border border-slate-600/80 bg-slate-900/80 px-2 py-1.5 font-mono text-[8px] font-semibold tracking-wide text-slate-300 transition-colors hover:border-retro-mint hover:text-retro-mint focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan"
          >
            GITHUB ↗
          </a>
        </header>

        <div className="relative flex items-center justify-between py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-500">
          <span>Curated build log</span>
          <span className="text-retro-neonCyan">{projectsData.length} projects</span>
        </div>

        <article
          className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
            isFocused
              ? 'border-retro-neonCyan/80 bg-gradient-to-br from-[#112330] via-[#0d1721] to-[#11102a] shadow-[0_0_22px_rgba(34,211,238,0.16)]'
              : 'border-slate-700/80 bg-[#0c111b]'
          }`}
          aria-live="polite"
        >
          <div className="h-1 bg-gradient-to-r from-retro-mint via-retro-neonCyan to-lilac-500" />
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[9px] font-semibold tracking-[0.12em]">
                <span className="text-retro-mint">{formatProjectNumber(selectedIndex)}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-500">{formatProjectNumber(projectsData.length)}</span>
              </div>
              <span className="rounded-full border border-retro-mint/30 bg-retro-mint/10 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-wide text-retro-mint">
                {selectedProject.type}
              </span>
            </div>

            <h3 className="mt-3 font-sans text-[21px] font-extrabold leading-tight tracking-tight text-white sm:text-[23px]">
              {selectedProject.title}
            </h3>
            <p className="mt-2 max-w-[42rem] font-sans text-[11px] leading-relaxed text-slate-300 sm:text-[12px]">
              {selectedProject.desc}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedProject.stack.split(' • ').map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-slate-600/80 bg-[#080c15]/70 px-2 py-1 font-mono text-[8px] text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[8px] tracking-[0.14em] text-slate-400">BUILD NOTES</span>
                <span className="font-mono text-[8px] text-slate-600">03 HIGHLIGHTS</span>
              </div>
              <ul className="mt-2 space-y-2">
                {selectedProject.features.map((feature, featureIndex) => (
                  <li key={feature} className="flex gap-2 font-sans text-[10px] leading-relaxed text-slate-400 sm:text-[11px]">
                    <span className="mt-0.5 shrink-0 font-mono text-[9px] font-bold text-retro-mint">
                      0{featureIndex + 1}
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-500 bg-slate-800/80 px-3 py-2 font-mono text-[9px] font-bold tracking-wide text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan"
              >
                VIEW SOURCE <span aria-hidden="true">↗</span>
              </a>
              {selectedProject.launch && (
                <a
                  href={selectedProject.launch}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-retro-mint bg-retro-mint/15 px-3 py-2 font-mono text-[9px] font-bold tracking-wide text-retro-mint transition-all hover:-translate-y-0.5 hover:bg-retro-mint hover:text-[#06110d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-mint"
                >
                  OPEN LIVE <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </article>

        <section className="relative mt-4" aria-label="Choose a project">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pixel text-[8px] tracking-[0.14em] text-slate-400">BROWSE PROJECTS</span>
            <span className="font-mono text-[8px] text-slate-600">↑ / ↓ TO EXPLORE</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {projectsData.map((project, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={project.id}
                  ref={(element) => { projectRefs.current[index] = element; }}
                  type="button"
                  onClick={() => selectProject(index)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`group flex min-h-[62px] items-start gap-2 rounded-lg border p-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan ${
                    isSelected && isFocused
                      ? 'border-retro-neonCyan bg-cyan-950/40 shadow-[0_0_12px_rgba(34,211,238,0.14)]'
                      : isSelected
                        ? 'border-slate-500/80 bg-slate-800/50'
                        : 'border-slate-700/70 bg-[#0b1019]/80 hover:border-slate-500 hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-retro-mint' : 'text-slate-600'}`}>
                    {formatProjectNumber(index)}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate font-sans text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {project.title}
                    </span>
                    <span className="mt-1 block truncate font-mono text-[9px] font-medium text-slate-400 sm:text-[10px]">
                      {project.type}
                    </span>
                  </span>
                  <span className={`ml-auto pt-0.5 text-[12px] ${isSelected ? 'text-retro-neonCyan' : 'text-slate-700 group-hover:text-slate-400'}`} aria-hidden="true">
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
