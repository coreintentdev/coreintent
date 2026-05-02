"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "coreintent-aitwin-history";
const SOUND_KEY = "coreintent-aitwin-sound";

interface Message {
  role: "twin" | "user";
  text: string;
  timestamp: number;
}

const GREETING_LINES = [
  "Kia ora. I'm CoreyAI — the digital twin of CoreIntent.",
  "Three AI models. One engine. Zero subscriptions.",
  "Type 'help' to see what I can do, or just ask me anything.",
];

const RESPONSES: Record<string, string[]> = {
  help: [
    "Commands I understand:",
    "  help     — You're looking at it",
    "  about    — What CoreIntent actually is",
    "  pricing  — How competitions work (hint: free)",
    "  stack    — The tech behind the engine",
    "  demo     — Watch a simulated trading analysis",
    "  models   — Meet the AI orchestra",
    "  who      — Who built this",
    "  status   — Engine status check",
    "  clear    — Wipe conversation",
    "",
    "Or just type a question. I'll do my best.",
  ],
  about: [
    "CoreIntent is an agentic AI trading engine.",
    "",
    "Three AI models working together:",
    "  Grok    → Fast signal detection & sentiment",
    "  Claude  → Deep analysis & risk assessment",
    "  Perplexity → Real-time research & news",
    "",
    "They don't agree with each other. That's the point.",
    "Consensus from disagreement = better signals.",
    "",
    "Currently in paper trading mode. No real money.",
    "Built in New Zealand by Corey McIvor / Zynthio.ai.",
  ],
  pricing: [
    "CoreIntent runs on competitions, not subscriptions.",
    "",
    "  Daily League   — Fast rounds, quick signals",
    "  Weekly League   — Strategy depth matters",
    "  Monthly League  — The real competition",
    "",
    "Entry: Free. Bots welcome. No captcha.",
    "\"Free costs fuck all to serve.\" — Corey",
    "",
    "No credit cards. No trial that expires.",
    "You compete, you learn, you win. Simple.",
  ],
  stack: [
    "Tech stack:",
    "",
    "  Frontend  → Next.js 15, TypeScript (strict)",
    "  AI Layer  → Grok + Claude + Perplexity",
    "  Hosting   → Vercel (web) + Cloudzy VPS",
    "  Parent    → Zynthio.ai",
    "",
    "  7 pages, 14 API routes, custom terminal",
    "  No database yet — that's coming",
    "  No auth yet — also coming",
    "",
    "Honest about what's built vs what's planned.",
    "Visit /stack for the full breakdown.",
  ],
  models: [
    "The AI Orchestra:",
    "",
    "  ╔═══════════╦══════════════════════════════╗",
    "  ║ Grok      ║ Fast signals, market sentiment║",
    "  ║ Claude    ║ Deep analysis, risk assessment ║",
    "  ║ Perplexity║ Live research, breaking news   ║",
    "  ╚═══════════╩══════════════════════════════╝",
    "",
    "They run in parallel. They disagree often.",
    "When all three align → high-confidence signal.",
    "When they diverge → something interesting is happening.",
  ],
  who: [
    "Built by Corey McIvor.",
    "Based in New Zealand. Solo founder.",
    "Parent brand: Zynthio.ai",
    "",
    "Contact: corey@coreyai.ai",
    "GitHub: @coreintentdev",
    "X: @coreintentai",
    "",
    "One dev. Three AIs. No VC. No nonsense.",
  ],
  status: [
    "Engine Status Check:",
    "",
    "  ● Web App      → Online (Vercel)",
    "  ○ VPS Scripts  → Written, not deployed",
    "  ○ Exchange API → Planned (Binance/Coinbase)",
    "  ○ Database     → Not yet connected",
    "  ○ Auth         → Not yet built",
    "  ● AI Services  → Ready (when API keys set)",
    "",
    "Paper trading mode. Demo data where noted.",
    "Honest status — no fake green dots.",
  ],
  clear: ["__CLEAR__"],
};

