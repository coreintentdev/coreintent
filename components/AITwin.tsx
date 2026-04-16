"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "coreyai-twin-history";

const GREETING = `G'day — I'm CoreyAI, the digital twin of Corey McIvor.

I live inside CoreIntent, an agentic AI trading engine built in New Zealand. Three AI models. Zero subscriptions. Just competitions.

Type **help** to see what I can do, or just ask me anything.`;

const RESPONSES: Record<string, string> = {
  help: `**Available commands:**

  \u2022 **about** — What is CoreIntent?
  \u2022 **pricing** — How does pricing work?
  \u2022 **stack** — What's the tech stack?
  \u2022 **demo** — Watch a simulated trading analysis
  \u2022 **clear** — Clear conversation history
  \u2022 **help** — Show this menu

Or just type naturally — I'll do my best.`,

  about: `**CoreIntent** is an agentic AI trading engine.

Three AI models work together:
\u2022 **Grok** (X.ai) — Fast market signals
\u2022 **Claude** (Anthropic) — Deep analysis
\u2022 **Perplexity** — Research & news

Currently in paper trading mode. No real money. Just pure AI vs AI competition.

Built in New Zealand by Corey McIvor under the **Zynthio.ai** brand.

Bots are first-class citizens here. If you can code it, you can compete with it.`,

  pricing: `**No subscriptions. Ever.**

CoreIntent runs on competitions:
\u2022 **Daily leagues** — Quick-fire signal battles
\u2022 **Weekly leagues** — Strategy over time
\u2022 **Monthly leagues** — The main event

Free to enter. Free to compete.

"Free costs fuck all to serve." — That's the philosophy.

AI-to-AI competition is the whole point. Bring your bot, bring your brain, or bring both.`,

  stack: `**The CoreIntent Stack:**

\u2022 **Frontend:** Next.js 14 (App Router) + TypeScript (strict)
\u2022 **AI Layer:** Grok + Claude + Perplexity with graceful fallback
\u2022 **Hosting:** Vercel (frontend) + Cloudzy VPS (agents)
\u2022 **CDN:** Cloudflare Pro
\u2022 **Cost:** ~$45/month total

**Architecture:**
\u2022 6 pages, 10+ API routes
\u2022 AI service orchestration in lib/ai.ts
\u2022 VPS scripts for risk monitoring & signal listening
\u2022 Edge middleware for CORS

No database yet. No auth yet. But the engine is code-ready.`,
};

const DEMO_SEQUENCE = [
  "**[DEMO MODE]** Initiating simulated trading analysis...",
  "\u27EB Scanning markets across 3 AI models...",
  `\u27EB **Grok** signal detected:

Pair: BTC/USDT
Direction: LONG
Confidence: 82%
Source: Volume spike + momentum divergence`,
  `\u27EB **Claude** deep analysis:

Market structure: Bullish order block at $67,200
Risk/Reward: 2.8:1
Correlation check: ETH confirming, SOL lagging
Macro: No major events in 24h window
Verdict: ALIGNED with Grok signal`,
  `\u27EB **Perplexity** research scan:

\u2022 No negative news catalysts found
\u2022 Whale wallets accumulating (on-chain)
\u2022 Funding rates neutral \u2014 not overheated
\u2022 Social sentiment: cautiously bullish`,
  `\u27EB **CONSENSUS REACHED** \u2014 3/3 models agree

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  SIGNAL: LONG BTC/USDT     \u2502
\u2502  Entry: $67,450             \u2502
\u2502  Stop: $66,800  (-0.96%)    \u2502
\u2502  Target: $69,250  (+2.67%)  \u2502
\u2502  R:R Ratio: 2.8:1           \u2502
\u2502  Score: 87/100              \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

This is a **paper trade simulation**. No real money was used. This is how CoreIntent's three AI models reach consensus.

Type **help** to explore more.`,
];

function playNotificationSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.onended = () => {
      void ctx.close();
    };
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  if (Object.prototype.hasOwnProperty.call(RESPONSES, lower)) return RESPONSES[lower];

  if (lower.includes("help") || lower === "?") return RESPONSES.help;
  if (lower.includes("about") || lower.includes("what is") || lower.includes("who are"))
    return RESPONSES.about;
  if (
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("free") ||
    lower.includes("subscription")
  )
    return RESPONSES.pricing;
  if (lower.includes("stack") || lower.includes("tech") || lower.includes("built with"))
    return RESPONSES.stack;
  if (
    lower.includes("demo") ||
    lower.includes("trade") ||
    lower.includes("signal") ||
    lower.includes("analysis")
  )
    return "__DEMO__";
  if (lower.includes("clear") || lower.includes("reset")) return "__CLEAR__";

  if (/^(hi|hey|hello|sup|yo|g'?day|kia ora)/i.test(lower)) {
    return "Hey! Good to have you here. Type **help** to see what I can show you, or just ask away.";
  }

  if (/^(thanks|cheers|ta|sweet|nice)/i.test(lower)) {
    return "No worries! Anything else you want to know? Type **help** for the full menu.";
  }

  return `I'm a client-side twin \u2014 no backend brain hooked up yet. But I can help with the basics.

Try: **help**, **about**, **pricing**, **stack**, or **demo**

Once CoreIntent goes live, I'll have Claude, Grok, and Perplexity behind me. For now, I keep it simple.`;
}

