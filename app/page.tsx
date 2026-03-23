"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "docs";

const STATUS_CARDS = [
  { label: "Engine", value: "ONLINE", color: "#10b981" },
  { label: "Exchanges", value: "2 Active", color: "#3b82f6" },
  { label: "AI Agents", value: "4 Running", color: "#a855f7" },
  { label: "Signals", value: "12 Active", color: "#f59e0b" },
];

const ARCHITECTURE = [
  { name: "BRAIN", desc: "AI Model Dev (Claude + Grok)", icon: "B", color: "#a855f7" },
  { name: "OPS", desc: "Operations & Deployment", icon: "O", color: "#3b82f6" },
  { name: "GROWTH", desc: "Community & Marketing", icon: "G", color: "#10b981" },
  { name: "LAUNCH", desc: "Mainnet Deployment", icon: "L", color: "#ef4444" },
  { name: "COMMAND", desc: "Control Center & Terminal", icon: "C", color: "#f59e0b" },
];

const INTEGRATIONS = [
  "Binance", "Coinbase", "gTrade", "Claude API", "Grok Pro",
  "Perplexity Max", "X Premium+", "Cloudflare Pro", "Vercel",
  "Cloudzy VPS", "Linear", "GitHub", "Notion",
  "PDF Plumber", "Mac the Zipper", "The Ripper", "AI-to-AI Transfer",
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("terminal");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-green)" }}>
            CoreIntent
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            v0.1.0-alpha | Zynthio.ai
          </span>
        </div>
        <nav style={{ display: "flex", gap: "4px" }}>
          {(["terminal", "dashboard", "agents", "docs"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
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
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "hidden", padding: "16px" }}>
        {tab === "terminal" && <Terminal />}

        {tab === "dashboard" && (
          <div style={{ overflow: "auto", height: "100%" }}>
            {/* Status cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {STATUS_CARDS.map((card) => (
                <div
                  key={card.label}
                  style={{
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: card.color }}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture */}
            <h3 style={{ color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", marginBottom: "12px" }}>
              Architecture
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {ARCHITECTURE.map((a) => (
                <div
                  key={a.name}
                  style={{
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
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
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {a.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Integrations */}
            <h3 style={{ color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", marginBottom: "12px" }}>
              Connected Services
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {INTEGRATIONS.map((i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 12px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: "var(--accent-green)",
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div style={{ overflow: "auto", height: "100%" }}>
            <h3 style={{ color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>
              AI Agent Fleet
            </h3>
            {[
              { name: "TrendFollower", model: "Claude Opus", status: "active", task: "BTC/ETH momentum tracking" },
              { name: "MeanRevert", model: "Claude Sonnet", status: "active", task: "SOL mean reversion scanning" },
              { name: "SentimentBot", model: "Grok", status: "processing", task: "Social signal aggregation" },
              { name: "ArbitrageBot", model: "Claude Haiku", status: "paused", task: "Cross-exchange spread detection" },
              { name: "RiskGuard", model: "Claude Opus", status: "active", task: "Circuit breaker monitoring (0.8% threshold)" },
              { name: "ResearchAgent", model: "Perplexity", status: "active", task: "Market research & news analysis" },
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
                    background:
                      agent.status === "active" ? "#10b981" :
                      agent.status === "processing" ? "#f59e0b" : "#64748b",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{agent.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{agent.task}</div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", background: "var(--bg-primary)", padding: "4px 8px", borderRadius: "4px" }}>
                  {agent.model}
                </span>
              </div>
            ))}
          </div>
        )}

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
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["/api/status", "Engine health & uptime"],
                    ["/api/portfolio", "Portfolio balances & P&L"],
                    ["/api/signals", "Active trading signals"],
                    ["/api/agents", "AI agent fleet status"],
                    ["/api/market", "Market data feed"],
                  ].map(([route, desc]) => (
                    <tr key={route} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "8px", color: "var(--accent-blue)" }}>{route}</td>
                      <td style={{ padding: "8px" }}>{desc}</td>
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
                <li><strong>LAUNCH</strong> — Mainnet deployment & release management</li>
                <li><strong>COMMAND</strong> — Web terminal & control center</li>
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
        <span>coreintent.dev | Zynthio Trading Engine</span>
        <span>Paper Trading Mode | Next.js + xterm | Vercel Ready</span>
      </footer>
    </div>
  );
}