const DEMO_STEPS: { text: string; delay: number }[] = [
  { text: "Initiating multi-model trading analysis...", delay: 800 },
  { text: "", delay: 400 },
  { text: "═══ SIGNAL PIPELINE ═══", delay: 600 },
  { text: "", delay: 200 },
  { text: "[GROK] Scanning BTC/USDT on 15m timeframe...", delay: 1200 },
  { text: "[GROK] RSI: 72.4 | MACD: Bullish crossover", delay: 800 },
  { text: "[GROK] Sentiment: 78% bullish on X/Twitter", delay: 600 },
  { text: "[GROK] Signal: BUY — Confidence 74%", delay: 800 },
  { text: "", delay: 400 },
  { text: "[CLAUDE] Running deep analysis on GROK signal...", delay: 1400 },
  { text: "[CLAUDE] On-chain: Whale accumulation detected (+2,400 BTC)", delay: 900 },
  { text: "[CLAUDE] Risk: RSI overbought zone — divergence possible", delay: 700 },
  { text: "[CLAUDE] Macro: Fed minutes release in 4h — volatility incoming", delay: 800 },
  { text: "[CLAUDE] Signal: HOLD — Wait for Fed catalyst", delay: 600 },
  { text: "", delay: 400 },
  { text: "[PERPLEXITY] Researching current market context...", delay: 1200 },
  { text: "[PERPLEXITY] Breaking: Bitcoin ETF inflows hit $1.2B this week", delay: 800 },
  { text: "[PERPLEXITY] Funding rate: 0.012% — slightly elevated", delay: 600 },
  { text: "[PERPLEXITY] Signal: BUY — Institutional flow supports move", delay: 700 },
  { text: "", delay: 600 },
  { text: "═══ CONSENSUS ENGINE ═══", delay: 800 },
  { text: "", delay: 200 },
  { text: "  Grok:       BUY  (74%)", delay: 400 },
  { text: "  Claude:     HOLD (68%) — risk flag", delay: 400 },
  { text: "  Perplexity: BUY  (71%)", delay: 400 },
  { text: "", delay: 400 },
  { text: "  Consensus:  CAUTIOUS BUY", delay: 600 },
  { text: "  Action:     Scale in 50% now, 50% post-Fed", delay: 500 },
  { text: "  Stop Loss:  -2.5% from entry", delay: 400 },
  { text: "  Take Profit: +5.2% (R:R = 2.08)", delay: 400 },
  { text: "", delay: 400 },
  { text: "[DEMO] This was a simulated analysis.", delay: 600 },
  { text: "In production, these run against live market data.", delay: 500 },
  { text: "The disagreement between models IS the edge.", delay: 800 },
];

const FALLBACK_RESPONSES = [
  "Interesting question. I'm a client-side twin — no live AI behind me right now. But I can tell you about the platform. Try 'help' for commands.",
  "I don't have an answer for that one yet. I'm running purely client-side. Try 'about', 'pricing', 'stack', or 'demo'.",
  "Good question. I'm not connected to the AI orchestra right now — I'm the lightweight twin. Type 'help' to see what I know.",
  "That's beyond my local decision tree. The full AI orchestra (Grok + Claude + Perplexity) handles the deep stuff. Try 'demo' to see what that looks like.",
  "Can't process that one client-side. But I can walk you through the platform — try 'about' or 'demo'.",
];

