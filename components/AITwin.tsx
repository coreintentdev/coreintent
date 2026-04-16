"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   CoreyAI Twin — Interactive AI Presence
   Client-side only. No tracking. No cookies. Privacy-first.
   ═══════════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: number;
}

// ── Decision Tree Responses ────────────────────────────────────

const GREETINGS = [
  "Kia ora! I'm CoreyAI — the digital twin running on CoreIntent.",
  "Welcome to CoreIntent. I'm CoreyAI, your guide to the engine room.",
  "Hey — CoreyAI here. Built in NZ, powered by three AI models. Ask me anything.",
];

const RESPONSES: Record<string, string> = {
  help: `Available commands:
  help     — Show this menu
  about    — What is CoreIntent?
  pricing  — How the competition model works
  stack    — The tech behind the engine
  demo     — Walk through a simulated trade analysis
  clear    — Clear conversation
  sound    — Toggle notification sounds

Or just type naturally — I'll do my best.`,

  about: `CoreIntent is an agentic AI trading engine built by Corey McIvor in New Zealand under the parent brand Zynthio.ai.

Three AI models work together:
  → Grok — fast signal detection
  → Claude — deep analysis & reasoning
  → Perplexity — real-time research

It's competition-based — daily, weekly, and monthly leagues. No subscriptions. Bots are welcome — AI-to-AI is first-class here.

Currently in paper trading mode. Not connected to exchanges yet — that's the roadmap.`,

  pricing: `Here's the deal: CoreIntent doesn't do subscriptions.

The model is competition-based:
  → Free tier — costs us fuck all to serve
  → Daily leagues — quick-fire trading battles
  → Weekly leagues — sustained strategy tests
  → Monthly leagues — the real proving ground

Entry is free. Prizes come from the platform pool. Bots are welcome — bring your algo, bring your AI. The best signal wins.

No recurring charges. No hidden fees. Just competitions.`,

  stack: `The engine runs on:

  Framework    → Next.js 14 (App Router) + TypeScript (strict)
  AI Models    → Claude (analysis) · Grok (signals) · Perplexity (research)
  Deployment   → Vercel (frontend) + Cloudzy VPS (agents)
  Security     → F18 — digital identity protection with land mines
  World        → The Mansion (gamified rooms, story missions — coming soon)
  Music Layer  → SongPal (Corey's originals)

  6 pages, 10 API routes, full agent fleet ready to deploy.
  All open-source at github.com/coreintentdev.`,

  clear: "__CLEAR__",
  sound: "__SOUND_TOGGLE__",
};

// ── Fuzzy matching for natural language ────────────────────────

function matchIntent(input: string): string | null {
  const lower = input.toLowerCase().trim();

  // Direct command match
  if (RESPONSES[lower]) return lower;

  // Keyword matching
  const keywords: Record<string, string[]> = {
    help: ["help", "commands", "menu", "options", "what can you do", "?"],
    about: ["about", "what is", "explain", "coreintent", "who are you", "what are you", "tell me"],
    pricing: ["price", "pricing", "cost", "free", "pay", "subscription", "competition", "league"],
    stack: ["stack", "tech", "technology", "built with", "framework", "architecture", "how built"],
    demo: ["demo", "trade", "trading", "analysis", "simulate", "show me", "example", "signal"],
  };

  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) return intent;
  }

  return null;
}

// ── Fallback responses ─────────────────────────────────────────

const FALLBACKS = [
  "Hmm, not sure I follow. Try 'help' to see what I can do.",
  "Didn't catch that — type 'help' for the command list.",
  "I'm good at trading talk and platform questions. Try 'about', 'pricing', 'stack', or 'demo'.",
  "Not in my decision tree yet. Try 'help' — or ask about the platform.",
];

// ── Demo mode steps ────────────────────────────────────────────

