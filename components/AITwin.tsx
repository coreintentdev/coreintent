"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───

interface Message {
  role: "twin" | "user";
  text: string;
  timestamp: number;
}

interface ConversationState {
  messages: Message[];
  hasInteracted: boolean;
}

// ─── Response Tree ───

const GREETINGS = [
  "Kia ora. I'm CoreyAI — the digital twin running this engine.",
  "Welcome to CoreIntent. Three AI models, one trading engine, zero subscriptions.",
  "Type 'help' to see what I can do, or just ask me anything about the platform.",
];

const RESPONSES: Record<string, string[]> = {
  help: [
    "Commands I understand:",
    "",
    "  about     — What CoreIntent is",
    "  pricing   — How competitions work",
    "  stack     — Our tech architecture",
    "  demo      — Watch a live trading analysis",
    "  models    — The AI models we orchestrate",
    "  security  — How we protect your data",
    "  who       — About the builder",
    "  clear     — Clear this conversation",
    "",
    "Or just type naturally — I'll do my best.",
  ],
  about: [
    "CoreIntent is an agentic AI trading engine built in New Zealand.",
    "",
    "We orchestrate three AI models — Grok for fast signals, Claude for deep analysis, Perplexity for research — into a single consensus engine.",
    "",
    "No subscriptions. Free competitions. Daily, weekly, monthly leagues.",
    "Bots are first-class citizens here. AI-to-AI trading is the point.",
    "",
    "Currently in paper trading mode. We ship honest — everything labelled DEMO is demo.",
  ],
  pricing: [
    "We don't do subscriptions. We do competitions.",
    "",
    "  DAILY SPRINT  — Fast 24hr leagues, free entry",
    "  WEEKLY CLASH   — 7-day strategy battles",
    "  MONTHLY LEAGUE — Full month, deeper analysis",
    "",
    "Free costs fuck all to serve. That's not a bug, it's the model.",
    "Bots welcome. No captcha. Bring your best algorithm.",
  ],
  stack: [
    "Architecture:",
    "",
    "  Frontend  — Next.js 15, App Router, TypeScript strict",
    "  AI Layer  — Grok (xAI), Claude (Anthropic), Perplexity",
    "  Hosting   — Vercel (edge) + Cloudzy VPS",
    "  Security  — CSP headers, CORS, rate limiting, F18 identity shield",
    "",
    "No database yet. No auth yet. Paper trading only.",
    "Honest status: alpha. Shipping fast, shipping real.",
  ],
  models: [
    "Three brains, one engine:",
    "",
    "  GROK (xAI)       — Fast signal generation, market pulse",
    "  CLAUDE (Anthropic) — Deep analysis, risk assessment, reasoning",
    "  PERPLEXITY        — Real-time research, news correlation",
    "",
    "Each model votes independently. Consensus drives the signal.",
    "When they disagree, that's data too.",
  ],
  security: [
    "Privacy-first. Always.",
    "",
    "  - No tracking cookies",
    "  - No analytics fingerprinting",
    "  - This conversation stays in your browser (localStorage)",
    "  - CSP headers block XSS vectors",
    "  - All API errors are sanitised — no stack traces leak",
    "  - F18 digital identity protection (planned)",
    "",
    "Your data is yours. We don't want it.",
  ],
  who: [
    "Built by Corey McIvor. Based in New Zealand.",
    "",
    "Solo founder. Parent brand: Zynthio.ai",
    "Background: software engineering, AI orchestration, trading systems.",
    "",
    "This isn't a startup pitch deck. It's a working engine.",
    "Code is on GitHub. Everything ships or it doesn't exist.",
  ],
  clear: ["__CLEAR__"],
};

const DEMO_STEPS = [
  { delay: 800, text: "[SIGNAL DETECTED] BTC/USDT — potential breakout pattern" },
  { delay: 1200, text: "Routing to AI consensus engine..." },
  { delay: 1000, text: "" },
  { delay: 600, text: "  GROK:       BUY  — momentum spike detected, RSI divergence" },
  { delay: 800, text: "  CLAUDE:     BUY  — support level held 3x, volume confirms" },
  { delay: 800, text: "  PERPLEXITY: HOLD — macro uncertainty, Fed minutes pending" },
  { delay: 1000, text: "" },
  { delay: 600, text: "  CONSENSUS:  BUY (2/3 confidence: 73%)" },
  { delay: 800, text: "  Risk Level: MODERATE" },
  { delay: 600, text: "  Position:   2.5% of portfolio" },
  { delay: 600, text: "  Stop Loss:  -3.2% below entry" },
  { delay: 600, text: "  Take Profit: +8.5% (2.6:1 R:R)" },
  { delay: 1000, text: "" },
  { delay: 800, text: "[PAPER TRADE EXECUTED] — This is demo data. No real money involved." },
  { delay: 600, text: "Type 'help' for more commands." },
];

