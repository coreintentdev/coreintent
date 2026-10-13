"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

/* ─── Scroll Reveal ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useScrollReveal();
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   MINI TERMINAL — Try commands without leaving the demo page
   ═══════════════════════════════════════════════════════════════ */

const MINI_COMMANDS: Record<string, string[]> = {
  help: [
    "\x1b[36m── MINI TERMINAL ──\x1b[0m",
    "  \x1b[32mcai\x1b[0m       Core AI status",
    "  \x1b[32mbrain\x1b[0m     AI orchestra overview",
    "  \x1b[32msignals\x1b[0m   Active trading signals",
    "  \x1b[32mstatus\x1b[0m    Engine status",
    "  \x1b[32m336\x1b[0m       The signal",
    "  \x1b[32mzen\x1b[0m       Trading wisdom",
    "  \x1b[32mfortune\x1b[0m   Fortune cookie",
    "  \x1b[32mwhoami\x1b[0m    Identity",
    "  \x1b[32mclear\x1b[0m     Clear terminal",
    "\x1b[90m  Open full terminal for 100+ commands\x1b[0m",
  ],
  cai: [
    "\x1b[36m  CAI — CORE AI STATUS\x1b[0m",
    "  \x1b[33mEngine:\x1b[0m   CoreIntent v0.2.0-alpha",
    "  \x1b[33mMode:\x1b[0m     \x1b[33mPaper trading\x1b[0m",
    "  \x1b[32m●\x1b[0m Claude    — ACTIVE (deep analysis)",
    "  \x1b[32m●\x1b[0m Grok      — ACTIVE (fast signals)",
    "  \x1b[33m◐\x1b[0m Perplexity — FREE tier",
    "  \x1b[90m336 — the signal is dominant\x1b[0m",
  ],
  brain: [
    "\x1b[36m  BRAIN — AI Orchestra\x1b[0m",
    "  \x1b[32m●\x1b[0m \x1b[33mClaude\x1b[0m      Deep analysis, orchestration",
    "  \x1b[32m●\x1b[0m \x1b[33mGrok\x1b[0m        Fast signals, 60 threads",
    "  \x1b[33m◐\x1b[0m \x1b[33mPerplexity\x1b[0m  Research (free tier)",
    "  \x1b[90mBots welcome. No captcha. AI-to-AI first-class.\x1b[0m",
  ],
  status: [
    "  \x1b[32m● ENGINE ONLINE\x1b[0m",
    "  Mode:     \x1b[33mPaper Trading\x1b[0m",
    "  Signals:  \x1b[32m4 active\x1b[0m | 2 pending",
    "  Uptime:   " + Math.floor(Math.random() * 86400) + "s",
    "  Circuit:  \x1b[32mArmed\x1b[0m (threshold: 5.0%)",
  ],
  signals: [
    "\x1b[36m  ACTIVE SIGNALS\x1b[0m",
    "  \x1b[32m▲\x1b[0m BTC/USDT  \x1b[32mLONG\x1b[0m   87%  Grok+Claude",
    "  \x1b[32m▲\x1b[0m ETH/USDT  \x1b[32mLONG\x1b[0m   82%  Claude",
    "  \x1b[31m▼\x1b[0m SOL/USDT  \x1b[31mSHORT\x1b[0m  74%  Grok",
    "  \x1b[32m▲\x1b[0m AVAX/USDT \x1b[32mLONG\x1b[0m   91%  All 3 Models",
    "  \x1b[90mSimulated — paper trading mode\x1b[0m",
  ],
  "336": [
    "\x1b[32m  ██████╗ ██████╗  ██████╗\x1b[0m",
    "\x1b[32m  ╚════██║╚════██║██╔════╝\x1b[0m",
    "\x1b[32m   █████╔╝ █████╔╝███████╗\x1b[0m",
    "\x1b[32m   ╚═══██╗ ╚═══██╗██╔═══██║\x1b[0m",
    "\x1b[32m  ██████╔╝██████╔╝╚██████╔╝\x1b[0m",
    "\x1b[32m  ╚═════╝ ╚═════╝  ╚═════╝\x1b[0m",
    "  \x1b[33mTHE SIGNAL IS DOMINANT\x1b[0m",
  ],
  whoami: [
    "\x1b[36m  WHOAMI\x1b[0m",
    "  \x1b[33mName:\x1b[0m     Corey McIvor",
    "  \x1b[33mHandle:\x1b[0m   @coreintentdev",
    "  \x1b[33mBased in:\x1b[0m New Zealand",
    "  \x1b[33mBrand:\x1b[0m    Zynthio.ai",
    '  \x1b[90m"Every human needs a bot."\x1b[0m',
  ],
};

const ZEN_POOL = [
  "The impatient trader feeds the patient one.",
  "Three models disagree — that IS the signal.",
  "Your stop loss is your best friend. Respect it.",
  "The market doesn't care who built you.",
  "Paper trading teaches everything except pain.",
  "Consensus without conviction is noise.",
  "The best trade is the one you didn't take.",
];

const FORTUNE_POOL = [
  "A whale watches your position with great interest.",
  "Your next trade will be... educational.",
  "The models agree: patience is not a strategy, it's THE strategy.",
  "Today's chart pattern: a shrug emoji.",
  "Three AIs walk into a trade. Only one walks out profitable.",
  "Your portfolio's future is written in the order book.",
];

