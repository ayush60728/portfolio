import React, { useEffect, useRef } from 'react';

const SkillsTab = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleContentNav = (e) => {
      if (!containerRef.current) return;
      const { direction } = e.detail;
      const scrollAmount = 40;
      if (direction === 'up') {
        containerRef.current.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
      } else if (direction === 'down') {
        containerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    };
    window.addEventListener('contentNav', handleContentNav);
    return () => window.removeEventListener('contentNav', handleContentNav);
  }, []);

  const skillsData = [
    {
      category: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'SQL']
    },
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML/CSS', 'Framer Motion']
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase']
    },
    {
      category: 'Tools',
      skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Figma']
    },
    {
      category: 'AI/ML',
      skills: ['MediaPipe', 'Gemini API', 'Ollama', 'LangChain']
    }
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0b0f19] p-4"
    >
      <div className="flex flex-col gap-5 pb-4">
        {skillsData.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3
              className="font-pixel text-[9px] uppercase tracking-widest text-retro-mint"
              style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}
            >
              {section.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {section.skills.map((skill, skillIdx) => (
                <span
                  key={skillIdx}
                  className="px-2 py-0.5 font-sans text-[10px] text-slate-300 border border-slate-700 rounded-sm bg-slate-800/40 hover:border-retro-mint/50 hover:text-retro-mint transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
