"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PaletteItem {
  id: string;
  label: string;
  category: "navigate" | "terminal" | "action";
  hint: string;
  icon: string;
  color: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items: PaletteItem[] = [
    { id: "home", label: "Terminal", category: "navigate", hint: "Main terminal interface", icon: ">_", color: "#10b981", action: () => router.push("/") },
    { id: "demo", label: "Demo", category: "navigate", hint: "Interactive trading demo", icon: "D", color: "#3b82f6", action: () => router.push("/demo") },
    { id: "stack", label: "Stack", category: "navigate", hint: "Architecture & tech stack", icon: "S", color: "#a855f7", action: () => router.push("/stack") },
    { id: "pricing", label: "Competitions", category: "navigate", hint: "Leagues & pricing", icon: "C", color: "#f59e0b", action: () => router.push("/pricing") },
    { id: "privacy", label: "Privacy Policy", category: "navigate", hint: "Privacy & data handling", icon: "P", color: "#64748b", action: () => router.push("/privacy") },
    { id: "terms", label: "Terms of Service", category: "navigate", hint: "Legal terms", icon: "T", color: "#64748b", action: () => router.push("/terms") },

    { id: "t-status", label: "status", category: "terminal", hint: "Engine status & health", icon: "●", color: "#10b981", action: () => copyCmd("status") },
    { id: "t-brain", label: "brain", category: "terminal", hint: "AI orchestra overview", icon: "●", color: "#a855f7", action: () => copyCmd("brain") },
    { id: "t-portfolio", label: "portfolio", category: "terminal", hint: "View portfolio & P&L", icon: "●", color: "#3b82f6", action: () => copyCmd("portfolio") },
    { id: "t-signals", label: "signals", category: "terminal", hint: "Active trading signals", icon: "●", color: "#f59e0b", action: () => copyCmd("signals") },
    { id: "t-market", label: "market", category: "terminal", hint: "Market data overview", icon: "●", color: "#06b6d4", action: () => copyCmd("market") },
    { id: "t-battle", label: "battle", category: "terminal", hint: "Watch AI models debate", icon: "●", color: "#ef4444", action: () => copyCmd("battle") },
    { id: "t-challenge", label: "challenge", category: "terminal", hint: "Speed trading game", icon: "●", color: "#10b981", action: () => copyCmd("challenge") },
    { id: "t-mission", label: "mission", category: "terminal", hint: "Signal infiltration op", icon: "●", color: "#f59e0b", action: () => copyCmd("mission") },
    { id: "t-ecg", label: "ecg", category: "terminal", hint: "Engine heartbeat monitor", icon: "●", color: "#10b981", action: () => copyCmd("ecg") },
    { id: "t-constellation", label: "constellation", category: "terminal", hint: "AI star map", icon: "●", color: "#3b82f6", action: () => copyCmd("constellation") },
    { id: "t-cipher", label: "cipher", category: "terminal", hint: "Decode a secret signal", icon: "●", color: "#a855f7", action: () => copyCmd("cipher") },
    { id: "t-orbit", label: "orbit", category: "terminal", hint: "Watch AI models orbit", icon: "●", color: "#ef4444", action: () => copyCmd("orbit") },
    { id: "t-hologram", label: "hologram", category: "terminal", hint: "Holographic data card", icon: "●", color: "#06b6d4", action: () => copyCmd("hologram") },
    { id: "t-336", label: "336", category: "terminal", hint: "The signal is dominant", icon: "●", color: "#10b981", action: () => copyCmd("336") },

    { id: "a-github", label: "Open GitHub", category: "action", hint: "View source on GitHub", icon: "GH", color: "#e2e8f0", action: () => window.open("https://github.com/coreintentdev/coreintent", "_blank") },
    { id: "a-twitter", label: "Follow @coreintentai", category: "action", hint: "X / Twitter", icon: "X", color: "#e2e8f0", action: () => window.open("https://x.com/coreintentai", "_blank") },
  ];

  const [copied, setCopied] = useState(false);

  const copyCmd = useCallback((cmd: string) => {
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setOpen(false);
  }, []);

  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.hint.toLowerCase().includes(q) ||
          item.category.includes(q)
        );
      })
    : items;

  const grouped = {
    navigate: filtered.filter((i) => i.category === "navigate"),
    terminal: filtered.filter((i) => i.category === "terminal"),
    action: filtered.filter((i) => i.category === "action"),
  };

  const flatList = [...grouped.navigate, ...grouped.terminal, ...grouped.action];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatList[selected]) {
          flatList[selected].action();
        }
      }
    },
    [flatList, selected]
  );

  if (!open) {
    return (
      <>
        {copied && (
          <div className="cmd-palette-toast">
            Command copied — paste in terminal
          </div>
        )}
      </>
    );
  }

  let itemIdx = -1;

  return (
    <>
      <div
        className="cmd-palette-backdrop"
        onClick={() => setOpen(false)}
      />
      <div className="cmd-palette-container">
        <div className="cmd-palette-panel">
          <div className="cmd-palette-header">
            <span className="cmd-palette-icon">&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands, pages, actions..."
              className="cmd-palette-input"
              spellCheck={false}
              autoComplete="off"
            />
            <kbd className="cmd-palette-kbd">ESC</kbd>
          </div>

          <div className="cmd-palette-results">
            {flatList.length === 0 && (
              <div className="cmd-palette-empty">
                No results for &quot;{query}&quot;
              </div>
            )}

            {grouped.navigate.length > 0 && (
              <>
                <div className="cmd-palette-category">Pages</div>
                {grouped.navigate.map((item) => {
                  itemIdx++;
                  const idx = itemIdx;
                  return (
                    <button
                      key={item.id}
                      className={`cmd-palette-item ${idx === selected ? "cmd-palette-item-active" : ""}`}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelected(idx)}
                    >
                      <span className="cmd-palette-item-icon" style={{ color: item.color, borderColor: `${item.color}44` }}>
                        {item.icon}
                      </span>
                      <span className="cmd-palette-item-label">{item.label}</span>
                      <span className="cmd-palette-item-hint">{item.hint}</span>
                      {idx === selected && <span className="cmd-palette-item-enter">Enter</span>}
                    </button>
                  );
                })}
              </>
            )}

            {grouped.terminal.length > 0 && (
              <>
                <div className="cmd-palette-category">Terminal Commands</div>
                {grouped.terminal.map((item) => {
                  itemIdx++;
                  const idx = itemIdx;
                  return (
                    <button
                      key={item.id}
                      className={`cmd-palette-item ${idx === selected ? "cmd-palette-item-active" : ""}`}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelected(idx)}
                    >
                      <span className="cmd-palette-item-icon" style={{ color: item.color, borderColor: `${item.color}44` }}>
                        {item.icon}
                      </span>
                      <span className="cmd-palette-item-label" style={{ fontFamily: "inherit" }}>
                        {item.label}
                      </span>
                      <span className="cmd-palette-item-hint">{item.hint}</span>
                      {idx === selected && <span className="cmd-palette-item-enter">Copy</span>}
                    </button>
                  );
                })}
              </>
            )}

            {grouped.action.length > 0 && (
              <>
                <div className="cmd-palette-category">Actions</div>
                {grouped.action.map((item) => {
                  itemIdx++;
                  const idx = itemIdx;
                  return (
                    <button
                      key={item.id}
                      className={`cmd-palette-item ${idx === selected ? "cmd-palette-item-active" : ""}`}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelected(idx)}
                    >
                      <span className="cmd-palette-item-icon" style={{ color: item.color, borderColor: `${item.color}44` }}>
                        {item.icon}
                      </span>
                      <span className="cmd-palette-item-label">{item.label}</span>
                      <span className="cmd-palette-item-hint">{item.hint}</span>
                      {idx === selected && <span className="cmd-palette-item-enter">Open</span>}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          <div className="cmd-palette-footer">
            <span><kbd className="cmd-palette-kbd-sm">↑↓</kbd> Navigate</span>
            <span><kbd className="cmd-palette-kbd-sm">Enter</kbd> Select</span>
            <span><kbd className="cmd-palette-kbd-sm">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </>
  );
}