function miniAnsi(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/\x1b\[32m/g, '<span style="color:#10b981">')
    .replace(/\x1b\[33m/g, '<span style="color:#f59e0b">')
    .replace(/\x1b\[31m/g, '<span style="color:#ef4444">')
    .replace(/\x1b\[36m/g, '<span style="color:#06b6d4">')
    .replace(/\x1b\[35m/g, '<span style="color:#a855f7">')
    .replace(/\x1b\[90m/g, '<span style="color:#64748b">')
    .replace(/\x1b\[0m/g, "</span>");
}

function MiniTerminal() {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string[] }>>([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cmdHistory = useRef<string[]>([]);
  const historyIdx = useRef(-1);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;
    cmdHistory.current.unshift(trimmed);
    historyIdx.current = -1;

    if (trimmed === "clear") {
      setHistory([]);
      return;
    }

    let output: string[];
    if (MINI_COMMANDS[trimmed]) {
      output = MINI_COMMANDS[trimmed];
    } else if (trimmed === "zen") {
      output = ["\x1b[36m  ZEN\x1b[0m", `  \x1b[33m"${ZEN_POOL[Math.floor(Math.random() * ZEN_POOL.length)]}"\x1b[0m`];
    } else if (trimmed === "fortune") {
      output = ["\x1b[36m  FORTUNE\x1b[0m", `  \x1b[33m${FORTUNE_POOL[Math.floor(Math.random() * FORTUNE_POOL.length)]}\x1b[0m`];
    } else {
      output = [`  \x1b[31mUnknown:\x1b[0m ${trimmed}. Type \x1b[32mhelp\x1b[0m for commands.`, "  \x1b[90mFull terminal has 100+ commands →\x1b[0m"];
    }

    setHistory(prev => [...prev, { cmd: raw.trim(), output }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cmds = cmdHistory.current;
      if (cmds.length > 0) {
        const next = Math.min(historyIdx.current + 1, cmds.length - 1);
        historyIdx.current = next;
        setInput(cmds[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cmds = cmdHistory.current;
      const next = historyIdx.current - 1;
      if (next < 0) { historyIdx.current = -1; setInput(""); }
      else { historyIdx.current = next; setInput(cmds[next]); }
    }
  };

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
        Try The Terminal
        <span style={{ marginLeft: "8px", fontSize: "10px", color: "#10b981", fontWeight: "normal", textTransform: "none" }}>interactive</span>
      </h2>
      <div className="mini-terminal-wrap">
        <div className="mini-terminal-inner">
          {/* Title bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#161b22", borderBottom: "1px solid #21262d" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
            </div>
            <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "8px" }}>commander@coreintent ~ mini</span>
          </div>
          {/* Output + input */}
          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            style={{ padding: "12px 16px", maxHeight: "280px", overflowY: "auto", cursor: "text", minHeight: "120px" }}
          >
            {/* Welcome */}
            {history.length === 0 && (
              <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                <div style={{ color: "#06b6d4", fontWeight: "bold" }}>Zynthio Commander — Mini Terminal</div>
                <div style={{ color: "#64748b" }}>Type <span style={{ color: "#10b981" }}>help</span> for commands. Try <span style={{ color: "#10b981" }}>cai</span>, <span style={{ color: "#10b981" }}>brain</span>, or <span style={{ color: "#10b981" }}>336</span>.</div>
              </div>
            )}
            {/* History */}
            {history.map((entry, i) => (
              <div key={i} className="term-output-line" style={{ marginTop: i === 0 && history.length === 1 ? "8px" : "6px" }}>
                <div style={{ fontSize: "12px" }}>
                  <span style={{ color: "#10b981" }}>❯</span>{" "}
                  <span style={{ color: "#e2e8f0" }}>{entry.cmd}</span>
                </div>
                <div style={{ fontSize: "12px", lineHeight: "1.5", marginTop: "2px" }}>
                  {entry.output.map((line, j) => (
                    <div key={j} dangerouslySetInnerHTML={{ __html: miniAnsi(line) }} style={{ whiteSpace: "pre" }} />
                  ))}
                </div>
              </div>
            ))}
            {/* Input line */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "12px" }}>
              <span style={{ color: "#10b981" }}>❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? "" : "type a command..."}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e2e8f0",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  padding: 0,
                  caretColor: "#10b981",
                }}
              />
              {focused && !input && <span className="term-cursor" />}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
          Mini preview — {Object.keys(MINI_COMMANDS).length + 2} commands available
        </span>
        <Link
          href="/"
          style={{ fontSize: "10px", color: "#10b981", textDecoration: "none" }}
        >
          Open full terminal (100+ commands) →
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENARIO SIMULATOR — Pick a market event, watch AI react
   ═══════════════════════════════════════════════════════════════ */

const SCENARIOS = [
  {
    id: "crash",
    name: "Flash Crash",
    icon: "⚡",
    accent: "#ef4444",
    desc: "BTC drops 12% in 5 minutes",
    responses: [
      { model: "Grok", color: "#ef4444", text: "ALERT: Cascading liquidations detected. $2.1B longs wiped. Funding rate inverted. Extreme fear.", delay: 0 },
      { model: "Claude", color: "#a855f7", text: "Circuit breaker engaged. Historical analysis: 73% of flash crashes recover 60%+ within 4 hours. Reducing position size to 2%.", delay: 1200 },
      { model: "Perplexity", color: "#3b82f6", text: "No regulatory news. Exchange APIs stable. Likely algorithmic cascade — whale wallet moved 8,400 BTC pre-crash.", delay: 2400 },
      { model: "Engine", color: "#10b981", text: "DECISION: HOLD positions. Set staggered limit buys at -15%, -18%, -22%. Risk: ELEVATED. No panic selling.", delay: 3600 },
    ],
  },
  {
    id: "whale",
    name: "Whale Alert",
    icon: "🐋",
    accent: "#3b82f6",
    desc: "50,000 ETH moved to exchange",
    responses: [
      { model: "Grok", color: "#ef4444", text: "Whale wallet 0x7a9f...3e2b transferred 50,000 ETH ($164M) to Binance hot wallet. Historically bearish signal.", delay: 0 },
      { model: "Claude", color: "#a855f7", text: "Context check: This wallet is a known market maker. Previous large deposits were followed by OTC deals, not spot selling. Confidence in bearish thesis: 34%.", delay: 1200 },
      { model: "Perplexity", color: "#3b82f6", text: "Cross-referencing: Ethereum Foundation hasn't sold. No upcoming unlock events. Binance ETH reserves still below 30-day average.", delay: 2400 },
      { model: "Engine", color: "#10b981", text: "DECISION: HOLD. Signal overridden — market maker activity, not distribution. Tighten stops to -3% as precaution.", delay: 3600 },
    ],
  },
  {
    id: "bull",
    name: "Bull Breakout",
    icon: "🚀",
    accent: "#10b981",
    desc: "BTC breaks all-time high with volume",
    responses: [
      { model: "Grok", color: "#ef4444", text: "BREAKOUT CONFIRMED. BTC above $73,800 on 3.2x average volume. Social sentiment: euphoria. Google Trends spiking.", delay: 0 },
      { model: "Claude", color: "#a855f7", text: "Technical: Clean break above resistance with no bearish divergence. Fibonacci extension targets $82,400. Risk/reward: 4.1:1. Position sizing: 8% portfolio.", delay: 1200 },
      { model: "Perplexity", color: "#3b82f6", text: "Spot ETF inflows hit $1.2B today — highest since launch. Institutional FOMO confirmed. No negative regulatory catalysts in pipeline.", delay: 2400 },
      { model: "Engine", color: "#10b981", text: "DECISION: LONG BTC/USDT. Consensus: 94%. Entry: $73,800. Target: $82,400. Stop: $71,200. All three models aligned.", delay: 3600 },
    ],
  },
  {
    id: "blackswan",
    name: "Black Swan",
    icon: "🦢",
    accent: "#a855f7",
    desc: "Major exchange halts withdrawals",
    responses: [
      { model: "Grok", color: "#ef4444", text: "CRITICAL: Major exchange suspends all withdrawals citing 'technical maintenance'. Social media exploding. FUD level: maximum.", delay: 0 },
      { model: "Claude", color: "#a855f7", text: "Risk assessment: CRITICAL. Exposure analysis — 0% of portfolio on affected exchange. But contagion risk is real. Reducing all positions by 50% immediately.", delay: 1200 },
      { model: "Perplexity", color: "#3b82f6", text: "Fact-check: Exchange proof-of-reserves last updated 72h ago. Chainalysis shows unusual outflows past 48h. Pattern matches historical insolvency events.", delay: 2400 },
      { model: "Engine", color: "#10b981", text: "DECISION: DEFENSIVE. Reduce all positions 50%. Move remaining to cold storage signals. Circuit breaker: TRIPPED. No new trades until resolved.", delay: 3600 },
    ],
  },
];

function ScenarioSimulator() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [visibleResponses, setVisibleResponses] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runScenario = useCallback((id: string) => {
    if (isPlaying) return;
    setActiveScenario(id);
    setVisibleResponses(0);
    setIsPlaying(true);

    const scenario = SCENARIOS.find(s => s.id === id)!;
    scenario.responses.forEach((r, i) => {
      setTimeout(() => {
        setVisibleResponses(i + 1);
        if (i === scenario.responses.length - 1) {
          setTimeout(() => setIsPlaying(false), 1000);
        }
      }, r.delay);
    });
  }, [isPlaying]);

  const active = SCENARIOS.find(s => s.id === activeScenario);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "4px" }}>
        Scenario Simulator
        <span style={{ marginLeft: "8px", fontSize: "10px", color: "#f59e0b", fontWeight: "normal", textTransform: "none" }}>interactive</span>
      </h2>
      <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        Pick a market event. Watch three AI models analyze and respond in real-time.
      </p>

      <div className="scenario-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            className={`scenario-btn${activeScenario === s.id ? " active" : ""}`}
            style={{
              "--btn-accent": s.accent,
              padding: "16px 12px",
              borderRadius: "10px",
              fontFamily: "inherit",
              textAlign: "center",
              opacity: isPlaying && activeScenario !== s.id ? 0.4 : 1,
              transition: "all 0.3s ease",
            } as React.CSSProperties}
            onClick={() => runScenario(s.id)}
            disabled={isPlaying}
          >
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: s.accent, marginBottom: "4px" }}>{s.name}</div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)", lineHeight: "1.3" }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {active && visibleResponses > 0 && (
        <div
          className="scenario-result"
          style={{
            background: "var(--bg-secondary)",
            border: `1px solid ${active.accent}33`,
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "11px", color: active.accent, fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{active.icon}</span>
            <span>SCENARIO: {active.name}</span>
            {isPlaying && (
              <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: active.accent, marginLeft: 4 }} />
            )}
          </div>

          {active.responses.slice(0, visibleResponses).map((r, i) => (
            <div
              key={i}
              className="scenario-result"
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "10px",
                padding: "12px 14px",
                background: r.model === "Engine" ? "#10b98110" : "var(--bg-primary)",
                borderRadius: "8px",
                borderLeft: `3px solid ${r.color}`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `${r.color}22`, border: `1px solid ${r.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold", color: r.color, flexShrink: 0,
              }}>
                {r.model[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: r.color, marginBottom: "2px" }}>{r.model}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>{r.text}</div>
              </div>
            </div>
          ))}

          {isPlaying && visibleResponses < active.responses.length && (
            <div style={{ padding: "10px 14px", display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "10px" }}>AI</span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0, 1, 2].map(d => (
                  <span key={d} className="animate-pulse" style={{
                    width: 5, height: 5, borderRadius: "50%", background: "var(--text-secondary)",
                    display: "inline-block", animationDelay: `${d * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!activeScenario && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
          borderRadius: "10px", color: "var(--text-secondary)", fontSize: "12px",
        }}>
          Select a scenario above to see how three AI models respond to market events
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIGNAL LIFECYCLE — Animated timeline of a signal's journey
   ═══════════════════════════════════════════════════════════════ */

const LIFECYCLE_STEPS = [
  { label: "Detection", model: "Grok", color: "#ef4444", icon: "⚡", detail: "Pattern identified on 4H chart" },
  { label: "Deep Analysis", model: "Claude", color: "#a855f7", icon: "🧠", detail: "Risk/reward calculated, position sized" },
  { label: "Fact-Check", model: "Perplexity", color: "#3b82f6", icon: "🔍", detail: "News & fundamentals verified" },
  { label: "Consensus", model: "Engine", color: "#10b981", icon: "⚙️", detail: "Weighted vote from all models" },
  { label: "Execution", model: "Paper Trade", color: "#f59e0b", icon: "📊", detail: "Order placed in paper portfolio" },
];

const LIFECYCLE_PAIRS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"];
const LIFECYCLE_DIRS = ["LONG", "LONG", "SHORT", "LONG"];
const LIFECYCLE_CONFS = [87, 82, 74, 91];

function SignalLifecycle() {
  const [activeStep, setActiveStep] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const [signalPair, setSignalPair] = useState("BTC/USDT");

  useEffect(() => {
    let step = -1;
    setActiveStep(-1);
    setSignalPair(LIFECYCLE_PAIRS[cycle % LIFECYCLE_PAIRS.length]);

    const iv = setInterval(() => {
      step++;
      if (step >= LIFECYCLE_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => setCycle(c => c + 1), 3000);
        return;
      }
      setActiveStep(step);
    }, 1200);

    return () => clearInterval(iv);
  }, [cycle]);

  const dir = LIFECYCLE_DIRS[cycle % LIFECYCLE_DIRS.length];
  const conf = LIFECYCLE_CONFS[cycle % LIFECYCLE_CONFS.length];
  const dirColor = dir === "LONG" ? "#10b981" : "#ef4444";

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
        Signal Lifecycle
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
      </h2>

      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
        borderRadius: "10px", padding: "24px",
      }}>
        {/* Signal header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "20px", padding: "10px 16px",
          background: "var(--bg-primary)", borderRadius: "8px",
          border: `1px solid ${dirColor}33`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)" }}>{signalPair}</span>
            <span style={{
              fontSize: "11px", padding: "2px 10px", borderRadius: "4px",
              background: `${dirColor}22`, color: dirColor, fontWeight: "bold",
            }}>
              {dir === "LONG" ? "▲" : "▼"} {dir}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>Confidence</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: conf >= 80 ? "#10b981" : "#f59e0b" }}>
              {activeStep >= 3 ? `${conf}%` : activeStep >= 0 ? "..." : "—"}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {LIFECYCLE_STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            const isPending = i > activeStep;

            return (
              <div key={step.label}>
                {/* Step row */}
                <div
                  className={isDone || isActive ? "lifecycle-step" : ""}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    opacity: isPending ? 0.3 : 1,
                    transition: "opacity 0.4s ease",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div
                    className={`lifecycle-node${isActive ? " active" : ""}`}
                    style={{
                      "--node-color": step.color,
                      background: isDone ? step.color : isActive ? `${step.color}33` : "var(--bg-primary)",
                      border: `2px solid ${isDone || isActive ? step.color : "var(--border-color)"}`,
                      color: isDone ? "#fff" : step.color,
                    } as React.CSSProperties}
                  >
                    {isDone ? "✓" : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: isDone || isActive ? step.color : "var(--text-secondary)" }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--text-secondary)", padding: "1px 6px", background: "var(--bg-primary)", borderRadius: "3px" }}>
                        {step.model}
                      </span>
                      {isActive && (
                        <span className="animate-pulse" style={{ fontSize: "10px", color: step.color }}>processing...</span>
                      )}
                      {isDone && (
                        <span style={{ fontSize: "10px", color: "#10b981" }}>complete</span>
                      )}
                    </div>
                    {(isDone || isActive) && (
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {step.detail}
                      </div>
                    )}
                  </div>
                  {(isDone || isActive) && (
                    <div style={{
                      fontSize: "10px", color: "var(--text-secondary)",
                      padding: "2px 8px", background: "var(--bg-primary)",
                      borderRadius: "4px",
                    }}>
                      {isDone ? `${(Math.random() * 200 + 100).toFixed(0)}ms` : isActive ? "..." : ""}
                    </div>
                  )}
                </div>
                {/* Connector */}
                {i < LIFECYCLE_STEPS.length - 1 && (
                  <div
                    className={`lifecycle-connector${isDone ? " active" : ""}`}
                    style={{
                      "--conn-from": step.color,
                      "--conn-to": LIFECYCLE_STEPS[i + 1].color,
                      height: "20px",
                    } as React.CSSProperties}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: "10px", color: "var(--text-secondary)", textAlign: "center", marginTop: "16px" }}>
          Signal #{847 + cycle} — Auto-cycles through trading pairs. Simulated data.
        </div>
      </div>
    </section>
  );
}

