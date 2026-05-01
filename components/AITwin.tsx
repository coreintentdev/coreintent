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
  const soundRef = useRef(false);

  openRef.current = open;
  soundRef.current = soundOn;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const saveMessages = useCallback((msgs: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-100)));
    } catch {
      /* storage full */
    }
  }, []);

  const addMessage = useCallback(
    (role: "ai" | "user", text: string) => {
      const msg: Message = { id: nextId++, role, text };
      setMessages((prev) => {
        const updated = [...prev, msg];
        saveMessages(updated);
        return updated;
      });
      if (role === "ai" && soundRef.current) playSound("blip");
    },
    [saveMessages],
  );

  const runDemo = useCallback(async () => {
    setDemoRunning(true);
    abortRef.current = false;
    for (const step of DEMO_STEPS) {
      if (abortRef.current) break;
      setTyping(true);
      await wait(step.delay);
      if (abortRef.current) break;
      setTyping(false);
      addMessage("ai", step.text);
      await wait(200);
    }
    setTyping(false);
    setDemoRunning(false);
  }, [addMessage]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || demoRunning) return;
    addMessage("user", trimmed);
    setInput("");

    const response = getResponse(trimmed);

    if (response.text === "__CLEAR__") {
      abortRef.current = true;
      setDemoRunning(false);
      setTyping(false);
      setMessages([]);
      saveMessages([]);
      setTimeout(() => addMessage("ai", "Conversation cleared. Fresh start. Type 'help' anytime."), 100);
      return;
    }

    if (response.isDemo) {
      runDemo();
      return;
    }

    setTyping(true);
    const delay = Math.min(300 + response.text.length * 3, 1200);
    setTimeout(() => {
      setTyping(false);
      addMessage("ai", response.text);
    }, delay);
  }, [input, demoRunning, addMessage, saveMessages, runDemo]);

  // Mount & load saved messages
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      /* corrupt data */
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-wake on first interaction
  useEffect(() => {
    if (!mounted) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const wake = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ok */
      }
      setTimeout(() => {
        if (openRef.current) return;
        setOpen(true);
        const hasVisited = localStorage.getItem(VISITED_KEY);
        addMessage("ai", hasVisited ? RETURN_GREETING : FIRST_GREETING);
        try {
          localStorage.setItem(VISITED_KEY, "1");
        } catch {
          /* ok */
        }
      }, 1500);
    };

    window.addEventListener("keydown", wake, { once: true });
    window.addEventListener("mousemove", wake, { once: true });
    return () => {
      window.removeEventListener("keydown", wake);
      window.removeEventListener("mousemove", wake);
    };
  }, [mounted, addMessage]);

  // Auto-scroll on new messages or typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  if (!mounted) return null;

  const togglePanel = () => {
    setOpen((prev) => !prev);
    if (soundOn) playSound("click");
  };

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-terminal)",
        animation: "aiTwinSlideUp 0.3s ease",
      }
    : {
        position: "fixed",
        bottom: "88px",
        right: "24px",
        width: "380px",
        height: "520px",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-terminal)",
        border: "1px solid #10b98133",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 1px #10b98155",
        animation: "aiTwinSlideUp 0.3s ease",
        overflow: "hidden",
      };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={panelStyle}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid #10b98122",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 6px #10b981",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#10b981" }}>CoreyAI</span>
              <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>twin</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setSoundOn((p) => !p)}
                title={soundOn ? "Mute sounds" : "Enable sounds"}
                style={{
                  background: "none",
                  border: "none",
                  color: soundOn ? "#10b981" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {soundOn ? "[ON]" : "[OFF]"}
              </button>
              <button
                onClick={togglePanel}
                title="Close"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.length === 0 && !typing && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  marginTop: "40px",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.3 }}>&gt;_</div>
                CoreyAI is listening.
                <br />
                Type something to begin.
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: msg.role === "ai" ? "#10b981" : "var(--accent-blue)",
                    flexShrink: 0,
                    marginTop: "2px",
                    minWidth: "42px",
                  }}
                >
                  {msg.role === "ai" ? "CoreyAI" : "you"}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: msg.role === "ai" ? "var(--text-primary)" : "#10b981",
                    whiteSpace: "pre-line",
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "#10b981",
                    flexShrink: 0,
                    marginTop: "2px",
                    minWidth: "42px",
                  }}
                >
                  CoreyAI
                </span>
                <span className="ai-twin-typing-dots" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  ...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderTop: "1px solid #10b98122",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "bold" }}>&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={demoRunning ? "Analysis running..." : "Type a command..."}
              disabled={demoRunning}
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={demoRunning || !input.trim()}
              style={{
                background: "none",
                border: "none",
                color: input.trim() && !demoRunning ? "#10b981" : "var(--text-secondary)",
                cursor: input.trim() && !demoRunning ? "pointer" : "default",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: "bold",
                padding: "4px 8px",
              }}
            >
              &crarr;
            </button>
          </form>

          {/* Privacy notice */}
          <div
            style={{
              padding: "4px 16px 6px",
              fontSize: "9px",
              color: "var(--text-secondary)",
              textAlign: "center",
              background: "var(--bg-secondary)",
              opacity: 0.7,
            }}
          >
            No tracking. No cookies. Conversation stays in your browser.
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={togglePanel}
        title={open ? "Close CoreyAI" : "Open CoreyAI"}
        className="ai-twin-toggle"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1100,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "2px solid #10b98155",
          background: open ? "#10b981" : "var(--bg-secondary)",
          color: open ? "#000" : "#10b981",
          cursor: "pointer",
          fontSize: "16px",
          fontFamily: "inherit",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open ? "0 0 20px #10b98155" : "0 4px 16px rgba(0,0,0,0.4), 0 0 12px #10b98122",
          transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        }}
      >
        {open ? "×" : ">_"}
      </button>
    </>
  );
}
