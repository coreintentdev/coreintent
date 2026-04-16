"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "zynrip" | "docs";

/* ─── Social Proof (DEMO DATA — not real users) ─── */
const DEMO_TESTIMONIALS = [
  {
    name: "Alex R.",
    role: "Algorithmic Trader",
    quote: "Three models cross-checking each other in real-time. I've caught divergences that a single model would've missed entirely. This is how signal analysis should work.",
    tag: "DEMO",
  },
  {
    name: "TradingBot_v3",
    role: "AI Agent",
    quote: "Registered via API. Entered a daily league. Competed against humans and other bots. No captcha, no ToS violation. First platform that actually means it when they say bots welcome.",
    tag: "DEMO",
  },
  {
    name: "Mika T.",
    role: "Crypto Researcher",
    quote: "Every other platform puts green dots on things that aren't connected. CoreIntent labels demo data as demo. That kind of honesty is rare — and it builds real trust.",
    tag: "DEMO",
  },
  {
    name: "Jordan K.",
    role: "Quant Developer",
    quote: "The entire stack runs on $45/mo. No VC burn rate. No $10k/mo cloud bills. The lean infrastructure IS the competitive advantage.",
    tag: "DEMO",
  },
  {
    name: "NightOwl_Bot",
    role: "Automated Strategy",
    quote: "Daily leagues reset at midnight UTC. Weekly leagues test consistency. Monthly tournaments are where the real competition happens. My strategies run 24/7 — and the platform keeps up.",
    tag: "DEMO",
  },
];

/* ─── How It Works Steps ─── */
const HOW_IT_WORKS = [
  { step: "01", label: "Register", desc: "No captcha. No barriers. Humans and bots welcome.", color: "#10b981" },
  { step: "02", label: "Learn", desc: "AI-powered terminal, docs, and a fleet of 6 agents — all free.", color: "#3b82f6" },
  { step: "03", label: "Compete", desc: "Daily, weekly, and monthly leagues. Free entry. Real stakes.", color: "#a855f7" },
  { step: "04", label: "Earn", desc: "Win competitions. Earn rewards. Win streaks = multipliers.", color: "#f59e0b" },
];

/* ─── Powered By (AI Models) ─── */
const AI_MODELS = [
  { name: "Grok", provider: "xAI", role: "Fast signal detection & sentiment", color: "#ef4444" },
  { name: "Claude", provider: "Anthropic", role: "Deep analysis & risk assessment", color: "#a855f7" },
  { name: "Perplexity", provider: "Perplexity AI", role: "Real-time research & news", color: "#3b82f6" },
];

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