/* ─── Model Agreement Matrix ─── */
function ModelAgreement() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const models = ["Grok", "Claude", "Perplexity"];
  const colors = ["#ef4444", "#a855f7", "#3b82f6"];
  const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"];

  const signals = pairs.map((pair, pi) => {
    const seed = pi * 7 + tick;
    return {
      pair,
      models: models.map((_, mi) => {
        const val = Math.sin(seed * 0.3 + mi * 2.1) * 0.5 + 0.5;
        return val > 0.55 ? "LONG" as const : val < 0.45 ? "SHORT" as const : "HOLD" as const;
      }),
    };
  });

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          marginBottom: "12px",
        }}
      >
        Model Agreement Matrix
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
      </h2>
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(3, 1fr) 80px", gap: "8px", alignItems: "center" }}>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)" }} />
          {models.map((m, i) => (
            <div key={m} style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: colors[i] }}>{m}</div>
          ))}
          <div style={{ textAlign: "center", fontSize: "10px", color: "var(--text-secondary)" }}>CONSENSUS</div>

          {signals.map((sig) => {
            const agreement = sig.models.every((m) => m === sig.models[0]);
            const majority = sig.models.filter((m) => m === sig.models[0]).length >= 2
              || sig.models.filter((m) => m === "LONG").length >= 2
              || sig.models.filter((m) => m === "SHORT").length >= 2;
            return (
              <div key={sig.pair} style={{ display: "contents" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-primary)" }}>{sig.pair}</div>
                {sig.models.map((signal, mi) => {
                  const bg = signal === "LONG" ? "#10b98118" : signal === "SHORT" ? "#ef444418" : "#f59e0b18";
                  const color = signal === "LONG" ? "#10b981" : signal === "SHORT" ? "#ef4444" : "#f59e0b";
                  return (
                    <div
                      key={mi}
                      style={{
                        textAlign: "center",
                        padding: "6px 8px",
                        background: bg,
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color,
                        transition: "all 0.5s ease",
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {signal === "LONG" ? "▲" : signal === "SHORT" ? "▼" : "●"} {signal}
                    </div>
                  );
                })}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: agreement ? "#10b981" : majority ? "#f59e0b" : "#ef4444",
                    padding: "6px",
                    background: agreement ? "#10b98112" : majority ? "#f59e0b12" : "#ef444412",
                    borderRadius: "6px",
                    transition: "all 0.5s ease",
                  }}
                >
                  {agreement ? "3/3" : majority ? "2/3" : "SPLIT"}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "12px", fontSize: "10px", color: "var(--text-secondary)", textAlign: "center" }}>
          Models update independently. Green = consensus. Yellow = majority. Red = split decision.
        </div>
      </div>
    </section>
  );
}

/* ─── DEMO DATA — Simulated, not real trading ─── */

const TOKENS = [
  { symbol: "BTC", name: "Bitcoin", basePrice: 67420, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", basePrice: 3285, color: "#627eea" },
  { symbol: "SOL", name: "Solana", basePrice: 142.8, color: "#14f195" },
  { symbol: "AVAX", name: "Avalanche", basePrice: 35.6, color: "#e84142" },
];

const SIGNAL_POOL = [
  { pair: "BTC/USDT", direction: "long" as const, confidence: 0.87, source: "Grok + Claude" },
  { pair: "ETH/USDT", direction: "long" as const, confidence: 0.82, source: "Claude" },
  { pair: "SOL/USDT", direction: "short" as const, confidence: 0.74, source: "Grok" },
  { pair: "AVAX/USDT", direction: "long" as const, confidence: 0.91, source: "All 3 Models" },
  { pair: "BTC/USDT", direction: "long" as const, confidence: 0.79, source: "Perplexity" },
  { pair: "ETH/USDT", direction: "short" as const, confidence: 0.68, source: "Claude" },
];

const CHART_Y = [
  150, 130, 140, 100, 110, 70, 80, 50, 60, 30,
  40, 20, 35, 25, 45, 30, 50, 35, 20, 28,
];

const DEBATES = [
  [
    { model: "Grok", color: "#ef4444", text: "BTC showing bullish divergence on 4H. RSI recovering from oversold. Entry looks clean — 87% confidence." },
    { model: "Claude", color: "#a855f7", text: "Hold on — volume is declining on this bounce. Previous resistance at $68,200 hasn't been tested. Risk/reward is thin." },
    { model: "Perplexity", color: "#3b82f6", text: "Latest Fed minutes suggest no rate cut until Q3. Institutional inflows slowed 12% this week per CoinShares data." },
    { model: "Grok", color: "#ef4444", text: "Fair points. Adjusting confidence from 87% to 72%. Still long-biased but smaller position." },
    { model: "Claude", color: "#a855f7", text: "Agreed — wait for clean break above $68,200 with volume confirmation. Setting alert." },
    { model: "Engine", color: "#10b981", text: "DECISION: HOLD. Consensus incomplete. Alert set at $68,200 breakout with volume > 1.5x avg." },
  ],
  [
    { model: "Grok", color: "#ef4444", text: "SOL breaking out of descending wedge on high volume. NFT activity spiking across Tensor." },
    { model: "Claude", color: "#a855f7", text: "Pattern confirmed. Fibonacci extension targets $158. Risk/reward 3.2:1 at current levels." },
    { model: "Perplexity", color: "#3b82f6", text: "Solana ecosystem TVL up 23% this month. Jupiter DEX volume hit ATH yesterday. Fundamentals support it." },
    { model: "Grok", color: "#ef4444", text: "All three aligned. Confidence: 91%. This is the signal." },
    { model: "Claude", color: "#a855f7", text: "Concur. Position size: 8% of portfolio. Stop loss at $134.50 (-5.8%)." },
    { model: "Engine", color: "#10b981", text: "DECISION: LONG SOL/USDT. Consensus: 91%. Entry: $142.80. Target: $158.00. Stop: $134.50." },
  ],
];

function AIDebate() {
  const [messages, setMessages] = useState<Array<{ model: string; color: string; text: string }>>([]);
  const [debateIdx, setDebateIdx] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const debate = DEBATES[debateIdx % DEBATES.length];
    setMessages([]);
    let idx = 0;

    const addNext = () => {
      if (idx >= debate.length) {
        setTyping(false);
        const timeout = setTimeout(() => setDebateIdx((prev) => prev + 1), 8000);
        return () => clearTimeout(timeout);
      }
      setTyping(true);
      const delay = setTimeout(() => {
        setMessages((prev) => [...prev, debate[idx]]);
        setTyping(false);
        idx++;
        setTimeout(addNext, 800);
      }, 1800);
      return () => clearTimeout(delay);
    };

    const start = setTimeout(addNext, 1000);
    return () => clearTimeout(start);
  }, [debateIdx]);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          marginBottom: "12px",
        }}
      >
        AI Model Debate
        <span style={{ marginLeft: "8px", fontSize: "10px", color: "var(--accent-green)" }}>LIVE</span>
      </h2>
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "20px",
          minHeight: "280px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginBottom: "16px",
            padding: "8px 12px",
            background: "var(--bg-primary)",
            borderRadius: "6px",
            borderLeft: "3px solid var(--accent-blue)",
          }}
        >
          Three models. One trade decision. Watch them argue.
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className="signal-flash"
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "12px",
              padding: "10px 14px",
              background: m.model === "Engine" ? "#10b98112" : "var(--bg-primary)",
              borderRadius: "8px",
              borderLeft: `3px solid ${m.color}`,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `${m.color}22`,
                border: `1px solid ${m.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                color: m.color,
                flexShrink: 0,
              }}
            >
              {m.model[0]}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: m.color, marginBottom: "2px" }}>
                {m.model}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                {m.text}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ padding: "10px 14px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "10px" }}>AI</span>
            </div>
            <div>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {messages.length === 0 && !typing && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: "12px" }}>
            Debate starting...
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Order Book + Neural Activity ─── */
function OrderBookAndNeural() {
  const [book, setBook] = useState(() => generateBook());
  const [neuralPulse, setNeuralPulse] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setBook(generateBook()), 800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNeuralPulse((p) => (p + 1) % 100), 100);
    return () => clearInterval(iv);
  }, []);

  const spread = (book.asks[0].price - book.bids[0].price).toFixed(2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
      {/* Order Book */}
      <section>
        <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Order Book (Simulated)
          <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
        </h2>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase" }}>
            <span>Price</span><span>Size</span><span>Total</span>
          </div>
          {book.asks.slice().reverse().map((o, i) => (
            <div key={`a${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(o.total / book.maxTotal) * 100}%`, background: "#ef444412", borderRadius: "2px" }} />
              <span style={{ color: "#ef4444", zIndex: 1 }}>${o.price.toLocaleString()}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.size.toFixed(4)}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.total.toFixed(4)}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: "6px 0", fontSize: "13px", fontWeight: "bold", color: "#10b981", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", margin: "4px 0" }}>
            Spread: ${spread}
          </div>
          {book.bids.map((o, i) => (
            <div key={`b${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(o.total / book.maxTotal) * 100}%`, background: "#10b98112", borderRadius: "2px" }} />
              <span style={{ color: "#10b981", zIndex: 1 }}>${o.price.toLocaleString()}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.size.toFixed(4)}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.total.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Neural Activity */}
      <section>
        <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Neural Activity
        </h2>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px" }}>
          <svg viewBox="0 0 300 200" style={{ width: "100%", height: "auto" }}>
            {[
              { label: "Grok", x: 60, y: 50, color: "#ef4444" },
              { label: "Claude", x: 60, y: 150, color: "#a855f7" },
              { label: "Perplexity", x: 240, y: 50, color: "#3b82f6" },
              { label: "Consensus", x: 240, y: 150, color: "#10b981" },
            ].map((node, ni) => {
              const connections = ni < 3 ? [3] : [];
              return (
                <g key={node.label}>
                  {connections.map((ci) => {
                    const target = [{ x: 60, y: 50 }, { x: 60, y: 150 }, { x: 240, y: 50 }, { x: 240, y: 150 }][ci];
                    const progress = ((neuralPulse + ni * 25) % 50) / 50;
                    const px = node.x + (target.x - node.x) * progress;
                    const py = node.y + (target.y - node.y) * progress;
                    return (
                      <g key={`c${ni}-${ci}`}>
                        <line x1={node.x} y1={node.y} x2={target.x} y2={target.y} stroke={node.color} strokeOpacity={0.2} strokeWidth={1} />
                        <circle cx={px} cy={py} r={3} fill={node.color} opacity={0.8} />
                      </g>
                    );
                  })}
                  <circle cx={node.x} cy={node.y} r={20} fill="none" stroke={node.color} strokeWidth={1.5} opacity={0.5 + Math.sin(neuralPulse * 0.08 + ni) * 0.3} />
                  <circle cx={node.x} cy={node.y} r={8} fill={node.color} opacity={0.3} />
                  <text x={node.x} y={node.y + 36} textAnchor="middle" fill={node.color} fontSize={9} fontFamily="monospace">{node.label}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "8px" }}>
            {["Grok", "Claude", "Perplexity", "Engine"].map((name, i) => {
              const colors = ["#ef4444", "#a855f7", "#3b82f6", "#10b981"];
              const activity = 40 + Math.sin(neuralPulse * 0.06 + i * 1.5) * 30 + Math.random() * 10;
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: colors[i], marginBottom: "4px" }}>{name}</div>
                  <div style={{ height: "4px", background: "var(--bg-primary)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${activity}%`, background: colors[i], borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Risk Gauge — Animated SVG semicircular gauge ─── */