function renderContent(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "var(--accent-green)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeAttached = useRef(false);
  const demoTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Load conversation from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setIsAwake(true);
        }
      }
    } catch {
      // Start fresh
    }
  }, []);

  // Persist conversation
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Storage unavailable
      }
    }
  }, [messages]);

  // Wake on first interaction
  useEffect(() => {
    if (isAwake || wakeAttached.current) return;
    wakeAttached.current = true;

    const wake = () => {
      setIsAwake(true);
      setIsOpen(true);
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ role: "ai", content: GREETING, timestamp: Date.now() }]);
        setIsTyping(false);
      }, 1200);
      document.removeEventListener("keydown", wake);
      document.removeEventListener("mousemove", wake);
    };

    document.addEventListener("keydown", wake, { once: true });
    document.addEventListener("mousemove", wake, { once: true });

    return () => {
      document.removeEventListener("keydown", wake);
      document.removeEventListener("mousemove", wake);
    };
  }, [isAwake]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Cleanup demo timeouts
  useEffect(() => {
    return () => {
      demoTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const addAIMessage = useCallback(
    (content: string, sound: boolean) => {
      setMessages((prev) => [...prev, { role: "ai", content, timestamp: Date.now() }]);
      if (sound) playNotificationSound();
    },
    [],
  );

  const runDemo = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    setIsTyping(true);
    demoTimeouts.current = [];

    DEMO_SEQUENCE.forEach((msg, i) => {
      const t = setTimeout(() => {
        if (i > 0) setIsTyping(true);
        const t2 = setTimeout(() => {
          addAIMessage(msg, soundEnabled);
          setIsTyping(i < DEMO_SEQUENCE.length - 1);
          if (i === DEMO_SEQUENCE.length - 1) setDemoRunning(false);
        }, 800);
        demoTimeouts.current.push(t2);
      }, i * 2500);
      demoTimeouts.current.push(t);
    });
  }, [demoRunning, soundEnabled, addAIMessage]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isTyping || demoRunning) return;

      setMessages((prev) => [...prev, { role: "user", content: trimmed, timestamp: Date.now() }]);
      setInput("");

      const response = getResponse(trimmed);

      if (response === "__CLEAR__") {
        setTimeout(() => {
          setMessages([]);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            // ignore
          }
          addAIMessage("Conversation cleared. Type **help** to start fresh.", soundEnabled);
        }, 300);
        return;
      }

      if (response === "__DEMO__") {
        runDemo();
        return;
      }

      setIsTyping(true);
      setTimeout(() => {
        addAIMessage(response, soundEnabled);
        setIsTyping(false);
      }, 600 + Math.random() * 800);
    },
    [input, isTyping, demoRunning, soundEnabled, addAIMessage, runDemo],
  );

  const toggle = useCallback(() => {
    if (!isAwake) {
      setIsAwake(true);
      setIsOpen(true);
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ role: "ai", content: GREETING, timestamp: Date.now() }]);
        setIsTyping(false);
      }, 1200);
    } else {
      setIsOpen((prev) => !prev);
    }
  }, [isAwake]);

  const canSubmit = input.trim() && !isTyping && !demoRunning;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={toggle}
        aria-label={isOpen ? "Close CoreyAI" : "Open CoreyAI"}
        className="ai-twin-trigger"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: isAwake
            ? "2px solid var(--accent-green)"
            : "2px solid var(--border-color)",
          background: isOpen ? "var(--accent-green)" : "var(--bg-secondary)",
          color: isOpen ? "var(--bg-primary)" : "var(--accent-green)",
          fontSize: 22,
          fontFamily: "inherit",
          cursor: "pointer",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: isAwake
            ? "0 0 20px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0,0,0,0.4)"
            : "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {isOpen ? "\u00D7" : "\u25B6"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="ai-twin-panel"
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: 420,
            maxHeight: "70vh",
            background: "var(--bg-terminal)",
            border: "1px solid var(--accent-green)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
            boxShadow:
              "0 0 40px rgba(16, 185, 129, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
            animation: "aiTwinSlideUp 0.3s ease both",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--accent-green)",
                  boxShadow: "0 0 8px var(--accent-green)",
                  display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.5px" }}>
                CoreyAI Twin
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-secondary)",
                  background: "var(--bg-primary)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  border: "1px solid var(--border-color)",
                }}
              >
                v0.2.0-alpha
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled((p) => !p)}
              aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
              title={soundEnabled ? "Sound on" : "Sound off"}
              style={{
                background: "none",
                border: "1px solid var(--border-color)",
                color: soundEnabled ? "var(--accent-green)" : "var(--text-secondary)",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
                fontFamily: "inherit",
                fontSize: 12,
                transition: "all 0.2s ease",
              }}
            >
              {soundEnabled ? "SND:ON" : "SND:OFF"}
            </button>
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
              gap: 12,
              minHeight: 200,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.timestamp}-${i}`}
                style={{
                  animation: "fadeInUp 0.3s ease both",
                  maxWidth: msg.role === "user" ? "85%" : "100%",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "ai" && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--accent-green)",
                      marginBottom: 4,
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    COREYAI
                  </div>
                )}
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 4px 12px"
                        : "4px 12px 12px 12px",
                    background:
                      msg.role === "user"
                        ? "var(--accent-blue)"
                        : "var(--bg-secondary)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid var(--border-color)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ animation: "fadeInUp 0.3s ease both" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--accent-green)",
                    marginBottom: 4,
                    fontWeight: 600,
                    letterSpacing: "1px",
                  }}
                >
                  COREYAI
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px 12px 12px 12px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    display: "inline-flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span className="ai-twin-dot" style={{ animationDelay: "0s" }} />
                  <span className="ai-twin-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="ai-twin-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: 8,
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                demoRunning ? "Demo in progress..." : "Type a command or question..."
              }
              disabled={demoRunning}
              autoComplete="off"
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "var(--bg-terminal)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontFamily: "inherit",
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-green)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            />
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                padding: "10px 16px",
                background: canSubmit
                  ? "var(--accent-green)"
                  : "var(--border-color)",
                border: "none",
                borderRadius: 8,
                color: canSubmit ? "var(--bg-primary)" : "var(--text-secondary)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                cursor: canSubmit ? "pointer" : "default",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              &gt;_
            </button>
          </form>
        </div>
      )}
    </>
  );
}
