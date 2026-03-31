"use client";

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const AI_SERVICES = [
  {
    name: "Grok (X.ai)",
    tier: "Pro",
    role: "Signal Detection & Sentiment",
    speed: "Fastest",
    cost: "Near-free with X Premium+",
    color: "#ef4444",
    tasks: ["Real-time signal detection", "X/Twitter sentiment analysis", "Market mood scoring", "News reaction speed"],
  },
  {
    name: "Claude (Anthropic)",
    tier: "API",
    role: "Deep Analysis & Risk",
    speed: "Fast",
    cost: "Pay-per-token",
    color: "#a855f7",
    tasks: ["Post-trade analysis", "Risk assessment", "Strategy generation", "Code & agent orchestration"],
  },
  {
    name: "Perplexity",
    tier: "Max",
    role: "Research & Coordination",
    speed: "Fast",
    cost: "Subscription",
    color: "#3b82f6",
    tasks: ["Market research", "News aggregation", "9 platform connectors", "Cross-source verification"],
  },
];

const PLATFORMS = [
  { name: "X Premium+", what: "Grok API, analytics, post reach, @coreintentai", color: "#1d9bf0" },
  { name: "Cloudflare Pro", what: "CDN, WAF, DDoS protection, DNS for coreintent.dev", color: "#f48120" },
  { name: "Vercel", what: "Next.js hosting, edge functions, preview deploys", color: "#fff" },
  { name: "Cloudzy VPS", what: "Trading engine: risk_monitor, gtrade_listener, signal_listener", color: "#10b981" },
  { name: "GitHub", what: "5 repos, CI/CD, open source, coreintentdev org", color: "#8b949e" },
  { name: "Linear", what: "26 tasks, epics: BRAIN/OPS/GROWTH/LAUNCH/COMMAND", color: "#5e6ad2" },
  { name: "Notion", what: "Documentation hub, knowledge base", color: "#fff" },
  { name: "The Ripper", what: "Custom-built data extraction tool", color: "#ef4444" },
  { name: "Mac the Zipper", what: "Compression & packaging utility", color: "#f59e0b" },
  { name: "PDF Plumber", what: "PDF parsing & document extraction", color: "#06b6d4" },
  { name: "AI-to-AI Transfer", what: "Cross-model context & doc transfer pipeline", color: "#a855f7" },
];

const CONNECTORS = [
  "Gmail + Calendar", "Google Drive", "Linear", "Notion",
  "GitHub", "Asana", "Slack", "Jira", "Confluence",
];

const EXCHANGES = [
  { name: "Binance", status: "planned", pairs: "500+", type: "CEX" },
  { name: "Coinbase", status: "planned", pairs: "200+", type: "CEX" },
  { name: "gTrade", status: "planned", pairs: "50+", type: "DeFi (Polygon/Arbitrum)" },
];

export default function StackPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, padding: "48px 24px", fontFamily: "inherit" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>The Stack</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
            Full API orchestra powering CoreIntent / Zynthio
          </p>

          {/* AI Services */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            AI Services
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {AI_SERVICES.map((svc) => (
              <div
                key={svc.name}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "24px",
                  borderTop: `3px solid ${svc.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", color: svc.color }}>{svc.name}</h3>
                  <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: svc.color + "22", color: svc.color }}>
                    {svc.tier}
                  </span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>{svc.role}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  Speed: {svc.speed} | Cost: {svc.cost}
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {svc.tasks.map((t) => (
                    <li key={t} style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "3px 0" }}>
                      <span style={{ color: svc.color, marginRight: "6px" }}>+</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Exchanges */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Exchanges
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {EXCHANGES.map((ex) => (
              <div
                key={ex.name}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                  aria-label={`${ex.name} status: ${ex.status}`}
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{ex.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    {ex.type} | {ex.pairs} pairs | {ex.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platforms */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Platforms &amp; Infrastructure
          </h2>
          <div style={{ marginBottom: "40px" }}>
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
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
                <span style={{ fontWeight: "bold", fontSize: "14px", minWidth: "140px", color: p.color }}>{p.name}</span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{p.what}</span>
              </div>
            ))}
          </div>

          {/* Perplexity Connectors */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Perplexity Max Connectors (9 Active)
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
            {CONNECTORS.map((c) => (
              <span
                key={c}
                style={{
                  padding: "8px 14px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#3b82f6",
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Cost Summary */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Monthly Cost Breakdown
          </h2>
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Service</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Tier</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>Cost/mo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["X Premium+", "Premium+", "$16"],
                  ["Grok API", "Included w/ X", "$0"],
                  ["Perplexity", "Max", "$20"],
                  ["Cloudflare", "Pro", "$20"],
                  ["Vercel", "Hobby (free) → Pro", "$0-20"],
                  ["Cloudzy VPS", "Basic", "~$5-10"],
                  ["Claude API", "Pay-per-use", "~$5-30"],
                  ["GitHub", "Free (public)", "$0"],
                  ["Linear", "Free tier", "$0"],
                ].map(([svc, tier, cost]) => (
                  <tr key={svc} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "8px" }}>{svc}</td>
                    <td style={{ padding: "8px", color: "var(--text-secondary)" }}>{tier}</td>
                    <td style={{ padding: "8px", textAlign: "right", color: "var(--accent-green)" }}>{cost}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ padding: "8px" }} colSpan={2}>Total (estimated)</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "var(--accent-yellow)" }}>~$66-116/mo</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "12px" }}>
              Grok is fast and near-free with X Premium+. Claude API scales with usage. Most infra is free-tier eligible.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
