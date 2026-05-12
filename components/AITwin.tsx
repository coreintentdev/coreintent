"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  role: "twin" | "user";
  text: string;
}

const STORAGE_KEY = "coreyai-twin-history";
const WAKE_KEY = "coreyai-twin-woken";
const SOUND_KEY = "coreyai-twin-sound";

const GREETINGS = [
  "Kia ora! I'm CoreyAI — the digital twin running this engine. Type 'help' to see what I can do.",
  "Hey! CoreyAI here. Welcome to CoreIntent. I'm the AI that watches the AI. Type 'help' to get started.",
  "G'day from NZ! I'm CoreyAI, your guide to the engine. Try 'help', 'about', or 'demo' to explore.",
];

const RESPONSES: Record<string, string> = {
  help: `Available commands:
  help     — You're looking at it
  about    — What is CoreIntent?
  pricing  — How competitions work
  stack    — The tech behind the engine
  demo     — Walk through a live trading analysis
  status   — Engine status overview
  who      — Who built this?
  clear    — Clear the chat

Type any command or just ask me something.`,

  about: `CoreIntent is an agentic AI trading engine built in New Zealand.

Three AI models — Grok (fast signals), Claude (deep analysis), and Perplexity (research) — work together to generate trading signals.

No subscriptions. No monthly fees. Just competitions.
Daily, weekly, and monthly leagues where you compete for real. Bots welcome — AI-to-AI is first-class here.

Currently in paper trading mode. The architecture is production-ready, the exchange connections are planned.

Parent brand: Zynthio.ai`,

  pricing: `CoreIntent runs on competitions, not subscriptions.

FREE TIER — $0/forever
  - Daily competitions
  - Paper trading
  - Community signals

LEAGUES
  - Daily sprints (24h)
  - Weekly battles (7 days)
  - Monthly championships

No credit card. No lock-in. Bots welcome.
"Free costs f**k all to serve." — Corey

Check /pricing for the full breakdown.`,

  stack: `The engine runs on:

  Frontend:  Next.js 15 (App Router) + TypeScript (strict)
  AI Layer:  Grok + Claude + Perplexity (multi-model orchestration)
  Terminal:  Custom web terminal with ANSI rendering
  VPS:       Cloudzy instance for signal processing
  Deploy:    Vercel (web) + VPS (agents)

14 API routes. 7 pages. One mission.

The AI models don't just run in parallel — they debate each other. Grok spots patterns fast, Claude thinks deep, Perplexity cross-references everything against real data.

Check /stack for the full architecture diagram.`,

  status: `ENGINE STATUS
  Mode:       Paper Trading
  AI Models:  Code-ready (awaiting API keys)
  Exchange:   Planned (Binance + Coinbase)
  Terminal:   ONLINE
  API:        14 routes active
  Database:   Not yet deployed
  Auth:       Not yet deployed

The engine architecture is built. Exchange connections and live trading are the next milestone.`,

  who: `Built by Corey McIvor from New Zealand.

One developer. Three AI models. Zero corporate backing.

CoreIntent is a Zynthio.ai project — the parent brand for all of Corey's AI builds.

Contact: corey@coreyai.ai
GitHub: @coreintentdev
X: @coreintentai`,

  hello: "Hey! What's on your mind? Type 'help' to see what I can do, or just ask me anything.",
  hi: "Hey! What's on your mind? Type 'help' to see what I can do, or just ask me anything.",
  hey: "Hey! What's on your mind? Type 'help' to see what I can do, or just ask me anything.",
};

const DEMO_STEPS = [
  { delay: 800, text: "Initiating trading analysis demo..." },
  { delay: 1200, text: "SCANNING: BTC/USDT on 4H timeframe" },
  { delay: 1500, text: "[Grok] RSI at 32 — oversold territory. Bullish divergence forming on MACD. Confidence: 84%" },
  { delay: 1800, text: "[Claude] Fibonacci retracement holding at 0.618 level ($64,200). Volume declining on pullback — accumulation pattern. Confidence: 79%" },
  { delay: 1600, text: "[Perplexity] Fed minutes dovish. ETF inflows: +$340M this week. On-chain: whales accumulating. Confidence: 88%" },
  { delay: 1000, text: "MODEL CONSENSUS: 3/3 BULLISH" },
  { delay: 1200, text: "SIGNAL GENERATED:\n  Direction: LONG\n  Entry: $65,840\n  Target: $69,200 (+5.1%)\n  Stop Loss: $63,900 (-2.9%)\n  Risk/Reward: 1.76:1\n  Confidence: 84%" },
  { delay: 1000, text: "Paper trade executed. Position logged.\n\nThis is what the engine does — three models debate, one decision comes out. All simulated. Type 'help' for more commands." },
];

let sharedAudioCtx: AudioContext | null = null;