const DEMO_STEPS: { delay: number; text: string }[] = [
  { delay: 0, text: "▶ Initiating demo trade analysis..." },
  { delay: 1200, text: "⟐ SIGNAL DETECTED — BTC/USDT" },
  {
    delay: 2400,
    text: `┌─────────────────────────────────┐
│  Grok Signal Layer              │
│  Pattern: Bullish divergence    │
│  Timeframe: 4H                  │
│  Confidence: 78%                │
│  Source: Volume + RSI crossover  │
└─────────────────────────────────┘`,
  },
  {
    delay: 4800,
    text: `┌─────────────────────────────────┐
│  Claude Analysis Engine         │
│  Risk Score: 6.2/10             │
│  Position Size: 2.1% of port    │
│  Entry: $67,420                 │
│  Stop Loss: $66,100 (-1.96%)    │
│  Take Profit: $69,800 (+3.53%)  │
│  R:R Ratio: 1.80                │
└─────────────────────────────────┘`,
  },
  {
    delay: 7200,
    text: `┌─────────────────────────────────┐
│  Perplexity Research Layer      │
│  Market Sentiment: Cautious +   │
│  News: ETF inflows ↑ $340M      │
│  Macro: Fed hold confirmed      │
│  Social: Trending bullish       │
│  Verdict: SUPPORTS entry        │
└─────────────────────────────────┘`,
  },
  {
    delay: 9600,
    text: `⟐ CONSENSUS REACHED — 3/3 models agree

  Action:     LONG BTC/USDT
  Confidence: 82% (weighted average)
  Mode:       Paper Trade (demo)
  Status:     ORDER PLACED ✓

This is how three AI models collaborate on a single trade.
Type 'about' to learn more, or 'help' for all commands.`,
  },
];

// ── Notification sound (base64 tiny beep) ──────────────────────

function playNotification() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available — silent fallback
  }
}

// ── LocalStorage helpers ───────────────────────────────────────

const STORAGE_KEY = "coreintent_ai_twin";

function loadMessages(): Message[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // Storage full or unavailable
  }
}

