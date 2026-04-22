"use client";

import { useState, useEffect, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

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

          {/* ═══ SIGNAL FEED + CHART ═══ */}
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
