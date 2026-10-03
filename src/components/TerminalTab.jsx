import React, { useState, useRef, useEffect } from 'react';

const TerminalTab = () => {
  const [history, setHistory] = useState([]);
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

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const newHistory = [...history, { type: 'input', content: `ayush@portfolio:~$ ${trimmedCmd}` }];

    const args = trimmedCmd.split(' ');
    const cmdName = args[0].toLowerCase();

    switch (cmdName) {
      case 'help':
        newHistory.push({ type: 'output', content: 'Available commands:' });
        newHistory.push({ type: 'output', content: '  clear    - clears the terminal' });
        newHistory.push({ type: 'output', content: '  echo     - prints text back' });
        newHistory.push({ type: 'output', content: '  exit     - go back to myself tab' });
        newHistory.push({ type: 'output', content: '  help     - shows this message' });
        break;
      case 'exit':
        window.dispatchEvent(new CustomEvent('escapeToMyself'));
        return;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        newHistory.push({ type: 'output', content: args.slice(1).join(' ') });
        break;
      default:
        newHistory.push({ type: 'output', content: `command not found: ${cmdName}. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    // Stop propagation so global D-pad/buttons don't capture this
    e.stopPropagation();

    if (e.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('escapeToMyself'));
    } else if (e.key === 'Enter') {
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

  const handleChip = (cmd) => {
    handleCommand(cmd);
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 p-2 bg-[#080b13] font-lcd overflow-hidden">
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] z-10"></div>
      
      {/* CHAMBER 1: SYS_BOOT & TELEMETRY LOG */}
      <div className="rounded-lg border border-cyan-900/50 bg-[#06111a] overflow-hidden shrink-0 z-20 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]">
        <div className="px-2 py-1 bg-slate-900/90 border-b border-cyan-950/80 flex items-center justify-between text-[9px] font-mono select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse"></span>
            <span className="font-pixel text-[8px] text-cyan-300 tracking-wider">SYS_BOOT & TELEMETRY LOG</span>
          </div>
          <div className="flex items-center gap-2 text-[8px]">
            <span className="text-slate-400 font-mono flex items-center gap-1">STATUS: <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] animate-pulse"></span> <span className="text-emerald-400 font-bold">ONLINE</span></span>
            <span className="font-pixel text-[7px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">READ-ONLY</span>
          </div>
        </div>
        <div className="px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] text-cyan-200/90 leading-tight space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>[BOOT-SEQ] Portfolio OS v1.0.0 INITIALIZED</span>
            <span className="text-amber-400 font-mono text-[8px]">MEM: 256KB VRAM OK</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400">✔ LOAD:</span>
            <span>All modules mounted successfully.</span>
          </div>
          <div className="flex items-center justify-between text-cyan-300">
            <span className="truncate">[SUBSYS] Type "help" to see available commands.</span>
            <span className="text-retro-amber font-mono text-[8px] shrink-0">CH-0 READY</span>
          </div>
          <div className="text-slate-400 font-mono text-[10px]">Press ESC or type "exit" to go back to MYSELF.</div>
        </div>
      </div>

      {/* MECHANICAL DIVIDING RAIL */}
      <div className="flex items-center gap-1.5 px-1 py-0.5 select-none shrink-0 z-20">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-900/20 via-purple-700/60 to-purple-500/80"></div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-purple-800/60 text-[8px] font-pixel text-[#d8b4fe] shadow-sm">
          <span className="w-1.5 h-1.5 bg-[#c084fc] rounded-sm"></span>
          <span>TERMINAL PROMPT BUS v2.5</span>
          <span className="text-retro-mint">///</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500/80 via-purple-700/60 to-cyan-900/20"></div>
      </div>

      {/* CHAMBER 2: INTERACTIVE CLI MATRIX */}
      <div className="flex-1 rounded-lg border border-purple-500/50 bg-[#0d0a1b] overflow-hidden flex flex-col z-20" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-2.5 py-1.5 bg-[#070510] font-mono font-bold text-[11px] sm:text-[12px] text-slate-300 leading-relaxed space-y-1 custom-scrollbar"
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

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[11px] sm:text-[13px] text-retro-mint shrink-0 select-none font-bold flex items-center gap-1 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]">
              <span className="text-retro-neonCyan">&gt;</span> ayush@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent border-none p-0 text-[11px] sm:text-[13px] font-mono font-bold text-white focus:ring-0 focus:outline-none drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalTab;