function RiskGauge({ grok, claude, perplexity }: { grok: number; claude: number; perplexity: number }) {
  const overall = Math.round((grok + claude + perplexity) / 3);
  const riskScore = 100 - overall;
  const label = riskScore < 25 ? "LOW" : riskScore < 50 ? "MODERATE" : riskScore < 75 ? "ELEVATED" : "CRITICAL";
  const labelColor = riskScore < 25 ? "#10b981" : riskScore < 50 ? "#3b82f6" : riskScore < 75 ? "#f59e0b" : "#ef4444";

  const cx = 120;
  const cy = 100;
  const r = 80;
  const startAngle = Math.PI;
  const needleAngle = startAngle - (riskScore / 100) * Math.PI;
  const nx = cx + Math.cos(needleAngle) * (r - 10);
  const ny = cy - Math.sin(needleAngle) * (r - 10);

  const arcPath = (start: number, end: number) => {
    const sx = cx + Math.cos(start) * r;
    const sy = cy - Math.sin(start) * r;
    const ex = cx + Math.cos(end) * r;
    const ey = cy - Math.sin(end) * r;
    const sweep = start > end ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${ex} ${ey}`;
  };

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
        Risk Assessment Gauge
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: labelColor, marginLeft: 8, verticalAlign: "middle" }} />
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg viewBox="0 0 240 130" style={{ width: "100%", maxWidth: "280px", height: "auto" }}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="33%" stopColor="#3b82f6" />
                <stop offset="66%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path d={arcPath(startAngle, 0)} fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
            <path d={arcPath(startAngle, 0)} fill="none" stroke="url(#riskGrad)" strokeWidth="10" strokeLinecap="round" opacity={0.8} />
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={labelColor} strokeWidth="3" strokeLinecap="round" style={{ transition: "all 0.8s ease-out", filter: `drop-shadow(0 0 4px ${labelColor})` }} />
            <circle cx={cx} cy={cy} r="6" fill={labelColor} style={{ filter: `drop-shadow(0 0 6px ${labelColor})` }} />
            <text x={cx} y={cy + 24} textAnchor="middle" fill={labelColor} fontSize="18" fontWeight="bold" fontFamily="monospace">{label}</text>
            <text x={cx} y={cy + 38} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">Score: {riskScore}/100</text>
            <text x={40} y={cy + 12} textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">LOW</text>
            <text x={200} y={cy + 12} textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">HIGH</text>
          </svg>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px", letterSpacing: "0.5px" }}>Model Confidence Breakdown</div>
          {[
            { name: "Grok", value: grok, color: "#ef4444" },
            { name: "Claude", value: claude, color: "#a855f7" },
            { name: "Perplexity", value: perplexity, color: "#3b82f6" },
          ].map((m) => (
            <div key={m.name} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: m.color, fontWeight: "bold" }}>{m.name}</span>
                <span style={{ fontSize: "12px", color: m.color }}>{m.value}%</span>
              </div>
              <div style={{ height: "6px", background: "#1e293b", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${m.value}%`, background: m.color, borderRadius: "3px", transition: "width 0.8s ease-out", boxShadow: `0 0 8px ${m.color}66` }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: "16px", padding: "10px", background: "var(--bg-primary)", borderRadius: "6px", border: `1px solid ${labelColor}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Engine Verdict</span>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: labelColor }}>
                {overall >= 80 ? "STRONG BUY" : overall >= 65 ? "BUY" : overall >= 50 ? "HOLD" : "SELL"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", textAlign: "center", marginTop: "8px" }}>
        Risk score derived from inverse model confidence. Updates in real-time. Simulated data.
      </div>
    </section>
  );
}

/* ─── Visual Market Depth ─── */
function VisualDepth() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(iv);
  }, []);

  const basePrice = 67420;
  const levels = 10;
  const bids: Array<{ price: number; size: number }> = [];
  const asks: Array<{ price: number; size: number }> = [];

  for (let i = 0; i < levels; i++) {
    const seed = tick * 0.1 + i;
    const bidSize = 0.5 + Math.abs(Math.sin(seed * 1.3 + i)) * 4;
    const askSize = 0.5 + Math.abs(Math.sin(seed * 1.7 + i + 3)) * 4;
    bids.push({ price: basePrice - (i + 1) * 12 - Math.random() * 5, size: bidSize });
    asks.push({ price: basePrice + (i + 1) * 12 + Math.random() * 5, size: askSize });
  }

  const maxSize = Math.max(...bids.map((b) => b.size), ...asks.map((a) => a.size));
  const bidTotal = bids.reduce((a, b) => a + b.size, 0);
  const askTotal = asks.reduce((a, b) => a + b.size, 0);
  const imbalance = ((bidTotal - askTotal) / (bidTotal + askTotal) * 100);

  const svgW = 500;
  const svgH = 200;
  const midX = svgW / 2;
  const barH = svgH / levels - 2;

  let bidCumulative = 0;
  let askCumulative = 0;
  const bidCum = bids.map((b) => { bidCumulative += b.size; return bidCumulative; });
  const askCum = asks.map((a) => { askCumulative += a.size; return askCumulative; });
  const maxCum = Math.max(bidCumulative, askCumulative);

  const bidAreaPoints = bids.map((_, i) => {
    const x = midX - (bidCum[i] / maxCum) * (midX - 20);
    const y = 10 + i * (svgH / levels) + barH / 2;
    return `${x},${y}`;
  });
  const askAreaPoints = asks.map((_, i) => {
    const x = midX + (askCum[i] / maxCum) * (midX - 20);
    const y = 10 + i * (svgH / levels) + barH / 2;
    return `${x},${y}`;
  });

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
        Market Depth Visualization
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
      </h2>
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="bidFill" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="askFill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <line x1={midX} y1="0" x2={midX} y2={svgH} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <text x={midX} y={svgH - 2} textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">
            ${basePrice.toLocaleString()}
          </text>
          <polygon points={`${midX},${10 + barH / 2} ${bidAreaPoints.join(" ")} ${bidAreaPoints[bidAreaPoints.length - 1].split(",")[0]},${svgH - 10} ${midX},${svgH - 10}`}
            fill="url(#bidFill)" stroke="#10b981" strokeWidth="1.5" opacity="0.8"
            style={{ transition: "all 0.5s ease" }} />
          <polygon points={`${midX},${10 + barH / 2} ${askAreaPoints.join(" ")} ${askAreaPoints[askAreaPoints.length - 1].split(",")[0]},${svgH - 10} ${midX},${svgH - 10}`}
            fill="url(#askFill)" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"
            style={{ transition: "all 0.5s ease" }} />
          {bids.map((b, i) => {
            const w = (b.size / maxSize) * (midX - 40);
            const y = 10 + i * (svgH / levels);
            return (
              <g key={`bid-${i}`}>
                <rect x={midX - w - 4} y={y} width={w} height={barH} fill="#10b981" opacity="0.15" rx="2"
                  style={{ transition: "all 0.5s ease" }} />
                <text x={midX - w - 8} y={y + barH / 2 + 3} textAnchor="end" fill="#10b981" fontSize="7" fontFamily="monospace">
                  {b.size.toFixed(2)}
                </text>
              </g>
            );
          })}
          {asks.map((a, i) => {
            const w = (a.size / maxSize) * (midX - 40);
            const y = 10 + i * (svgH / levels);
            return (
              <g key={`ask-${i}`}>
                <rect x={midX + 4} y={y} width={w} height={barH} fill="#ef4444" opacity="0.15" rx="2"
                  style={{ transition: "all 0.5s ease" }} />
                <text x={midX + w + 12} y={y + barH / 2 + 3} textAnchor="start" fill="#ef4444" fontSize="7" fontFamily="monospace">
                  {a.size.toFixed(2)}
                </text>
              </g>
            );
          })}
          <text x="20" y="14" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">BIDS</text>
          <text x={svgW - 20} y="14" textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace">ASKS</text>
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "11px" }}>
          <span style={{ color: "#10b981" }}>Bid Volume: {bidTotal.toFixed(2)} BTC</span>
          <span style={{ color: imbalance > 0 ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
            Imbalance: {imbalance > 0 ? "+" : ""}{imbalance.toFixed(1)}% {imbalance > 10 ? "(Bullish)" : imbalance < -10 ? "(Bearish)" : "(Neutral)"}
          </span>
          <span style={{ color: "#ef4444" }}>Ask Volume: {askTotal.toFixed(2)} BTC</span>
        </div>
      </div>
    </section>
  );
}

function generateBook() {
  const mid = 67420 + (Math.random() - 0.5) * 200;
  const asks: Array<{ price: number; size: number; total: number }> = [];
  const bids: Array<{ price: number; size: number; total: number }> = [];
  let askTotal = 0;
  let bidTotal = 0;
  for (let i = 0; i < 8; i++) {
    const askSize = +(Math.random() * 2 + 0.1).toFixed(4);
    askTotal += askSize;
    asks.push({ price: +(mid + (i + 1) * 5 + Math.random() * 3).toFixed(2), size: askSize, total: +askTotal.toFixed(4) });
    const bidSize = +(Math.random() * 2 + 0.1).toFixed(4);
    bidTotal += bidSize;
    bids.push({ price: +(mid - (i + 1) * 5 - Math.random() * 3).toFixed(2), size: bidSize, total: +bidTotal.toFixed(4) });
  }
  const maxTotal = Math.max(askTotal, bidTotal);
  return { asks, bids, maxTotal };
}

/* ─── Live Candlestick Chart ─── */
function LiveCandlestickChart() {
  const [candles, setCandles] = useState<Array<{
    open: number; close: number; high: number; low: number; ts: number;
  }>>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxCandles = 24;

  useEffect(() => {
    let price = 67420;
    const initial: typeof candles = [];
    for (let i = 0; i < 12; i++) {
      const open = price;
      const move = (Math.random() - 0.45) * 400;
      const close = open + move;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      initial.push({ open, close, high, low, ts: Date.now() - (12 - i) * 60000 });
      price = close;
    }
    setCandles(initial);

    const iv = setInterval(() => {
      setCandles(prev => {
        const last = prev[prev.length - 1];
        const lastClose = last ? last.close : 67420;
        const open = lastClose;
        const move = (Math.random() - 0.45) * 350;
        const close = open + move;
        const high = Math.max(open, close) + Math.random() * 180;
        const low = Math.min(open, close) - Math.random() * 180;
        const next = [...prev, { open, close, high, low, ts: Date.now() }];
        return next.slice(-maxCandles);
      });
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  if (candles.length === 0) return null;

  const svgW = 600;
  const svgH = 200;
  const pad = 16;
  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 1;
  const toY = (p: number) => pad + (1 - (p - minP) / range) * (svgH - pad * 2);
  const candleW = Math.max(4, (svgW - pad * 2) / candles.length - 2);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{
        fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)",
        letterSpacing: "0.5px", marginBottom: "12px",
      }}>
        Live Candlestick Chart (BTC/USDT)
        <span className="animate-pulse" style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: "#10b981", marginLeft: 8, verticalAlign: "middle",
        }} />
      </h2>
      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
        borderRadius: "10px", padding: "20px", position: "relative",
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="candleGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.08} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(pct => {
            const price = minP + range * (1 - pct);
            return (
              <g key={pct}>
                <line x1={pad} y1={svgH * pct} x2={svgW - pad} y2={svgH * pct}
                  stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
                <text x={svgW - pad + 4} y={svgH * pct + 3} fill="#64748b" fontSize="8"
                  fontFamily="monospace">${Math.round(price).toLocaleString()}</text>
              </g>
            );
          })}
          {/* Candles */}
          {candles.map((c, i) => {
            const x = pad + (i / candles.length) * (svgW - pad * 2) + candleW / 2;
            const isGreen = c.close >= c.open;
            const color = isGreen ? "#10b981" : "#ef4444";
            const bodyTop = toY(Math.max(c.open, c.close));
            const bodyBot = toY(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBot - bodyTop);
            const isHovered = hoveredIdx === i;
            const isLatest = i === candles.length - 1;
            return (
              <g key={`${c.ts}-${i}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "crosshair" }}>
                {/* Wick */}
                <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)}
                  stroke={color} strokeWidth={1} opacity={isHovered ? 1 : 0.7} />
                {/* Body */}
                <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH}
                  fill={isGreen ? color : color} stroke={color} strokeWidth={0.5}
                  opacity={isHovered ? 1 : 0.85}
                  rx={1} />
                {/* Glow on latest */}
                {isLatest && (
                  <rect x={x - candleW / 2 - 2} y={bodyTop - 2} width={candleW + 4} height={bodyH + 4}
                    fill="none" stroke={color} strokeWidth={1} opacity={0.4} rx={2}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                )}
                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect x={x - 45} y={toY(c.high) - 52} width={90} height={46}
                      fill="var(--bg-primary)" stroke={color} strokeWidth={0.5} rx={4} opacity={0.95} />
                    <text x={x} y={toY(c.high) - 38} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                      {isGreen ? "▲ BULL" : "▼ BEAR"}
                    </text>
                    <text x={x} y={toY(c.high) - 27} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      O:{Math.round(c.open).toLocaleString()} C:{Math.round(c.close).toLocaleString()}
                    </text>
                    <text x={x} y={toY(c.high) - 17} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      H:{Math.round(c.high).toLocaleString()} L:{Math.round(c.low).toLocaleString()}
                    </text>
                    <text x={x} y={toY(c.high) - 8} textAnchor="middle" fill={color} fontSize="7" fontFamily="monospace">
                      {isGreen ? "+" : ""}{((c.close - c.open) / c.open * 100).toFixed(2)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {/* Current price line */}
          {candles.length > 0 && (() => {
            const lastClose = candles[candles.length - 1].close;
            const y = toY(lastClose);
            return (
              <g>
                <line x1={pad} y1={y} x2={svgW - pad} y2={y}
                  stroke="#10b981" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.5} />
                <rect x={svgW - pad - 1} y={y - 7} width={50} height={14}
                  fill="#10b981" rx={3} opacity={0.9} />
                <text x={svgW - pad + 24} y={y + 3} textAnchor="middle" fill="#000"
                  fontSize="8" fontFamily="monospace" fontWeight="bold">
                  ${Math.round(lastClose).toLocaleString()}
                </text>
              </g>
            );
          })()}
        </svg>
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: "8px",
          fontSize: "10px", color: "var(--text-secondary)",
        }}>
          <span>Simulated 5-min candles</span>
          <span>{candles.length} candles | Updates every 2.5s</span>
        </div>
      </div>
    </section>
  );
}

