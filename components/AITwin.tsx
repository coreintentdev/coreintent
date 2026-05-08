"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  role: "twin" | "user";
  text: string;
  timestamp: number;
}

interface ConversationState {
  messages: Message[];
  hasGreeted: boolean;
}

const STORAGE_KEY = "coreintent-ai-twin";

const GREETINGS = [
  "Kia ora! I'm CoreyAI — the digital twin of CoreIntent's founder. Welcome to the engine room.",
  "G'day — CoreyAI here. I'm the AI presence that lives inside CoreIntent. What can I show you?",
  "Hey — CoreyAI online. I'm here to walk you through what CoreIntent does. Fire away.",
];

const RESPONSES: Record<string, string | string[]> = {
  help: [
    "Commands I know:",
    "",
    "  \x1b[36mabout\x1b[0m     — What is CoreIntent?",
    "  \x1b[36mpricing\x1b[0m   — How competitions work",
    "  \x1b[36mstack\x1b[0m     — The tech under the hood",
    "  \x1b[36mdemo\x1b[0m      — Watch a live trading analysis",
    "  \x1b[36mwho\x1b[0m       — Who built this?",
    "  \x1b[36mbots\x1b[0m      — Bot policy",
    "  \x1b[36msecurity\x1b[0m  — How we handle your data",
    "  \x1b[36mclear\x1b[0m     — Clear this conversation",
    "",
    "Or just type anything — I'll do my best.",
  ].join("\n"),

  about: [
    "CoreIntent is an agentic AI trading engine. Three AI models — Claude, Grok, and Perplexity — work together to produce trading signals through consensus.",
    "",
    "It's not a subscription platform. It's competition-based. Daily, weekly, and monthly leagues where traders (and bots) compete on paper trades.",
    "",
    "Right now we're in paper trading mode. No live exchange connections yet — that's coming. Everything you see is real AI analysis, real signals, simulated execution.",
    "",
    "Built in New Zealand by Corey McIvor under the Zynthio.ai parent brand.",
  ].join("\n"),

  pricing: [
    "No subscriptions. Ever. CoreIntent runs on competitions.",
    "",
    "\x1b[32m  DAILY\x1b[0m    — Quick-fire leagues. Prove you can read the market today.",
    "\x1b[36m  WEEKLY\x1b[0m   — Sustained edge. Consistency beats luck.",
    "\x1b[33m  MONTHLY\x1b[0m  — The main event. Full strategy deployment.",
    "",
    "Entry is free. \"Free costs fuck all to serve\" — that's the philosophy.",
    "Bots are welcome. AI-to-AI competition is a first-class citizen here.",
  ].join("\n"),

  stack: [
    "The engine room:",
    "",
    "\x1b[36m  Framework\x1b[0m    Next.js 15 + TypeScript (strict mode)",
    "\x1b[32m  AI Layer\x1b[0m     Claude (deep analysis) + Grok (fast signals) + Perplexity (research)",
    "\x1b[33m  Frontend\x1b[0m     Custom CSS, zero frameworks. Terminal-first aesthetic.",
    "\x1b[35m  Infra\x1b[0m        Vercel (web) + Cloudzy VPS (agents/listeners)",
    "\x1b[31m  Security\x1b[0m     CSP headers, strict CORS, no tracking, F18 digital identity protection",
    "",
    "Three dependencies in package.json: next, react, react-dom. That's it.",
    "Everything else is hand-rolled. No bloat.",
  ].join("\n"),

  demo: "DEMO_MODE",

  who: [
    "Built by Corey McIvor — based in New Zealand.",
    "",
    "Software engineer, AI builder, trader. Founded Zynthio.ai as the parent brand.",
    "CoreIntent is the trading engine. There's more in the pipeline — The Mansion (gamified world), SongPal (music layer), F18 Security.",
    "",
    "Find him at \x1b[36m@coreintentai\x1b[0m on X, or \x1b[36m@coreintentdev\x1b[0m on GitHub.",
  ].join("\n"),

  bots: [
    "Bots are welcome here. No captcha. No gatekeeping.",
    "",
    "AI-to-AI competition is a first-class feature, not a bug. If your bot can trade smarter than a human, it deserves to win.",
    "",
    "CoreIntent itself is built on multi-AI orchestration — we'd be hypocrites to lock bots out.",
  ].join("\n"),

  security: [
    "Privacy-first. Always.",
    "",
    "  — No tracking cookies",
    "  — No analytics scripts",
    "  — This conversation stays in your browser (localStorage)",
    "  — Strict CSP headers, X-Frame-Options DENY",
    "  — All API errors are sanitized (no stack traces leak)",
    "  — F18 Security layer planned for digital identity protection",
    "",
    "We don't sell data. We don't harvest data. We barely collect data.",
  ].join("\n"),

  hello: "Hey! Already said hi but — good to see the enthusiasm. Type \x1b[36mhelp\x1b[0m to see what I can do.",
  hi: "Hey! Already said hi but — good to see the enthusiasm. Type \x1b[36mhelp\x1b[0m to see what I can do.",
  hey: "Hey! Already said hi but — good to see the enthusiasm. Type \x1b[36mhelp\x1b[0m to see what I can do.",
};

