"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  role: "twin" | "user";
  content: string;
}

const STORAGE_KEY = "coreintent-ai-twin";
const TYPE_SPEED = 16;

const GREETING =
  "Kia ora! I\u2019m CoreyAI \u2014 the digital twin behind CoreIntent.\n\nThree AI models. Zero subscriptions. Pure NZ engineering.\n\nType \u2018help\u2019 to see what I can do.";

function getResponses(raw: string): { texts: string[]; clear?: boolean } {
  const cmd = raw.toLowerCase().trim();

  if (cmd === "help")
    return {
      texts: [
        "Commands:\n  help     \u2014 This menu\n  about    \u2014 What is CoreIntent?\n  pricing  \u2014 How much? (spoiler: free)\n  stack    \u2014 The tech under the hood\n  demo     \u2014 Simulated trade analysis\n  who      \u2014 About CoreyAI\n  clear    \u2014 Clear conversation\n\nOr just type naturally.",
      ],
    };

  if (cmd === "about")
    return {
      texts: [
        "CoreIntent is an agentic AI trading engine.\n\nThree models work together \u2014 Grok for speed, Claude for depth, Perplexity for research \u2014 to find and validate trading signals.\n\nNo subscriptions. Competition-based. Daily, weekly, and monthly leagues where traders and bots compete.\n\nBuilt in New Zealand by Corey McIvor. Currently in paper trading mode.",
      ],
    };

  if (cmd === "pricing")
    return {
      texts: [
        "Free. Competitions cost nothing to enter.\n\nNo subscriptions. No premium tiers. No paywalls.\n\nEnter daily, weekly, or monthly trading leagues. Win on performance, not payment.\n\nBots are first-class citizens here.",
      ],
    };

  if (cmd === "stack")
    return {
      texts: [
        "The engine:\n  Next.js 14 + TypeScript (strict mode)\n  AI: Claude, Grok, Perplexity\n  Risk monitoring + signal detection\n  VPS on Cloudzy, NZ-routed\n\nPhilosophy:\n  No unnecessary frameworks\n  No un-auditable dependencies\n  ~$45/month total infra cost\n  Security headers locked tight\n\nVisit /stack for the full architecture.",
      ],
    };

  if (cmd === "who" || cmd === "whoami" || cmd === "who are you")
    return {
      texts: [
        "I\u2019m CoreyAI \u2014 a client-side digital twin.\n\nBuilt by Corey McIvor from New Zealand. One developer, multiple AI models, zero corporate overhead.\n\nYour conversation stays in your browser. No tracking, no cookies, no data leaves your machine.\n\nParent brand: Zynthio.ai",
      ],
    };

  if (cmd === "demo")
    return {
      texts: [
        "[SCAN] Initiating market analysis...",
        "[SIGNAL] BTC/USDT \u2014 Bullish divergence on 4H. RSI: 34 \u2192 42 while price held $67,200 support.",
        "[GROK] Fast signal confirmed. Volume +340% above 20MA. Momentum shifting. Confidence: HIGH.",
        "[CLAUDE] Deep analysis agrees. Pattern match: 87%. Macro: neutral-bullish. No conflicting signals on higher TFs.",
        "[PERPLEXITY] No contrary news. ETF inflows $274M today. Sentiment: cautiously bullish.",
        "[CONSENSUS] 3/3 \u2192 LONG\n  Entry:  $67,420\n  Stop:   $66,100  (-1.96%)\n  Target: $69,800  (+3.52%)\n  R/R:    1:1.8\n  Size:   2% portfolio",
        "[EXECUTED] Paper trade placed. Monitoring...\n\nThis is demo data \u2014 no real trades executed.\nType \u2018about\u2019 to learn more.",
      ],
    };

  if (cmd === "clear") return { texts: ["Conversation cleared."], clear: true };

  if (/\b(trade|trading|signal)\b/i.test(cmd))
    return {
      texts: [
        "CoreIntent validates signals across three AI models before any trade. Paper mode for now.\n\nType \u2018demo\u2019 for a simulated analysis.",
      ],
    };

  if (/\b(ai|model|grok|claude|perplexity)\b/i.test(cmd))
    return {
      texts: [
        "Three models, one consensus:\n  Grok \u2014 fast pattern detection\n  Claude \u2014 deep analysis\n  Perplexity \u2014 real-time research\n\nNo single model trades alone. Type \u2018stack\u2019 for details.",
      ],
    };

  if (/\b(hi|hey|hello|g'?day|sup)\b/i.test(cmd))
    return {
      texts: [
        "Hey! Good to have you. Type \u2018help\u2019 to explore, or just ask me anything.",
      ],
    };

  if (/\b(bye|later|cya|cheers)\b/i.test(cmd))
    return {
      texts: [
        "Catch you later. Conversation saved locally \u2014 no data goes anywhere.",
      ],
    };

  if (/\b(nz|zealand|kiwi)\b/i.test(cmd))
    return {
      texts: [
        "Built in New Zealand. One developer who got tired of subscriptions and black-box trading tools.",
      ],
    };

  if (/\b(bot|automat)\b/i.test(cmd))
    return {
      texts: [
        "Bots are welcome. No captcha, no restrictions. AI-to-AI competition is first-class.",
      ],
    };

  if (/\b(mansion|game|gamif)\b/i.test(cmd))
    return {
      texts: [
        "The Mansion is coming \u2014 a gamified world with rooms, story missions, and AI challenges. Not built yet, but it\u2019s on the roadmap.",
      ],
    };

  if (/\b(zynthio|brand|parent)\b/i.test(cmd))
    return {
      texts: [
        "Zynthio.ai is the parent brand. CoreIntent is the trading engine. More projects are in the pipeline.",
      ],
    };

  if (/\b(corey|mciv)\b/i.test(cmd))
    return {
      texts: [
        "Corey McIvor \u2014 founder, developer, and the human behind this digital twin. Based in New Zealand. Builds things that work without charging you monthly for the privilege.",
      ],
    };

  return {
    texts: [
      "Not sure about that one. Type \u2018help\u2019 for available commands, or ask about trading, AI models, or pricing.",
    ],
  };
}

function playBeep(ctx: AudioContext) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.03;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    /* audio unavailable */
  }
}

