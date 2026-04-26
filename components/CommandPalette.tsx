"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  label: string;
  desc: string;
  category: string;
  icon: string;
  keys?: string;
}

const COMMANDS: Command[] = [
  { id: "nav-terminal", label: "Terminal", desc: "Interactive command center", category: "Navigate", icon: ">_", keys: "" },
  { id: "nav-demo", label: "Demo", desc: "AI trading engine demo", category: "Navigate", icon: "▶", keys: "" },
  { id: "nav-stack", label: "Stack", desc: "Architecture & infrastructure", category: "Navigate", icon: "◇", keys: "" },
  { id: "nav-pricing", label: "Pricing", desc: "Competitions & leagues", category: "Navigate", icon: "$", keys: "" },
  { id: "nav-privacy", label: "Privacy", desc: "Privacy policy", category: "Navigate", icon: "⊞", keys: "" },
  { id: "nav-terms", label: "Terms", desc: "Terms of service", category: "Navigate", icon: "⊞", keys: "" },

  { id: "info-status", label: "Engine Status", desc: "Check engine health", category: "Quick Actions", icon: "♥", keys: "" },
  { id: "info-portfolio", label: "Portfolio", desc: "View portfolio balances", category: "Quick Actions", icon: "■", keys: "" },
  { id: "info-signals", label: "Signals", desc: "Active trading signals", category: "Quick Actions", icon: "⚡", keys: "" },
  { id: "info-agents", label: "Agents", desc: "AI agent fleet status", category: "Quick Actions", icon: "⌘", keys: "" },
  { id: "info-market", label: "Market", desc: "Live market overview", category: "Quick Actions", icon: "▲", keys: "" },

  { id: "egg-336", label: "336", desc: "The signal", category: "Easter Eggs", icon: "#", keys: "" },
  { id: "egg-matrix", label: "Matrix", desc: "Enter the matrix", category: "Easter Eggs", icon: "M", keys: "" },
  { id: "egg-fire", label: "Fire", desc: "ASCII fire simulation", category: "Easter Eggs", icon: "~", keys: "" },
  { id: "egg-party", label: "Party", desc: "Competition mode", category: "Easter Eggs", icon: "*", keys: "" },
  { id: "egg-cowsay", label: "Cowsay", desc: "ASCII cow wisdom", category: "Easter Eggs", icon: "C", keys: "" },
];

const PATHS: Record<string, string> = {
  "nav-terminal": "/",
  "nav-demo": "/demo",
  "nav-stack": "/stack",
  "nav-pricing": "/pricing",
  "nav-privacy": "/privacy",
  "nav-terms": "/terms",
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.desc.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQuery("");
      setActiveIdx(0);
    }, 150);
  }, []);

  const execute = useCallback(
    (cmd: Command) => {
      close();
      if (cmd.id.startsWith("nav-")) {
        const path = PATHS[cmd.id];
        if (path) router.push(path);
      }
      if (cmd.id.startsWith("info-")) {
        router.push("/");
      }
      if (cmd.id.startsWith("egg-")) {
        router.push("/");
      }
    },
    [close, router]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          close();
        } else {
          setOpen(true);
        }
      }
      if (e.key === "Escape" && open) {
        close();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[activeIdx]) {
        e.preventDefault();
        execute(filtered[activeIdx]);
      }
    },
    [filtered, activeIdx, execute]
  );

  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.querySelector("[data-active='true']");
      if (active) {
        active.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIdx]);

  if (!open) return null;

  let currentCategory = "";

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "min(20vh, 160px)",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: closing ? "cmdBackdropOut 0.15s ease forwards" : "cmdBackdropIn 0.15s ease forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: "min(560px, 92vw)",
          maxHeight: "420px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.08)",
          animation: closing ? "cmdPanelOut 0.15s ease forwards" : "cmdPanelIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontSize: "14px", flexShrink: 0 }}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          />
          <kbd
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              background: "var(--bg-primary)",
              padding: "3px 6px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            padding: "8px",
          }}
          className="custom-scrollbar"
        >
          {filtered.length === 0 && (
            <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
              No commands found for &quot;{query}&quot;
            </div>
          )}
          {filtered.map((cmd, i) => {
            const showCategory = cmd.category !== currentCategory;
            currentCategory = cmd.category;
            const isActive = i === activeIdx;

            return (
              <div key={cmd.id}>
                {showCategory && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "8px 8px 4px",
                      marginTop: i > 0 ? "4px" : 0,
                    }}
                  >
                    {cmd.category}
                  </div>
                )}
                <div
                  data-active={isActive}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isActive ? "rgba(16, 185, 129, 0.08)" : "transparent",
                    transition: "background 0.1s ease",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      background: isActive ? "rgba(16, 185, 129, 0.15)" : "var(--bg-primary)",
                      border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.3)" : "var(--border-color)"}`,
                      fontSize: "12px",
                      color: isActive ? "var(--accent-green)" : "var(--text-secondary)",
                      flexShrink: 0,
                      transition: "all 0.1s ease",
                    }}
                  >
                    {cmd.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        transition: "color 0.1s ease",
                      }}
                    >
                      {cmd.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", opacity: 0.7 }}>
                      {cmd.desc}
                    </div>
                  </div>
                  {isActive && (
                    <span style={{ fontSize: "11px", color: "var(--accent-green)", opacity: 0.6 }}>
                      ↵
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderTop: "1px solid var(--border-color)",
            fontSize: "10px",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span style={{ color: "var(--accent-green)", opacity: 0.6 }}>CoreIntent Commander</span>
        </div>
      </div>
    </div>
  );
}
