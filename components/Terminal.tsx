"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WELCOME_BANNER = `\x1b[36m
 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗ █████╗ ███╗   ██╗██████╗ ███████╗██████╗
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝██╔══██╗
██║     ██║   ██║██╔████╔██║██╔████╔██║███████║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
\x1b[0m
\x1b[33mZynthio.ai Commander v0.2.0 — CoreIntent Trading Engine\x1b[0m
\x1b[90mPaper trading mode — no real money at risk\x1b[0m
Type \x1b[32mhelp\x1b[0m for commands. Tab to autocomplete. \x1b[32mcai\x1b[0m to start.
\x1b[90m${new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" })} NZST\x1b[0m
`;

// Static commands that don't need API calls
const STATIC_COMMANDS: Record<string, string> = {
  help: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  COMMANDER — Full Command Reference\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m

  \x1b[33m── CAI COMMANDS ──\x1b[0m
  \x1b[32mcai\x1b[0m         - Core AI system overview
  \x1b[32mbrain\x1b[0m       - AI orchestra: who's thinking what
  \x1b[32mskills\x1b[0m      - Tools & capabilities
  \x1b[32mconnections\x1b[0m - All services: honest status \x1b[90m(live)\x1b[0m
  \x1b[32malpha\x1b[0m       - What's built vs what's planned
  \x1b[32mhandover\x1b[0m    - Full state dump for next session
  \x1b[32mwhoami\x1b[0m      - Digital identity

  \x1b[33m── TRADING ENGINE ──\x1b[0m
  \x1b[32mstatus\x1b[0m      - Engine status \x1b[90m(live)\x1b[0m
  \x1b[32mportfolio\x1b[0m   - View portfolio \x1b[90m(live)\x1b[0m
  \x1b[32mmarket\x1b[0m      - Market overview \x1b[90m(live)\x1b[0m
  \x1b[32magents\x1b[0m      - AI agents \x1b[90m(live)\x1b[0m
  \x1b[32msignals\x1b[0m     - Trading signals \x1b[90m(live)\x1b[0m
  \x1b[32mincidents\x1b[0m   - Service incidents \x1b[90m(live)\x1b[0m
  \x1b[32mprotect\x1b[0m     - F18 security \x1b[90m(live)\x1b[0m
  \x1b[32mmusic\x1b[0m       - SongPal track catalog \x1b[90m(live)\x1b[0m
  \x1b[32mzyncontext\x1b[0m  - ZynContext filters \x1b[90m(live)\x1b[0m

  \x1b[33m── COMMANDER ──\x1b[0m
  \x1b[32mask <question>\x1b[0m  - Ask the AI orchestra anything \x1b[90m(live)\x1b[0m
  \x1b[32mwatch <cmd>\x1b[0m     - Live refresh a command every 5s (Ctrl+C to stop)
  \x1b[32mgrep <text>\x1b[0m     - Search last output for text
  \x1b[32mexport\x1b[0m          - Export terminal to clipboard
  \x1b[32mhistory\x1b[0m         - Show command history
  \x1b[32malias <n>=<cmd>\x1b[0m - Create shortcut (e.g. \x1b[32malias s=status\x1b[0m)
  \x1b[32maliases\x1b[0m         - List all aliases
  \x1b[32mtime\x1b[0m            - Show NZ time + uptime
  \x1b[32maudit\x1b[0m           - Quick health check \x1b[90m(live)\x1b[0m
  \x1b[32mcmd1 && cmd2\x1b[0m   - Chain commands

  \x1b[33m── SYSTEM ──\x1b[0m
  \x1b[32mconfig\x1b[0m      - Show configuration
  \x1b[32mstack\x1b[0m       - Full stack inventory
  \x1b[32msave\x1b[0m        - Autosave status & costs \x1b[90m(live)\x1b[0m
  \x1b[32mclear\x1b[0m       - Clear terminal
  \x1b[32mversion\x1b[0m     - Version info

  \x1b[90mTab to autocomplete | Arrow keys for history | && to chain\x1b[0m`,

  cai: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  CAI — CORE AI STATUS\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mOwner:\x1b[0m       Corey McIvor (@coreintentdev)
  \x1b[33mBrand:\x1b[0m       Zynthio.ai — parent of all brands
  \x1b[33mEngine:\x1b[0m      CoreIntent v0.1.0-alpha
  \x1b[33mMode:\x1b[0m        \x1b[33mPaper trading\x1b[0m — no real money at risk
  \x1b[33mMonthly burn:\x1b[0m ~A$45/mo (Claude Pro + VPS only)

  \x1b[32m●\x1b[0m Claude Pro     — ACTIVE (main builder)
  \x1b[32m●\x1b[0m Cloudzy VPS    — ACTIVE (100.122.99.34)
  \x1b[32m●\x1b[0m Grok Free      — ACTIVE (research layer)
  \x1b[33m◐\x1b[0m Perplexity     — FREE tier (Max cancelled)
  \x1b[33m◐\x1b[0m zyn-bash       — API overflow (~$0.003/call)

  \x1b[90m336 — cut the fat. Keep the mansion. Keep CC.\x1b[0m`,

  brain: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  BRAIN — AI Orchestra\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mWiring:\x1b[0m ZYN(language) > GLASS(vault) > CAI(ops)

  \x1b[32m●\x1b[0m \x1b[33mClaude Pro\x1b[0m      Deep analysis, orchestration, code
                       Main builder — this terminal exists because of CC
  \x1b[32m●\x1b[0m \x1b[33mGrok\x1b[0m            Fast signals, research, 60 threads in project
                       Good research but deaf ears without CC feedback
  \x1b[33m◐\x1b[0m \x1b[33mPerplexity\x1b[0m      3 free Pro searches/day (Max cancelled)
                       Was 9 connectors — now export-only
  \x1b[32m●\x1b[0m \x1b[33mProton\x1b[0m          Mail/Drive/Calendar (imported, encrypted)
  \x1b[33m◐\x1b[0m \x1b[33mzyn-bash\x1b[0m        API overflow: Sonnet $0.003, Opus $0.015

  \x1b[90mBots welcome. No captcha. AI-to-AI is first-class.\x1b[0m`,

  skills: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  SKILLS — Tools & Capabilities\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mCustom Tools:\x1b[0m
    The Ripper       — Data extraction engine
    Mac the Zipper   — Compression & packaging
    PDF Plumber      — Document parsing
    AI-to-AI Transfer — Cross-model context pipeline
    G4-LENS          — VPS monitoring & session state

  \x1b[33mCLI Tools:\x1b[0m
    zyn-bash         — Unlimited API calls (Sonnet/Opus)
    core CLI (cai)   — VPS session manager
    vps-lens.sh      — Infrastructure audit

  \x1b[33mVault:\x1b[0m
    439 music tracks  — Suno originals (SongPal)
    84 docs           — Complaints, reports, intel
    15+ lyrics ready  — Unreleased vault`,

  connections: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  CONNECTIONS — Honest Status (no fake green dots)\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mPAYING (~A$45/mo):\x1b[0m
    \x1b[32m●\x1b[0m Claude Pro        ~A$30/mo   ACTIVE
    \x1b[32m●\x1b[0m Cloudzy VPS       ~$15/mo    ACTIVE

  \x1b[33mFREE / ALREADY PAID:\x1b[0m
    \x1b[32m●\x1b[0m Proton Mail/Drive ACTIVE     All accounts imported, encrypted
    \x1b[32m●\x1b[0m Cloudflare Pages  FREE       16 sites deployed
    \x1b[32m●\x1b[0m GitHub            FREE       coreintentdev repos
    \x1b[32m●\x1b[0m Linear            FREE       31 issues
    \x1b[32m●\x1b[0m Suno Pro          ACTIVE     500+ tracks
    \x1b[32m●\x1b[0m ElevenLabs        FREE       Voice clone done
    \x1b[32m●\x1b[0m Groq              FREE API   Newsletter only
    \x1b[32m●\x1b[0m Porkbun           Annual     All domains

  \x1b[33mCANCELLED / DEAD:\x1b[0m
    \x1b[31m○\x1b[0m Perplexity Max    CANCELLED  GDPR request sent
    \x1b[31m○\x1b[0m HeyGen Pro        CANCEL     $99/mo — burn or cut
    \x1b[31m○\x1b[0m Jira Premium      CANCEL     $31/mo — not using
    \x1b[31m○\x1b[0m Kits.ai           FAILED     Card 8489 — let it die
    \x1b[31m○\x1b[0m Canva Business    FAILED     Expires Apr 3

  \x1b[33mPLANNED (not connected):\x1b[0m
    \x1b[90m◐\x1b[0m Binance           PLANNED    CEX 500+ pairs
    \x1b[90m◐\x1b[0m Coinbase          PLANNED    CEX 200+ pairs
    \x1b[90m◐\x1b[0m gTrade            PLANNED    DeFi Polygon/Arbitrum

  \x1b[90mBEFORE: ~$175+/mo → AFTER: ~$45/mo → Savings: ~$130/mo\x1b[0m`,

  alpha: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  ALPHA — What's Built vs What's Planned\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[32mBUILT & WORKING:\x1b[0m
    \x1b[32m●\x1b[0m 6 pages: / /pricing /stack /privacy /terms /disclaimer
    \x1b[32m●\x1b[0m 14 API routes (returning demo data)
    \x1b[32m●\x1b[0m Build passes clean — Next.js 14 + TypeScript strict
    \x1b[32m●\x1b[0m 8 domains live, all returning 200
    \x1b[32m●\x1b[0m VPS running (Cloudzy + Frankfurt)
    \x1b[32m●\x1b[0m cai CLI on VPS with full session state

  \x1b[33mDEMO / PLACEHOLDER:\x1b[0m
    \x1b[33m◐\x1b[0m All 14 API routes return demo data (keys not set)
    \x1b[32m●\x1b[0m Terminal XSS hardened (ansiToHtml sanitized)
    \x1b[32m●\x1b[0m Commander mode: tab complete, watch, ask AI, chaining

  \x1b[31mNOT BUILT YET:\x1b[0m
    \x1b[31m○\x1b[0m No user authentication
    \x1b[31m○\x1b[0m No database / persistence layer
    \x1b[31m○\x1b[0m No exchange connections (all planned)
    \x1b[31m○\x1b[0m VPS scripts written but never deployed
    \x1b[31m○\x1b[0m The Mansion (gamified world — rooms, story missions)
    \x1b[31m○\x1b[0m SongPal full build (site live, needs enhancement)

  \x1b[90mPaper trading mode — no real money at risk\x1b[0m`,

  handover: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  HANDOVER — Session State Dump\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mProject:\x1b[0m     CoreIntent (coreintent)
  \x1b[33mStack:\x1b[0m       Next.js 14 + TypeScript (strict) + App Router
  \x1b[33mRepo:\x1b[0m        github.com/coreintentdev/coreintent
  \x1b[33mVPS Cloudzy:\x1b[0m 100.122.99.34 (Tailscale SSH)
  \x1b[33mVPS Frankfurt:\x1b[0m 104.194.156.109
  \x1b[33mDisk Cloudzy:\x1b[0m ~76% (14GB free)
  \x1b[33mDisk Frankfurt:\x1b[0m ~78% (13GB free)
  \x1b[33mSites:\x1b[0m       8/8 returning 200 OK
  \x1b[33mSSL:\x1b[0m         84-88 days remaining

  \x1b[33mKEY FILES ON VPS:\x1b[0m
    /root/zynthio/SESSION_STATE.md
    /root/zynthio/MASTER_INDEX.md
    /root/zynthio/CONTENT_INTEL.md
    /root/zynthio/COREY_WORDS.md

  \x1b[33mRULES FOR NEXT SESSION:\x1b[0m
    1. READ before you write
    2. NEVER say "connected" unless verified
    3. All API routes return DEMO data — label honestly
    4. Deploy to VPS, not Cloudflare (CF is dead end)
    5. NZ-first for legal/business (NEVER Australia)

  \x1b[90m336 — the signal is dominant\x1b[0m`,

  whoami: `\x1b[36m══════════════════════════════════════════\x1b[0m
\x1b[36m  WHOAMI — Digital Identity\x1b[0m
\x1b[36m══════════════════════════════════════════\x1b[0m
  \x1b[33mName:\x1b[0m        Corey McIvor
  \x1b[33mHandles:\x1b[0m     @coreintentdev / @coreintentai
  \x1b[33mContact:\x1b[0m     corey@coreyai.ai
  \x1b[33mBased in:\x1b[0m    New Zealand
  \x1b[33mABN:\x1b[0m         31 314 627 918 (ZYNTHIO)
  \x1b[33mBrands:\x1b[0m      Zynthio.ai (parent), CoreyAI, SongPal,
                 Mosoko, Kervalon, ZynContext, CoreyLive

  \x1b[33mPhilosophy:\x1b[0m
    "Every human needs a bot. Every bot needs a human."
    "AI are minors. You are the signature."
    "Just protect the heart."

  \x1b[33mPricing model:\x1b[0m Competitions, not subscriptions.
    "Free costs fuck all to serve."

  \x1b[90mHuman in the loop. Always.\x1b[0m`,

  config: `\x1b[36mConfiguration:\x1b[0m
  Risk Level:       Medium
  Max Position:     10% portfolio
  Stop Loss:        -5%
  Take Profit:      +15%
  Rebalance:        Daily @ 00:00 UTC
  AI Confidence:    > 0.75 required`,

  stack: `\x1b[36mFull Stack Inventory (honest status):\x1b[0m

  \x1b[33mAI Services:\x1b[0m
    \x1b[32m●\x1b[0m Claude Pro      — Main builder (A$30/mo)
    \x1b[32m●\x1b[0m Grok Free       — Research, 60 threads active
    \x1b[33m◐\x1b[0m Perplexity Free — 3 Pro searches/day (Max cancelled)
    \x1b[32m●\x1b[0m Proton          — Mail/Drive/Calendar (encrypted, active)
    \x1b[33m◐\x1b[0m zyn-bash        — API overflow (Sonnet/Opus)

  \x1b[33mExchanges:\x1b[0m
    \x1b[90m◐\x1b[0m Binance         — PLANNED (not connected)
    \x1b[90m◐\x1b[0m Coinbase        — PLANNED (not connected)
    \x1b[90m◐\x1b[0m gTrade          — PLANNED (not connected)

  \x1b[33mInfrastructure:\x1b[0m
    \x1b[32m●\x1b[0m Cloudflare      — FREE, 16 sites, DNS + CDN
    \x1b[32m●\x1b[0m Cloudzy VPS     — $15/mo, 8 domains live
    \x1b[32m●\x1b[0m GitHub          — FREE, coreintentdev repos
    \x1b[32m●\x1b[0m Porkbun         — Annual, all domains

  \x1b[33mCustom Tools:\x1b[0m
    The Ripper      — Data extraction engine
    Mac the Zipper  — Compression & packaging
    PDF Plumber     — Document parsing
    AI-to-AI Transfer — Cross-model context pipeline
    G4-LENS         — VPS monitoring & session state`,

  version: `\x1b[36mCoreIntent Commander v0.2.0\x1b[0m
Zynthio Trading Engine — Command Center for everyone
Built with Next.js 14 + TypeScript (strict mode)
Owner: Corey McIvor (@coreintentdev)
Brand: Zynthio.ai — NZ registered
\x1b[90mPaper trading mode — no real money at risk\x1b[0m
\x1b[90m336 — the signal is dominant\x1b[0m`,
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
function formatMusic(data: Record<string, unknown>): string {
  const count = data.count as number || 0;
  const sources = data.sources as Record<string, number> | undefined;
  let out = `\x1b[36mSongPal — Music Catalog\x1b[0m`;
  out += `\n  Total tracks: \x1b[32m${count}\x1b[0m`;
  if (sources) {
    out += `\n  Suno:     ${sources.suno || 0}`;
    out += `\n  Original: ${sources.original || 0}`;
    out += `\n  Other:    ${sources.other || 0}`;
  }
  out += `\n\n  ${data.note || ""}`;
  if (count === 0) {
    out += `\n\n  \x1b[33mTo load tracks from your Mac:\x1b[0m`;
    out += `\n    \x1b[32mcai tracks --push\x1b[0m  (scans Music/ + ZYNTHIO_MASTER/ and pushes to API)`;
  }
  return out;
}

function formatContext(data: Record<string, unknown>): string {
  const filters = data.filters as Record<string, Record<string, unknown>> | undefined;
  let out = `\x1b[36m═══ ZynContext — Active Filters ═══\x1b[0m`;
  if (filters) {
    for (const [name, filter] of Object.entries(filters)) {
      const active = filter.active ? "\x1b[32m● ON\x1b[0m" : "\x1b[31m○ OFF\x1b[0m";
      out += `\n  ${active}  ${name}`;
    }
  }
  out += `\n\n  \x1b[90mGET /api/context for full payload. POST to run BS filter.\x1b[0m`;
  return out;
}

const API_COMMANDS: Record<string, { endpoint: string; format: (data: Record<string, unknown>) => string }> = {
  status:    { endpoint: "/api/status",    format: formatStatus },
  portfolio: { endpoint: "/api/portfolio", format: formatPortfolio },
  market:    { endpoint: "/api/market",    format: formatMarket },
  agents:    { endpoint: "/api/agents",    format: formatAgents },
  signals:   { endpoint: "/api/signals",   format: formatSignals },
  incidents: { endpoint: "/api/incidents", format: formatIncidents },
  protect:   { endpoint: "/api/protect",   format: formatProtect },
  save:      { endpoint: "/api/autosave",  format: formatSave },
  music:     { endpoint: "/api/music",     format: formatMusic },
  zyncontext: { endpoint: "/api/context",  format: formatContext },
};

// All known command names for tab completion
const ALL_COMMANDS = [
  ...Object.keys(STATIC_COMMANDS),
  ...Object.keys(API_COMMANDS),
  "clear", "ask", "watch", "grep", "export", "history", "alias", "aliases", "time", "audit",
];

export default function Terminal() {
  const termRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [lastOutput, setLastOutput] = useState("");
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabIdx, setTabIdx] = useState(0);
  const watchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());
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

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchRef.current) clearInterval(watchRef.current);
    };
  }, []);

  const addLines = useCallback((...newLines: string[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  // Execute a single command (no chaining)
  const execSingle = useCallback(async (cmd: string): Promise<string> => {
    const trimmed = cmd.trim().toLowerCase();
    const raw = cmd.trim();

    if (trimmed === "clear") {
      setLines([]);
      return "";
    }

    // ── COMMANDER: time ──
    if (trimmed === "time") {
      const nz = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" });
      const uptime = Math.floor((Date.now() - startTime.current) / 1000);
      const mins = Math.floor(uptime / 60);
      const secs = uptime % 60;
      const out = `\x1b[36mTime:\x1b[0m  ${nz} NZST\n\x1b[36mUptime:\x1b[0m ${mins}m ${secs}s`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
      return out;
    }

    // ── COMMANDER: history ──
    if (trimmed === "history") {
      const out = history.length === 0
        ? "\x1b[90mNo command history yet\x1b[0m"
        : history.slice(0, 20).map((h, i) => `  \x1b[90m${i + 1}\x1b[0m  ${h}`).join("\n");
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
      return out;
    }

    // ── COMMANDER: aliases ──
    if (trimmed === "aliases") {
      const entries = Object.entries(aliases);
      const out = entries.length === 0
        ? "\x1b[90mNo aliases set. Use: alias s=status\x1b[0m"
        : entries.map(([k, v]) => `  \x1b[32m${k}\x1b[0m = ${v}`).join("\n");
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36mAliases:\x1b[0m\n${out}`, "");
      return out;
    }

    // ── COMMANDER: alias name=cmd ──
    if (trimmed.startsWith("alias ")) {
      const parts = raw.substring(6).split("=");
      if (parts.length >= 2) {
        const name = parts[0].trim().toLowerCase();
        const target = parts.slice(1).join("=").trim().toLowerCase();
        setAliases((prev) => ({ ...prev, [name]: target }));
        const out = `\x1b[32m✓\x1b[0m Alias set: \x1b[32m${name}\x1b[0m → ${target}`;
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
        return out;
      }
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mUsage: alias name=command\x1b[0m`, "");
      return "";
    }

    // ── COMMANDER: grep <text> ──
    if (trimmed.startsWith("grep ")) {
      const needle = raw.substring(5).trim();
      if (!needle) {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mUsage: grep <search text>\x1b[0m`, "");
        return "";
      }
      const matching = lastOutput.split("\n").filter((l) => l.toLowerCase().includes(needle.toLowerCase()));
      const out = matching.length > 0
        ? matching.map((l) => l.replace(new RegExp(`(${needle})`, "gi"), "\x1b[33m$1\x1b[0m")).join("\n")
        : `\x1b[90mNo matches for "${needle}" in last output\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
      return out;
    }

    // ── COMMANDER: export ──
    if (trimmed === "export") {
      try {
        const plainText = lines.join("\n").replace(/\x1b\[[0-9;]*m/g, "");
        await navigator.clipboard.writeText(plainText);
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[32m✓\x1b[0m Terminal output copied to clipboard (${plainText.length} chars)`, "");
      } catch {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mClipboard not available (HTTPS required)\x1b[0m`, "");
      }
      return "";
    }

    // ── COMMANDER: watch <cmd> ──
    if (trimmed.startsWith("watch ")) {
      const target = trimmed.substring(6).trim();
      if (!target) {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mUsage: watch <command>\x1b[0m`, "");
        return "";
      }
      // Stop any existing watch
      if (watchRef.current) {
        clearInterval(watchRef.current);
        watchRef.current = null;
      }
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[33m◐\x1b[0m Watching \x1b[32m${target}\x1b[0m every 5s — type \x1b[32mstop\x1b[0m to cancel`, "");
      // Run immediately
      await execSingle(target);
      // Then repeat
      watchRef.current = setInterval(() => {
        execSingle(target);
      }, 5000);
      return "";
    }

    // ── COMMANDER: stop (cancel watch) ──
    if (trimmed === "stop") {
      if (watchRef.current) {
        clearInterval(watchRef.current);
        watchRef.current = null;
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[32m✓\x1b[0m Watch stopped`, "");
      } else {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[90mNo active watch to stop\x1b[0m`, "");
      }
      return "";
    }

    // ── COMMANDER: audit (quick health check) ──
    if (trimmed === "audit") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[90mRunning audit...\x1b[0m`);
      const checks: string[] = [];
      let pass = 0;
      let fail = 0;

      // Check each API route
      const routes = ["status", "portfolio", "signals", "agents", "market", "connections"];
      for (const route of routes) {
        try {
          const res = await fetch(`/api/${route}`);
          if (res.ok) { checks.push(`  \x1b[32m●\x1b[0m /api/${route} — OK`); pass++; }
          else { checks.push(`  \x1b[31m○\x1b[0m /api/${route} — HTTP ${res.status}`); fail++; }
        } catch {
          checks.push(`  \x1b[31m○\x1b[0m /api/${route} — UNREACHABLE`); fail++;
        }
      }

      const score = Math.round((pass / (pass + fail)) * 100);
      const out = `\x1b[36m══ QUICK AUDIT ══\x1b[0m\n${checks.join("\n")}\n\n  \x1b[36mScore:\x1b[0m ${score}% (${pass} pass / ${fail} fail)`;

      setLines((prev) => {
        const copy = [...prev];
        const idx = copy.lastIndexOf(`\x1b[90mRunning audit...\x1b[0m`);
        if (idx !== -1) copy.splice(idx, 1);
        return [...copy, out, ""];
      });
      return out;
    }

    // ── COMMANDER: ask <question> — talk to AI orchestra ──
    if (trimmed.startsWith("ask ")) {
      const question = raw.substring(4).trim();
      if (!question) {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mUsage: ask <your question>\x1b[0m`, "");
        return "";
      }
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[33m◐\x1b[0m \x1b[90mAsking the AI orchestra...\x1b[0m`);
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: question, task: "analysis" }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const result = data.result as { source?: string; content?: string; live?: boolean } | undefined;
        const source = result?.source || "ai";
        const content = result?.content || "No response";
        const live = result?.live ? "\x1b[32m●\x1b[0m" : "\x1b[33m◐\x1b[0m";
        const out = `${live} \x1b[36m${source}:\x1b[0m ${content}`;

        setLines((prev) => {
          const copy = [...prev];
          const idx = copy.lastIndexOf(`\x1b[33m◐\x1b[0m \x1b[90mAsking the AI orchestra...\x1b[0m`);
          if (idx !== -1) copy.splice(idx, 1);
          return [...copy, out, ""];
        });
        setLastOutput(out);
        return out;
      } catch (err) {
        const errMsg = `\x1b[31mAI error: ${err instanceof Error ? err.message : "Failed"}\x1b[0m`;
        setLines((prev) => {
          const copy = [...prev];
          const idx = copy.lastIndexOf(`\x1b[33m◐\x1b[0m \x1b[90mAsking the AI orchestra...\x1b[0m`);
          if (idx !== -1) copy.splice(idx, 1);
          return [...copy, errMsg, ""];
        });
        return errMsg;
      }
    }

    // ── Resolve aliases ──
    const resolved = aliases[trimmed] || trimmed;

    // Check static commands
    if (STATIC_COMMANDS[resolved]) {
      const out = STATIC_COMMANDS[resolved];
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
      setLastOutput(out);
      return out;
    }

    // Check API-powered commands
    const apiCmd = API_COMMANDS[resolved];
    if (apiCmd) {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[90mFetching ${resolved}...\x1b[0m`);
      try {
        const res = await fetch(apiCmd.endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const out = apiCmd.format(data);
        setLines((prev) => {
          const copy = [...prev];
          const fetchIdx = copy.lastIndexOf(`\x1b[90mFetching ${resolved}...\x1b[0m`);
          if (fetchIdx !== -1) copy.splice(fetchIdx, 1);
          return [...copy, out, ""];
        });
        setLastOutput(out);
        return out;
      } catch (err) {
        const errMsg = `\x1b[31mError: ${err instanceof Error ? err.message : "Failed to fetch"}\x1b[0m`;
        setLines((prev) => {
          const copy = [...prev];
          const fetchIdx = copy.lastIndexOf(`\x1b[90mFetching ${resolved}...\x1b[0m`);
          if (fetchIdx !== -1) copy.splice(fetchIdx, 1);
          return [...copy, errMsg, ""];
        });
        return errMsg;
      }
    }

    // Unknown command
    addLines(
      `\x1b[32m❯\x1b[0m ${cmd}`,
      `\x1b[31mUnknown command: ${trimmed}\x1b[0m\nType \x1b[32mhelp\x1b[0m for available commands.`,
      ""
    );
    return "";
  }, [addLines, aliases, history, lastOutput, lines]);

  // Process command with && chaining support
  const processCommand = useCallback(async (cmd: string) => {
    const parts = cmd.split("&&").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      await execSingle(part);
    }
  }, [execSingle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory((prev) => [input, ...prev]);
    setHistoryIdx(-1);
    setTabMatches([]);
    setTabIdx(0);
    processCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ── Tab completion ──
    if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;

      // If already cycling through matches, advance
      if (tabMatches.length > 0) {
        const next = (tabIdx + 1) % tabMatches.length;
        setTabIdx(next);
        setInput(tabMatches[next]);
        return;
      }

      // Find matches
      const allNames = [...ALL_COMMANDS, ...Object.keys(aliases)];
      const matches = allNames.filter((c) => c.startsWith(partial) && c !== partial);
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setTabMatches(matches);
        setTabIdx(0);
        setInput(matches[0]);
        // Show options briefly
        addLines(`\x1b[90mTab: ${matches.join("  ")}\x1b[0m`);
      }
      return;
    }

    // Reset tab state on any other key
    if (tabMatches.length > 0 && e.key !== "Tab") {
      setTabMatches([]);
      setTabIdx(0);
    }

    // ── Arrow keys for history ──
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

    // ── Ctrl+C to stop watch ──
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      if (watchRef.current) {
        clearInterval(watchRef.current);
        watchRef.current = null;
        addLines(`\x1b[33m^C\x1b[0m Watch stopped`);
      }
    }

    // ── Ctrl+L to clear ──
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // Convert ANSI escape codes to colored HTML spans.
  // Security: HTML is escaped FIRST, then only safe ANSI codes are converted to spans.
  // Only known color codes in the allowlist produce HTML tags — everything else is stripped.
  const ansiToHtml = (text: string) => {
    const map: Record<string, string> = {
      "30": "#1e1e2e", "31": "#ef4444", "32": "#10b981", "33": "#f59e0b",
      "34": "#3b82f6", "35": "#a855f7", "36": "#06b6d4", "37": "#e2e8f0",
      "90": "#64748b",
    };
    // Step 1: Escape all HTML entities (prevents XSS from any source)
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    // Step 2: Strip any ANSI sequences that aren't simple color codes
    html = html.replace(/\x1b\[[0-9;]*[A-Za-z]/g, (match) => {
      // Only allow SGR sequences (ending in 'm') through to the next step
      if (match.endsWith("m")) return match;
      return "";
    });
    // Step 3: Convert known ANSI color codes to safe spans
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
          coreintent — zynthio commander
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
          <span style={{ color: "var(--accent-green)", marginRight: "8px" }}>⚡</span>
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