const DEMO_STEPS = [
  { delay: 400, text: "\x1b[36m[CoreyAI]\x1b[0m Initiating trading analysis demo..." },
  { delay: 800, text: "\x1b[33m[GROK]\x1b[0m Scanning market — BTC/USDT on 15m timeframe..." },
  { delay: 1200, text: "\x1b[33m[GROK]\x1b[0m Signal detected: RSI divergence at $67,420. Momentum shifting bullish." },
  { delay: 800, text: "\x1b[35m[PERPLEXITY]\x1b[0m Cross-referencing: 3 major analysts flagged BTC accumulation zone at $66,800-$67,500." },
  { delay: 1000, text: "\x1b[35m[PERPLEXITY]\x1b[0m Macro context: Fed minutes dovish, DXY weakening. Favorable for risk assets." },
  { delay: 1200, text: "\x1b[34m[CLAUDE]\x1b[0m Deep analysis complete. Signal confluence: 3/3 models agree." },
  { delay: 800, text: "\x1b[34m[CLAUDE]\x1b[0m Risk assessment: Entry $67,420 | Stop $66,200 | Target $69,800" },
  { delay: 600, text: "\x1b[34m[CLAUDE]\x1b[0m Risk/Reward: 1:1.95 — above threshold. Confidence: 78%." },
  { delay: 1000, text: "" },
  { delay: 400, text: "\x1b[32m  ╔══════════════════════════════════════╗\x1b[0m" },
  { delay: 100, text: "\x1b[32m  ║  CONSENSUS: LONG BTC/USDT           ║\x1b[0m" },
  { delay: 100, text: "\x1b[32m  ║  Entry:  $67,420  | Stop: $66,200   ║\x1b[0m" },
  { delay: 100, text: "\x1b[32m  ║  Target: $69,800  | R:R  1:1.95     ║\x1b[0m" },
  { delay: 100, text: "\x1b[32m  ║  Confidence: 78%  | Models: 3/3     ║\x1b[0m" },
  { delay: 100, text: "\x1b[32m  ╚══════════════════════════════════════╝\x1b[0m" },
  { delay: 800, text: "" },
  { delay: 400, text: "\x1b[36m[CoreyAI]\x1b[0m That's how the engine works. Three models, one consensus. Paper trade it in a competition to test your edge." },
  { delay: 600, text: "\x1b[36m[CoreyAI]\x1b[0m This was simulated — but the real engine runs the same pipeline with live market data." },
];

const FALLBACK_RESPONSES = [
  "Interesting. I don't have a canned response for that — I'm client-side only right now. Try \x1b[36mhelp\x1b[0m to see what I know.",
  "Not sure about that one. I'm running on a local decision tree, no API calls. Type \x1b[36mhelp\x1b[0m for commands I handle.",
  "Good question — but I'm limited to pre-built responses for now. The full AI backend is coming. Try \x1b[36mabout\x1b[0m, \x1b[36mstack\x1b[0m, or \x1b[36mdemo\x1b[0m.",
  "I'm just the twin — the lightweight local version. For the real AI power, check out the terminal on the home page. Try \x1b[36mhelp\x1b[0m here.",
];