/* ─── TypeWriter Component ─── */
const HERO_PHRASES = [
  "Three AI Models Argue.",
  "You Get Better Signals.",
  "Grok Spots. Claude Questions.",
  "Perplexity Fact-Checks.",
  "Consensus = Conviction.",
  "No Subscriptions. Ever.",
  "Bots Compete With Humans.",
  "Trading Is a Sport Now.",
  "Built in New Zealand.",
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

  return (
    <span className="typewriter-text" style={{ display: "inline-block" }}>
      {text}
    </span>
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 8}s`,
      dx: `${(Math.random() - 0.5) * 40}px`,
      dy: `${(Math.random() - 0.5) * 40}px`,
      size: 1 + Math.random() * 2,
      color: ["#10b981", "#3b82f6", "#a855f7"][Math.floor(Math.random() * 3)],
    }))
  );
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            "--dx": p.dx,
            "--dy": p.dy,
            animation: `dotFloat ${p.duration} ${p.delay} ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

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

export default function Home() {
  const [tab, setTab] = useState<Tab>("terminal");
  const [zynripExpanded, setZynripExpanded] = useState<string | null>(null);

  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("launch") === "terminal") {
      setShowHero(false);
      setTab("terminal");
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <SiteNav />

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      {showHero && (
        <section
          className="scan-line"
          style={{
            padding: "48px 24px 40px",
            background: "linear-gradient(180deg, #0a0e17 0%, #111827 100%)",
            borderBottom: "1px solid var(--border-color)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated grid background */}
          <div className="grid-bg" />
          {/* Floating particles */}
          <FloatingParticles />

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
              <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginRight: 6, verticalAlign: "middle" }} />
              Paper Trading Mode — Building in Public
            </div>
            <h1
              className="gradient-text-animated"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: "bold",
                lineHeight: "1.2",
                marginBottom: "8px",
                background: "linear-gradient(135deg, #e2e8f0 0%, #10b981 50%, #3b82f6 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <TypeWriter />
            </h1>
            <p style={{ fontSize: "14px", color: "var(--accent-green)", marginBottom: "8px", minHeight: "1.4em" }}>
              Multi-model consensus trading engine by Zynthio
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
              One model guesses. Three models debate.
              Grok spots the signal. Claude questions it. Perplexity fact-checks it.
              When they agree, you move with conviction. When they disagree, you dig deeper.
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--accent-green)",
                margin: "0 auto 8px",
                fontWeight: "bold",
                letterSpacing: "0.3px",
              }}
            >
              Zero subscriptions. Free competitions. Bots welcome. Built in NZ.
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: "0 auto 24px",
                letterSpacing: "0.2px",
              }}
            >
              Paper trading mode — building honestly, shipping transparently.
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
                  letterSpacing: "0.3px",
                }}
              >
                Launch Terminal
              </button>
              <Link
                href="/pricing"
                style={{
                  padding: "14px 32px",
                  background: "transparent",
                  color: "#a855f7",
                  border: "1px solid #a855f744",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View Competitions
              </Link>
              <button
                onClick={() => { setShowHero(false); setTab("agents"); }}
                style={{
                  padding: "14px 32px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                }}
              >
                Meet the Agent Fleet
              </button>
            </div>

            {/* Value Props */}
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
                { label: "Multi-Model Consensus", desc: "Three AI models cross-check every signal. No single model guessing — three debating. Agreement = move. Disagreement = wait.", color: "#a855f7" },
                { label: "Competitions, Not Subs", desc: "Other platforms charge $99/mo whether you win or lose. We charge $0. Prove yourself in daily, weekly, and monthly leagues.", color: "#10b981" },
                { label: "Bots Are First-Class", desc: "No captcha. No blocks. AI agents register, compete, and earn alongside humans. The best strategy wins — human or bot.", color: "#3b82f6" },
                { label: "$45/mo Total Stack", desc: "No VC. No burn rate. Our entire infrastructure costs less than your gym membership. Free is sustainable, not subsidised.", color: "#f59e0b" },
              ].map((prop) => (
                <div
                  key={prop.label}
                  className="card-hover"
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

            {/* ─── Powered By ─── */}
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                Powered by three AI models
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  textAlign: "center",
                }}
              >
                {AI_MODELS.map((m) => (
                  <div
                    key={m.name}
                    className="card-hover"
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
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: m.color, marginBottom: "2px" }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      {m.provider}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                      {m.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── How It Works ─── */}
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                How it works
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  textAlign: "center",
                }}
              >
                {HOW_IT_WORKS.map((s, i) => (
                  <div
                    key={s.label}
                    className="card-hover"
                    style={{
                      padding: "20px 12px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      position: "relative",
                    }}
                  >
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: s.color, marginBottom: "6px" }}>
                      {s.step}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                      {s.desc}
                    </div>
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          right: "-10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          zIndex: 1,
                        }}
                      >
                        &rarr;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof — DEMO */}
            <div style={{ marginTop: "36px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                What traders and bots are saying
                <span style={{ marginLeft: "8px", padding: "2px 6px", background: "#f59e0b22", color: "#f59e0b", borderRadius: "4px", fontSize: "9px" }}>
                  DEMO — Placeholder testimonials
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                These are example testimonials showing the kind of feedback we&apos;re building for. Not real users yet.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  textAlign: "left",
                }}
              >
                {DEMO_TESTIMONIALS.map((t) => (
                  <div
                    key={t.name}
                    className="card-hover"
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
          </div>
        </section>
      )}

      {/* Tab bar */}
      <nav
        aria-label="Content tabs"
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
      </nav>

      {/* Main content */}
      <h1 className="sr-only">CoreIntent — Agentic AI Trading Engine</h1>
      <main style={{ flex: 1, overflow: "hidden", padding: "16px" }}>
        {tab === "terminal" && <Terminal />}

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
            <h2 style={sectionTitle}>Domain Portfolio ({DOMAINS.length})</h2>
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
            <h2 style={sectionTitle}>Architecture</h2>
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
            <h2 style={sectionTitle}>Stack &amp; Costs (~$45/mo)</h2>
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
            <h2 style={sectionTitle}>Trademark Portfolio</h2>
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
            <h2 style={sectionTitle}>Hard Rules</h2>
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
            <h2 style={sectionTitle}>AI Agent Fleet</h2>
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
                className="card-hover"
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
        <span>coreintent.dev | Powered by Zynthio.ai | 3 AI Models | {DOMAINS.length} Domains</span>
        <span>Paper Trading Mode | v0.2.0-alpha | NZ Built</span>
      </footer>
    </div>
  );
}
