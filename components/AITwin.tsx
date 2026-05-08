"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  role: "twin" | "user";
  text: string;
  timestamp: number;
}

const STORAGE_KEY = "coreyai-twin-history";
const SOUND_KEY = "coreyai-twin-sound";

const GREETING_LINES = [
  "Kia ora! I'm CoreyAI — the digital twin of Corey McIvor.",
  "I built CoreIntent: three AI models, one trading engine, zero subscriptions.",
  "Type 'help' to see what I can do, or just ask me anything.",
];

const RESPONSES: Record<string, string[]> = {
  help: [
    "Here's what I respond to:",
    "",
    "  about    — What CoreIntent is",
    "  pricing  — How competitions work (hint: it's free)",
    "  stack    — The tech behind the engine",
    "  demo     — Watch a simulated trading analysis",
    "  who      — About me, CoreyAI",
    "  status   — Engine status overview",
    "  models   — The AI orchestra",
    "  clear    — Clear this chat",
    "  help     — This menu",
    "",
    "Or just type a question — I'll do my best.",
  ],
  about: [
    "CoreIntent is an agentic AI trading engine.",
    "",
    "Three AI models work together:",
    "  Grok   → Fast signal detection & sentiment",
    "  Claude → Deep analysis & risk assessment",
    "  Perplexity → Real-time research & news",
    "",
    "It's competition-based — daily, weekly, monthly leagues.",
    "Paper trading mode. No real money at risk.",
    "Bots are welcome. AI-to-AI is first-class.",
    "",
    "Built in New Zealand by Zynthio.ai.",
  ],
  pricing: [
    "CoreIntent runs on competitions, not subscriptions.",
    "",
    "  Daily League   — Quick-fire signal challenges",
    "  Weekly League  — Sustained strategy testing",
    "  Monthly League — The real proving ground",
    "",
    'Free costs f*** all to serve — that\'s not marketing, that\'s math.',
    "We don't sell your data. We don't upsell.",
    "You compete. You learn. That's it.",
  ],
  stack: [
    "The engine runs on:",
    "",
    "  Next.js 15       — App Router + TypeScript (strict)",
    "  React 18         — Client-side interactivity",
    "  Grok API (xAI)   — Fast signals",
    "  Claude (Anthropic) — Deep analysis",
    "  Perplexity API   — Real-time research",
    "  Cloudzy VPS      — 24/7 monitoring scripts",
    "  Vercel           — Frontend deployment",
    "",
    "$45/mo total infrastructure.",
    "Visit /stack for the full breakdown.",
  ],
  who: [
    "I'm CoreyAI — the digital twin of Corey McIvor.",
    "",
    "Corey's a developer from New Zealand.",
    "He built CoreIntent under the Zynthio.ai brand.",
    "Three AI models, one engine, zero bullshit.",
    "",
    "I live here in the browser — no backend, no tracking.",
    "Everything you type stays in your browser's localStorage.",
    "Privacy-first. Always.",
  ],
  status: [
    "Engine Status:",
    "",
    "  Mode        Paper Trading (no real funds)",
    "  Frontend    Live on Vercel",
    "  API Routes  14 endpoints (demo data unless keys configured)",
    "  VPS         Scripts written, deployment pending",
    "  Auth        Not yet implemented",
    "  Database    Not yet connected",
    "",
    "This is v0.2.0-alpha. Honest about what's built and what's planned.",
  ],
  models: [
    "The AI Orchestra:",
    "",
    "  ◆ Grok (xAI)",
    "    Fast signal detection, sentiment analysis",
    "    The speedster — first to spot a trend",
    "",
    "  ◆ Claude (Anthropic)",
    "    Deep analysis, risk assessment, reasoning",
    "    The strategist — thinks before it acts",
    "",
    "  ◆ Perplexity",
    "    Real-time research, news correlation",
    "    The researcher — verifies everything",
    "",
    "When they agree: strong signal.",
    "When they disagree: that's where it gets interesting.",
  ],
  clear: ["__CLEAR__"],
};

const FALLBACK_RESPONSES = [
  "Interesting question. I'm a client-side twin — no backend brain yet. Try 'help' for what I know.",
  "I don't have an answer for that one, but I'm honest about it. Type 'help' to see what I can do.",
  "That's beyond my decision tree right now. Check out the terminal on the home page for live commands.",
  "Good question — but I'm keeping it real: I only know what's coded into me. Try 'about' or 'demo'.",
];

