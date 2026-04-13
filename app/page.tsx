"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "zynrip" | "docs";

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
  { label: "API Routes", value: "14", color: "#06b6d4" },
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
  { service: "Proton Mail", role: "Encrypted email (imported)", cost: "Proton plan" },
  { service: "Suno API", role: "Music generation (paid)", cost: "Pay-per-use" },
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

export default function Home() {
  const [tab, setTab] = useState<Tab>("terminal");
  const [zynripExpanded, setZynripExpanded] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <SiteNav />

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
      <main style={{ flex: 1, overflow: "hidden", padding: "16px" }} role="main">
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
                    ["/api/context", "ZynContext (assumption blocker)", "Live"],
                    ["/api/music", "SongPal track catalog", "Real"],
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
