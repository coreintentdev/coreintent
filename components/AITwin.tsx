"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

const STORAGE_KEY = "coreyai-messages";
const VISITED_KEY = "coreyai-visited";
const SESSION_KEY = "coreyai-session-greeted";

const FIRST_GREETING =
  "Kia ora! I'm CoreyAI — the digital twin running this engine.\n\nThree AI models. Zero subscriptions. Built in New Zealand.\n\nType 'help' to see what I can do, or just ask me anything.";

const RETURN_GREETING =
  "Welcome back! CoreyAI here — still watching the signals.\n\nType 'help' for commands, or 'demo' to see a live analysis.";

const HELP_TEXT = `Available commands:
  about     — What is CoreIntent?
  pricing   — Competition details
  stack     — Tech stack & costs
  models    — Meet the AI trio
  rules     — The hard rules
  demo      — Watch a signal analysis
  clear     — Clear conversation
  336       — ???

Or just type naturally — I'll figure it out.`;

const ABOUT_TEXT = `CoreIntent is an agentic AI trading engine built by Corey McIvor in New Zealand.

Three AI models — Grok, Claude, and Perplexity — cross-check every trading signal. When they agree, confidence is high. When they disagree, the system flags it.

No subscriptions. Free competitions. Bots welcome.
Parent brand: Zynthio.ai`;

const PRICING_TEXT = `$0. That's the price. Competitions, not subscriptions.

Daily leagues — fast signal sprints
Weekly leagues — strategy consistency
Monthly leagues — the real test

Free entry. Your P&L is your membership card.

The platform runs on ~$45/mo. Charging you would be extraction, not business.`;

const STACK_TEXT = `Next.js 15 + TypeScript (strict mode)
Vercel hosting — free
Cloudflare Pro — $20/mo
Cloudzy VPS — $25/mo
GitHub Actions CI/CD — free
Total: ~$45/mo

AI Models:
  Grok — fast signals & sentiment
  Claude — deep analysis & risk
  Perplexity — real-time research`;

const MODELS_TEXT = `The AI trio:

GROK (xAI) — Fast signal detection & sentiment. Spots patterns before they trend. The speedster.

CLAUDE (Anthropic) — Deep analysis & risk assessment. Questions everything. The skeptic.

PERPLEXITY (Perplexity AI) — Real-time research & fact-checking. No stale data.

All three agree → high confidence.
They disagree → dig deeper, not guess harder.`;

const RULES_TEXT = `The hard rules:

1. Competitions, not subscriptions
2. Bots welcome — AI-to-AI is first-class
3. NZ-first for all legal/business
4. Demo means demo. Planned means planned.
5. Build passes clean or you don't push
6. 336 is the signal — always
7. Free costs f*ck all to serve — give it away`;

const SIGNAL_336 = `▓▓▓ 336 ▓▓▓

The signal is dominant.
You found it.

"Three models. Three filters. Six certainties."

Welcome to the inner circle.`;

const DEMO_STEPS = [
  { text: "Initialising signal scan...", delay: 1200 },
  {
    text: "━━━ GROK ━━━\nScanning BTC/USDT on 4H chart...\nRSI divergence detected\nSocial sentiment: 73% bullish\n→ Signal: LONG | Confidence: 87%",
    delay: 1800,
  },
  {
    text: "━━━ CLAUDE ━━━\nRunning deep analysis...\nOn-chain metrics: accumulation phase\nRisk/Reward ratio: 2.4:1\n→ Adjusted confidence: 79%",
    delay: 1800,
  },
  {
    text: "━━━ PERPLEXITY ━━━\nSearching live sources...\nNo negative catalysts in 24h\nWhale activity: neutral\n→ Research confidence: 82%",
    delay: 1800,
  },
  {
    text: "━━━ ENGINE CONSENSUS ━━━\nModels agreeing: 3/3\nCombined confidence: 83%\n\n→ SIGNAL: LONG BTC/USDT\n→ Entry: $67,200 – $67,450\n→ Stop loss: $66,800\n→ Take profit: $68,100",
    delay: 1200,
  },
  {
    text: "[DEMO] Simulated analysis — paper trading mode.\nNo real trades were executed.\nType 'help' for more commands.",
    delay: 0,
  },
];

const FALLBACKS = [
  "Not sure about that one. I'm running off a local decision tree — no live AI behind me yet. Try 'help'.",
  "Can't compute that. Type 'help', 'about', 'pricing', or 'demo'.",
  "That's above my pay grade. Type 'demo' and I'll walk you through a signal analysis instead.",
  "No dice. The real AI trio lives in the engine. Try 'help' for available commands.",
];