function playNotificationSound() {
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioContext();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  if (lower === "clear") return "__CLEAR__";
  if (lower === "demo") return "__DEMO__";

  const exact = RESPONSES[lower];
  if (exact) return exact;

  if (lower.includes("trade") || lower.includes("trading"))
    return "CoreIntent is a paper trading engine — no real money at risk yet. Try 'demo' to see a simulated trading analysis, or 'status' for the current engine state.";

  if (lower.includes("ai") || lower.includes("model") || lower.includes("grok") || lower.includes("claude") || lower.includes("perplexity"))
    return "The engine orchestrates three AI models:\n\n  Grok — Fast pattern recognition & signals\n  Claude — Deep analysis & risk assessment\n  Perplexity — Real-time research & data\n\nThey debate each other before a trade decision is made. Try 'demo' to see it in action.";

  if (lower.includes("nz") || lower.includes("new zealand") || lower.includes("kiwi"))
    return "Built in New Zealand, registered in New Zealand, running from New Zealand. Kia ora!";

  if (lower.includes("bot") || lower.includes("api"))
    return "Bots are first-class citizens here. No captcha, no gatekeeping. AI-to-AI competition is the future. Check /pricing for league details.";

  if (lower.includes("exchange") || lower.includes("binance") || lower.includes("coinbase"))
    return "Exchange connections (Binance + Coinbase) are planned but not yet connected. The architecture is ready — we're in paper trading mode until launch.";

  if (lower.includes("mansion") || lower.includes("game") || lower.includes("gamif"))
    return "The Mansion is our gamified world — rooms, story missions, progression. It's designed but not yet built. Think of it as the layer that makes trading feel like exploration.";

  if (lower.includes("music") || lower.includes("song"))
    return "SongPal is Corey's music layer — original tracks, not AI-generated Suno stuff. It'll weave into the platform experience eventually.";

  if (lower.includes("security") || lower.includes("f18"))
    return "F18 Security is our digital identity protection layer. It plants land mines for bad actors — think honeypots and tripwires. Privacy-first, always.";

  if (lower.includes("thank"))
    return "No worries! That's what I'm here for. Anything else you want to know?";

  return `I'm not sure about "${input}" — but I'm just a client-side decision tree, not the full AI orchestra.\n\nTry: help, about, pricing, stack, demo, status, or who.`;
}

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orbPulse, setOrbPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeTriggered = useRef(false);
  const demoAbort = useRef(false);
  const greetingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundEnabledRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
      const woken = localStorage.getItem(WAKE_KEY);
      if (woken === "true") {
        setIsAwake(true);
        wakeTriggered.current = true;
      }
      const sound = localStorage.getItem(SOUND_KEY);
      if (sound === "true") {
        setSoundEnabled(true);
        soundEnabledRef.current = true;
      }
    } catch {
      // localStorage not available
    }
  }, []);

  useEffect(() => {
    if (!mounted || messages.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      // quota exceeded
    }
  }, [messages, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  const wake = useCallback(() => {
    if (wakeTriggered.current) return;
    wakeTriggered.current = true;
    setIsAwake(true);
    setOrbPulse(true);
    try { localStorage.setItem(WAKE_KEY, "true"); } catch {}
    setTimeout(() => setOrbPulse(false), 3000);
  }, []);

  useEffect(() => {
    if (!mounted || wakeTriggered.current) return;

    const handleActivity = () => wake();
    window.addEventListener("keydown", handleActivity, { once: true });
    window.addEventListener("mousemove", handleActivity, { once: true });
    window.addEventListener("touchstart", handleActivity, { once: true });
    return () => {
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [mounted, wake]);

  const addTwinMessage = useCallback((text: string) => {
    setIsTyping(true);
    setTypingText("");
    let i = 0;
    const speed = Math.max(8, Math.min(20, 1200 / text.length));
    const interval = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTypingText("");
        setMessages((prev) => [...prev, { role: "twin", text }]);
        if (soundEnabledRef.current) playNotificationSound();
      }
    }, speed);
    return () => clearInterval(interval);
  }, []);

  const runDemo = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    demoAbort.current = false;
    let stepIdx = 0;

    const runStep = () => {
      if (demoAbort.current || stepIdx >= DEMO_STEPS.length) {
        setDemoRunning(false);
        return;
      }
      const step = DEMO_STEPS[stepIdx];
      stepIdx++;
      setIsTyping(true);
      setTypingText("");
      let i = 0;
      const speed = Math.max(8, Math.min(18, 1000 / step.text.length));
      const interval = setInterval(() => {
        if (demoAbort.current) {
          clearInterval(interval);
          setIsTyping(false);
          setDemoRunning(false);
          return;
        }
        i++;
        setTypingText(step.text.slice(0, i));
        if (i >= step.text.length) {
          clearInterval(interval);
          setIsTyping(false);
          setTypingText("");
          setMessages((prev) => [...prev, { role: "twin", text: step.text }]);
          if (soundEnabledRef.current) playNotificationSound();
          setTimeout(runStep, step.delay);
        }
      }, speed);
    };

    setTimeout(runStep, 500);
  }, [demoRunning]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || demoRunning) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    const response = getResponse(trimmed);

    if (response === "__CLEAR__") {
      setTimeout(() => {
        setMessages([]);
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        addTwinMessage("Chat cleared. Type 'help' for commands.");
      }, 200);
      return;
    }

    if (response === "__DEMO__") {
      setTimeout(() => runDemo(), 300);
      return;
    }

    setTimeout(() => addTwinMessage(response), 400);
  }, [input, isTyping, demoRunning, addTwinMessage, runDemo]);

  const toggleOpen = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      if (messages.length === 0 && !isTyping) {
        const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        greetingTimeout.current = setTimeout(() => addTwinMessage(greeting), 600);
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      if (greetingTimeout.current) {
        clearTimeout(greetingTimeout.current);
        greetingTimeout.current = null;
      }
      demoAbort.current = true;
    }
  }, [isOpen, messages.length, isTyping, addTwinMessage]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEnabledRef.current = next;
    try { localStorage.setItem(SOUND_KEY, String(next)); } catch {}
    if (next) playNotificationSound();
  }, [soundEnabled]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating orb trigger */}
      {!isOpen && isAwake && (
        <button
          onClick={toggleOpen}
          aria-label="Open CoreyAI assistant"
          className="ai-twin-orb"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d1117, #111827)",
            border: "2px solid #10b98155",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            boxShadow: orbPulse
              ? "0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.2)"
              : "0 4px 20px rgba(0, 0, 0, 0.4), 0 0 8px rgba(16, 185, 129, 0.15)",
            transition: "box-shadow 0.3s ease, transform 0.2s ease, border-color 0.3s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.borderColor = "#10b981";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "#10b98155";
          }}
        >
          <span style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981, 0 0 16px rgba(16, 185, 129, 0.3)",
          }} className={orbPulse ? "ai-twin-orb-ping" : "engine-heartbeat"} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="ai-twin-panel"
          style={{
            position: "fixed",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
              }} className="engine-heartbeat" />
              <span style={{ fontSize: 13, fontWeight: "bold", color: "var(--text-primary)" }}>
                CoreyAI
              </span>
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                twin
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={toggleSound}
                aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                style={{
                  background: "none",
                  border: "1px solid var(--border-color)",
                  borderRadius: 4,
                  padding: "3px 6px",
                  cursor: "pointer",
                  fontSize: 11,
                  color: soundEnabled ? "#10b981" : "var(--text-secondary)",
                  fontFamily: "inherit",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
              >
                {soundEnabled ? "SND ON" : "SND OFF"}
              </button>
              <button
                onClick={toggleOpen}
                aria-label="Close CoreyAI"
                style={{
                  background: "none",
                  border: "1px solid var(--border-color)",
                  borderRadius: 4,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                X
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
              gap: 8,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxWidth: "92%",
                  ...(msg.role === "twin"
                    ? {
                        background: "var(--bg-secondary)",
                        borderLeft: "2px solid #10b981",
                        color: "var(--text-primary)",
                        alignSelf: "flex-start",
                      }
                    : {
                        background: "#10b98112",
                        borderRight: "2px solid #10b98155",
                        color: "var(--text-primary)",
                        alignSelf: "flex-end",
                        textAlign: "right" as const,
                      }),
                }}
              >
                {msg.role === "twin" && (
                  <span style={{
                    fontSize: 10,
                    color: "#10b981",
                    display: "block",
                    marginBottom: 2,
                    fontWeight: "bold",
                  }}>
                    CoreyAI
                  </span>
                )}
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxWidth: "92%",
                  background: "var(--bg-secondary)",
                  borderLeft: "2px solid #10b981",
                  color: "var(--text-primary)",
                  alignSelf: "flex-start",
                }}
              >
                <span style={{
                  fontSize: 10,
                  color: "#10b981",
                  display: "block",
                  marginBottom: 2,
                  fontWeight: "bold",
                }}>
                  CoreyAI
                </span>
                {typingText}
                <span className="cursor-blink" style={{
                  display: "inline-block",
                  width: 6,
                  height: 13,
                  background: "#10b981",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 12, color: "#10b981", flexShrink: 0 }}>{">​"}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder={demoRunning ? "Demo running..." : "Type a command..."}
                disabled={demoRunning}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  caretColor: "#10b981",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={isTyping || demoRunning || !input.trim()}
                aria-label="Send"
                style={{
                  background: isTyping || demoRunning || !input.trim() ? "transparent" : "#10b98122",
                  border: `1px solid ${isTyping || demoRunning || !input.trim() ? "var(--border-color)" : "#10b98155"}`,
                  borderRadius: 4,
                  padding: "4px 10px",
                  cursor: isTyping || demoRunning || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: 11,
                  color: isTyping || demoRunning || !input.trim() ? "var(--text-secondary)" : "#10b981",
                  fontFamily: "inherit",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                SEND
              </button>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
              fontSize: 9,
              color: "var(--text-secondary)",
              opacity: 0.6,
            }}>
              <span>No tracking. Conversation stays on your device.</span>
              <span>NZ-built</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
