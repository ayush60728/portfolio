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
      className="w-full h-full overflow-y-auto bg-[#0b0f19] p-4 font-pixel"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="flex flex-col gap-4 pb-4">
        {skillsData.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3 
              className="text-[#fbbf24] text-[11px] uppercase tracking-wider"
              style={{ textShadow: '0 0 5px rgba(251, 191, 36, 0.6)' }}
            >
              {section.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.skills.map((skill, skillIdx) => (
                <span
                  key={skillIdx}
                  className="px-2 py-1 text-[10px] text-[#34d399] border border-[#22d3ee] rounded-sm bg-[#0b0f19]/80 shadow-[0_0_2px_rgba(34,211,238,0.3)]"
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