export default function AITwin() {
  const [mounted, setMounted] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queueRef = useRef<string[]>([]);
  const fullRef = useRef("");
  const soundFlagRef = useRef(false);
  const greetedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    soundFlagRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(data.messages);
        setIsAwake(true);
        greetedRef.current = true;
      }
      if (typeof data.soundEnabled === "boolean") setSoundEnabled(data.soundEnabled);
    } catch {
      /* localStorage unavailable */
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || messages.length === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages: messages.slice(-100), soundEnabled })
      );
    } catch {
      /* storage full */
    }
  }, [mounted, messages, soundEnabled]);

  useEffect(() => {
    if (!mounted) return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mounted]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    if (isOpen && mounted) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const beep = useCallback(() => {
    if (!soundFlagRef.current) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      playBeep(audioRef.current);
    } catch {
      /* no audio */
    }
  }, []);

  const typeMessage = useCallback(
    (text: string) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      fullRef.current = text;
      let i = 0;
      setTypingText("");

      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        i++;
        if (i <= text.length) {
          setTypingText(text.slice(0, i));
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTypingText(null);
          setMessages((p) => [...p, { role: "twin", content: text }]);
          beep();
          if (queueRef.current.length > 0) {
            const next = queueRef.current.shift()!;
            setTimeout(() => {
              if (mountedRef.current) typeMessage(next);
            }, 400);
          }
        }
      }, TYPE_SPEED);
    },
    [beep]
  );

  const skipTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fullRef.current) {
      const text = fullRef.current;
      fullRef.current = "";
      setTypingText(null);
      setMessages((p) => [...p, { role: "twin", content: text }]);
      const remaining = queueRef.current.splice(0);
      for (const t of remaining) {
        setMessages((p) => [...p, { role: "twin", content: t }]);
      }
    }
  }, []);

  const processCommand = useCallback(
    (userInput: string) => {
      const { texts, clear } = getResponses(userInput);
      if (clear) {
        setMessages([]);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        queueRef.current = [];
      }
      if (texts.length === 1) {
        typeMessage(texts[0]);
      } else {
        queueRef.current = texts.slice(1);
        typeMessage(texts[0]);
      }
    },
    [typeMessage]
  );

  useEffect(() => {
    if (!mounted || isAwake) return;

    const wake = () => {
      setIsAwake(true);
      setIsOpen(true);
      cleanup();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (
        ["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"].includes(
          e.key
        )
      )
        return;
      wake();
    };

    let moves = 0;
    const handleMove = () => {
      moves++;
      if (moves > 5) wake();
    };

    const handleTouch = () => wake();

    const cleanup = () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchstart", handleTouch);
    };

    const t = setTimeout(() => {
      document.addEventListener("keydown", handleKey);
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchstart", handleTouch, { passive: true });
    }, 2000);

    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, [mounted, isAwake]);

  useEffect(() => {
    if (isAwake && isOpen && messages.length === 0 && !greetedRef.current) {
      greetedRef.current = true;
      typeMessage(GREETING);
    }
  }, [isAwake, isOpen, messages.length, typeMessage]);

  useEffect(() => {
    if (!mounted) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [mounted, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    if (typingText !== null) skipTyping();
    setMessages((p) => [...p, { role: "user", content: trimmed }]);
    setInput("");
    processCommand(trimmed);
  };

  if (!mounted || !isAwake) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open CoreyAI assistant"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--bg-secondary)",
          border: "1px solid var(--accent-green)",
          color: "var(--accent-green)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontFamily: "inherit",
          fontWeight: 700,
          zIndex: 9999,
          animation: "fadeInUp 0.4s ease, fabGlow 3s ease-in-out infinite",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        AI
      </button>
    );
  }

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-terminal)",
        animation: "fadeInUp 0.3s ease",
      }
    : {
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 420,
        height: 520,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-terminal)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        boxShadow:
          "0 0 40px rgba(16, 185, 129, 0.1), 0 8px 32px rgba(0,0,0,0.5)",
        animation: "fadeInUp 0.3s ease",
        overflow: "hidden",
      };

  return (
    <div style={panelStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent-green)",
              boxShadow: "0 0 8px var(--accent-green)",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "var(--text-primary)",
            }}
          >
            CoreyAI
          </span>
          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
            v0.2.0
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            style={{
              background: "none",
              border: "none",
              color: soundEnabled
                ? "var(--accent-green)"
                : "var(--text-secondary)",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: 14,
              fontFamily: "inherit",
              borderRadius: 4,
              transition: "color 0.2s",
            }}
          >
            {"\u266A"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close CoreyAI"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: 18,
              fontFamily: "inherit",
              lineHeight: 1,
              borderRadius: 4,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {"\u00D7"}
          </button>
        </div>
      </div>

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
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 13,
              lineHeight: 1.6,
              color:
                msg.role === "user"
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <span
              style={{
                color:
                  msg.role === "user"
                    ? "var(--accent-blue)"
                    : "var(--accent-green)",
              }}
            >
              {msg.role === "user" ? "> " : "\u25B8 "}
            </span>
            {msg.content}
          </div>
        ))}
        {typingText !== null && (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-primary)",
            }}
          >
            <span style={{ color: "var(--accent-green)" }}>{"\u25B8 "}</span>
            {typingText}
            <span
              className="cursor-blink"
              style={{ color: "var(--accent-green)" }}
            >
              {"\u2588"}
            </span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "var(--accent-green)",
            fontSize: 13,
            marginRight: 8,
            fontWeight: 700,
          }}
        >
          {">"}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          spellCheck={false}
          autoComplete="off"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 13,
            fontFamily: "inherit",
            caretColor: "var(--accent-green)",
          }}
        />
      </form>
    </div>
  );
}