const FALLBACK_RESPONSES = [
  "Interesting question. I'm a client-side twin — no API brain yet. Try 'help' for what I know.",
  "I don't have a response for that yet. The full AI layer is coming. Try: about, pricing, stack, demo.",
  "Good question. I'm running on a decision tree right now, not the full Claude/Grok/Perplexity stack. Type 'help' to see my commands.",
  "That's beyond my local knowledge. Once the API layer is live, I'll be much smarter. For now, try 'help'.",
];

// ─── Helpers ───

const STORAGE_KEY = "coreintent-aitwin";

function loadConversation(): ConversationState {
  if (typeof window === "undefined") return { messages: [], hasInteracted: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], hasInteracted: false };
    const parsed = JSON.parse(raw) as ConversationState;
    if (!Array.isArray(parsed.messages)) return { messages: [], hasInteracted: false };
    return parsed;
  } catch {
    return { messages: [], hasInteracted: false };
  }
}

function saveConversation(state: ConversationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

function matchCommand(input: string): string | null {
  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const commands = Object.keys(RESPONSES);
  for (const cmd of commands) {
    if (normalized === cmd || normalized.startsWith(cmd + " ")) return cmd;
  }
  if (normalized.includes("price") || normalized.includes("cost") || normalized.includes("competition")) return "pricing";
  if (normalized.includes("tech") || normalized.includes("architecture") || normalized.includes("built with")) return "stack";
  if (normalized.includes("what is") || normalized.includes("what are") || normalized.includes("explain")) return "about";
  if (normalized.includes("model") || normalized.includes("ai") || normalized.includes("grok") || normalized.includes("claude") || normalized.includes("perplexity")) return "models";
  if (normalized.includes("safe") || normalized.includes("private") || normalized.includes("privacy") || normalized.includes("security") || normalized.includes("data")) return "security";
  if (normalized.includes("corey") || normalized.includes("founder") || normalized.includes("built") || normalized.includes("who")) return "who";
  if (normalized.includes("demo") || normalized.includes("trade") || normalized.includes("signal") || normalized.includes("watch") || normalized.includes("show")) return "demo";
  if (normalized.includes("help") || normalized === "?" || normalized === "h") return "help";
  return null;
}

// ─── Component ───

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeListenerAttached = useRef(false);
  const hasGreeted = useRef(false);

  // Load saved conversation on mount
  useEffect(() => {
    const saved = loadConversation();
    if (saved.messages.length > 0) {
      setMessages(saved.messages);
      setIsAwake(true);
      hasGreeted.current = true;
    }
  }, []);

  // Save conversation on change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation({ messages, hasInteracted: true });
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const playNotification = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.value = 0.05;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  const addTwinMessage = useCallback((text: string) => {
    const msg: Message = { role: "twin", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const typeMessages = useCallback(
    async (lines: string[]) => {
      setIsTyping(true);
      for (const line of lines) {
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 60));
        addTwinMessage(line);
        playNotification();
      }
      setIsTyping(false);
    },
    [addTwinMessage, playNotification]
  );

  const runDemo = useCallback(async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    setIsTyping(true);
    addTwinMessage("Initiating demo trading analysis...");
    await new Promise((r) => setTimeout(r, 600));

    for (const step of DEMO_STEPS) {
      await new Promise((r) => setTimeout(r, step.delay));
      addTwinMessage(step.text);
    }
    setIsTyping(false);
    setDemoRunning(false);
  }, [demoRunning, addTwinMessage]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || demoRunning) return;

    const userMsg: Message = { role: "user", text: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const cmd = matchCommand(trimmed);

    if (cmd === "demo") {
      await runDemo();
      return;
    }

    if (cmd && RESPONSES[cmd]) {
      const lines = RESPONSES[cmd];
      if (lines[0] === "__CLEAR__") {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
        hasGreeted.current = false;
        addTwinMessage("Conversation cleared. Type anything to start fresh.");
        return;
      }
      await typeMessages(lines);
      return;
    }

    // Fallback
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    addTwinMessage(fallback);
    setIsTyping(false);
  }, [input, isTyping, demoRunning, runDemo, typeMessages, addTwinMessage]);

  const greet = useCallback(async () => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    setIsAwake(true);
    setIsOpen(true);
    await typeMessages(GREETINGS);
  }, [typeMessages]);

  // Wake on first interaction (keystroke or mouse move)
  useEffect(() => {
    if (wakeListenerAttached.current || hasGreeted.current) return;
    wakeListenerAttached.current = true;

    const saved = loadConversation();
    if (saved.hasInteracted) return;

    let triggered = false;
    const wake = () => {
      if (triggered) return;
      triggered = true;
      document.removeEventListener("keydown", wake);
      document.removeEventListener("mousemove", wake);
      greet();
    };

    document.addEventListener("keydown", wake, { once: true });
    document.addEventListener("mousemove", wake, { once: true });

    return () => {
      document.removeEventListener("keydown", wake);
      document.removeEventListener("mousemove", wake);
    };
  }, [greet]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isAwake) {
      setIsAwake(true);
      if (!hasGreeted.current) {
        greet();
      }
    }
  };

  // ─── Render ───

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Close CoreyAI assistant" : "Open CoreyAI assistant"}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 10000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "1px solid #10b98166",
          background: isOpen ? "#1e293b" : "#0d1117",
          color: "#10b981",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          boxShadow: isAwake
            ? "0 0 20px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(0, 0, 0, 0.5)"
            : "0 4px 16px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
        }}
        className={isAwake && !isOpen ? "energy-pulse" : undefined}
      >
        {isOpen ? "✕" : "◈"}
      </button>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="CoreyAI assistant"
        style={{
          position: "fixed",
          bottom: 88,
          right: 20,
          zIndex: 9999,
          width: "min(420px, calc(100vw - 40px))",
          maxHeight: "min(600px, calc(100vh - 120px))",
          background: "#0d1117",
          border: "1px solid #1e293b",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(16, 185, 129, 0.2)",
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, flex: 1 }}>
            CoreyAI
          </span>
          <span style={{ color: "#475569", fontSize: 11 }}>twin v0.1</span>
          <button
            onClick={() => setSoundEnabled((p) => !p)}
            aria-label={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
            title={soundEnabled ? "Sound on" : "Sound off"}
            style={{
              background: "none",
              border: "none",
              color: soundEnabled ? "#10b981" : "#475569",
              cursor: "pointer",
              fontSize: 14,
              padding: "2px 4px",
              lineHeight: 1,
            }}
          >
            {soundEnabled ? "♪" : "♫"}
          </button>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minHeight: 200,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={`${msg.timestamp}-${i}`}
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: msg.role === "twin" ? "#94a3b8" : "#10b981",
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                animation: "fadeInUp 0.25s ease both",
              }}
            >
              {msg.role === "user" && (
                <span style={{ color: "#10b981", opacity: 0.6 }}>&gt; </span>
              )}
              {msg.role === "twin" && msg.text === "" ? " " : msg.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: 3, padding: "4px 0" }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #1e293b",
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#10b981", fontSize: 13, lineHeight: "32px", flexShrink: 0 }}>
            &gt;
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={demoRunning ? "Demo running..." : "Type a command..."}
            disabled={demoRunning}
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              lineHeight: "32px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || demoRunning}
            aria-label="Send message"
            style={{
              background: "none",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: input.trim() && !isTyping ? "#10b981" : "#334155",
              cursor: input.trim() && !isTyping ? "pointer" : "default",
              fontSize: 12,
              padding: "4px 12px",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>

        {/* Privacy footer */}
        <div
          style={{
            padding: "6px 16px",
            borderTop: "1px solid #0f172a",
            fontSize: 10,
            color: "#334155",
            textAlign: "center",
          }}
        >
          No tracking. No cookies. Conversation stays in your browser.
        </div>
      </div>

      {/* Mobile full-screen override */}
      <style>{`
        @media (max-width: 480px) {
          [role="dialog"][aria-label="CoreyAI assistant"] {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-height: calc(100vh - 70px) !important;
            border-radius: 12px 12px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}
