"use client";

import { useState, useEffect, useCallback } from "react";
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

/* ─── Architecture Diagram Nodes ─── */
const ARCH_NODES = [
  { id: "grok", label: "Grok", role: "Fast Signals", color: "#ef4444", x: 100, y: 60 },
  { id: "claude", label: "Claude", role: "Deep Analysis", color: "#a855f7", x: 300, y: 60 },
  { id: "perplexity", label: "Perplexity", role: "Research", color: "#3b82f6", x: 500, y: 60 },
  { id: "engine", label: "Engine", role: "Orchestrator", color: "#10b981", x: 300, y: 180 },
  { id: "risk", label: "RiskGuard", role: "Circuit Breaker", color: "#f59e0b", x: 100, y: 180 },
  { id: "terminal", label: "Terminal", role: "Commander", color: "#06b6d4", x: 500, y: 180 },
  { id: "exchange", label: "Exchanges", role: "Planned", color: "#64748b", x: 200, y: 290 },
  { id: "vps", label: "VPS", role: "Cloudzy", color: "#10b981", x: 400, y: 290 },
];

const ARCH_CONNECTIONS = [
  { from: "grok", to: "engine", label: "signals" },
  { from: "claude", to: "engine", label: "analysis" },
  { from: "perplexity", to: "engine", label: "research" },
  { from: "engine", to: "risk", label: "risk check" },
  { from: "engine", to: "terminal", label: "commands" },
  { from: "engine", to: "exchange", label: "orders" },
  { from: "engine", to: "vps", label: "deploy" },
  { from: "risk", to: "engine", label: "limits" },
];

/* ─── Live Signal Pipeline — Real-time AI orchestration visualization ─── */
const PIPELINE_STAGES = [
  { id: "grok", label: "Grok", role: "Signal Scan", color: "#ef4444", x: 80, y: 60 },
  { id: "claude", label: "Claude", role: "Risk Analysis", color: "#a855f7", x: 270, y: 60 },
  { id: "perplexity", label: "Perplexity", role: "Fact-Check", color: "#3b82f6", x: 460, y: 60 },
  { id: "engine", label: "Engine", role: "Consensus", color: "#10b981", x: 650, y: 60 },
];

const PIPELINE_SIGNALS = [
  { pair: "BTC/USDT", price: "$67,420", direction: "LONG", conf: [87, 79, 82, 83] },
  { pair: "ETH/USDT", price: "$3,285", direction: "SHORT", conf: [72, 81, 68, 74] },
  { pair: "SOL/USDT", price: "$142.80", direction: "LONG", conf: [91, 85, 88, 88] },
  { pair: "AVAX/USDT", price: "$35.60", direction: "HOLD", conf: [58, 62, 55, 58] },
];