// ── Component ──────────────────────────────────────────────────

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeTriggered = useRef(false);
  const demoTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Load persisted messages on mount
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) {
      setMessages(saved);
      setIsAwake(true);
    }
  }, []);

  // Persist messages on change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Wake on first interaction (keystroke or mouse)
  useEffect(() => {
    if (wakeTriggered.current) return;

    const wake = () => {
      if (wakeTriggered.current) return;
      wakeTriggered.current = true;
      setIsAwake(true);

      // Show bubble hint after a brief delay
      setTimeout(() => setShowBubble(true), 800);
      // Auto-hide bubble after 8 seconds
      setTimeout(() => setShowBubble(false), 8800);

      window.removeEventListener("keydown", wake);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };

    window.addEventListener("keydown", wake);
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);

    return () => {
      window.removeEventListener("keydown", wake);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  // Cleanup demo timeouts
  useEffect(() => {
    return () => {
      demoTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const addMessage = useCallback(
    (role: "assistant" | "user", text: string) => {
      const msg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
      if (role === "assistant" && soundEnabled) {
        playNotification();
      }
    },
    [soundEnabled]
  );

  const typeResponse = useCallback(
    (text: string, delay = 400) => {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
        addMessage("assistant", text);
      }, delay + Math.min(text.length * 8, 1500));
      return timeout;
    },
    [addMessage]
  );

  const runDemo = useCallback(() => {
    if (demoRunning) {
      addMessage("assistant", "Demo already running — hang tight.");
      return;
    }
    setDemoRunning(true);
    demoTimeouts.current.forEach(clearTimeout);
    demoTimeouts.current = [];

    DEMO_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        addMessage("assistant", step.text);
        if (soundEnabled) playNotification();
        if (i === DEMO_STEPS.length - 1) {
          setDemoRunning(false);
        }
      }, step.delay);
      demoTimeouts.current.push(t);
    });
  }, [demoRunning, addMessage, soundEnabled]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    addMessage("user", trimmed);
    setInputValue("");

    const intent = matchIntent(trimmed);

    if (intent === "clear" || trimmed.toLowerCase() === "clear") {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      setTimeout(() => addMessage("assistant", "Cleared. Fresh start."), 300);
      return;
    }

    if (intent === "sound" || trimmed.toLowerCase() === "sound") {
      const next = !soundEnabled;
      setSoundEnabled(next);
      setTimeout(
        () => addMessage("assistant", `Sound ${next ? "enabled" : "disabled"}.`),
        300
      );
      return;
    }

    if (intent === "demo") {
      runDemo();
      return;
    }

    if (intent && RESPONSES[intent]) {
      typeResponse(RESPONSES[intent]);
      return;
    }

    // Fallback
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    typeResponse(fallback, 600);
  }, [inputValue, isTyping, addMessage, soundEnabled, runDemo, typeResponse]);

  const handleToggle = useCallback(() => {
    const opening = !isOpen;
    setIsOpen(opening);
    setShowBubble(false);

    // If opening for first time with no messages, send greeting
    if (opening && messages.length === 0) {
      const greeting =
        GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setTimeout(() => {
        addMessage("assistant", greeting);
        setTimeout(
          () =>
            addMessage(
              "assistant",
              "Type 'help' to see what I can do, or just ask me something."
            ),
          800
        );
      }, 400);
    }
  }, [isOpen, messages.length, addMessage]);

  // Don't render anything until awake
  if (!isAwake) return null;

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close CoreyAI" : "Open CoreyAI"}
        className="ai-twin-toggle"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "1px solid var(--accent-green)",
          background: isOpen
            ? "var(--bg-primary)"
            : "linear-gradient(135deg, #0d1117, #111827)",
          color: "var(--accent-green)",
          cursor: "pointer",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          boxShadow: isOpen
            ? "0 0 20px rgba(16, 185, 129, 0.3)"
            : "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(16, 185, 129, 0.15)",
          transition: "all 0.3s ease",
          animation: !isOpen ? "ai-twin-pulse 3s ease-in-out infinite" : "none",
        }}
      >
        {isOpen ? "✕" : "⟐"}
      </button>

      {/* ── Speech Bubble Hint ── */}
      {showBubble && !isOpen && (
        <div
          className="ai-twin-bubble animate-fade-in"
          style={{
            position: "fixed",
            bottom: 84,
            right: 20,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            padding: "10px 16px",
            fontSize: 13,
            color: "var(--text-primary)",
            zIndex: 10001,
            maxWidth: 220,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
          }}
          onClick={handleToggle}
        >
          <span style={{ color: "var(--accent-green)" }}>CoreyAI</span> is
          online. Click to chat.
          <div
            style={{
              position: "absolute",
              bottom: -6,
              right: 24,
              width: 12,
              height: 12,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderTop: "none",
              borderLeft: "none",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      )}

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className="ai-twin-panel"
          role="dialog"
          aria-label="CoreyAI Chat"
          style={{
            position: "fixed",
            bottom: 88,
            right: 20,
            width: 400,
            maxHeight: "70vh",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
            boxShadow:
              "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(16, 185, 129, 0.3)",
            animation: "ai-twin-slide-up 0.3s ease both",
            overflow: "hidden",
          }}
        >
          {/* Title Bar */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-green)",
                boxShadow: "0 0 6px var(--accent-green)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                flex: 1,
              }}
            >
              CoreyAI Twin
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={
                soundEnabled ? "Disable sounds" : "Enable sounds"
              }
              title={soundEnabled ? "Sound on" : "Sound off"}
              style={{
                background: "none",
                border: "none",
                color: soundEnabled
                  ? "var(--accent-green)"
                  : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 14,
                padding: "2px 4px",
                borderRadius: 4,
                transition: "color 0.2s",
              }}
            >
              {soundEnabled ? "♪" : "♪̸"}
            </button>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                padding: "2px 8px",
                border: "1px solid var(--border-color)",
                borderRadius: 4,
              }}
            >
              NZ 🇳🇿
            </span>
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
              gap: 10,
              minHeight: 200,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "ai-twin-msg-in 0.25s ease both",
                }}
              >
                <div
                  style={{
                    maxWidth: "92%",
                    padding: "8px 12px",
                    borderRadius:
                      msg.role === "user"
                        ? "10px 10px 2px 10px"
                        : "10px 10px 10px 2px",
                    background:
                      msg.role === "user"
                        ? "rgba(59, 130, 246, 0.15)"
                        : "var(--bg-secondary)",
                    border: `1px solid ${
                      msg.role === "user"
                        ? "rgba(59, 130, 246, 0.3)"
                        : "var(--border-color)"
                    }`,
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px 10px 10px 2px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    fontSize: 12.5,
                    color: "var(--accent-green)",
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <span className="ai-twin-dot" style={{ animationDelay: "0s" }}>●</span>
                  <span className="ai-twin-dot" style={{ animationDelay: "0.15s" }}>●</span>
                  <span className="ai-twin-dot" style={{ animationDelay: "0.3s" }}>●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder={demoRunning ? "Demo in progress..." : "Type a command or question..."}
              disabled={demoRunning}
              aria-label="Chat input"
              style={{
                flex: 1,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12.5,
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-green)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || demoRunning}
              aria-label="Send message"
              style={{
                background:
                  inputValue.trim() && !isTyping && !demoRunning
                    ? "var(--accent-green)"
                    : "var(--border-color)",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                color:
                  inputValue.trim() && !isTyping && !demoRunning
                    ? "var(--bg-primary)"
                    : "var(--text-secondary)",
                cursor:
                  inputValue.trim() && !isTyping && !demoRunning
                    ? "pointer"
                    : "default",
                fontSize: 14,
                fontWeight: 700,
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              ↵
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "6px 16px",
              borderTop: "1px solid var(--border-color)",
              fontSize: 10,
              color: "var(--text-secondary)",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            Privacy-first — no tracking, no cookies. Conversation stays on your device.
          </div>
        </div>
      )}
    </>
  );
}
