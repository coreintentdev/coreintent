"use client";

import { useEffect, useRef, useState } from "react";

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

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  \x1b[32mstatus\x1b[0m      - Engine status
  \x1b[32mportfolio\x1b[0m   - View portfolio
  \x1b[32mmarket\x1b[0m      - Market overview
  \x1b[32magents\x1b[0m      - List active AI agents
  \x1b[32mconfig\x1b[0m      - Show configuration
  \x1b[32mlogs\x1b[0m        - Recent activity logs
  \x1b[32mstack\x1b[0m       - Show API orchestra & tools
  \x1b[32mscan\x1b[0m        - Gmail/Drive AI scan status
  \x1b[32mclear\x1b[0m       - Clear terminal
  \x1b[32mversion\x1b[0m     - Show version info`,

  status: `\x1b[32m● ENGINE ONLINE\x1b[0m
  Uptime:     0d 0h 0m
  Mode:       \x1b[33mPaper Trading\x1b[0m
  Exchanges:  Binance (connected), Coinbase (pending)
  AI Model:   Claude Opus 4.6
  Signals:    12 active | 3 pending`,

  portfolio: `\x1b[36m┌─────────┬──────────┬───────────┬──────────┐
│ Asset   │ Balance  │ Value ($) │ Change   │
├─────────┼──────────┼───────────┼──────────┤
│ BTC     │ 0.4521   │ 28,432.10 │ \x1b[32m+2.4%\x1b[36m    │
│ ETH     │ 5.2300   │  9,841.50 │ \x1b[32m+1.8%\x1b[36m    │
│ SOL     │ 120.00   │  4,320.00 │ \x1b[31m-0.6%\x1b[36m    │
│ USDC    │ 7,406.40 │  7,406.40 │  0.0%    │
├─────────┼──────────┼───────────┼──────────┤
│ TOTAL   │          │ 50,000.00 │ \x1b[32m+1.9%\x1b[36m    │
└─────────┴──────────┴───────────┴──────────┘\x1b[0m`,

  market: `\x1b[33mMarket Overview (live)\x1b[0m
  BTC/USD   $62,900  \x1b[32m▲ 2.4%\x1b[0m   Vol: $28.4B
  ETH/USD   $1,882   \x1b[32m▲ 1.8%\x1b[0m   Vol: $12.1B
  SOL/USD   $36.00   \x1b[31m▼ 0.6%\x1b[0m   Vol: $1.8B
  Fear/Greed Index: \x1b[33m58 (Neutral)\x1b[0m`,

  agents: `\x1b[36mActive AI Agents:\x1b[0m
  [1] \x1b[32m●\x1b[0m TrendFollower   - Monitoring BTC/ETH momentum
  [2] \x1b[32m●\x1b[0m MeanRevert      - Scanning SOL mean reversion
  [3] \x1b[33m◐\x1b[0m SentimentBot    - Processing social signals
  [4] \x1b[31m○\x1b[0m ArbitrageBot    - Paused (insufficient spread)`,

  config: `\x1b[36mConfiguration:\x1b[0m
  Risk Level:       Medium
  Max Position:     10% portfolio
  Stop Loss:        -5%
  Take Profit:      +15%
  Rebalance:        Daily @ 00:00 UTC
  AI Confidence:    > 0.75 required`,

  logs: `\x1b[90m[03:21:14]\x1b[0m TrendFollower: BTC bullish crossover detected
\x1b[90m[03:18:02]\x1b[0m SentimentBot: Positive sentiment spike (+32%)
\x1b[90m[03:15:45]\x1b[0m System: Portfolio rebalance complete
\x1b[90m[03:12:30]\x1b[0m MeanRevert: SOL approaching lower band
\x1b[90m[03:10:11]\x1b[0m System: Binance WebSocket reconnected`,

  stack: `\x1b[36mAPI Orchestra & Tools:\x1b[0m
  \x1b[33mAI Services:\x1b[0m
    Grok Pro        - Signal detection (fast, near-free via X Premium+)
    Claude API      - Deep analysis, risk, agent orchestration
    Perplexity Max  - Research, 9 connectors, cross-source verification
    Gemini          - Gmail/Drive scanning & organization

  \x1b[33mExchanges:\x1b[0m
    Binance         - CEX, 500+ pairs
    Coinbase        - CEX, 200+ pairs
    gTrade          - DeFi (Polygon/Arbitrum)

  \x1b[33mInfrastructure:\x1b[0m
    Cloudflare Pro  - CDN, WAF, DDoS, DNS
    Vercel          - Next.js hosting, edge functions
    Cloudzy VPS     - Trading engine backend
    GitHub          - 5 repos, CI/CD

  \x1b[33mCustom Tools:\x1b[0m
    The Ripper      - Data extraction engine
    Mac the Zipper  - Compression & packaging
    PDF Plumber     - Document parsing
    AI-to-AI Transfer - Cross-model context pipeline

  \x1b[33mStorage & Hosting:\x1b[0m
    Google Drive    - Cloud storage (Gemini-scanned)
    Notion          - Documentation hub
    Domain hosting  - coreintent.dev

  \x1b[33mPlatforms:\x1b[0m
    X Premium+, Linear, Slack, Jira, Asana, Confluence`,

  scan: `\x1b[36mGmail + Drive AI Scan:\x1b[0m
  \x1b[32m●\x1b[0m Gmail (Gemini)    - Scanning inbox, categorizing, auto-labeling
  \x1b[32m●\x1b[0m Google Drive      - Indexing docs, extracting insights
  \x1b[33m◐\x1b[0m AI-to-AI Transfer - Syncing context across Claude/Grok/Perplexity

  Use this to reorganize your life:
  - Email triage & priority sorting
  - Document summarization
  - Calendar optimization
  - Cross-platform context sync`,

  version: `CoreIntent v0.1.0-alpha
Zynthio Trading Engine
Built with Next.js + xterm.js
Node runtime for local & web`,
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

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === "clear") {
      setLines([]);
      return;
    }
    const output = COMMANDS[trimmed];
    const response = output
      ? output
      : `\x1b[31mUnknown command: ${trimmed}\x1b[0m\nType \x1b[32mhelp\x1b[0m for available commands.`;

    setLines((prev) => [...prev, `\x1b[32m❯\x1b[0m ${cmd}`, response, ""]);
  };

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