function LiveSignalPipeline() {
  const [activeStage, setActiveStage] = useState(-1);
  const [signalIdx, setSignalIdx] = useState(0);
  const [dotProgress, setDotProgress] = useState(0);
  const [confidences, setConfidences] = useState([0, 0, 0, 0]);
  const [statusText, setStatusText] = useState("Awaiting signal...");
  const [signalCount, setSignalCount] = useState(847);
  const [latency, setLatency] = useState(0);

  const signal = PIPELINE_SIGNALS[signalIdx];

  const cycleSignal = useCallback(() => {
    let stage = -1;
    let elapsed = 0;
    const stepDuration = 900;
    const stages = [
      { stage: 0, status: `Grok scanning ${PIPELINE_SIGNALS[signalIdx].pair}...` },
      { stage: 0, status: `Signal detected: ${PIPELINE_SIGNALS[signalIdx].direction} @ ${PIPELINE_SIGNALS[signalIdx].price}` },
      { stage: 1, status: "Claude running deep risk analysis..." },
      { stage: 1, status: `Risk/reward: ${(1.5 + Math.random() * 2).toFixed(1)}:1 — acceptable` },
      { stage: 2, status: "Perplexity fact-checking live sources..." },
      { stage: 2, status: "No adverse news — research confirms" },
      { stage: 3, status: "Engine computing weighted consensus..." },
      { stage: 3, status: `DECISION: ${PIPELINE_SIGNALS[signalIdx].direction} — ${PIPELINE_SIGNALS[signalIdx].conf[3]}% confidence` },
    ];

    const iv = setInterval(() => {
      const stepIdx = Math.floor(elapsed / stepDuration);
      if (stepIdx >= stages.length) {
        clearInterval(iv);
        setActiveStage(-1);
        setDotProgress(0);
        setStatusText("Signal processed. Awaiting next...");
        setSignalCount((c) => c + 1);
        setTimeout(() => {
          setSignalIdx((i) => (i + 1) % PIPELINE_SIGNALS.length);
        }, 1500);
        return;
      }

      const currentStep = stages[stepIdx];
      if (currentStep.stage !== stage) {
        stage = currentStep.stage;
        setActiveStage(stage);
        const sig = PIPELINE_SIGNALS[signalIdx];
        setConfidences((prev) => {
          const next = [...prev];
          next[stage] = sig.conf[stage];
          return next;
        });
      }
      setStatusText(currentStep.status);
      setDotProgress(stepIdx / (stages.length - 1));
      setLatency(Math.floor(elapsed / 100) * 100 + Math.floor(Math.random() * 50));
      elapsed += stepDuration / 2;
    }, stepDuration / 2);

    return () => clearInterval(iv);
  }, [signalIdx]);

  useEffect(() => {
    setConfidences([0, 0, 0, 0]);
    setActiveStage(-1);
    setDotProgress(0);
    const cleanup = cycleSignal();
    return cleanup;
  }, [cycleSignal]);

  const getConnectionPath = (fromIdx: number) => {
    const from = PIPELINE_STAGES[fromIdx];
    const to = PIPELINE_STAGES[fromIdx + 1];
    return `M ${from.x + 35} ${from.y} L ${to.x - 35} ${to.y}`;
  };

  const getDotPosition = () => {
    const totalConnections = 3;
    const progressPerConnection = 1 / totalConnections;
    const connectionIdx = Math.min(2, Math.floor(dotProgress * totalConnections));
    const localProgress = (dotProgress * totalConnections - connectionIdx) / 1;

    const from = PIPELINE_STAGES[connectionIdx];
    const to = PIPELINE_STAGES[connectionIdx + 1];
    if (!from || !to) return { x: PIPELINE_STAGES[3].x, y: PIPELINE_STAGES[3].y };

    const startX = from.x + 35;
    const endX = to.x - 35;
    return {
      x: startX + (endX - startX) * Math.min(1, localProgress),
      y: from.y,
    };
  };

  const dot = getDotPosition();
  const dirColor = signal.direction === "LONG" ? "#10b981" : signal.direction === "SHORT" ? "#ef4444" : "#f59e0b";

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", position: "relative" }}>
        <div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px" }}>
            Live Signal Pipeline
          </div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-primary)", marginTop: "4px" }}>
            Watch AI Models Process a Signal
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Signals</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#10b981" }}>{signalCount.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Latency</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: latency < 2000 ? "#10b981" : "#f59e0b" }}>{(latency / 1000).toFixed(1)}s</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "bold" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Pipeline SVG */}
      <svg viewBox="0 0 730 130" style={{ width: "100%", height: "auto", position: "relative" }}>
        <defs>
          <filter id="pipeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="connectionGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Connection lines */}
        {[0, 1, 2].map((i) => {
          const isActive = activeStage > i || (activeStage === i && dotProgress > i / 3);
          return (
            <path
              key={`conn-${i}`}
              d={getConnectionPath(i)}
              fill="none"
              stroke={isActive ? PIPELINE_STAGES[i + 1].color : "var(--border-color)"}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? "8 4" : "none"}
              strokeOpacity={isActive ? 0.8 : 0.3}
              className={isActive ? "pipeline-connection-active" : ""}
              style={{ transition: "stroke 0.3s, stroke-opacity 0.3s" }}
            />
          );
        })}

        {/* Nodes */}
        {PIPELINE_STAGES.map((node, i) => {
          const isActive = activeStage === i;
          const isPast = activeStage > i;
          return (
            <g key={node.id}>
              {/* Glow ring */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="36"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity="0.3"
                  className="pipeline-node-active"
                  style={{ "--glow-color": node.color } as React.CSSProperties}
                />
              )}
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="28"
                fill={isActive ? node.color + "25" : isPast ? node.color + "15" : node.color + "08"}
                stroke={node.color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 1 : isPast ? 0.6 : 0.3}
                filter={isActive ? "url(#pipeGlow)" : undefined}
                style={{ transition: "all 0.4s ease" }}
              />
              {/* Label */}
              <text x={node.x} y={node.y - 3} textAnchor="middle" fill={isActive || isPast ? node.color : "#64748b"} fontSize="11" fontWeight="bold" fontFamily="inherit"
                style={{ transition: "fill 0.3s" }}>
                {node.label}
              </text>
              <text x={node.x} y={node.y + 10} textAnchor="middle" fill={isActive ? node.color : "#64748b"} fontSize="7" fontFamily="inherit" opacity={isActive ? 0.8 : 0.5}>
                {node.role}
              </text>
              {/* Confidence badge */}
              {confidences[i] > 0 && (
                <g>
                  <rect x={node.x - 16} y={node.y + 20} width="32" height="16" rx="4" fill={node.color + "20"} stroke={node.color} strokeWidth="0.5" strokeOpacity="0.4" />
                  <text x={node.x} y={node.y + 31} textAnchor="middle" fill={node.color} fontSize="9" fontWeight="bold" fontFamily="inherit">
                    {confidences[i]}%
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Traveling signal dot */}
        {activeStage >= 0 && (
          <g>
            <circle cx={dot.x} cy={dot.y} r="8" fill={dirColor} opacity="0.15" />
            <circle cx={dot.x} cy={dot.y} r="4" fill={dirColor} filter="url(#pipeGlow)">
              <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          padding: "10px 16px",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            padding: "3px 10px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "bold",
            background: dirColor + "20",
            color: dirColor,
            border: `1px solid ${dirColor}44`,
          }}>
            {signal.pair} {signal.direction}
          </span>
          <span className="pipeline-status-enter" key={statusText} style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {statusText}
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {activeStage >= 0 && (
            <div style={{ display: "flex", gap: "4px" }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i <= activeStage ? PIPELINE_STAGES[i].color : "var(--border-color)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          )}
          <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
            {signal.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setPulsePhase((p) => (p + 1) % ARCH_CONNECTIONS.length), 800);
    return () => clearInterval(iv);
  }, []);

  const nodeMap = Object.fromEntries(ARCH_NODES.map((n) => [n.id, n]));

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "16px" }}>
        Interactive Architecture — Click nodes to explore
        <span
          className="animate-pulse"
          style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }}
        />
      </div>

      <svg viewBox="0 0 600 340" role="img" aria-label="CoreIntent architecture diagram showing data flow from AI models through the engine to exchanges and VPS" style={{ width: "100%", height: "auto", maxHeight: "360px" }}>
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {ARCH_CONNECTIONS.map((conn, i) => {
          const from = nodeMap[conn.from];
          const to = nodeMap[conn.to];
          if (!from || !to) return null;
          const isActive = i === pulsePhase || activeNode === conn.from || activeNode === conn.to;
          return (
            <g key={`${conn.from}-${conn.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? "#10b981" : "var(--border-color)"}
                strokeWidth={isActive ? 2 : 1}
                className={isActive ? "arch-flow-line" : ""}
                style={{
                  transition: "stroke 0.3s, stroke-width 0.3s",
                  opacity: isActive ? 1 : 0.4,
                }}
              />
              {isActive && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 6}
                  textAnchor="middle"
                  fill="#10b981"
                  fontSize="8"
                  fontFamily="inherit"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {ARCH_NODES.map((node) => {
          const isActive = activeNode === node.id;
          return (
            <g
              key={node.id}
              className="arch-node"
              onClick={() => setActiveNode(isActive ? null : node.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Outer glow ring */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity="0.3"
                  className="arch-node-circle"
                  style={{ color: node.color }}
                />
              )}
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="24"
                fill={isActive ? node.color + "33" : node.color + "18"}
                stroke={node.color}
                strokeWidth={isActive ? 2 : 1}
                filter={isActive ? "url(#nodeGlow)" : undefined}
                style={{ transition: "all 0.3s ease" }}
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y - 2}
                textAnchor="middle"
                fill={node.color}
                fontSize="10"
                fontWeight="bold"
                fontFamily="inherit"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="7"
                fontFamily="inherit"
              >
                {node.role}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Node detail panel */}
      {activeNode && (() => {
        const node = nodeMap[activeNode];
        if (!node) return null;
        const conns = ARCH_CONNECTIONS.filter((c) => c.from === activeNode || c.to === activeNode);
        return (
          <div
            className="animate-fade-in"
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              background: "var(--bg-primary)",
              border: `1px solid ${node.color}44`,
              borderRadius: "8px",
              borderLeft: `3px solid ${node.color}`,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "bold", color: node.color, marginBottom: "4px" }}>
              {node.label} — {node.role}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Connections: {conns.map((c) => {
                const other = c.from === activeNode ? c.to : c.from;
                return `${nodeMap[other]?.label} (${c.label})`;
              }).join(" · ")}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function StackPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, padding: "48px 24px", fontFamily: "inherit" }} aria-label="Technology Stack">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>The Stack</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
            Full API orchestra powering CoreIntent / Zynthio
          </p>

          {/* Live Signal Pipeline */}
          <LiveSignalPipeline />

          {/* Architecture Diagram */}
          <ArchitectureDiagram />

          {/* AI Services */}
          <h2 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            AI Services
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {AI_SERVICES.map((svc) => (
              <div
                key={svc.name}
                className="card-hover"
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
                className="card-hover"
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
