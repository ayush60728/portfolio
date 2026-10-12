import React, { useEffect, useRef, useState } from 'react';

const QUICK_COMMANDS = ['help', 'echo hello world', 'clear', 'exit'];

const TerminalTab = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (command) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setCommandHistory((previousHistory) => [...previousHistory, trimmedCommand]);
    setHistoryIndex(-1);

    const newHistory = [
      ...history,
      { type: 'input', content: `ayush@portfolio:~$ ${trimmedCommand}` },
    ];
    const args = trimmedCommand.split(/\s+/);
    const commandName = args[0].toLowerCase();

    switch (commandName) {
      case 'help':
        newHistory.push({ type: 'output', content: 'help  clear  echo <text>  exit' });
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
        newHistory.push({ type: 'output', content: `command not found: ${commandName}. Type "help" to continue.` });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (event) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('escapeToMyself'));
    } else if (event.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleQuickCommand = (command) => {
    handleCommand(command);
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#080d18] font-sans">
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute -right-20 -top-16 h-44 w-44 rounded-full bg-retro-neonCyan/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-lilac-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      <div className="relative z-20 flex h-full min-h-0 flex-col gap-3 overflow-y-auto custom-scrollbar p-3 sm:p-4">
        <header className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-[#111827]/90 p-3 shadow-[0_12px_25px_rgba(0,0,0,0.18)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-retro-neonCyan/40 bg-retro-neonCyan/10 font-mono text-[13px] font-bold text-retro-neonCyan shadow-[0_0_15px_rgba(34,211,238,0.12)]">
              &gt;_
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-retro-neonCyan">
                Workspace / Terminal
              </p>
              <h2 className="mt-1 truncate font-sans text-[17px] font-extrabold tracking-tight text-white">
                Developer Console
              </h2>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-retro-mint/25 bg-retro-mint/10 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-wide text-retro-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-retro-mint shadow-[0_0_7px_rgba(52,211,153,0.9)]" />
            online
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-2.5">
            <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Session</p>
            <p className="mt-1 font-sans text-[12px] font-bold text-slate-200">Local shell</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-2.5">
            <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Commands</p>
            <p className="mt-1 font-sans text-[12px] font-bold text-slate-200">04 built-in</p>
          </div>
          <div className="hidden rounded-lg border border-slate-700/70 bg-slate-900/70 p-2.5 sm:block">
            <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Memory</p>
            <p className="mt-1 font-sans text-[12px] font-bold text-retro-amber">256KB VRAM</p>
          </div>
        </div>

        <section
          className="flex min-h-[190px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-retro-neonCyan/40 bg-[#070c15]/95 shadow-[0_0_25px_rgba(34,211,238,0.07)]"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <div className="flex items-center justify-between border-b border-retro-neonCyan/20 bg-[#0d1723] px-3 py-2">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-retro-neonCyan">Interactive terminal</p>
              <p className="mt-1 font-sans text-[10px] text-slate-400">Run a command in the local portfolio shell.</p>
            </div>
            <span className="rounded border border-retro-mint/30 bg-retro-mint/10 px-1.5 py-1 font-mono text-[8px] text-retro-mint">INPUT READY</span>
          </div>

          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto bg-[#050910] px-3 py-3 font-mono text-[10px] leading-relaxed custom-scrollbar sm:text-[11px]"
          >
            {history.map((line, index) => (
              <div
                key={`${line.content}-${index}`}
                className={`whitespace-pre-wrap break-words ${line.type === 'input' ? 'text-retro-neonCyan drop-shadow-[0_0_4px_rgba(34,211,238,0.45)]' : 'text-retro-mint drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]'}`}
              >
                {line.content}
              </div>
            ))}

            <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
              <span className="shrink-0 font-mono text-[10px] font-bold text-retro-mint sm:text-[11px]">
                <span className="text-retro-neonCyan">&gt;</span> ayush@portfolio:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
                aria-label="Terminal command input"
                className="min-w-0 w-full border-none bg-transparent p-0 font-mono text-[10px] font-bold text-white outline-none ring-0 placeholder:text-slate-600 focus:border-none focus:outline-none focus:ring-0 sm:text-[11px]"
                placeholder="type a command..."
              />
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0b121d] px-3 py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">Quick commands</span>
              <span className="font-mono text-[8px] text-slate-600">CLICK TO RUN</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_COMMANDS.map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => handleQuickCommand(command)}
                  className="rounded-md border border-slate-600/80 bg-slate-800/70 px-2 py-1.5 font-mono text-[9px] text-slate-300 transition-colors hover:border-retro-neonCyan hover:bg-retro-neonCyan/10 hover:text-retro-neonCyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-retro-neonCyan"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TerminalTab;
