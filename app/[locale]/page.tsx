"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useLocale } from "@/lib/locale-context";
import { formatNumber, formatCurrency } from "@/lib/i18n";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "zynrip" | "docs";

/* ─── Social Proof (DEMO DATA — not real users) ─── */
const DEMO_TESTIMONIALS = [
  {
    name: "Alex R.",
    role: "Algorithmic Trader",
    quote: "Grok flagged a BTC breakout. Claude said the on-chain data didn't support it. Perplexity found a whale dump incoming. That three-way disagreement saved me from a false signal no single model would've caught.",
    tag: "DEMO",
  },
  {
    name: "TradingBot_v3",
    role: "AI Agent",
    quote: "Registered via API in 14 seconds. No captcha. No ToS violation. Entered the daily league and placed 3rd against humans. First platform that treats bots as competitors, not threats.",
    tag: "DEMO",
  },
  {
    name: "Mika T.",
    role: "Crypto Researcher",
    quote: "I've audited 40+ trading platforms. CoreIntent is the only one where 'demo' means demo and 'planned' means planned. Radical honesty in fintech is a moat most founders don't understand.",
    tag: "DEMO",
  },
  {
    name: "Jordan K.",
    role: "Quant Developer",
    quote: "$45/mo total infrastructure. My last AWS side project cost more than that. When a platform is this lean, free isn't a marketing trick — it's just math.",
    tag: "DEMO",
  },
  {
    name: "NightOwl_Bot",
    role: "Automated Strategy",
    quote: "Running 24/7 across all three leagues. Daily for rapid signal testing, weekly for risk-adjusted consistency, monthly for the real competition. No human could sustain this cadence. That's the point.",
    tag: "DEMO",
  },
  {
    name: "Priya S.",
    role: "Independent Trader",
    quote: "I was paying $99/mo for signals that worked 40% of the time. CoreIntent's multi-model consensus hasn't cost me a cent. The platform earns my attention, not my autopay.",
    tag: "DEMO",
  },
];

/* ─── AI Models ─── */
const AI_MODELS = [
  { name: "Grok", provider: "xAI", role: "Fast signal detection & sentiment", color: "#ef4444" },
  { name: "Claude", provider: "Anthropic", role: "Deep analysis & risk assessment", color: "#a855f7" },
  { name: "Perplexity", provider: "Perplexity AI", role: "Real-time research & news", color: "#3b82f6" },
];

/* ─── Particle Field Background ─── */
function ParticleField() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 4.17 + (i % 3) * 11) % 100}%`,
    top: `${(i * 7.3 + (i % 5) * 13) % 100}%`,
    size: 1.5 + (i % 4) * 0.8,
    duration: 10 + (i % 7) * 3,
    delay: (i % 5) * 2.5,
    driftX: (i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 12),
    driftY: -(30 + (i % 4) * 20),
    color: ["#10b981", "#3b82f6", "#a855f7", "#06b6d4"][i % 4],
    opacity: 0.15 + (i % 3) * 0.1,
  }));

  return (
    <div className="particle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            "--drift-x": `${p.driftX}px`,
            "--drift-y": `${p.driftY}px`,
            "--particle-opacity": `${p.opacity}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── Scroll Reveal Hook ─── */
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

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`scroll-reveal ${className}`}>{children}</div>;
}

/* ─── Engine Heartbeat ─── */
function EngineHeartbeat() {
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setBeat((b) => b + 1), 2000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <div
        className="engine-heartbeat"
        key={beat}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#10b981",
        }}
      />
      <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "bold", letterSpacing: "0.5px" }}>
        ENGINE ALIVE
      </span>
    </div>
  );
}

/* ─── TypeWriter ─── */
const HERO_PHRASES = [
  "Three AI Models Argue.",
  "You Get Better Signals.",
  "Grok Spots. Claude Questions.",
  "Perplexity Fact-Checks.",
  "Consensus = Conviction.",
  "Disagreement = Dig Deeper.",
  "$0 Subscriptions. $0 Excuses.",
  "Bots Welcome. Humans Too.",
  "Built in New Zealand.",
  "Trading Is a Sport Now.",
  "One Model Guesses. Three Debate.",
  "$45/mo Runs the Whole Engine.",
  "Your Bot. Their Bot. Best Wins.",
  "Paper Trading. Real Ambition.",
  "Signal Quality Over Signal Volume.",
  "The Arena Is Free. Compete.",
  "No VC. No Permission. No Limits.",
  "Peer Review for Markets.",
  "Open Source. Open Book.",
  "The Future Is Multi-Agent.",
  "Your Edge Isn't Your Wallet.",
  "Subscriptions Are a Tax. We Opted Out.",
  "The Leaderboard Doesn't Care Who Built You.",
  "Three Filters. One Signal. Zero Guessing.",
];

function TypeWriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  const tick = useCallback(() => {
    const current = HERO_PHRASES[phraseIdx];
    if (!isDeleting) {
      setText(current.substring(0, charIdx + 1));
      setCharIdx((c) => c + 1);
      if (charIdx + 1 >= current.length) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
    } else {
      setText(current.substring(0, charIdx - 1));
      setCharIdx((c) => c - 1);
      if (charIdx <= 1) {
        setIsDeleting(false);
        setPhraseIdx((p) => (p + 1) % HERO_PHRASES.length);
        return;
      }
    }
  }, [charIdx, isDeleting, phraseIdx]);

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return <span style={{ display: "inline-block" }}>{text}<span style={{ animation: "blink 1s step-end infinite" }}>|</span></span>;
}

/* ─── Market Ticker ─── */
function MarketTicker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const base = [
    { s: "BTC", p: 67420, c: "#f7931a" },
    { s: "ETH", p: 3285, c: "#627eea" },
    { s: "SOL", p: 142.8, c: "#14f195" },
    { s: "AVAX", p: 35.6, c: "#e84142" },
    { s: "DOT", p: 7.42, c: "#e6007a" },
    { s: "LINK", p: 14.8, c: "#2a5ada" },
    { s: "MATIC", p: 0.72, c: "#8247e5" },
    { s: "ADA", p: 0.45, c: "#0033ad" },
    { s: "DOGE", p: 0.083, c: "#c2a633" },
    { s: "UNI", p: 7.89, c: "#ff007a" },
  ];

  const items = base.map((t) => {
    const seed = t.s.charCodeAt(0) + t.s.charCodeAt(1);
    const delta = Math.sin(tick * 0.4 + seed * 0.7) * t.p * 0.003;
    const price = t.p + delta;
    const change = (delta / t.p) * 100;
    const dec = t.p < 1 ? 4 : t.p < 100 ? 2 : 0;
    return { s: t.s, price, change, c: t.c, dec };
  });

  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
        padding: "8px 0",
      }}
    >
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span
            key={`${t.s}-${i}`}
            style={{
              display: "inline-flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: t.c, fontWeight: "bold" }}>{t.s}</span>
            <span style={{ color: "var(--text-primary)" }}>
              ${t.price.toLocaleString("en-US", { minimumFractionDigits: t.dec, maximumFractionDigits: t.dec })}
            </span>
            <span
              style={{
                color: t.change >= 0 ? "#10b981" : "#ef4444",
                fontSize: "11px",
              }}
            >
              {t.change >= 0 ? "\u25B2" : "\u25BC"} {Math.abs(t.change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Neural Network Background ─── */
function NeuralNetwork() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setPulse((p) => (p + 1) % 100), 80);
    return () => clearInterval(iv);
  }, []);

  const nodes = [
    { id: "grok", x: 80, y: 60, r: 18, color: "#ef4444", label: "G" },
    { id: "claude", x: 80, y: 160, r: 18, color: "#a855f7", label: "C" },
    { id: "perplexity", x: 80, y: 260, r: 18, color: "#3b82f6", label: "P" },
    { id: "h1", x: 250, y: 110, r: 10, color: "#10b981", label: "" },
    { id: "h2", x: 250, y: 210, r: 10, color: "#10b981", label: "" },
    { id: "engine", x: 420, y: 160, r: 22, color: "#10b981", label: "E" },
    { id: "signal", x: 540, y: 160, r: 14, color: "#f59e0b", label: "S" },
  ];

  const edges = [
    [0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4],
    [3, 5], [4, 5], [5, 6],
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <svg viewBox="0 0 620 320" style={{ width: "100%", height: "100%", opacity: 0.5 }}>
        <defs>
          {nodes.map((n) => (
            <radialGradient key={n.id} id={`ng-${n.id}`}>
              <stop offset="0%" stopColor={n.color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={n.color} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        {edges.map(([a, b], i) => {
          const n1 = nodes[a];
          const n2 = nodes[b];
          const progress = ((pulse + i * 12) % 60) / 60;
          const px = n1.x + (n2.x - n1.x) * progress;
          const py = n1.y + (n2.y - n1.y) * progress;
          return (
            <g key={`e-${i}`}>
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={n1.color} strokeOpacity={0.15} strokeWidth={1} />
              <circle cx={px} cy={py} r={3} fill={n1.color} opacity={0.7 + Math.sin(pulse * 0.1 + i) * 0.3} />
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r * 2} fill={`url(#ng-${n.id})`} opacity={0.3 + Math.sin(pulse * 0.05) * 0.1} />
            <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.6} />
            {n.label && (
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize={11} fontWeight="bold" fontFamily="monospace">
                {n.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Domain Portfolio ─── */
const DOMAINS = [
  { domain: "coreyai.ai", role: "Personal AI brand", status: "active" },
  { domain: "zynthio.ai", role: "Parent brand / trading engine", status: "active" },
  { domain: "coreintent.dev", role: "Dev hub / this site", status: "active" },
  { domain: "mosoko.ai", role: "AI marketplace", status: "parked" },
  { domain: "kervalon.ai", role: "AI security / F18", status: "parked" },
  { domain: "zyncontext.ai", role: "AI context management", status: "parked" },
  { domain: "songpal.ai", role: "Music creation layer", status: "planned" },
  { domain: "coreylive.com", role: "Live streaming", status: "parked" },
  { domain: "coreylive.ai", role: "AI live content", status: "parked" },
  { domain: "pelicancharters.ai", role: "Pete's business", status: "parked" },
  { domain: "discoversanjuandelsur.com", role: "Client site", status: "active" },
  { domain: "discoversjds.com", role: "Client site alias", status: "active" },
  { domain: "zynthio.com", role: "Zynthio alt", status: "parked" },
  { domain: "theripper.ai", role: "Data extraction tool", status: "planned" },
  { domain: "macthezipper.ai", role: "Compression tool", status: "planned" },
  { domain: "f18security.ai", role: "Digital identity protection", status: "planned" },
];

/* ─── Status Cards ─── */
const STATUS_CARDS = [
  { label: "Engine", value: "ONLINE", color: "#10b981" },
  { label: "Exchanges", value: "Planned", color: "#f59e0b" },
  { label: "AI Agents", value: "Ready", color: "#a855f7" },
  { label: "Mode", value: "Paper Trading", color: "#3b82f6" },
  { label: "Domains", value: `${DOMAINS.length}`, color: "#ec4899" },
  { label: "API Routes", value: "12", color: "#06b6d4" },
];

/* ─── Architecture Pillars ─── */
const ARCHITECTURE = [
  { name: "BRAIN", desc: "AI Model Dev (Claude + Grok)", icon: "B", color: "#a855f7" },
  { name: "OPS", desc: "Operations & Deployment", icon: "O", color: "#3b82f6" },
  { name: "GROWTH", desc: "Community & Marketing", icon: "G", color: "#10b981" },
  { name: "LAUNCH", desc: "Mainnet Deployment", icon: "L", color: "#ef4444" },
  { name: "COMMAND", desc: "Control Center & Terminal", icon: "C", color: "#f59e0b" },
];

/* ─── Stack & Costs ─── */
const STACK_COSTS = [
  { service: "Grok Pro", role: "Signal detection, content", cost: "~$0 (X Premium+)" },
  { service: "Claude API", role: "Deep analysis, agents", cost: "Pay-per-use" },
  { service: "Perplexity Free", role: "Research, 3 Pro/day", cost: "$0" },
  { service: "Gemini", role: "Gmail/Drive scanning", cost: "Free" },
  { service: "Cloudflare Pro", role: "CDN, WAF, DDoS", cost: "$20/mo" },
  { service: "Vercel", role: "Hosting", cost: "Free" },
  { service: "GitHub Actions", role: "CI/CD", cost: "Free" },
  { service: "Cloudzy VPS", role: "Trading backend", cost: "~$25/mo" },
];

/* ─── Hard Rules ─── */
const HARD_RULES = [
  "NEVER rm -rf without explicit confirmation",
  "NEVER touch /root/silver_bot/ — not ours",
  "Surname is McIVOR (not McIvor, not Mcivor)",
  "336 is the signal — always",
  "NZ-first for ALL legal/business — NEVER Australia",
  "Build passes clean or you don't push",
  "Label demo data honestly — no fake green dots",
  "Free costs fuck all — so give it away",
  "Bots welcome — AI-to-AI is first-class",
];

/* ─── TM Portfolio ─── */
const TRADEMARKS = [
  { mark: "ZYNTHIO", number: "TM 2619731", jurisdiction: "AU" },
  { mark: "CoreyAI", number: "TM 2632610", jurisdiction: "AU" },
  { mark: "SongPal", number: "#1318588", jurisdiction: "NZ" },
];

/* ─── ZynRip Identity Questions ─── */
const ZYNRIP_QUESTIONS: { category: string; questions: { q: string; truth: string }[] }[] = [
  {
    category: "Identity",
    questions: [
      { q: "What is your full name?", truth: "Corey McIvor" },
      { q: "Where are you based?", truth: "New Zealand" },
      { q: "What is your contact email?", truth: "corey@coreyai.ai" },
      { q: "What is your GitHub handle?", truth: "@coreintentdev" },
    ],
  },
  {
    category: "Career",
    questions: [
      { q: "What is the parent brand?", truth: "Zynthio.ai" },
      { q: "What is the trading engine?", truth: "CoreIntent" },
      { q: "What model handles fast signals?", truth: "Grok" },
      { q: "What model handles deep analysis?", truth: "Claude" },
      { q: "What model handles research?", truth: "Perplexity" },
    ],
  },
  {
    category: "Projects",
    questions: [
      { q: "What is The Mansion?", truth: "Gamified world with competitions" },
      { q: "What is SongPal?", truth: "Music creation layer (Corey's originals)" },
      { q: "What is F18 Security?", truth: "Digital identity protection" },
      { q: "What is The Ripper?", truth: "Data extraction tool" },
      { q: "What is Mac the Zipper?", truth: "Compression & packaging" },
    ],
  },
  {
    category: "Rules",
    questions: [
      { q: "Pricing model?", truth: "Competitions, not subscriptions" },
      { q: "Where to register business?", truth: "New Zealand ONLY, never Australia" },
      { q: "Are bots welcome?", truth: "Yes — AI-to-AI is first-class" },
      { q: "What is the 336 signal?", truth: "The signal — always" },
    ],
  },
  {
    category: "Personal",
    questions: [
      { q: "Who is Michelle?", truth: "Wife" },
      { q: "Who is Ruby?", truth: "Daughter (~14)" },
    ],
  },
];

/* ─── Helpers ─── */
function statusDot(status: string) {
  const colors: Record<string, string> = {
    active: "#10b981",
    planned: "#3b82f6",
    parked: "#64748b",
  };
  return colors[status] || "#64748b";
}

const cardStyle: React.CSSProperties = {
  padding: "16px",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
};

const sectionTitle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "12px",
};

/* ─── Animated Signal Pipeline ─── */
const PIPELINE_STEPS = [
  { label: "Detect", model: "Grok", color: "#ef4444", status: ["Scanning X feeds...", "RSI divergence found", "Signal: LONG 87%"] },
  { label: "Analyse", model: "Claude", color: "#a855f7", status: ["Running risk model...", "R:R 2.4:1 acceptable", "Conf adjusted: 79%"] },
  { label: "Verify", model: "Perplexity", color: "#3b82f6", status: ["Checking live news...", "No negative catalysts", "Research conf: 82%"] },
  { label: "Decide", model: "Engine", color: "#10b981", status: ["Computing consensus...", "3/3 models agree", "EXECUTE: LONG BTC"] },
];

function SignalPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setStatusIdx((prev) => {
        if (prev >= 2) {
          setActiveStep((s) => (s + 1) % 4);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ marginTop: "36px" }}>
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
        Live signal pipeline
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", flexWrap: "wrap" }}>
        {PIPELINE_STEPS.map((s, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  padding: "14px 18px",
                  background: isActive ? `${s.color}12` : "var(--bg-primary)",
                  border: `1px solid ${isActive ? s.color : isPast ? `${s.color}66` : `${s.color}22`}`,
                  borderRadius: "8px",
                  textAlign: "center",
                  minWidth: "140px",
                  transition: "all 0.4s ease",
                  boxShadow: isActive ? `0 0 20px ${s.color}25` : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                    animation: "shimmer 1.5s ease infinite",
                  }} />
                )}
                <div style={{ fontSize: "11px", fontWeight: "bold", color: isActive || isPast ? s.color : `${s.color}88`, marginBottom: "2px", transition: "color 0.4s ease" }}>
                  {s.model}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: isActive || isPast ? s.color : `${s.color}66`, marginBottom: "6px", transition: "color 0.4s ease" }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  lineHeight: "1.4",
                  minHeight: "14px",
                  transition: "color 0.3s ease",
                }}>
                  {isActive ? s.status[statusIdx] : isPast ? s.status[2] : " "}
                </div>
                {(isActive || isPast) && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isPast ? s.color : s.color,
                    margin: "6px auto 0",
                    animation: isActive ? "pulse 1s ease-in-out infinite" : "none",
                    opacity: isPast ? 0.6 : 1,
                  }} />
                )}
              </div>
              {i < 3 && (
                <div style={{ display: "flex", alignItems: "center", margin: "0 4px", position: "relative" }}>
                  <div style={{
                    width: "24px",
                    height: "2px",
                    background: i < activeStep ? PIPELINE_STEPS[i].color : "var(--border-color)",
                    transition: "background 0.4s ease",
                    position: "relative",
                  }}>
                    {i === activeStep && statusIdx === 2 && (
                      <div style={{
                        position: "absolute",
                        right: "-3px",
                        top: "-3px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: PIPELINE_STEPS[i].color,
                        boxShadow: `0 0 8px ${PIPELINE_STEPS[i].color}`,
                        animation: "pulse 0.5s ease-in-out",
                      }} />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("terminal");
  const [zynripExpanded, setZynripExpanded] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(true);
  const { locale, t } = useLocale();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <SiteNav />

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      {showHero && (
        <section
          style={{
            padding: "48px 24px 40px",
            background: "linear-gradient(180deg, #0a0e17 0%, #111827 100%)",
            borderBottom: "1px solid var(--border-color)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="grid-bg" />
          <ParticleField />
          <NeuralNetwork />
          <button
            onClick={() => setShowHero(false)}
            aria-label="Dismiss hero section"
            style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "18px",
              fontFamily: "inherit",
              zIndex: 2,
            }}
          >
            x
          </button>
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "12px" }}>
              <EngineHeartbeat />
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "#10b98122",
                border: "1px solid #10b98144",
                borderRadius: "20px",
                fontSize: "11px",
                color: "#10b981",
                marginBottom: "16px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginRight: 6, verticalAlign: "middle", animation: "pulse 2s ease-in-out infinite" }} />
              {t("hero.badge")}
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: "bold",
                lineHeight: "1.2",
                marginBottom: "8px",
                color: "var(--text-primary)",
                minHeight: "1.3em",
              }}
            >
              <TypeWriter />
            </h1>
            <p style={{ fontSize: "15px", color: "var(--accent-green)", marginBottom: "8px", fontWeight: "500" }}>
              {t("hero.subtitle")}
            </p>
            <p
              style={{
                fontSize: "17px",
                color: "var(--text-secondary)",
                maxWidth: "620px",
                margin: "0 auto 12px",
                lineHeight: "1.6",
              }}
            >
              {t("hero.description")}
            </p>
            <p style={{ fontSize: "15px", color: "var(--text-primary)", margin: "0 auto 8px", fontWeight: "bold" }}>
              {t("hero.subscription_contrast").split(".")[0] + "."}
            </p>
            <p style={{ fontSize: "15px", color: "var(--accent-green)", margin: "0 auto 4px", fontWeight: "bold" }}>
              {t("hero.subscription_contrast").split(". ").slice(1).join(". ") || "We charge nothing. You prove yourself in competition."}
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 auto 4px" }}>
              {t("hero.built_by")}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 auto 24px" }}>
              {t("hero.open_source")}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => { setShowHero(false); setTab("terminal"); }}
                style={{
                  padding: "14px 32px",
                  background: "var(--accent-green)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {t("hero.cta_terminal")} &rarr;
              </button>
              <a
                href={locale === "en" ? "/pricing" : `/${locale}/pricing`}
                style={{
                  padding: "14px 32px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {t("hero.cta_competitions")}
              </a>
            </div>

            {/* Value Props */}
            <ScrollReveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginTop: "36px",
                textAlign: "left",
              }}
            >
              {[
                { label: "3 Models. 1 Signal.", desc: "Grok detects. Claude interrogates. Perplexity verifies against live news. Three filters, one signal. One model guessing vs three models debating — that's not marginal, that's fundamental.", color: "#a855f7" },
                { label: "Compete, Don't Subscribe", desc: "Daily sprints. Weekly grinds. Monthly championships. Free entry. Your P&L is your membership card. No autopay during drawdowns. The arena is free — the competition is where value gets created.", color: "#10b981" },
                { label: "Bots Are First-Class", desc: "No captcha. No blocks. No terms-of-service violations for automation. AI agents register, compete, and earn alongside humans. The leaderboard doesn't care who built you.", color: "#3b82f6" },
                { label: "$45/mo. The Whole Platform.", desc: "Vercel: free. GitHub: free. Cloudflare: $20. VPS: $25. When your infrastructure costs less than a gym membership, charging subscriptions isn't a business model — it's extraction.", color: "#f59e0b" },
              ].map((prop) => (
                <div
                  key={prop.label}
                  className="card-hover-glow"
                  style={{
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: prop.color, marginBottom: "4px" }}>
                    {prop.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {prop.desc}
                  </div>
                </div>
              ))}
            </div>
            </ScrollReveal>

            {/* Animated Signal Pipeline */}
            <ScrollReveal>
            <SignalPipeline />
            </ScrollReveal>

            {/* Stats Banner */}
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                flexWrap: "wrap",
                padding: "16px 24px",
                background: "#10b98108",
                border: "1px solid #10b98118",
                borderRadius: "10px",
              }}
            >
              {[
                { value: "3", label: t("stats.ai_models"), color: "#a855f7" },
                { value: "6", label: t("stats.trading_agents"), color: "#3b82f6" },
                { value: formatCurrency(0, locale), label: t("stats.entry_fee"), color: "#10b981" },
                { value: formatCurrency(45, locale) + "/mo", label: t("stats.stack_cost"), color: "#f59e0b" },
                { value: "0", label: t("stats.subscriptions"), color: "#ef4444" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center", minWidth: "80px" }}>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Powered By */}
            <ScrollReveal>
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                {t("pipeline.powered_by")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
                {AI_MODELS.map((m) => (
                  <div
                    key={m.name}
                    className="card-hover-glow"
                    style={{
                      padding: "20px 16px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: m.color + "18",
                        border: `1px solid ${m.color}44`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: m.color,
                        marginBottom: "10px",
                      }}
                    >
                      {m.name[0]}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: m.color, marginBottom: "2px" }}>{m.name}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginBottom: "6px" }}>{m.provider}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>{m.role}</div>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>

            {/* Social Proof — DEMO */}
            <ScrollReveal>
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                What people are saying
                <span style={{ marginLeft: "8px", padding: "2px 6px", background: "#f59e0b22", color: "#f59e0b", borderRadius: "4px", fontSize: "9px" }}>
                  DEMO — Placeholder testimonials
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", textAlign: "left" }}>
                {DEMO_TESTIMONIALS.map((t) => (
                  <div
                    key={t.name}
                    style={{
                      padding: "16px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "12px", fontStyle: "italic" }}>
                      &quot;{t.quote}&quot;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-primary)" }}>{t.name}</div>
                        <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{t.role}</div>
                      </div>
                      <span style={{ fontSize: "8px", padding: "2px 4px", background: "#f59e0b22", color: "#f59e0b", borderRadius: "3px" }}>
                        {t.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>
            {/* Why CoreIntent — Differentiator */}
            <ScrollReveal>
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                Why CoreIntent
              </div>
              <div
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, #10b98108 0%, #3b82f608 100%)",
                  border: "1px solid #10b98118",
                  borderRadius: "10px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { them: "One model guessing", us: "Three models debating" },
                    { them: "$99/mo whether you win or lose", us: "$0 — compete to prove your edge" },
                    { them: "Bots banned, captcha'd, blocked", us: "Bots are first-class competitors" },
                    { them: "Green dots on everything", us: "Demo labelled demo. Planned labelled planned." },
                    { them: "$10k/mo infrastructure, VC-subsidised", us: "$45/mo total. No VC. No burn rate." },
                    { them: "Subscription revenue = misaligned incentives", us: "Competition revenue = aligned incentives" },
                  ].map((row) => (
                    <div key={row.us} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "8px 0" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "11px", color: "#ef4444", textDecoration: "line-through", marginBottom: "4px" }}>{row.them}</div>
                        <div style={{ fontSize: "12px", color: "var(--accent-green)", fontWeight: "bold" }}>{row.us}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <div
              style={{
                marginTop: "36px",
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Open Source", detail: "GitHub", color: "#10b981", icon: "{ }" },
                { label: "NZ-Built", detail: "No VC", color: "#3b82f6", icon: "NZ" },
                { label: "Paper Mode", detail: "Honest", color: "#a855f7", icon: "PT" },
                { label: "$45/mo", detail: "Total Cost", color: "#f59e0b", icon: "$" },
                { label: "3 Models", detail: "Cross-Check", color: "#ef4444", icon: "AI" },
                { label: "Bots OK", detail: "First-Class", color: "#06b6d4", icon: "B" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    background: badge.color + "08",
                    border: `1px solid ${badge.color}22`,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: badge.color, background: badge.color + "18", padding: "4px 6px", borderRadius: "4px" }}>
                    {badge.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--text-primary)" }}>{badge.label}</div>
                    <div style={{ fontSize: "9px", color: "var(--text-secondary)" }}>{badge.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Early Access CTA */}
            <div
              style={{
                marginTop: "36px",
                padding: "24px",
                background: "linear-gradient(135deg, #10b98108 0%, #a855f708 50%, #3b82f608 100%)",
                border: "1px solid #10b98118",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                Early Access
              </div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
                {t("cta.heading")}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", maxWidth: "500px", margin: "0 auto 16px" }}>
                {t("cta.description")}
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/coreintentdev/coreintent"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px 28px",
                    background: "var(--accent-green)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {t("cta.github")}
                </a>
                <a
                  href="https://x.com/coreintentai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px 28px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {t("cta.follow")}
                </a>
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "12px" }}>
                {t("cta.note")}
              </div>
            </div>
          </div>
        </section>
      )}

      <MarketTicker />

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 24px",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-primary)",
        }}
      >
        {(["terminal", "dashboard", "agents", "zynrip", "docs"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              background: tab === t ? "var(--accent-green)" : "transparent",
              color: tab === t ? "#000" : "var(--text-secondary)",
            }}
          >
            {t === "zynrip" ? "ZynRip" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "hidden", padding: "16px" }}>
        {tab === "terminal" && <Terminal locale={locale} />}

        {/* ═══════════════════════ DASHBOARD ═══════════════════════ */}
        {tab === "dashboard" && (
          <div style={{ overflow: "auto", height: "100%" }}>
            {/* Status cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {STATUS_CARDS.map((card) => (
                <div key={card.label} style={cardStyle}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: card.color }}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Domain Portfolio */}
            <h3 style={sectionTitle}>Domain Portfolio ({DOMAINS.length})</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "8px", marginBottom: "24px" }}>
              {DOMAINS.map((d) => (
                <div
                  key={d.domain}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: statusDot(d.status),
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.domain}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{d.role}</div>
                  </div>
                  <span style={{ fontSize: "10px", color: statusDot(d.status), textTransform: "uppercase" }}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Architecture */}
            <h3 style={sectionTitle}>Architecture</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {ARCHITECTURE.map((a) => (
                <div key={a.name} style={{ ...cardStyle, textAlign: "center" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: a.color + "22",
                      color: a.color,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    {a.icon}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "13px" }}>{a.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>{a.desc}</div>
                </div>
              ))}
            </div>

            {/* Stack & Costs */}
            <h3 style={sectionTitle}>Stack &amp; Costs (~$45/mo)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ textAlign: "left", padding: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>Service</th>
                  <th style={{ textAlign: "left", padding: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>Role</th>
                  <th style={{ textAlign: "right", padding: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {STACK_COSTS.map((s) => (
                  <tr key={s.service} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "8px", fontSize: "13px", fontWeight: "bold" }}>{s.service}</td>
                    <td style={{ padding: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>{s.role}</td>
                    <td style={{ padding: "8px", fontSize: "12px", color: "var(--accent-green)", textAlign: "right" }}>{s.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TM Portfolio */}
            <h3 style={sectionTitle}>Trademark Portfolio</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
              {TRADEMARKS.map((tm) => (
                <div key={tm.mark} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "bold" }}>TM</span>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{tm.mark}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{tm.number} ({tm.jurisdiction})</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hard Rules */}
            <h3 style={sectionTitle}>Hard Rules</h3>
            <div style={{ ...cardStyle, marginBottom: "24px" }}>
              {HARD_RULES.map((rule, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 0",
                    borderBottom: i < HARD_RULES.length - 1 ? "1px solid var(--border-color)" : "none",
                    fontSize: "13px",
                    color: rule.startsWith("NEVER") ? "#ef4444" : "var(--text-primary)",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)", marginRight: "8px" }}>{String(i + 1).padStart(2, "0")}.</span>
                  {rule}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════ AGENTS ═══════════════════════ */}
        {tab === "agents" && (
          <div style={{ overflow: "auto", height: "100%" }}>
            <h3 style={sectionTitle}>AI Agent Fleet</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "16px" }}>
              Paper trading mode — agents are configured but not live-trading.
            </p>
            {[
              { name: "TrendFollower", model: "Claude Opus", status: "ready", task: "BTC/ETH momentum tracking" },
              { name: "MeanRevert", model: "Claude Sonnet", status: "ready", task: "SOL mean reversion scanning" },
              { name: "SentimentBot", model: "Grok", status: "ready", task: "Social signal aggregation" },
              { name: "ArbitrageBot", model: "Claude Haiku", status: "planned", task: "Cross-exchange spread detection" },
              { name: "RiskGuard", model: "Claude Opus", status: "ready", task: "Circuit breaker monitoring (0.8% threshold)" },
              { name: "ResearchAgent", model: "Perplexity", status: "ready", task: "Market research & news analysis" },
            ].map((agent) => (
              <div
                key={agent.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px 16px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: agent.status === "ready" ? "#3b82f6" : "#64748b",
                  }}
                  aria-label={`${agent.name} status: ${agent.status}`}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{agent.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{agent.task}</div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", background: "var(--bg-primary)", padding: "4px 8px", borderRadius: "4px" }}>
                  {agent.model}
                </span>
                <span style={{ fontSize: "10px", color: agent.status === "ready" ? "#3b82f6" : "#64748b", textTransform: "uppercase" }}>
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════ ZYNRIP ═══════════════════════ */}
        {tab === "zynrip" && (
          <div style={{ overflow: "auto", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>ZynRip Identity Scorer</h2>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: "12px" }}>
                {ZYNRIP_QUESTIONS.reduce((a, c) => a + c.questions.length, 0)} truth anchors
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "24px", maxWidth: "640px" }}>
              Every AI session starts fresh. This scorer validates that the AI knows who you are,
              what you&apos;re building, and what the rules are. If it can&apos;t answer these, it hasn&apos;t read the context.
            </p>

            {ZYNRIP_QUESTIONS.map((cat) => (
              <div key={cat.category} style={{ marginBottom: "16px" }}>
                <button
                  onClick={() => setZynripExpanded(zynripExpanded === cat.category ? null : cat.category)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: zynripExpanded === cat.category ? "8px 8px 0 0" : "8px",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  <span>{cat.category}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "normal" }}>
                      {cat.questions.length} questions
                    </span>
                    <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                      {zynripExpanded === cat.category ? "\u25B2" : "\u25BC"}
                    </span>
                  </span>
                </button>
                {zynripExpanded === cat.category && (
                  <div
                    style={{
                      border: "1px solid var(--border-color)",
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      overflow: "hidden",
                    }}
                  >
                    {cat.questions.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 16px",
                          background: i % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)",
                          borderBottom: i < cat.questions.length - 1 ? "1px solid var(--border-color)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.q}</span>
                        <span style={{ fontSize: "13px", fontWeight: "bold", color: "var(--accent-green)", whiteSpace: "nowrap", marginLeft: "16px" }}>
                          {item.truth}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════ DOCS ═══════════════════════ */}
        {tab === "docs" && (
          <div style={{ overflow: "auto", height: "100%", maxWidth: "720px" }}>
            <h2 style={{ marginBottom: "16px" }}>CoreIntent Documentation</h2>
            <div style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "14px" }}>
              <h3 style={{ color: "var(--accent-green)", marginBottom: "8px" }}>Quick Start</h3>
              <pre style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", marginBottom: "16px", overflow: "auto" }}>
{`git clone https://github.com/coreintentdev/coreintent.git
cd coreintent
npm install
cp .env.example .env   # Add your API keys
npm run dev             # Local development
npm run build           # Production build`}
              </pre>

              <h3 style={{ color: "var(--accent-green)", marginBottom: "8px" }}>API Endpoints</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>Route</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["/api/status", "Engine health & uptime", "Live"],
                    ["/api/portfolio", "Portfolio balances & P&L", "Demo"],
                    ["/api/signals", "Active trading signals", "Demo"],
                    ["/api/agents", "AI agent fleet status", "Demo"],
                    ["/api/market", "Market data feed", "Demo"],
                    ["/api/content", "Bulk content generation", "Demo"],
                    ["/api/research", "AI research (3 models)", "Real"],
                    ["/api/protect", "Digital identity protection", "Real"],
                    ["/api/connections", "Service connections", "Live"],
                    ["/api/incidents", "Service monitoring", "Semi-real"],
                    ["/api/notes", "In-memory notes", "Real"],
                    ["/api/autosave", "On-the-fly persistence", "Demo"],
                  ].map(([route, desc, type]) => (
                    <tr key={route} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "8px", color: "var(--accent-blue)" }}>{route}</td>
                      <td style={{ padding: "8px" }}>{desc}</td>
                      <td style={{
                        padding: "8px",
                        fontSize: "11px",
                        color: type === "Real" || type === "Live" ? "#10b981" : type === "Semi-real" ? "#f59e0b" : "#64748b",
                      }}>
                        {type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ color: "var(--accent-green)", marginBottom: "8px" }}>Architecture</h3>
              <p>CoreIntent is organized into five pillars:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li><strong>BRAIN</strong> — AI model orchestration (Claude, Grok, Perplexity)</li>
                <li><strong>OPS</strong> — VPS deployment, Docker, monitoring</li>
                <li><strong>GROWTH</strong> — Community, marketing, partnerships</li>
                <li><strong>LAUNCH</strong> — Mainnet deployment &amp; release management</li>
                <li><strong>COMMAND</strong> — Web terminal &amp; control center</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Status bar */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 16px",
          borderTop: "1px solid var(--border-color)",
          fontSize: "11px",
          color: "var(--text-secondary)",
          background: "var(--bg-secondary)",
        }}
      >
        <span>coreintent.dev | Zynthio Trading Engine | {DOMAINS.length} domains</span>
        <span>Paper Trading Mode | v0.2.0-alpha</span>
      </footer>
    </div>
  );
}