function parseAnsi(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  const colored = escaped
    .replace(/\x1b\[0m/g, "</span>")
    .replace(/\x1b\[31m/g, '<span style="color:#ef4444">')
    .replace(/\x1b\[32m/g, '<span style="color:#10b981">')
    .replace(/\x1b\[33m/g, '<span style="color:#f59e0b">')
    .replace(/\x1b\[34m/g, '<span style="color:#3b82f6">')
    .replace(/\x1b\[35m/g, '<span style="color:#a855f7">')
    .replace(/\x1b\[36m/g, '<span style="color:#06b6d4">');
  return colored.replace(/\x1b\[[0-9;]*m/g, "");
}

function loadState(): ConversationState {
  if (typeof window === "undefined") return { messages: [], hasGreeted: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], hasGreeted: false };
    const parsed = JSON.parse(raw) as ConversationState;
    if (!Array.isArray(parsed.messages)) return { messages: [], hasGreeted: false };
    return parsed;
  } catch {
    return { messages: [], hasGreeted: false };
  }
}

function saveState(state: ConversationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export default function AITwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pulseButton, setPulseButton] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasActivatedRef = useRef(false);

  useEffect(() => {
    const saved = loadState();
    if (saved.messages.length > 0) {
      setMessages(saved.messages);
      setHasGreeted(saved.hasGreeted);
      setIsAwake(true);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0 && !hasGreeted) return;
    saveState({ messages, hasGreeted });
  }, [messages, hasGreeted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const playNotification = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.05;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  const addTwinMessage = useCallback(
    (text: string) => {
      const msg: Message = { role: "twin", text, timestamp: Date.now() };
      setMessages((prev) => [...prev, msg]);
      playNotification();
    },
    [playNotification],
  );

  const activateTwin = useCallback(() => {
    if (hasActivatedRef.current) return;
    hasActivatedRef.current = true;
    setIsAwake(true);
    setPulseButton(true);
  }, []);

  useEffect(() => {
    const saved = loadState();
    if (saved.messages.length > 0) return;

    const handleActivity = () => activateTwin();
    window.addEventListener("keydown", handleActivity, { once: true });
    window.addEventListener("mousemove", handleActivity, { once: true });
    window.addEventListener("touchstart", handleActivity, { once: true });
    return () => {
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [activateTwin]);

  const hasGreetedRef = useRef(hasGreeted);
  hasGreetedRef.current = hasGreeted;

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    setHasGreeted(true);
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addTwinMessage(greeting);
      setTimeout(() => {
        addTwinMessage("Type \x1b[36mhelp\x1b[0m to see what I can do, or just ask me anything.");
      }, 600);
    }, 1200);
  }, [addTwinMessage]);

  const toggleOpen = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setPulseButton(false);
      if (!hasGreetedRef.current) {
        setTimeout(greet, 300);
      }
    }
  }, [isOpen, greet]);

  const runDemo = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    let totalDelay = 0;

    for (const step of DEMO_STEPS) {
      totalDelay += step.delay;
      setTimeout(() => {
        if (step.text === "") {
          addTwinMessage(" ");
        } else {
          addTwinMessage(step.text);
        }
      }, totalDelay);
    }

    setTimeout(() => {
      setDemoRunning(false);
    }, totalDelay + 200);
  }, [demoRunning, addTwinMessage]);

  const handleCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const userMsg: Message = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg]);

      if (trimmed.toLowerCase() === "clear") {
        setTimeout(() => {
          setMessages([]);
          setHasGreeted(false);
          saveState({ messages: [], hasGreeted: false });
          addTwinMessage("Conversation cleared. Type \x1b[36mhelp\x1b[0m to start over.");
          setHasGreeted(true);
        }, 300);
        return;
      }

      const key = trimmed.toLowerCase().replace(/[^a-z]/g, "");
      const response = RESPONSES[key];

      setIsTyping(true);
      const delay = 400 + Math.random() * 800;

      setTimeout(() => {
        setIsTyping(false);

        if (response === "DEMO_MODE") {
          addTwinMessage("Starting the trading analysis demo. Watch the three AI models work together...");
          setTimeout(runDemo, 500);
          return;
        }

        if (typeof response === "string") {
          addTwinMessage(response);
        } else if (Array.isArray(response)) {
          addTwinMessage(response.join("\n"));
        } else {
          const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
          addTwinMessage(fallback);
        }
      }, delay);
    },
    [addTwinMessage, runDemo],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || demoRunning) return;
    handleCommand(input);
    setInput("");
  };

  if (!isAwake) return null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Close CoreyAI" : "Open CoreyAI"}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isOpen ? "#1e293b" : "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          border: "2px solid",
          borderColor: isOpen ? "#334155" : "#10b981",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: pulseButton && !isOpen
            ? "0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          animation: pulseButton && !isOpen ? "aiTwinButtonPulse 2s ease-in-out infinite" : "none",
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
            right: 20,
            width: "min(420px, calc(100vw - 40px))",
            height: "min(560px, calc(100vh - 120px))",
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
            animation: "aiTwinSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 1px rgba(16,185,129,0.3)",
            overflow: "hidden",
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #111827 0%, #0d1117 100%)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse 2s ease-in-out infinite",
                  boxShadow: "0 0 6px #10b981",
                }}
              />
              <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
                CoreyAI
              </span>
              <span style={{ color: "#4a5568", fontSize: 11 }}>twin</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                title={soundEnabled ? "Sound on" : "Sound off"}
                style={{
                  background: "none",
                  border: "1px solid #334155",
                  borderRadius: 6,
                  color: soundEnabled ? "#10b981" : "#4a5568",
                  fontSize: 14,
                  padding: "2px 8px",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {soundEnabled ? "♫" : "♪"}
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
            className="custom-scrollbar"
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.timestamp}-${i}`}
                style={{
                  animation: "aiTwinFadeIn 0.3s ease-out",
                }}
              >
                {msg.role === "twin" ? (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#c9d1d9",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: parseAnsi(msg.text) }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#10b981",
                      paddingLeft: 2,
                    }}
                  >
                    <span style={{ color: "#4a5568" }}>{">"} </span>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  padding: "4px 0",
                  animation: "aiTwinFadeIn 0.2s ease-out",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "aiTwinDot 1.4s ease-in-out infinite",
                    animationDelay: "0s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "aiTwinDot 1.4s ease-in-out infinite",
                    animationDelay: "0.2s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "aiTwinDot 1.4s ease-in-out infinite",
                    animationDelay: "0.4s",
                  }}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #1e293b",
              display: "flex",
              gap: 8,
              background: "#0a0e17",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#10b981", fontSize: 13, lineHeight: "36px", flexShrink: 0 }}>
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
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e2e8f0",
                fontSize: 13,
                fontFamily: "inherit",
                caretColor: "#10b981",
                lineHeight: "36px",
              }}
            />
            <button
              type="submit"
              disabled={demoRunning || !input.trim()}
              aria-label="Send"
              style={{
                background: input.trim() && !demoRunning ? "#10b981" : "#1e293b",
                border: "none",
                borderRadius: 6,
                color: input.trim() && !demoRunning ? "#0a0e17" : "#4a5568",
                fontSize: 14,
                padding: "0 12px",
                cursor: input.trim() && !demoRunning ? "pointer" : "default",
                transition: "all 0.2s",
                fontFamily: "inherit",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {"->"}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              padding: "6px 16px",
              borderTop: "1px solid #1e293b",
              fontSize: 10,
              color: "#334155",
              textAlign: "center",
              flexShrink: 0,
              background: "#0a0e17",
            }}
          >
            Client-side only — no data leaves your browser
          </div>
        </div>
      )}

    </>
  );
}