const DEMO_STEPS: { label: string; lines: string[] }[] = [
  {
    label: "Signal Detection",
    lines: [
      "▸ Scanning BTC/USDT on 15m timeframe...",
      "▸ Grok detected: Bullish engulfing pattern at $67,240",
      "▸ RSI: 58.3 — momentum building, not overbought",
      "▸ Volume spike: +34% above 24h average",
    ],
  },
  {
    label: "Deep Analysis",
    lines: [
      "▸ Claude analysing on-chain metrics...",
      "▸ Exchange netflow: -2,400 BTC (accumulation signal)",
      "▸ Funding rate: 0.012% — slightly positive, healthy",
      "▸ Risk assessment: MODERATE — support at $66,800",
      "▸ Confidence: 72% — pattern is clean but resistance at $68k",
    ],
  },
  {
    label: "Research Verification",
    lines: [
      "▸ Perplexity scanning news & social...",
      "▸ No major macro events in next 4h",
      "▸ Whale activity: 3 large transfers to cold storage",
      "▸ Social sentiment: 64% bullish across CT",
      "▸ No conflicting signals found",
    ],
  },
  {
    label: "Consensus",
    lines: [
      "═══════════════════════════════",
      "  SIGNAL CONSENSUS: BUY",
      "═══════════════════════════════",
      "",
      "  Grok:       BUY  (pattern + volume)",
      "  Claude:     BUY  (on-chain supports)",
      "  Perplexity: BUY  (no counter-signals)",
      "",
      "  Entry:  $67,240",
      "  Target: $68,800  (+2.3%)",
      "  Stop:   $66,400  (-1.2%)",
      "  R:R     1:1.9",
      "",
      "[DEMO] This is simulated — not financial advice.",
    ],
  },
];

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeTriggered = useRef(false);
  const demoAbort = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setIsAwake(true);
          wakeTriggered.current = true;
        }
      }
      const soundPref = localStorage.getItem(SOUND_KEY);
      if (soundPref === "true") setSoundEnabled(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
      } catch {
        // quota exceeded
      }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => setShowDot(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const playNotification = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Web Audio unavailable
    }
  }, [soundEnabled]);

  const addTwinMessage = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        { role: "twin", text, timestamp: Date.now() },
      ]);
      playNotification();
    },
    [playNotification]
  );

  const typeLines = useCallback(
    async (lines: string[]) => {
      setIsTyping(true);
      for (const line of lines) {
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 60));
        addTwinMessage(line);
      }
      setIsTyping(false);
    },
    [addTwinMessage]
  );

  const runDemo = useCallback(async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    demoAbort.current = false;
    addTwinMessage("Starting simulated trading analysis...");
    addTwinMessage("[DEMO] All data is simulated — not real trades.");
    addTwinMessage("");

    for (const step of DEMO_STEPS) {
      if (demoAbort.current) break;
      addTwinMessage(`━━━ ${step.label} ━━━`);
      for (const line of step.lines) {
        if (demoAbort.current) break;
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
        addTwinMessage(line);
      }
      if (!demoAbort.current) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    if (!demoAbort.current) {
      addTwinMessage("");
      addTwinMessage(
        "That's the pipeline. Three models, one consensus. Type 'about' for more."
      );
    }
    setDemoRunning(false);
  }, [demoRunning, addTwinMessage]);

  const handleWake = useCallback(() => {
    if (wakeTriggered.current) return;
    wakeTriggered.current = true;
    setIsAwake(true);
    setIsOpen(true);
    typeLines(GREETING_LINES);
  }, [typeLines]);

  useEffect(() => {
    if (wakeTriggered.current) return;
    const onActivity = () => handleWake();
    window.addEventListener("keydown", onActivity, { once: true });
    window.addEventListener("mousemove", onActivity, { once: true });
    window.addEventListener("touchstart", onActivity, { once: true });
    return () => {
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, [handleWake]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isTyping) return;

      setMessages((prev) => [
        ...prev,
        { role: "user", text: trimmed, timestamp: Date.now() },
      ]);
      setInput("");

      const cmd = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

      if (cmd === "demo") {
        runDemo();
        return;
      }

      if (cmd === "clear") {
        setMessages([]);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        addTwinMessage("Chat cleared. Type 'help' to start again.");
        return;
      }

      const response = RESPONSES[cmd];
      if (response) {
        typeLines(response);
      } else {
        const fallback =
          FALLBACK_RESPONSES[
            Math.floor(Math.random() * FALLBACK_RESPONSES.length)
          ];
        typeLines([fallback]);
      }
    },
    [input, isTyping, addTwinMessage, typeLines, runDemo]
  );

  const handleToggle = useCallback(() => {
    if (!isAwake) {
      handleWake();
    } else {
      setIsOpen((prev) => !prev);
    }
  }, [isAwake, handleWake]);

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  if (!showDot && !isAwake) return null;

  return (
    <>
      {/* Floating dot / toggle button */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close CoreyAI" : "Open CoreyAI"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: isAwake ? "48px" : "14px",
          height: isAwake ? "48px" : "14px",
          borderRadius: "50%",
          border: isAwake
            ? "2px solid var(--accent-green)"
            : "none",
          background: isAwake
            ? "var(--bg-secondary)"
            : "var(--accent-green)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: isAwake
            ? "0 0 20px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(0,0,0,0.4)"
            : "0 0 8px rgba(16, 185, 129, 0.5)",
          animation: !isAwake ? "engineAlive 2s ease-in-out infinite" : "none",
          fontFamily: "inherit",
          fontSize: isAwake ? "20px" : "10px",
          color: "var(--accent-green)",
          padding: 0,
        }}
      >
        {isAwake ? (isOpen ? "×" : "◆") : ""}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 9998,
            width: "min(420px, calc(100vw - 40px))",
            maxHeight: "min(560px, calc(100vh - 120px))",
            background: "var(--bg-terminal)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow:
              "0 0 40px rgba(16, 185, 129, 0.08), 0 20px 60px rgba(0,0,0,0.5)",
            animation: "slideUpPanel 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
            fontFamily: "inherit",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="engine-alive-dot"
                style={{ width: "8px", height: "8px", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "var(--accent-green)",
                }}
              >
                CoreyAI
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                twin
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={handleSoundToggle}
                aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                title={soundEnabled ? "Sound on" : "Sound off"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: soundEnabled
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  transition: "color 0.2s ease",
                }}
              >
                {soundEnabled ? "♪" : "♪̸"}
              </button>
              <button
                onClick={handleToggle}
                aria-label="Close CoreyAI"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "12px",
              lineHeight: "1.6",
              minHeight: "200px",
            }}
          >
            {messages.map((msg, i) =>
              msg.text === "" ? (
                <div key={i} style={{ height: "8px" }} />
              ) : (
                <div
                  key={i}
                  style={{
                    animation: "fadeInUp 0.3s ease both",
                    animationDelay: `${Math.min(i * 0.02, 0.2)}s`,
                  }}
                >
                  {msg.role === "user" ? (
                    <div
                      style={{
                        color: "var(--accent-blue)",
                        padding: "2px 0",
                      }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>{">"} </span>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: msg.text.startsWith("━")
                          ? "var(--accent-yellow)"
                          : msg.text.startsWith("═") ||
                              msg.text.includes("SIGNAL CONSENSUS")
                            ? "var(--accent-green)"
                            : msg.text.startsWith("▸")
                              ? "var(--text-primary)"
                              : msg.text.startsWith("[DEMO]")
                                ? "var(--accent-yellow)"
                                : msg.text.startsWith("  ◆")
                                  ? "var(--accent-green)"
                                  : "var(--text-secondary)",
                        padding: "1px 0",
                        fontWeight:
                          msg.text.includes("SIGNAL CONSENSUS") ||
                          msg.text.startsWith("━")
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
              )
            )}
            {isTyping && (
              <div style={{ display: "flex", gap: "3px", padding: "4px 0" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid var(--border-color)",
              padding: "10px 16px",
              display: "flex",
              gap: "8px",
              background: "var(--bg-secondary)",
            }}
          >
            <span
              style={{
                color: "var(--accent-green)",
                fontSize: "12px",
                lineHeight: "28px",
                flexShrink: 0,
              }}
            >
              {">"}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={demoRunning ? "Demo running..." : "Type a command..."}
              disabled={demoRunning}
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontFamily: "inherit",
                lineHeight: "28px",
                padding: 0,
              }}
            />
            <button
              type="submit"
              disabled={isTyping || demoRunning}
              aria-label="Send"
              style={{
                background:
                  isTyping || demoRunning
                    ? "transparent"
                    : "var(--accent-green)",
                border: "none",
                borderRadius: "4px",
                color:
                  isTyping || demoRunning
                    ? "var(--text-secondary)"
                    : "var(--bg-primary)",
                cursor:
                  isTyping || demoRunning ? "not-allowed" : "pointer",
                fontSize: "11px",
                fontFamily: "inherit",
                fontWeight: "bold",
                padding: "4px 10px",
                transition: "all 0.2s ease",
              }}
            >
              ↵
            </button>
          </form>

          {/* Privacy notice */}
          <div
            style={{
              padding: "4px 16px 6px",
              fontSize: "9px",
              color: "var(--text-secondary)",
              opacity: 0.5,
              textAlign: "center",
              background: "var(--bg-secondary)",
            }}
          >
            No tracking. No cookies. Chat stays in your browser.
          </div>
        </div>
      )}

      {/* Mobile full-screen override */}
      <style>{`
        @keyframes slideUpPanel {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          div[style*="bottom: 80px"][style*="right: 20px"] {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-height: 100vh !important;
            max-height: 100dvh !important;
            border-radius: 12px 12px 0 0 !important;
            height: 70vh !important;
            height: 70dvh !important;
          }
        }
      `}</style>
    </>
  );
}