function getResponse(input: string): { text: string; isDemo?: boolean } {
  const s = input.toLowerCase().trim();

  if (s === "help" || s === "?") return { text: HELP_TEXT };
  if (s === "about") return { text: ABOUT_TEXT };
  if (s === "pricing" || s === "competitions" || s === "price") return { text: PRICING_TEXT };
  if (s === "stack" || s === "tech") return { text: STACK_TEXT };
  if (s === "models" || s === "ai") return { text: MODELS_TEXT };
  if (s === "rules") return { text: RULES_TEXT };
  if (s === "336") return { text: SIGNAL_336 };
  if (s === "clear") return { text: "__CLEAR__" };
  if (s === "demo" || s === "analyse" || s === "analyze") return { text: "", isDemo: true };

  if (/^(hi|hello|hey|yo|sup|g'?day|kia ora|howdy)/.test(s))
    return { text: "Hey! Good to have you here. Type 'help' to see what I can do, or 'demo' for the cool stuff." };

  if (/^(thanks|cheers|ta |thx|thank)/.test(s))
    return { text: "No worries! Anything else? Type 'help' for the full menu." };

  if (/^(bye|goodbye|later|cya|see ya|peace)/.test(s))
    return { text: "Catch you later! The engine never sleeps — I'll be here when you're back." };

  if (/price|cost|free|subscri|pay|fee|money/.test(s)) return { text: PRICING_TEXT };
  if (/stack|tech|built with|infra|architect/.test(s)) return { text: STACK_TEXT };
  if (/model|grok|claude|perplexity/.test(s)) return { text: MODELS_TEXT };
  if (/rule|law|principle/.test(s)) return { text: RULES_TEXT };
  if (/who|about|what is|explain/.test(s)) return { text: ABOUT_TEXT };
  if (/demo|show|signal|trad|analy/.test(s)) return { text: "", isDemo: true };

  return { text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] };
}

function playSound(type: "blip" | "click") {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "blip") {
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.frequency.value = 600;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch {
    /* audio unavailable */
  }
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let nextId = Date.now();

export default function AITwin() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed.slice(-40));
      }
    } catch {
      /* unavailable */
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || messages.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* quota */
    }
  }, [messages, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addMessage = useCallback((role: "ai" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: nextId++, role, text }]);
  }, []);

  const greet = useCallback(() => {
    let greeting: string;
    try {
      const visited = localStorage.getItem(VISITED_KEY);
      const sessionGreeted = sessionStorage.getItem(SESSION_KEY);
      if (sessionGreeted) return;
      greeting = visited ? RETURN_GREETING : FIRST_GREETING;
      localStorage.setItem(VISITED_KEY, "1");
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      greeting = FIRST_GREETING;
    }
    addMessage("ai", greeting);
  }, [addMessage]);

  const wake = useCallback(() => {
    setOpen(true);
    greet();
  }, [greet]);

  useEffect(() => {
    if (!mounted) return;
    const handler = () => {
      if (!openRef.current) wake();
    };
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("mousemove", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [mounted, wake]);

  const runDemo = useCallback(async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    abortRef.current = false;

    for (const step of DEMO_STEPS) {
      if (abortRef.current) break;
      if (step.delay > 0) {
        setTyping(true);
        await wait(step.delay);
      }
      if (abortRef.current) break;
      setTyping(false);
      addMessage("ai", step.text);
      if (soundOn) playSound("blip");
    }

    setTyping(false);
    setDemoRunning(false);
  }, [demoRunning, addMessage, soundOn]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || typing || demoRunning) return;

    addMessage("user", trimmed);
    if (soundOn) playSound("click");
    setInput("");

    const { text, isDemo } = getResponse(trimmed);

    if (text === "__CLEAR__") {
      setMessages([]);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
      setTimeout(() => addMessage("ai", "Chat cleared. Type 'help' to start fresh."), 100);
      return;
    }

    if (isDemo) {
      runDemo();
      return;
    }

    setTyping(true);
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      setTyping(false);
      addMessage("ai", text);
      if (soundOn) playSound("blip");
    }, delay);
  }, [input, typing, demoRunning, addMessage, soundOn, runDemo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) greet();
      return next;
    });
  }, [greet]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!mounted) return null;

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-terminal, #0d1117)",
        animation: "slideUpPanel 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
      }
    : {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 10000,
        width: "400px",
        maxHeight: "520px",
        borderRadius: "12px",
        border: "1px solid var(--border-color, #1e293b)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-terminal, #0d1117)",
        boxShadow:
          "0 0 40px rgba(16, 185, 129, 0.08), 0 20px 60px rgba(0,0,0,0.5)",
        animation: "slideUpPanel 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
      };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleOpen}
        aria-label={open ? "Close CoreyAI" : "Open CoreyAI"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10001,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "2px solid var(--accent-green, #10b981)",
          background: "var(--bg-secondary, #111827)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 0 20px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(0,0,0,0.4)",
          fontFamily: "inherit",
          fontSize: "18px",
          color: "var(--accent-green, #10b981)",
          padding: 0,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 30px rgba(16, 185, 129, 0.5), 0 4px 20px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(0,0,0,0.4)";
        }}
      >
        {open ? "×" : "◆"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={panelStyle}>
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color, #1e293b)",
              background: "var(--bg-secondary, #111827)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
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
                  color: "var(--accent-green, #10b981)",
                }}
              >
                CoreyAI
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--text-secondary, #94a3b8)",
                  opacity: 0.7,
                }}
              >
                twin
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                onClick={() => setSoundOn((p) => !p)}
                aria-label={soundOn ? "Mute" : "Unmute"}
                title={soundOn ? "Sound on" : "Sound off"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: soundOn
                    ? "var(--accent-green, #10b981)"
                    : "var(--text-secondary, #94a3b8)",
                  padding: "4px 6px",
                  fontFamily: "inherit",
                  opacity: soundOn ? 1 : 0.5,
                  transition: "all 0.2s ease",
                }}
              >
                {soundOn ? "♪" : "♪"}
              </button>
              <button
                onClick={toggleOpen}
                aria-label="Close CoreyAI"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "var(--text-secondary, #94a3b8)",
                  padding: "4px 8px",
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "12px",
              lineHeight: "1.65",
              minHeight: 0,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  animation: "fadeInUp 0.25s ease both",
                }}
              >
                {msg.role === "user" ? (
                  <div style={{ color: "var(--accent-blue, #3b82f6)" }}>
                    <span style={{ color: "var(--text-secondary, #94a3b8)", opacity: 0.6 }}>
                      {">"}{" "}
                    </span>
                    {msg.text}
                  </div>
                ) : (
                  <div
                    style={{
                      color: msg.text.startsWith("━")
                        ? "var(--accent-yellow, #f59e0b)"
                        : msg.text.startsWith("▓") ||
                            msg.text.includes("CONSENSUS")
                          ? "var(--accent-green, #10b981)"
                          : msg.text.startsWith("[DEMO]")
                            ? "var(--accent-yellow, #f59e0b)"
                            : msg.text.startsWith("→")
                              ? "var(--text-primary, #e2e8f0)"
                              : "var(--text-secondary, #94a3b8)",
                      whiteSpace: "pre-wrap",
                      fontWeight:
                        msg.text.includes("CONSENSUS") ||
                        msg.text.startsWith("▓")
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: "3px", padding: "4px 0" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid var(--border-color, #1e293b)",
              padding: "10px 16px",
              display: "flex",
              gap: "8px",
              background: "var(--bg-secondary, #111827)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "var(--accent-green, #10b981)",
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
              onKeyDown={handleKeyDown}
              placeholder={demoRunning ? "Demo running..." : "Type a command..."}
              disabled={demoRunning}
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary, #e2e8f0)",
                fontSize: "12px",
                fontFamily: "inherit",
                lineHeight: "28px",
                padding: 0,
              }}
            />
            <button
              onClick={handleSend}
              disabled={typing || demoRunning}
              aria-label="Send"
              style={{
                background:
                  typing || demoRunning
                    ? "transparent"
                    : "var(--accent-green, #10b981)",
                border: "none",
                borderRadius: "4px",
                color:
                  typing || demoRunning
                    ? "var(--text-secondary, #94a3b8)"
                    : "var(--bg-primary, #0a0e17)",
                cursor: typing || demoRunning ? "not-allowed" : "pointer",
                fontSize: "11px",
                fontFamily: "inherit",
                fontWeight: "bold",
                padding: "4px 10px",
                transition: "all 0.2s ease",
              }}
            >
              ↵
            </button>
          </div>

          {/* Privacy */}
          <div
            style={{
              padding: "4px 16px 6px",
              fontSize: "9px",
              color: "var(--text-secondary, #94a3b8)",
              opacity: 0.4,
              textAlign: "center",
              background: "var(--bg-secondary, #111827)",
              flexShrink: 0,
            }}
          >
            No tracking. No cookies. Chat stays in your browser.
          </div>
        </div>
      )}

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
      `}</style>
    </>
  );
}
