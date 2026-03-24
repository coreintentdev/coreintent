"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WELCOME_BANNER = `\x1b[36m
 ██████╗ ██████╗ ██████╗ ███████╗██╗███╗   ██╗████████╗███████╗███╗   ██╗████████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
██║     ██║   ██║██████╔╝█████╗  ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║
██║     ██║   ██║██╔══██╗██╔══╝  ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║
╚██████╗╚██████╔╝██║  ██║███████╗██║██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝
\x1b[0m
\x1b[33mZynthio.ai Trading Engine v0.1.0-alpha\x1b[0m
Type \x1b[32mhelp\x1b[0m for available commands.
`;

// Static commands that don't need API calls
const STATIC_COMMANDS: Record<string, string> = {
  help: `Available commands:
  \x1b[32mstatus\x1b[0m      - Engine status \x1b[90m(live)\x1b[0m
  \x1b[32mportfolio\x1b[0m   - View portfolio \x1b[90m(live)\x1b[0m
  \x1b[32mmarket\x1b[0m      - Market overview \x1b[90m(live)\x1b[0m
  \x1b[32magents\x1b[0m      - List AI agents \x1b[90m(live)\x1b[0m
  \x1b[32msignals\x1b[0m     - Trading signals \x1b[90m(live)\x1b[0m
  \x1b[32mincidents\x1b[0m   - Service incidents \x1b[90m(live)\x1b[0m
  \x1b[32mprotect\x1b[0m     - F18 security scan \x1b[90m(live)\x1b[0m
  \x1b[32mconfig\x1b[0m      - Show configuration
  \x1b[32mstack\x1b[0m       - Show API orchestra & tools
  \x1b[32msave\x1b[0m        - Autosave status & costs \x1b[90m(live)\x1b[0m
  \x1b[32mclear\x1b[0m       - Clear terminal
  \x1b[32mversion\x1b[0m     - Show version info

  \x1b[33mNo coding needed.\x1b[0m Just type commands — AI does the rest.`,

  config: `\x1b[36mConfiguration:\x1b[0m
  Risk Level:       Medium
  Max Position:     10% portfolio
  Stop Loss:        -5%
  Take Profit:      +15%
  Rebalance:        Daily @ 00:00 UTC
  AI Confidence:    > 0.75 required`,

  stack: `\x1b[36mAPI Orchestra & Tools:\x1b[0m
  \x1b[33mAI Services:\x1b[0m
    Grok Pro        - Signal detection (fast, near-free via X Premium+)
    Claude API      - Deep analysis, risk, agent orchestration
    Perplexity Max  - Research, 9 connectors, cross-source verification
    Gemini          - Gmail/Drive scanning & organization

  \x1b[33mExchanges:\x1b[0m
    Binance         - CEX, 500+ pairs (planned)
    Coinbase        - CEX, 200+ pairs (planned)
    gTrade          - DeFi Polygon/Arbitrum (planned)

  \x1b[33mInfrastructure:\x1b[0m
    Cloudflare Pro  - CDN, WAF, DDoS, DNS
    Vercel          - Next.js hosting, edge functions
    Cloudzy VPS     - Trading engine backend
    GitHub          - 5 repos, CI/CD

  \x1b[33mCustom Tools:\x1b[0m
    The Ripper      - Data extraction engine
    Mac the Zipper  - Compression & packaging
    PDF Plumber     - Document parsing
    AI-to-AI Transfer - Cross-model context pipeline`,

  version: `CoreIntent v0.1.0-alpha
Zynthio Trading Engine — Command Center for everyone
Built with Next.js 14 + TypeScript (strict)
No coding required. AI handles the code.
\x1b[90mPaper trading mode — no real money at risk\x1b[0m`,
};

// Format API responses into ANSI terminal output
function formatStatus(data: Record<string, unknown>): string {
  const engine = data.engine === "online" ? "\x1b[32m● ENGINE ONLINE\x1b[0m" : "\x1b[31m● ENGINE OFFLINE\x1b[0m";
  const exchanges = data.exchanges as Record<string, string> | undefined;
  const ai = data.ai as Record<string, string> | undefined;
  const signals = data.signals as Record<string, number> | undefined;
  const cb = data.circuitBreaker as Record<string, unknown> | undefined;

  let out = `${engine}
  Mode:       \x1b[33m${data.mode || "unknown"}\x1b[0m
  Version:    ${data.version || "?"}
  Uptime:     ${Math.floor((data.uptime as number || 0))}s`;

  if (exchanges) {
    out += `\n\n  \x1b[36mExchanges:\x1b[0m`;
    for (const [name, status] of Object.entries(exchanges)) {
      const icon = status === "connected" ? "\x1b[32m●\x1b[0m" : status === "pending" ? "\x1b[33m◐\x1b[0m" : "\x1b[31m○\x1b[0m";
      out += `\n    ${icon} ${name}: ${status}`;
    }
  }

  if (ai) {
    out += `\n\n  \x1b[36mAI Models:\x1b[0m`;
    for (const [name, status] of Object.entries(ai)) {
      const icon = status === "active" ? "\x1b[32m●\x1b[0m" : "\x1b[33m◐\x1b[0m";
      out += `\n    ${icon} ${name}: ${status}`;
    }
  }

  if (signals) {
    out += `\n\n  Signals: \x1b[32m${signals.active} active\x1b[0m | ${signals.pending} pending`;
  }

  if (cb) {
    out += `\n  Circuit Breaker: ${cb.status === "armed" ? "\x1b[32m" : "\x1b[31m"}${cb.status}\x1b[0m (threshold: ${((cb.threshold as number) * 100).toFixed(1)}%)`;
  }

  return out;
}

function formatPortfolio(data: Record<string, unknown>): string {
  const holdings = data.holdings as Array<Record<string, unknown>> | undefined;
  if (!holdings || holdings.length === 0) return "\x1b[33mNo holdings data\x1b[0m";

  let out = `\x1b[36m┌─────────┬──────────┬───────────┬──────────┐
│ Asset   │ Balance  │ Value ($) │ Change   │
├─────────┼──────────┼───────────┼──────────┤\x1b[0m`;

  for (const h of holdings) {
    const change = h.change24h as number;
    const changeColor = change > 0 ? "\x1b[32m+" : change < 0 ? "\x1b[31m" : "";
    const changeStr = `${changeColor}${change}%\x1b[0m`;
    const val = (h.value as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const bal = typeof h.balance === "number" ? (h.balance as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : String(h.balance);
    out += `\n\x1b[36m│\x1b[0m ${String(h.asset).padEnd(7)} \x1b[36m│\x1b[0m ${bal.padStart(8)} \x1b[36m│\x1b[0m ${val.padStart(9)} \x1b[36m│\x1b[0m ${changeStr.padEnd(8)} \x1b[36m│\x1b[0m`;
  }

  out += `\n\x1b[36m├─────────┼──────────┼───────────┼──────────┤\x1b[0m`;
  const total = (data.totalValue as number || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
  out += `\n\x1b[36m│\x1b[0m \x1b[33mTOTAL\x1b[0m   \x1b[36m│\x1b[0m          \x1b[36m│\x1b[0m ${total.padStart(9)} \x1b[36m│\x1b[0m          \x1b[36m│\x1b[0m`;
  out += `\n\x1b[36m└─────────┴──────────┴───────────┴──────────┘\x1b[0m`;
  out += `\n  Mode: \x1b[33m${data.mode || "?"}\x1b[0m | Currency: ${data.currency || "?"}`;

  return out;
}

function formatMarket(data: Record<string, unknown>): string {
  const pairs = data.pairs as Array<Record<string, unknown>> | undefined;
  if (!pairs || pairs.length === 0) return "\x1b[33mNo market data\x1b[0m";

  let out = `\x1b[33mMarket Overview\x1b[0m`;
  for (const p of pairs) {
    const change = p.change24h as number;
    const arrow = change >= 0 ? "\x1b[32m▲" : "\x1b[31m▼";
    const vol = ((p.volume as number) / 1e9).toFixed(1);
    const price = (p.price as number).toLocaleString("en-US", { maximumFractionDigits: 2 });
    out += `\n  ${String(p.symbol).padEnd(10)} $${price.padEnd(8)} ${arrow} ${Math.abs(change)}%\x1b[0m   Vol: $${vol}B`;
  }
  out += `\n\n  Fear/Greed Index: \x1b[33m${data.fearGreedIndex} (${data.sentiment})\x1b[0m`;
  return out;
}

function formatAgents(data: Record<string, unknown>): string {
  const agents = data.agents as Array<Record<string, unknown>> | undefined;
  if (!agents || agents.length === 0) return "\x1b[33mNo agents running\x1b[0m";

  let out = `\x1b[36mAI Agent Fleet:\x1b[0m  Active: ${data.totalActive} | Paused: ${data.totalPaused} | Processing: ${data.totalProcessing}`;
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    const statusIcon = a.status === "active" ? "\x1b[32m●\x1b[0m"
      : a.status === "processing" ? "\x1b[33m◐\x1b[0m"
      : "\x1b[31m○\x1b[0m";
    const uptime = a.uptime ? `${Math.floor((a.uptime as number) / 60)}m` : "0m";
    out += `\n  [${i + 1}] ${statusIcon} ${String(a.name).padEnd(16)} \x1b[90m${a.model}\x1b[0m`;
    out += `\n      Task: ${a.task}  Uptime: ${uptime}`;
  }
  return out;
}

function formatSignals(data: Record<string, unknown>): string {
  const signals = data.signals as Array<Record<string, unknown>> | undefined;
  if (!signals || signals.length === 0) return "\x1b[33mNo signals\x1b[0m";

  let out = `\x1b[36mTrading Signals:\x1b[0m  Active: ${data.totalActive} | Pending: ${data.totalPending} | Min Confidence: ${data.minConfidence}`;
  for (const s of signals) {
    const conf = s.confidence as number;
    const confColor = conf >= 0.8 ? "\x1b[32m" : conf >= 0.7 ? "\x1b[33m" : "\x1b[31m";
    const dir = s.direction === "long" ? "\x1b[32m▲ LONG\x1b[0m" : "\x1b[31m▼ SHORT\x1b[0m";
    out += `\n  ${String(s.pair).padEnd(10)} ${dir}  Confidence: ${confColor}${(conf * 100).toFixed(0)}%\x1b[0m  Source: ${s.source}`;
  }
  return out;
}

function formatIncidents(data: Record<string, unknown>): string {
  const incidents = data.incidents as Array<Record<string, unknown>> | undefined;
  if (!incidents || incidents.length === 0) return "\x1b[32mNo incidents\x1b[0m";

  const summary = data.summary as Record<string, number> | undefined;
  let out = `\x1b[36mService Incidents:\x1b[0m`;
  if (summary) {
    out += `  Critical: \x1b[31m${summary.critical || 0}\x1b[0m | Major: \x1b[33m${summary.major || 0}\x1b[0m | Minor: ${summary.minor || 0}`;
  }
  for (const inc of incidents) {
    const sevColor = inc.severity === "critical" ? "\x1b[31m" : inc.severity === "major" ? "\x1b[33m" : "\x1b[90m";
    out += `\n  ${sevColor}[${inc.id}]\x1b[0m ${inc.title}`;
    out += `\n      Status: ${inc.status} | Severity: ${sevColor}${inc.severity}\x1b[0m`;
  }
  return out;
}

function formatProtect(data: Record<string, unknown>): string {
  const scans = data.scans as Record<string, Record<string, unknown>> | undefined;
  let out = `\x1b[36mF18 Security — Digital Identity Protection\x1b[0m`;
  out += `\n  Status: \x1b[32m${data.status || "unknown"}\x1b[0m`;

  if (scans) {
    for (const [name, scan] of Object.entries(scans)) {
      const live = scan.live ? "\x1b[32m●\x1b[0m" : "\x1b[33m◐\x1b[0m";
      out += `\n\n  ${live} \x1b[33m${name}\x1b[0m (${scan.source || "?"})`;
      const content = String(scan.content || "").substring(0, 200);
      if (content) out += `\n      ${content}${String(scan.content || "").length > 200 ? "..." : ""}`;
    }
  }
  return out;
}

function formatSave(data: Record<string, unknown>): string {
  let out = `\x1b[36mAutosave & Outsource Status:\x1b[0m`;
  const config = data.autosave as Record<string, unknown> | undefined;
  if (config) {
    out += `\n  Autosave: \x1b[32m${config.enabled ? "ON" : "OFF"}\x1b[0m`;
  }

  const cost = data.costAnalysis as Record<string, unknown> | undefined;
  if (cost) {
    out += `\n\n  \x1b[33mCost Breakdown:\x1b[0m`;
    out += `\n    Current monthly:   ~$${cost.currentMonthly || "?"}`;
    out += `\n    Replaces:          ~$${cost.equivalentIfSeparate || "?"}/mo`;
    out += `\n    \x1b[32mSavings:           ~$${cost.monthlySavings || "?"}/mo ($${cost.annualSavings || "?"}/yr)\x1b[0m`;
  }

  const backends = data.saveBackends as Array<Record<string, string>> | undefined;
  if (backends) {
    out += `\n\n  \x1b[33mSave Backends:\x1b[0m`;
    for (const b of backends) {
      out += `\n    \x1b[32m●\x1b[0m ${b.name} — ${b.description}`;
    }
  }
  return out;
}

// API-powered commands: endpoint + formatter
const API_COMMANDS: Record<string, { endpoint: string; format: (data: Record<string, unknown>) => string }> = {
  status:    { endpoint: "/api/status",    format: formatStatus },
  portfolio: { endpoint: "/api/portfolio", format: formatPortfolio },
  market:    { endpoint: "/api/market",    format: formatMarket },
  agents:    { endpoint: "/api/agents",    format: formatAgents },
  signals:   { endpoint: "/api/signals",   format: formatSignals },
  incidents: { endpoint: "/api/incidents", format: formatIncidents },
  protect:   { endpoint: "/api/protect",   format: formatProtect },
  save:      { endpoint: "/api/autosave",  format: formatSave },
};

export default function Terminal() {
  const termRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines([WELCOME_BANNER]);
  }, []);

  // Auto-scroll to bottom when new lines appear
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  const addLines = useCallback((...newLines: string[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const processCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    // Check static commands first
    if (STATIC_COMMANDS[trimmed]) {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, STATIC_COMMANDS[trimmed], "");
      return;
    }

    // Check API-powered commands
    const apiCmd = API_COMMANDS[trimmed];
    if (apiCmd) {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[90mFetching ${trimmed}...\x1b[0m`);
      try {
        const res = await fetch(apiCmd.endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Replace the "Fetching..." line with actual data
        setLines((prev) => {
          const copy = [...prev];
          // Find and remove the "Fetching..." line
          const fetchIdx = copy.lastIndexOf(`\x1b[90mFetching ${trimmed}...\x1b[0m`);
          if (fetchIdx !== -1) copy.splice(fetchIdx, 1);
          return [...copy, apiCmd.format(data), ""];
        });
      } catch (err) {
        setLines((prev) => {
          const copy = [...prev];
          const fetchIdx = copy.lastIndexOf(`\x1b[90mFetching ${trimmed}...\x1b[0m`);
          if (fetchIdx !== -1) copy.splice(fetchIdx, 1);
          return [...copy, `\x1b[31mError: ${err instanceof Error ? err.message : "Failed to fetch"}\x1b[0m`, ""];
        });
      }
      return;
    }

    // Unknown command
    addLines(
      `\x1b[32m❯\x1b[0m ${cmd}`,
      `\x1b[31mUnknown command: ${trimmed}\x1b[0m\nType \x1b[32mhelp\x1b[0m for available commands.`,
      ""
    );
  }, [addLines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory((prev) => [input, ...prev]);
    setHistoryIdx(-1);
    processCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      if (history[next]) setInput(history[next]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    }
  };

  // Strip ANSI for plain render — we use dangerouslySetInnerHTML with converted spans
  const ansiToHtml = (text: string) => {
    const map: Record<string, string> = {
      "30": "#1e1e2e", "31": "#ef4444", "32": "#10b981", "33": "#f59e0b",
      "34": "#3b82f6", "35": "#a855f7", "36": "#06b6d4", "37": "#e2e8f0",
      "90": "#64748b", "0": "",
    };
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/\x1b\[(\d+)m/g, (_match, code) => {
      if (code === "0") return "</span>";
      const color = map[code];
      return color ? `<span style="color:${color}">` : "";
    });
    return html;
  };

  return (
    <div
      style={{
        background: "var(--bg-terminal)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: "#161b22",
          borderBottom: "1px solid var(--border-color)",
          fontSize: "12px",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
        <span style={{ marginLeft: "8px", color: "var(--text-secondary)" }}>
          coreintent — zynthio terminal
        </span>
      </div>

      {/* Terminal output */}
      <div
        ref={termRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "12px",
          fontFamily: "inherit",
          fontSize: "13px",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          cursor: "text",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: ansiToHtml(line) }} />
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "var(--accent-green)", marginRight: "8px" }}>❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "13px",
              caretColor: "var(--accent-green)",
            }}
          />
        </form>
      </div>
    </div>
  );
}
