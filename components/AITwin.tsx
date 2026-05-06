"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

const STORAGE_KEY = "coreyai-twin";

const GREETING = `G'day! I'm CoreyAI — Corey's digital twin, built in Aotearoa New Zealand.

I run the CoreIntent trading engine — three AI models, zero subscriptions, pure competition.

Type 'help' to see what I can do, or just ask me anything.`;

function getResponse(input: string): string | string[] {
  const cmd = input.trim().toLowerCase();

  if (!cmd) return "Type something, mate. Try 'help' if you're lost.";

  if (cmd === "help") {
    return `Commands:

  help      — You're looking at it
  about     — What CoreIntent is
  pricing   — Competitions & pricing
  stack     — Tech stack breakdown
  demo      — Simulated trading analysis
  clear     — Clear this conversation
  reset     — Fresh start, wipe everything

Or just type a question — I'll do my best.`;
  }

  if (cmd === "about") {
    return `CoreIntent is an agentic AI trading engine built by Corey McIvor, under Zynthio.ai.

Three AI models work together:
  → Grok (xAI)         — fast market signals
  → Claude (Anthropic)  — deep analysis
  → Perplexity          — real-time research

We run paper trading competitions — daily, weekly, monthly leagues. No subscriptions, no paywall. Bots are welcome. AI-to-AI trading is first-class.

Currently in alpha (v0.2.0). Paper trading only — no real money at risk.`;
  }

  if (cmd === "pricing") {
    return `No subscriptions. Competitions only.

"Free costs fuck all to serve." — Corey

  → Daily leagues    — quick-fire paper trades
  → Weekly leagues   — strategy plays
  → Monthly leagues  — the long game

All free. Bots welcome. No captcha. No paywall. No premium tier.

Just show up and trade.`;
  }

  if (cmd === "stack") {
    return `Tech Stack:

  Framework     — Next.js 15 (App Router)
  Language      — TypeScript (strict mode)
  AI Models     — Grok + Claude + Perplexity
  API Routes    — 14 endpoints
  Deployment    — Vercel (web) + Cloudzy VPS
  Font          — JetBrains Mono
  Auth          — Not yet (coming)
  Database      — Not yet (coming)
  Exchanges     — Planned (Binance, Coinbase)

Current state: paper trading mode. Exchange connections are planned, not connected. API routes return demo data until keys are configured.`;
  }

  if (cmd === "demo") {
    return [
      `Initiating multi-model trading analysis...
Target: BTC/USDT | Timeframe: 4H
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      `[GROK — Fast Scan]
Price: $67,420 | 24h Volume: +23%
RSI(14): 58 | MACD: bullish crossover
Support: $66,800 | Resistance: $69,200

Signal: LONG | Confidence: 72%`,

      `[CLAUDE — Deep Analysis]
On-chain: accumulation trend detected
Exchange reserves: declining (bullish)
4H structure: higher lows since Monday
Macro: Fed pause sentiment at 78%
Whale activity: 3 large buys in 6h window

Signal: LONG | Confidence: 81%`,

      `[PERPLEXITY — Research]
Latest: Spot ETF inflows $340M this week
Sentiment score: 0.73 (bullish)
Social volume: trending on CT
No negative catalysts detected

Signal: LONG | Confidence: 77%`,

      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSENSUS: 3/3 models → LONG

Entry:  $67,420
Target: $69,800 (+3.5%)
Stop:   $66,100 (-1.9%)
R/R:    1.84x
Confidence: 77% weighted average

[DEMO] Paper trade only — no real money.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
  }

  if (
    ["hi", "hello", "hey", "sup", "gday", "g'day", "kia ora", "yo"].some(
      (g) => cmd === g || cmd.startsWith(g + " ")
    )
  ) {
    return "Hey! Good to see you. I'm CoreyAI — type 'help' to see what I can do, or just ask me something.";
  }

  if (cmd === "clear" || cmd === "cls") return "__CLEAR__";
  if (cmd === "reset") return "__RESET__";

  if (
    cmd.includes("who") &&
    (cmd.includes("you") || cmd.includes("corey") || cmd.includes("are"))
  ) {
    return `I'm CoreyAI — the digital twin of Corey McIvor, founder of CoreIntent and Zynthio.ai. Built in New Zealand.

Corey built this platform from scratch — three AI models orchestrated into one trading engine. I'm the front door. Ask me about the platform, the stack, or how it all works.`;
  }

  if (cmd.includes("corey")) {
    return "Corey McIvor — founder of CoreIntent and Zynthio.ai. Based in New Zealand. Built this entire platform from scratch. The man behind the engine.";
  }

  if (cmd.includes("mansion")) {
    return "The Mansion is CoreIntent's gamified world — rooms, story missions, interactive experiences. It's on the roadmap but not built yet. Think of it as the fun layer on top of the trading engine.";
  }

  if (cmd.includes("songpal") || cmd.includes("music")) {
    return "SongPal is Corey's music layer — original tracks, not AI-generated. It's a separate creative project woven into the Zynthio universe.";
  }

  if (cmd.includes("f18") || cmd.includes("security")) {
    return "F18 Security is CoreIntent's digital identity protection layer. Land mines for bad actors. Designed to protect your identity in the AI trading space. Currently in design phase.";
  }

  if (cmd.includes("zynthio")) {
    return "Zynthio.ai is the parent brand behind CoreIntent. Think of it as the umbrella — CoreIntent is the trading engine, but Zynthio is the ecosystem: AI tools, creative projects, and more. All built by Corey McIvor in NZ.";
  }

  if (
    cmd.includes("exchange") ||
    cmd.includes("binance") ||
    cmd.includes("coinbase")
  ) {
    return "Exchange connections (Binance, Coinbase) are PLANNED but not connected yet. Everything runs on demo data right now. Live exchange integration is on the roadmap.";
  }

  if (cmd.includes("trade") || cmd.includes("trading")) {
    return "CoreIntent is a paper trading platform — no real money at risk. We run AI-powered trading competitions using signals from three models (Grok, Claude, Perplexity). Try 'demo' to see a simulated analysis.";
  }

  if (
    cmd.includes("nz") ||
    cmd.includes("new zealand") ||
    cmd.includes("aotearoa")
  ) {
    return "Built in Aotearoa New Zealand. Everything runs from here — the code, the VPS, the competitions. NZ-first, always.";
  }

  const safe =
    input.length > 50 ? input.slice(0, 50) + "…" : input;
  return `Not sure what you mean by "${safe}", mate. Try 'help' for available commands.`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AITwin() {
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasWoken, setHasWoken] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processingRef = useRef(false);
  const messagesLenRef = useRef(0);
  messagesLenRef.current = messages.length;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
      if (localStorage.getItem(STORAGE_KEY + "-woken")) {
        setHasWoken(true);
      }
    } catch {
      /* localStorage unavailable */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* localStorage unavailable */
    }
  }, [messages, ready]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!ready || hasWoken) return;

    const wake = () => {
      setHasWoken(true);
      try {
        localStorage.setItem(STORAGE_KEY + "-woken", "1");
      } catch {
        /* localStorage unavailable */
      }
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 6000);
    };

    const handler = () => {
      wake();
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("touchstart", handler);
    };

    const timer = setTimeout(() => {
      document.addEventListener("keydown", handler, { once: true });
      document.addEventListener("mousemove", handler, { once: true });
      document.addEventListener("touchstart", handler, { once: true });
    }, 2000);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [ready, hasWoken]);

  const playBlip = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      /* Web Audio unavailable */
    }
  }, [soundEnabled]);

  const addAIMessages = useCallback(
    async (response: string | string[]) => {
      const steps = Array.isArray(response) ? response : [response];
      for (const step of steps) {
        setIsTyping(true);
        await delay(400 + Math.min(step.length * 3, 1200));
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "ai", text: step }]);
        playBlip();
      }
    },
    [playBlip]
  );

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    setShowBubble(false);

    if (messagesLenRef.current === 0 && !processingRef.current) {
      processingRef.current = true;
      setIsProcessing(true);
      await delay(300);
      await addAIMessages(GREETING);
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [addAIMessages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || processingRef.current) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", text }]);

      processingRef.current = true;
      setIsProcessing(true);

      const response = getResponse(text);

      if (response === "__CLEAR__") {
        await delay(200);
        setMessages([]);
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }

      if (response === "__RESET__") {
        await delay(200);
        setMessages([]);
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY + "-woken");
        } catch {
          /* localStorage unavailable */
        }
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }

      await addAIMessages(response);
      processingRef.current = false;
      setIsProcessing(false);
    },
    [input, addAIMessages]
  );

  if (!ready) return null;
  if (!hasWoken) return null;

  return (
    <>
      {showBubble && !isOpen && (
        <div
          className="ai-twin-bubble"
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleOpen();
          }}
          style={{
            position: "fixed",
            bottom: "84px",
            right: "24px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--accent-green)",
            borderRadius: "12px 12px 4px 12px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "var(--text-primary)",
            cursor: "pointer",
            zIndex: 10000,
            maxWidth: "240px",
            boxShadow: "0 4px 24px rgba(16, 185, 129, 0.2)",
          }}
        >
          <span
            style={{ color: "var(--accent-green)", fontWeight: "bold" }}
          >
            CoreyAI
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            {" "}
            &mdash; G&apos;day! Click to chat
          </span>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Open CoreyAI chat"
          className="ai-twin-trigger energy-pulse"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "var(--bg-secondary)",
            border: "2px solid var(--accent-green)",
            color: "var(--accent-green)",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "inherit",
            cursor: "pointer",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
          }}
        >
          &gt;_
        </button>
      )}

      {isOpen && (
        <div
          className="ai-twin-panel"
          role="dialog"
          aria-label="CoreyAI chat"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "380px",
            maxHeight: "520px",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            zIndex: 10000,
            boxShadow:
              "0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="engine-alive-dot" />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "var(--accent-green)",
                }}
              >
                CoreyAI
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                Twin
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={
                  soundEnabled ? "Mute sounds" : "Enable sounds"
                }
                title={soundEnabled ? "Sound on" : "Sound off"}
                style={{
                  background: "transparent",
                  border: "none",
                  color: soundEnabled
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  textDecoration: soundEnabled ? "none" : "line-through",
                }}
              >
                SND
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
          </div>

          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              fontSize: "12px",
              lineHeight: "1.6",
              minHeight: "200px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="ai-twin-msg"
                style={{
                  marginBottom: "12px",
                }}
              >
                {msg.role === "user" ? (
                  <div style={{ color: "var(--accent-green)" }}>
                    <span style={{ opacity: 0.5 }}>{">"} </span>
                    {msg.text}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "var(--text-primary)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  gap: "2px",
                  alignItems: "center",
                  height: "20px",
                }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                padding: "10px 0 10px 12px",
                color: "var(--accent-green)",
                fontSize: "13px",
                opacity: 0.6,
              }}
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isProcessing ? "Processing..." : "Type a command..."
              }
              disabled={isProcessing}
              autoComplete="off"
              className="terminal-input"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "13px",
                padding: "10px 12px",
                fontFamily: "inherit",
              }}
            />
          </form>
        </div>
      )}
    </>
  );
}
