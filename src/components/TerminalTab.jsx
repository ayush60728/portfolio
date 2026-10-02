import React, { useState, useRef, useEffect } from 'react';

const TerminalTab = () => {
  const [history, setHistory] = useState([
    { type: 'system', content: 'Portfolio Terminal OS v1.0.0' },
    { type: 'system', content: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input when the terminal mounts, without scrolling the whole page
    const timer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdStr) => {
    const trimmedCmd = cmdStr.trim();
    if (!trimmedCmd) return;

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const newHistory = [...history, { type: 'input', content: `ayush@portfolio:~$ ${trimmedCmd}` }];

    const args = trimmedCmd.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', content: 'Available commands:' });
        newHistory.push({ type: 'output', content: '  about    - brief bio' });
        newHistory.push({ type: 'output', content: '  skills   - list of skills' });
        newHistory.push({ type: 'output', content: '  projects - list of projects' });
        newHistory.push({ type: 'output', content: '  contact  - contact info' });
        newHistory.push({ type: 'output', content: '  whoami   - current user' });
        newHistory.push({ type: 'output', content: '  date     - current date/time' });
        newHistory.push({ type: 'output', content: '  echo     - prints text back' });
        newHistory.push({ type: 'output', content: '  clear    - clears the terminal' });
        newHistory.push({ type: 'output', content: '  help     - shows this message' });
        break;
      case 'about':
        newHistory.push({ type: 'output', content: 'Ayush Kumar — Developer. Building playful web experiences.' });
        break;
      case 'skills':
        newHistory.push({ type: 'output', content: 'Languages: JavaScript, TypeScript, Python, C++, Java' });
        newHistory.push({ type: 'output', content: 'Frontend:  React, Next.js, Tailwind CSS, Framer Motion' });
        newHistory.push({ type: 'output', content: 'Backend:   Node.js, Express, MongoDB, PostgreSQL' });
        newHistory.push({ type: 'output', content: 'AI/ML:     MediaPipe, Gemini API, Ollama, LangChain' });
        newHistory.push({ type: 'output', content: 'Tools:     Git, Docker, Linux, VS Code, Figma' });
        break;
      case 'projects':
        newHistory.push({ type: 'output', content: '1. Desktop Agent  — Local AI resolver (Python/Ollama/Qwen3)' });
        newHistory.push({ type: 'output', content: '2. AquaTrace      — Chrome ext for AI carbon footprints' });
        newHistory.push({ type: 'output', content: '3. Synapse        — P2P skill-swapping platform' });
        newHistory.push({ type: 'output', content: '4. Mind & Fitness — AI coaching with posture detection' });
        break;
      case 'contact':
        newHistory.push({ type: 'output', content: 'Email: ayushkumar44344@gmail.com' });
        newHistory.push({ type: 'output', content: 'GitHub: github.com/ayush60728' });
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        newHistory.push({ type: 'output', content: 'ayush@portfolio' });
        break;
      case 'date':
        newHistory.push({ type: 'output', content: new Date().toString() });
        break;
      case 'echo':
        newHistory.push({ type: 'output', content: args.slice(1).join(' ') });
        break;
      default:
        newHistory.push({ type: 'output', content: `command not found: ${cmd}. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    // Stop propagation so global D-pad/buttons don't capture this
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080b13] font-lcd text-[18px] sm:text-[20px] p-3 overflow-hidden leading-tight">
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] z-10"></div>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-2 z-20"
        onClick={() => inputRef.current && inputRef.current.focus({ preventScroll: true })}
      >
        {history.map((line, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap break-words ${
              line.type === 'system' ? 'text-slate-400 drop-shadow-[0_0_2px_rgba(148,163,184,0.4)]' : 
              line.type === 'input' ? 'text-retro-neonCyan drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]' :
              'text-retro-mint drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]'
            }`}
          >
            {line.content}
          </div>
        ))}
      </div>

      <div className="flex items-center text-retro-neonCyan drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] mt-1 shrink-0 z-20">
        <span className="mr-2">ayush@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent outline-none border-none text-retro-mint drop-shadow-[0_0_4px_rgba(52,211,153,0.5)] p-0 focus:ring-0 focus:outline-none placeholder-transparent font-lcd text-[18px] sm:text-[20px]"
        />
      </div>
    </div>
  );
};

export default TerminalTab;