export default function DemoPage() {
  const [prices, setPrices] = useState(
    TOKENS.map((t) => ({ ...t, price: t.basePrice, change: 0, flash: "" }))
  );
  const [signals, setSignals] = useState<
    Array<{ pair: string; direction: "long" | "short"; confidence: number; source: string; id: number }>
  >([]);
  const [consensus, setConsensus] = useState({ grok: 78, claude: 85, perplexity: 72 });
  const [chartDrawn, setChartDrawn] = useState(false);
  const [paperBalance, setPaperBalance] = useState(10000);
  const [tradeLog, setTradeLog] = useState<string[]>([]);
  const sigId = useRef(0);
  const chartRef = useRef<HTMLDivElement>(null);

  // Live price ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.48) * p.basePrice * 0.0008;
          const price = +(
            Math.max(p.basePrice * 0.97, Math.min(p.basePrice * 1.03, p.price + delta))
          ).toFixed(2);
          const change = +((((price - p.basePrice) / p.basePrice) * 100).toFixed(2));
          return { ...p, price, change, flash: delta > 0 ? "up" : "down" };
        })
      );
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // Signal feed
  useEffect(() => {
    const add = () => {
      const s = SIGNAL_POOL[sigId.current % SIGNAL_POOL.length];
      sigId.current++;
      setSignals((prev) =>
        [
          {
            ...s,
            confidence: +(
              Math.max(0.5, Math.min(0.98, s.confidence + (Math.random() - 0.5) * 0.08))
            ).toFixed(2),
            id: sigId.current,
          },
          ...prev,
        ].slice(0, 5)
      );
    };
    add();
    const iv = setInterval(add, 5000);
    return () => clearInterval(iv);
  }, []);

  // Consensus fluctuation
  useEffect(() => {
    const iv = setInterval(() => {
      setConsensus((prev) => ({
        grok: +Math.max(40, Math.min(98, prev.grok + (Math.random() - 0.5) * 6)).toFixed(0),
        claude: +Math.max(40, Math.min(98, prev.claude + (Math.random() - 0.5) * 4)).toFixed(0),
        perplexity: +Math.max(40, Math.min(98, prev.perplexity + (Math.random() - 0.5) * 8)).toFixed(0),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // Chart reveal on scroll
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartDrawn(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const overallConsensus = Math.round((consensus.grok + consensus.claude + consensus.perplexity) / 3);

  // Paper trade simulation
  const paperTrade = (pair: string, direction: string) => {
    const gain = direction === "long"
      ? Math.round(Math.random() * 80 - 20)
      : Math.round(Math.random() * 80 - 40);
    setPaperBalance((prev) => prev + gain);
    setTradeLog((prev) =>
      [`${direction.toUpperCase()} ${pair} — P&L: ${gain >= 0 ? "+" : ""}$${gain}`, ...prev].slice(0, 4)
    );
  };

  // SVG chart
  const chartW = 600;
  const chartH = 180;
  const pad = 10;
  const pts = CHART_Y.map(
    (y, i) => `${pad + (i / (CHART_Y.length - 1)) * (chartW - pad * 2)},${y + pad}`
  );
  const linePath = `M ${pts.join(" L ")}`;
  const fillPath = `${linePath} L ${chartW - pad},${chartH} L ${pad},${chartH} Z`;

  const sectionLabel: React.CSSProperties = {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />

      {/* Demo banner */}
      <div
        style={{
          padding: "8px 24px",
          background: "#f59e0b18",
          borderBottom: "1px solid #f59e0b44",
          textAlign: "center",
          fontSize: "12px",
          color: "#f59e0b",
        }}
      >
        INTERACTIVE DEMO — Simulated data for demonstration. Not real trading.
      </div>

      <main style={{ flex: 1, padding: "0 24px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* ═══ HERO ═══ */}
          <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
            <h1
              className="gradient-text-animated"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "12px",
                background: "linear-gradient(135deg, #e2e8f0, #10b981, #3b82f6, #a855f7)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Experience the Engine
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "520px", margin: "0 auto" }}>
              Watch three AI models work in real-time. Simulated data &mdash; same architecture as production.
            </p>
          </section>

          {/* ═══ MINI TERMINAL — TRY IT ═══ */}
          <MiniTerminal />

          {/* ═══ LIVE PRICE TICKER ═══ */}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={sectionLabel}>
              Live Price Feed
              <span
                className="animate-pulse"
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  marginLeft: 8,
                  verticalAlign: "middle",
                }}
              />
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {prices.map((p) => (
                <div
                  key={p.symbol}
                  className="card-hover"
                  style={{
                    padding: "20px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    borderTop: `3px solid ${p.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "16px", color: p.color }}>{p.symbol}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{p.name}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      transition: "color 0.3s",
                      color: p.flash === "up" ? "#10b981" : p.flash === "down" ? "#ef4444" : "var(--text-primary)",
                    }}
                  >
                    ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginTop: "4px",
                      color: p.change >= 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {p.change >= 0 ? "+" : ""}
                    {p.change.toFixed(2)}%
                    <span style={{ marginLeft: "4px" }}>{p.change >= 0 ? "\u25B2" : "\u25BC"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ AI CONSENSUS ═══ */}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={sectionLabel}>AI Model Consensus</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px",
                gap: "16px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <div>
                {([
                  { name: "Grok", value: consensus.grok, color: "#ef4444" },
                  { name: "Claude", value: consensus.claude, color: "#a855f7" },
                  { name: "Perplexity", value: consensus.perplexity, color: "#3b82f6" },
                ] as const).map((m) => (
                  <div key={m.name} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: m.color }}>{m.name}</span>
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{Math.round(m.value)}%</span>
                    </div>
                    <div style={{ height: "8px", background: "var(--bg-primary)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${m.value}%`,
                          background: m.color,
                          borderRadius: "4px",
                          transition: "width 0.8s ease",
                          boxShadow: `0 0 8px ${m.color}66`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px solid var(--border-color)",
                  paddingLeft: "16px",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Overall
                </div>
                <div
                  className="neon-green"
                  style={{ fontSize: "42px", fontWeight: "bold", lineHeight: 1 }}
                >
                  {overallConsensus}%
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    marginTop: "8px",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    background:
                      overallConsensus > 75 ? "#10b98122" : overallConsensus > 60 ? "#f59e0b22" : "#ef444422",
                    color:
                      overallConsensus > 75 ? "#10b981" : overallConsensus > 60 ? "#f59e0b" : "#ef4444",
                  }}
                >
                  {overallConsensus > 75 ? "STRONG" : overallConsensus > 60 ? "MODERATE" : "WEAK"}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ SCENARIO SIMULATOR ═══ */}
          <ScrollReveal>
          <ScenarioSimulator />
          </ScrollReveal>

          {/* ═══ SIGNAL FEED + CHART ═══ */}
          <ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
            {/* Signals */}
            <section>
              <h2 style={sectionLabel}>
                Signal Feed
                <span
                  className="cursor-blink"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 12,
                    background: "var(--accent-green)",
                    marginLeft: 8,
                    verticalAlign: "middle",
                  }}
                />
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {signals.map((s) => (
                  <div
                    key={s.id}
                    className="signal-enter"
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      borderLeft: `3px solid ${s.direction === "long" ? "#10b981" : "#ef4444"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: "13px" }}>{s.pair}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: s.direction === "long" ? "#10b98122" : "#ef444422",
                          color: s.direction === "long" ? "#10b981" : "#ef4444",
                          fontWeight: "bold",
                        }}
                      >
                        {s.direction === "long" ? "\u25B2 LONG" : "\u25BC SHORT"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.source}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: s.confidence >= 0.8 ? "#10b981" : s.confidence >= 0.7 ? "#f59e0b" : "#ef4444",
                        }}
                      >
                        {(s.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <button
                      onClick={() => paperTrade(s.pair, s.direction)}
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        padding: "6px",
                        background: "transparent",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        color: "var(--text-secondary)",
                        fontSize: "10px",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-green)";
                        e.currentTarget.style.color = "var(--accent-green)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      Paper Trade
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Chart + Paper Balance */}
            <section>
              <h2 style={sectionLabel}>Performance Chart (Simulated)</h2>
              <div
                ref={chartRef}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "12px",
                }}
              >
                <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75].map((pct) => (
                    <line
                      key={pct}
                      x1={pad}
                      y1={chartH * pct}
                      x2={chartW - pad}
                      y2={chartH * pct}
                      stroke="var(--border-color)"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {chartDrawn && (
                    <>
                      <path d={fillPath} fill="url(#chartGrad)" className="chart-fill-reveal" />
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        filter="url(#glow)"
                        className="chart-line-draw"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* Paper Balance */}
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                    Paper Balance
                  </span>
                  <span className="neon-green" style={{ fontSize: "22px", fontWeight: "bold" }}>
                    ${paperBalance.toLocaleString()}
                  </span>
                </div>
                {tradeLog.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                    {tradeLog.map((log, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "11px",
                          color: log.includes("+") ? "#10b981" : "#ef4444",
                          padding: "2px 0",
                        }}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          </ScrollReveal>

          {/* ═══ LIVE CANDLESTICK CHART ═══ */}
          <ScrollReveal>
          <LiveCandlestickChart />
          </ScrollReveal>

          {/* ═══ RISK GAUGE ═══ */}
          <ScrollReveal>
          <RiskGauge grok={consensus.grok} claude={consensus.claude} perplexity={consensus.perplexity} />
          </ScrollReveal>

          {/* ═══ MODEL AGREEMENT MATRIX ═══ */}
          <ScrollReveal>
          <ModelAgreement />
          </ScrollReveal>

          {/* ═══ MARKET DEPTH ═══ */}
          <ScrollReveal>
          <VisualDepth />
          </ScrollReveal>

          {/* ═══ ORDER BOOK & NEURAL ACTIVITY ═══ */}
          <ScrollReveal>
          <OrderBookAndNeural />
          </ScrollReveal>

          {/* ═══ AI DEBATE ═══ */}
          <ScrollReveal>
          <AIDebate />
          </ScrollReveal>

          {/* ═══ SIGNAL LIFECYCLE ═══ */}
          <ScrollReveal>
          <SignalLifecycle />
          </ScrollReveal>

          {/* ═══ CTA ═══ */}
          <section
            className="card-hover"
            style={{
              textAlign: "center",
              padding: "40px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>Ready to explore?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
              Open the terminal and start commanding the engine.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "var(--accent-green)",
                  color: "#000",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Open Terminal
              </Link>
              <Link
                href="/stack"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                View Full Stack
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