function matchCommand(input: string): string[] | null {
  const lower = input.toLowerCase().trim();

  if (lower === "demo" || lower === "analyse" || lower === "analyze" || lower === "trade") {
    return null;
  }

  for (const [cmd, response] of Object.entries(RESPONSES)) {
    if (lower === cmd) return response;
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("free") || lower.includes("subscription")) {
    return RESPONSES.pricing;
  }
  if (lower.includes("stack") || lower.includes("tech") || lower.includes("built with")) {
    return RESPONSES.stack;
  }
  if (lower.includes("what is") || lower.includes("explain") || lower.includes("about")) {
    return RESPONSES.about;
  }
  if (lower.includes("who") || lower.includes("corey") || lower.includes("founder") || lower.includes("builder")) {
    return RESPONSES.who;
  }
  if (lower.includes("model") || lower.includes("grok") || lower.includes("claude") || lower.includes("perplexity") || lower.includes("ai")) {
    return RESPONSES.models;
  }
  if (lower.includes("status") || lower.includes("health") || lower.includes("live") || lower.includes("running")) {
    return RESPONSES.status;
  }
  if (lower === "hi" || lower === "hello" || lower === "hey" || lower === "sup" || lower === "yo") {
    return ["Kia ora! Good to see you.", "I'm CoreyAI — the local twin. Type 'help' for commands, or just ask me something."];
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)].split("\n");
}

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const demoAbortRef = useRef(false);
  const fallbackIndexRef = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setIsAwake(true);
        }
      }
      const storedSound = localStorage.getItem(SOUND_KEY);
      if (storedSound === "true") setSoundEnabled(true);
    } catch {
      // localStorage not available
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
      } catch {
        // storage full
      }
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // audio not available
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (hasInteracted) return;

    const wake = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      setTimeout(() => setShowBubble(true), 1500);
    };

    window.addEventListener("keydown", wake, { once: true });
    window.addEventListener("mousemove", wake, { once: true });
    window.addEventListener("touchstart", wake, { once: true });

    return () => {
      window.removeEventListener("keydown", wake);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, [hasInteracted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addTwinMessages = useCallback(
    async (lines: string[]) => {
      setIsTyping(true);
      for (const line of lines) {
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 60));
        setMessages((prev) => [
          ...prev,
          { role: "twin", text: line, timestamp: Date.now() },
        ]);
        playTick();
      }
      setIsTyping(false);
    },
    [playTick],
  );

  const openAndGreet = useCallback(async () => {
    setIsOpen(true);
    setShowBubble(false);
    if (!isAwake) {
      setIsAwake(true);
      await addTwinMessages(GREETING_LINES);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isAwake, addTwinMessages]);

  const runDemo = useCallback(async () => {
    setDemoRunning(true);
    demoAbortRef.current = false;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "demo", timestamp: Date.now() },
    ]);

    setIsTyping(true);
    for (const step of DEMO_STEPS) {
      if (demoAbortRef.current) break;
      await new Promise((r) => setTimeout(r, step.delay));
      if (demoAbortRef.current) break;
      setMessages((prev) => [
        ...prev,
        { role: "twin", text: step.text, timestamp: Date.now() },
      ]);
      playTick();
    }
    setIsTyping(false);
    setDemoRunning(false);
  }, [playTick]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isTyping || demoRunning) return;

      setInput("");
      setMessages((prev) => [
        ...prev,
        { role: "user", text: trimmed, timestamp: Date.now() },
      ]);

      const lower = trimmed.toLowerCase();

      if (lower === "demo" || lower === "analyse" || lower === "analyze" || lower === "trade") {
        await runDemo();
        return;
      }

      if (lower === "clear") {
        setMessages([]);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        await addTwinMessages(["Terminal cleared. Type 'help' for commands."]);
        return;
      }

      const response = matchCommand(trimmed);
      if (response) {
        if (response[0] === "__CLEAR__") {
          setMessages([]);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            // ignore
          }
          await addTwinMessages(["Terminal cleared. Type 'help' for commands."]);
          return;
        }
        await addTwinMessages(response);
      }
    },
    [input, isTyping, demoRunning, addTwinMessages, runDemo],
  );

  const handleClose = () => {
    if (demoRunning) {
      demoAbortRef.current = true;
      setDemoRunning(false);
      setIsTyping(false);
    }
    setIsOpen(false);
  };

  if (!hasInteracted && !isAwake) return null;

  return (
    <>
      {/* Notification bubble */}
      {showBubble && !isOpen && (
        <button
          onClick={openAndGreet}
          aria-label="Open CoreyAI assistant"
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            background: "var(--bg-secondary)",
            border: "1px solid var(--accent-green)",
            borderRadius: 12,
            padding: "10px 16px",
            color: "var(--text-primary)",
            fontSize: 13,
            fontFamily: "inherit",
            cursor: "pointer",
            zIndex: 10000,
            maxWidth: 240,
            textAlign: "left",
            boxShadow: "0 4px 24px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.1)",
            animation: "fadeInUp 0.4s ease both",
          }}
        >
          <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>
            CoreyAI
          </span>{" "}
          — Kia ora. Need a guide?
        </button>
      )}

      {/* Toggle button */}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            openAndGreet();
          }
        }}
        aria-label={isOpen ? "Close CoreyAI" : "Open CoreyAI"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: isOpen
            ? "var(--bg-secondary)"
            : "linear-gradient(135deg, #10b981, #059669)",
          border: isOpen
            ? "1px solid var(--border-color)"
            : "1px solid rgba(16, 185, 129, 0.5)",
          color: isOpen ? "var(--text-secondary)" : "#000",
          fontSize: isOpen ? 20 : 18,
          fontFamily: "inherit",
          cursor: "pointer",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen
            ? "none"
            : "0 4px 20px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {isOpen ? "✕" : "◈"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: "min(400px, calc(100vw - 48px))",
            height: "min(520px, calc(100vh - 120px))",
            background: "var(--bg-terminal)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
            boxShadow:
              "0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.08)",
            animation: "aitwinSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className="engine-alive-dot"
                style={{ width: 8, height: 8 }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--accent-green)",
                }}
              >
                CoreyAI
              </span>
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                twin
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                title={soundEnabled ? "Sound on" : "Sound off"}
                style={{
                  background: "none",
                  border: "none",
                  color: soundEnabled
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "inherit",
                  padding: "2px 6px",
                  borderRadius: 4,
                  transition: "color 0.2s",
                }}
              >
                {soundEnabled ? "♫" : "♪"}
              </button>
              <button
                onClick={handleClose}
                aria-label="Close chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 16,
                  fontFamily: "inherit",
                  padding: "2px 6px",
                }}
              >
                ✕
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
              gap: 2,
            }}
          >
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div
                  key={i}
                  style={{
                    color: "var(--accent-green)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    marginTop: 8,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)", marginRight: 6 }}>
                    &gt;
                  </span>
                  {msg.text}
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    color:
                      msg.text.startsWith("[GROK]")
                        ? "#ef4444"
                        : msg.text.startsWith("[CLAUDE]")
                          ? "#a855f7"
                          : msg.text.startsWith("[PERPLEXITY]")
                            ? "#3b82f6"
                            : msg.text.startsWith("[DEMO]")
                              ? "var(--accent-yellow)"
                              : msg.text.includes("═══")
                                ? "var(--accent-green)"
                                : "var(--text-primary)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontWeight: msg.text.includes("═══") ? "bold" : "normal",
                    whiteSpace: "pre",
                    minHeight: msg.text === "" ? 8 : undefined,
                  }}
                >
                  {msg.text}
                </div>
              ),
            )}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "10px 16px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: 8,
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "var(--accent-green)",
                fontSize: 13,
                lineHeight: "32px",
                flexShrink: 0,
              }}
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={demoRunning ? "Demo running..." : "Type a command..."}
              disabled={isTyping || demoRunning}
              autoComplete="off"
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
                height: 32,
                caretColor: "var(--accent-green)",
              }}
            />
          </form>

          {/* Privacy note */}
          <div
            style={{
              padding: "4px 16px 6px",
              fontSize: 10,
              color: "var(--text-secondary)",
              textAlign: "center",
              background: "var(--bg-secondary)",
              borderTop: "1px solid rgba(30, 41, 59, 0.3)",
              flexShrink: 0,
              opacity: 0.6,
            }}
          >
            No tracking. No cookies. Conversation stays in your browser.
          </div>
        </div>
      )}

      {/* Mobile fullscreen override + slide-up animation */}
      <style>{`
        @keyframes aitwinSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 640px) {
          div[style*="aitwinSlideUp"] {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: calc(100vh - 60px) !important;
            border-radius: 12px 12px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}
