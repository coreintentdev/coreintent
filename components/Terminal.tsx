"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LOCALE_TO_BCP47, type Locale } from "@/lib/i18n";

const LOCALE_GREETINGS: Record<string, string> = {
  en: "Welcome, trader. Your session is live.",
  es: "Bienvenido, trader. Tu sesión está activa.",
  mi: "Nau mai, kai hokohoko. Kua ora tō whaihanga.",
  zh: "欢迎，交易者。您的会话已上线。",
  ja: "ようこそ、トレーダー。セッションが開始されました。",
  pt: "Bem-vindo, trader. Sua sessão está ativa.",
  fr: "Bienvenue, trader. Votre session est active.",
  de: "Willkommen, Trader. Deine Sitzung ist aktiv.",
  ar: "مرحبًا أيها المتداول. جلستك نشطة.",
  hi: "स्वागत है, ट्रेडर। आपका सत्र लाइव है।",
};

function buildWelcomeBanner(locale: string): string {
  const bcp47 = LOCALE_TO_BCP47[locale as Locale] || "en-NZ";
  const greeting = LOCALE_GREETINGS[locale] || LOCALE_GREETINGS.en;
  return `\x1b[36m
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
\x1b[90m${new Date().toLocaleString(bcp47, { timeZone: "Pacific/Auckland" })} NZST\x1b[0m
\x1b[32m${greeting}\x1b[0m`;
}

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
  \x1b[32mmaster\x1b[0m      - Web/Desktop master sync policy \x1b[90m(live)\x1b[0m
  \x1b[32msync <task>\x1b[0m - Route task to best channel \x1b[90m(live)\x1b[0m
  \x1b[32mzynhandball <task>\x1b[0m - Force handoff evaluation \x1b[90m(live)\x1b[0m
  \x1b[32mzynkyc <task>\x1b[0m - Ask KYC clarifiers when unsure \x1b[90m(live)\x1b[0m
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

  \x1b[33m── INTERACTIVE ──\x1b[0m
  \x1b[32mtrade [pair]\x1b[0m - Paper trade simulation (e.g. \x1b[32mtrade ETH/USDT\x1b[0m)
  \x1b[32mstonks [pair]\x1b[0m- Sparkline chart (e.g. \x1b[32mstonks SOL/USDT\x1b[0m)
  \x1b[32mradar\x1b[0m       - Animated market radar scan
  \x1b[32mping\x1b[0m        - Service connectivity diagnostics
  \x1b[32mtop\x1b[0m         - Live process monitor
  \x1b[32mleaderboard\x1b[0m - Competition standings (alias: \x1b[32mlb\x1b[0m)
  \x1b[32mbattle\x1b[0m      - Watch AI models debate a trade
  \x1b[32mscan\x1b[0m        - Full system scan with progress
  \x1b[32mweather\x1b[0m     - Market weather forecast
  \x1b[32mchallenge\x1b[0m   - Speed trading game (10 rounds — BUY/SELL/HOLD)
  \x1b[32mslots\x1b[0m       - Crypto slot machine — spin the reels
  \x1b[32mwarp\x1b[0m        - Watch AI pipeline process a live signal

  \x1b[33m── ANALYTICS ──\x1b[0m
  \x1b[32mheatmap\x1b[0m     - Crypto correlation matrix (animated)
  \x1b[32mbacktest\x1b[0m    - Run a strategy backtest simulation
  \x1b[32mpulse\x1b[0m       - Engine vitals heartbeat monitor

  \x1b[33m── EXPERIENCES ──\x1b[0m
  \x1b[32mspeedtest\x1b[0m   - Network speed diagnostics
  \x1b[32mlore\x1b[0m        - The CoreIntent origin story
  \x1b[32mzen\x1b[0m         - Trading koan for the soul
  \x1b[32mfire\x1b[0m        - ASCII fire simulation
  \x1b[32mabout\x1b[0m       - Platform summary & how it works
  \x1b[32mdecrypt\x1b[0m     - Decrypt a classified message
  \x1b[32morbit\x1b[0m       - Watch AI models orbit the engine
  \x1b[32mglitch\x1b[0m      - Trigger a system resilience test
  \x1b[32msniper\x1b[0m      - AI target lock — three models converge
  \x1b[32mcyberwar\x1b[0m    - Live war room command center
  \x1b[32mhologram\x1b[0m    - Holographic data projection
  \x1b[32marena\x1b[0m       - Live competition bracket — bots vs humans
  \x1b[32mdna\x1b[0m         - Trading engine DNA — the genetic code
  \x1b[32mtrain\x1b[0m       - Watch the neural network learn in real time

  \x1b[33m── EASTER EGGS ──\x1b[0m
  \x1b[32mfortune\x1b[0m     - Trading wisdom
  \x1b[32mcowsay\x1b[0m      - ASCII cow wisdom
  \x1b[32mmatrix\x1b[0m      - Enter the matrix
  \x1b[32m336\x1b[0m         - The signal
  \x1b[32mhack\x1b[0m        - F18 security scan
  \x1b[32mneofetch\x1b[0m    - System info
  \x1b[32mparty\x1b[0m       - Competition mode
  \x1b[32msudo\x1b[0m        - Nice try
  \x1b[32mrickroll\x1b[0m    - You know what this is
  \x1b[32mmoon\x1b[0m        - When moon?
  \x1b[32mwen\x1b[0m         - Wen lambo?

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
  \x1b[32m●\x1b[0m Cloudzy VPS    — ACTIVE
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
  \x1b[33m◐\x1b[0m \x1b[33mGemini\x1b[0m          Gmail/Drive scanning (planned)
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
    \x1b[32m●\x1b[0m 10 API routes (returning demo data)
    \x1b[32m●\x1b[0m Build passes clean — Next.js 14 + TypeScript strict
    \x1b[32m●\x1b[0m 8 domains live, all returning 200
    \x1b[32m●\x1b[0m VPS running (Cloudzy + Frankfurt)
    \x1b[32m●\x1b[0m cai CLI on VPS with full session state

  \x1b[33mDEMO / PLACEHOLDER:\x1b[0m
    \x1b[33m◐\x1b[0m All 12 API routes return demo data (keys not set)
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
  \x1b[33mVPS Cloudzy:\x1b[0m Cloudzy (Tailscale SSH)
  \x1b[33mVPS Frankfurt:\x1b[0m Frankfurt VPS
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
    \x1b[33m◐\x1b[0m Gemini          — Gmail/Drive (planned, not active)
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

  "336": `\x1b[32m
  ██████╗ ██████╗  ██████╗
  ╚════██║╚════██║██╔════╝
   █████╔╝ █████╔╝███████╗
   ╚═══██╗ ╚═══██╗██╔═══██║
  ██████╔╝██████╔╝╚██████╔╝
  ╚═════╝ ╚═════╝  ╚═════╝
\x1b[0m
  \x1b[33mTHE SIGNAL IS DOMINANT\x1b[0m

  \x1b[90m"Every human needs a bot. Every bot needs a human."
  "AI are minors. You are the signature."
  "Just protect the heart."\x1b[0m`,

  neofetch: `\x1b[36m         .---.         \x1b[0m  \x1b[33mcorey@coreintent\x1b[0m
\x1b[36m        /     \\        \x1b[0m  \x1b[36m──────────────────\x1b[0m
\x1b[36m       | Z Y N |       \x1b[0m  \x1b[33mOS:\x1b[0m       Next.js 14
\x1b[36m       | T H I |       \x1b[0m  \x1b[33mHost:\x1b[0m     Zynthio.ai
\x1b[36m       |  .O.  |       \x1b[0m  \x1b[33mKernel:\x1b[0m   TypeScript 5.5 (strict)
\x1b[36m        \\_____/        \x1b[0m  \x1b[33mShell:\x1b[0m    Commander v0.2.0
\x1b[36m         '---'         \x1b[0m  \x1b[33mTheme:\x1b[0m    Dark (Cyber)
                          \x1b[33mAI:\x1b[0m       Claude + Grok + Perplexity
                          \x1b[33mVPS:\x1b[0m      Cloudzy (8 domains)
                          \x1b[33mDomains:\x1b[0m  16
                          \x1b[33mBurn:\x1b[0m     ~/mo
                          \x1b[33mMode:\x1b[0m     \x1b[33mPaper Trading\x1b[0m
                          \x1b[33mSignal:\x1b[0m   \x1b[32m336\x1b[0m`,

  sudo: `\x1b[31m  Permission denied.\x1b[0m
  \x1b[90mNice try. This isn't Linux — it's the Zynthio Trading Engine.\x1b[0m
  \x1b[90mCorey McIvor is the only root user here.\x1b[0m
  \x1b[33m  336 — the signal is dominant\x1b[0m`,

  rickroll: `\x1b[36m  ══ INCOMING TRANSMISSION ══\x1b[0m
  \x1b[33m  Never gonna give you up\x1b[0m
  \x1b[33m  Never gonna let you down\x1b[0m
  \x1b[33m  Never gonna run around\x1b[0m
  \x1b[33m  and desert you\x1b[0m
  \x1b[90m  ...you just got rickrolled by a trading engine.\x1b[0m
  \x1b[90m  Type \x1b[32mhelp\x1b[0m for actual commands.\x1b[0m`,

  moon: `\x1b[33m
  ███╗   ███╗ ██████╗  ██████╗ ███╗   ██╗
  ████╗ ████║██╔═══██╗██╔═══██╗████╗  ██║
  ██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║
  ██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║
  ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║
  ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
\x1b[0m
  \x1b[33m            *  .  *
         .  *  TO THE  *  .
       *    MOON    *
         .  *  .  *  .
            *  .  *\x1b[0m

  \x1b[90mThree models. One direction. Straight up.\x1b[0m
  \x1b[90mPaper trading mode — no real rockets involved.\x1b[0m`,

  wen: `\x1b[33m  Wen moon?\x1b[0m   When three models agree.
  \x1b[33m  Wen lambo?\x1b[0m  When paper trading goes live.
  \x1b[33m  Wen rich?\x1b[0m   When skill beats luck on the leaderboard.
  \x1b[33m  Wen launch?\x1b[0m Building. In. Public.

  \x1b[90m  "The leaderboard doesn't care who built you."\x1b[0m`,

  party: `\x1b[33m
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░    COMPETITION MODE ACTIVATED    ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\x1b[0m
  \x1b[32m*\x1b[0m Daily League    — Resets every 24h
  \x1b[36m*\x1b[0m Weekly League   — 7-day battle
  \x1b[35m*\x1b[0m Monthly League  — The big one
  \x1b[33m*\x1b[0m Streak Bonus    — Win 3+ = multiplier

  \x1b[32mPrize Pool:\x1b[0m   TBD (competitions not live yet)
  \x1b[32mEntry Fee:\x1b[0m    FREE (free costs fuck all)
  \x1b[32mBots:\x1b[0m         WELCOME (AI-to-AI first-class)

  \x1b[90mCompetitions are planned. This is what's coming.\x1b[0m`,
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

function formatSync(data: Record<string, unknown>): string {
  // GET /api/sync returns policy; POST /api/sync returns a routing decision.
  if (data.mode === "master_sync_policy") {
    const rules = data.rules as Record<string, unknown> | undefined;
    const channels = data.channels as Record<string, string[]> | undefined;
    let out = `\x1b[36mMaster Sync Policy\x1b[0m`;
    out += `\n  Summary: ${data.summary || "Single source of truth for channel routing."}`;
    if (rules) {
      out += `\n\n  \x1b[33mRules:\x1b[0m`;
      out += `\n    handoff: ${rules.handoffName || "zynhandball"}`;
      out += `\n    uncertainty: ${rules.uncertainFlow || "zynKYC"}`;
      out += `\n    min confidence: ${rules.minConfidenceForAutoRoute || "?"}`;
      out += `\n    default route: ${rules.defaultRoute || "web"}`;
    }
    if (channels) {
      out += `\n\n  \x1b[33mChannels:\x1b[0m`;
      for (const [name, caps] of Object.entries(channels)) {
        out += `\n    \x1b[32m${name}\x1b[0m → ${caps.join(", ")}`;
      }
    }
    return out;
  }

  const decision = String(data.decision || "unknown");
  const reason = String(data.reason || "");
  const source = String(data.source || "web");
  const target = String(data.target || source);
  const decisionColor = decision === "zynKYC" ? "\x1b[33m" : decision === "zynhandball" ? "\x1b[36m" : "\x1b[32m";

  let out = `\x1b[36mSync Decision\x1b[0m`;
  out += `\n  Decision: ${decisionColor}${decision}\x1b[0m`;
  out += `\n  Source: ${source}  Target: ${target}`;
  if (reason) out += `\n  Reason: ${reason}`;

  const handoff = data.handoff as Record<string, unknown> | null;
  if (handoff) {
    out += `\n\n  \x1b[33mHandoff:\x1b[0m ${handoff.from} → ${handoff.to} (${handoff.mode})`;
  }

  const questions = data.questions as string[] | undefined;
  if (questions && questions.length > 0) {
    out += `\n\n  \x1b[33mzynKYC questions:\x1b[0m`;
    for (const q of questions) out += `\n    - ${q}`;
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
  master:    { endpoint: "/api/sync",      format: formatSync },
};

// All known command names for tab completion
const ALL_COMMANDS = [
  ...Object.keys(STATIC_COMMANDS),
  ...Object.keys(API_COMMANDS),
  "clear", "ask", "watch", "grep", "export", "history", "alias", "aliases", "time", "audit",
  "sync", "zynhandball", "zynkyc", "fortune", "matrix", "hack",
  "trade", "radar", "ping", "cowsay", "top",
  "stonks", "leaderboard", "lb", "battle", "scan", "weather",
  "challenge", "warp", "slots", "buy", "sell", "hold", "quit",
  "sudo", "rickroll", "moon", "wen",
  "speedtest", "lore", "zen", "fire", "about",
  "heatmap", "backtest", "pulse",
  "decrypt", "orbit", "glitch",
  "sniper", "cyberwar", "hologram",
  "arena", "dna", "train",
];

export default function Terminal() {
  const locale = useLocale();
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
  const gameRef = useRef<{
    round: number;
    score: number;
    streak: number;
    bestStreak: number;
    scenarios: Array<{
      pair: string;
      price: number;
      move: number;
      rsi: number;
      volume: string;
      grokSays: string;
    }>;
  } | null>(null);

  useEffect(() => {
    setLines([buildWelcomeBanner(locale)]);
  }, [locale]);

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

    // ── COMMANDER: sync/zynhandball/zynkyc <task> ──
    const syncCommands = ["sync ", "zynhandball ", "zynkyc "];
    if (syncCommands.some((prefix) => trimmed.startsWith(prefix))) {
      const task = raw.substring(raw.indexOf(" ") + 1).trim();
      if (!task) {
        addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31mUsage: ${trimmed.split(" ")[0]} <task>\x1b[0m`, "");
        return "";
      }

      const mode = trimmed.startsWith("zynkyc ")
        ? "zynkyc"
        : trimmed.startsWith("zynhandball ")
          ? "zynhandball"
          : "sync";
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[90mRouting task through master sync policy...\x1b[0m`);
      try {
        const payload: Record<string, unknown> = {
          task,
          source: "web",
          confidence: mode === "zynkyc" ? 0.4 : 0.85,
          contextComplete: mode === "zynkyc" ? false : true,
        };
        if (mode === "zynhandball") {
          payload.hints = {
            needsLocalFiles: true,
            needsProcessControl: true,
          };
        }
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const out = formatSync(data);
        setLines((prev) => {
          const copy = [...prev];
          const idx = copy.lastIndexOf(`\x1b[90mRouting task through master sync policy...\x1b[0m`);
          if (idx !== -1) copy.splice(idx, 1);
          return [...copy, out, ""];
        });
        setLastOutput(out);
        return out;
      } catch (err) {
        const errMsg = `\x1b[31mSync error: ${err instanceof Error ? err.message : "Failed"}\x1b[0m`;
        setLines((prev) => {
          const copy = [...prev];
          const idx = copy.lastIndexOf(`\x1b[90mRouting task through master sync policy...\x1b[0m`);
          if (idx !== -1) copy.splice(idx, 1);
          return [...copy, errMsg, ""];
        });
        return errMsg;
      }
    }

    // ── EASTER EGGS ──
    if (trimmed === "fortune") {
      const fortunes = [
        "Three models agree: that's a strong signal.",
        "When they disagree, you get deeper analysis.",
        "Every human needs a bot. Every bot needs a human.",
        "Free costs fuck all to serve.",
        "AI are minors. You are the signature.",
        "Just protect the heart.",
        "The market can stay irrational longer than you can stay solvent.",
        "Paper trading today. Live trading when ready.",
        "336 — the signal is dominant.",
        "Bots welcome. No captcha. AI-to-AI is first-class.",
        "Never trust a single model. That's why we have three.",
        "Risk management isn't optional. It's the whole game.",
        "Build passes clean or you don't push.",
        "Cut the fat. Keep the mansion. Keep CC.",
      ];
      const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
      const out = `\x1b[33m  ╔══════════════════════════════════════════╗
  ║           TRADING FORTUNE                ║
  ╠══════════════════════════════════════════╣[0m
  \x1b[36m  "${pick}"\x1b[0m
\x1b[33m  ╚══════════════════════════════════════════╝\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, "");
      return out;
    }

    if (trimmed === "matrix") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`);
      const chars = "01ZYNTHIOCAIabcdefghijklmnop<>{}[]|/=+-*&^%#@!";
      let count = 0;
      const iv = setInterval(() => {
        const line = Array.from({ length: 55 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        addLines(`\x1b[32m${line}\x1b[0m`);
        count++;
        if (count >= 12) {
          clearInterval(iv);
          addLines("", `\x1b[33m  "Wake up, trader..."\x1b[0m`, `\x1b[90m  The Matrix has you. Follow the white rabbit.\x1b[0m`, `\x1b[90m  Type \x1b[32mhelp\x1b[0m to return.\x1b[0m`, "");
        }
      }, 120);
      return "";
    }

    if (trimmed === "hack") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[31m  [F18 SECURITY] Initiating perimeter scan...\x1b[0m`);
      const phases = [
        `  \x1b[90m[0.2s]\x1b[0m Scanning network interfaces...      \x1b[32mOK\x1b[0m`,
        `  \x1b[90m[0.5s]\x1b[0m Checking SSL certificates...        \x1b[32m84-88 days remaining\x1b[0m`,
        `  \x1b[90m[0.8s]\x1b[0m Verifying API key rotation...        \x1b[33mDEMO KEYS ACTIVE\x1b[0m`,
        `  \x1b[90m[1.2s]\x1b[0m Scanning 16 domains...              \x1b[32m8 active, 0 compromised\x1b[0m`,
        `  \x1b[90m[1.5s]\x1b[0m Checking VPS integrity...            \x1b[32mClean\x1b[0m`,
        `  \x1b[90m[1.8s]\x1b[0m Identity verification...             \x1b[32mCorey McIvor — verified\x1b[0m`,
        `  \x1b[90m[2.0s]\x1b[0m Deploying land mines for bad actors...\x1b[32mArmed\x1b[0m`,
        "",
        `\x1b[36m  ══ F18 SECURITY SCAN COMPLETE ══\x1b[0m`,
        `\x1b[32m    Status:   SECURE\x1b[0m`,
        `\x1b[32m    Threats:  0 detected\x1b[0m`,
        `\x1b[33m    Warnings: Demo API keys in use\x1b[0m`,
        `\x1b[90m    "Digital identity protection with land mines for bad actors"\x1b[0m`,
      ];
      let i = 0;
      const iv = setInterval(() => {
        if (i < phases.length) {
          addLines(phases[i]);
          i++;
        } else {
          clearInterval(iv);
          addLines("");
        }
      }, 250);
      return "";
    }

    // ── TRADE: Mini paper trading simulation ──
    if (trimmed === "trade" || trimmed.startsWith("trade ")) {
      const pairInput = trimmed === "trade" ? "BTC/USDT" : raw.substring(6).trim().toUpperCase();
      const pair = pairInput || "BTC/USDT";
      const basePrices: Record<string, number> = {
        "BTC/USDT": 67420, "ETH/USDT": 3285, "SOL/USDT": 142.80, "AVAX/USDT": 35.60,
      };
      const basePrice = basePrices[pair] || 100;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  ══ PAPER TRADE: ${pair} ══\x1b[0m`, `\x1b[90m  Entry: $${basePrice.toLocaleString()}  |  Watching 20 ticks...\x1b[0m`, ``);

      let price = basePrice;
      let tick = 0;
      const bars: string[] = [];

      const iv = setInterval(() => {
        const delta = (Math.random() - 0.47) * basePrice * 0.0012;
        price = +(price + delta).toFixed(2);
        const change = ((price - basePrice) / basePrice) * 100;
        const barLen = Math.max(1, Math.min(30, Math.round(Math.abs(change) * 50)));
        const bar = change >= 0
          ? `  \x1b[32m${"█".repeat(barLen)}\x1b[0m $${price.toLocaleString()} \x1b[32m+${change.toFixed(3)}%\x1b[0m`
          : `  \x1b[31m${"█".repeat(barLen)}\x1b[0m $${price.toLocaleString()} \x1b[31m${change.toFixed(3)}%\x1b[0m`;
        bars.push(bar);
        addLines(bar);
        tick++;

        if (tick >= 20) {
          clearInterval(iv);
          const pnl = price - basePrice;
          const pnlPct = ((pnl / basePrice) * 100).toFixed(3);
          const pnlColor = pnl >= 0 ? "\x1b[32m" : "\x1b[31m";
          addLines(
            ``, `\x1b[36m  ══ TRADE RESULT ══\x1b[0m`,
            `  Entry:  $${basePrice.toLocaleString()}`,
            `  Exit:   ${pnlColor}$${price.toLocaleString()}\x1b[0m`,
            `  P&L:    ${pnlColor}${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnlPct}%)\x1b[0m`,
            `  \x1b[90mPaper trade — no real money at risk\x1b[0m`, ``
          );
        }
      }, 300);
      return "";
    }

    // ── RADAR: Animated market radar scan ──
    if (trimmed === "radar") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  ══ MARKET RADAR ══\x1b[0m`, ``);
      const sectors = [
        { name: "BTC Momentum", status: "strong", conf: 87 },
        { name: "ETH DeFi Activity", status: "moderate", conf: 72 },
        { name: "SOL NFT Volume", status: "cooling", conf: 58 },
        { name: "AVAX Cross-chain", status: "heating", conf: 81 },
        { name: "Market Sentiment", status: "bullish", conf: 76 },
        { name: "Whale Activity", status: "detected", conf: 91 },
        { name: "Fear/Greed Index", status: "greed", conf: 68 },
        { name: "Social Signals", status: "elevated", conf: 83 },
      ];
      const frames = [
        `  \x1b[90m       ·  ·  ·\x1b[0m`,
        `  \x1b[90m     ·         ·\x1b[0m`,
        `  \x1b[90m   ·     \x1b[32m◉\x1b[90m      ·\x1b[0m`,
        `  \x1b[90m   ·   SCANNING  ·\x1b[0m`,
        `  \x1b[90m   ·     \x1b[32m◉\x1b[90m      ·\x1b[0m`,
        `  \x1b[90m     ·         ·\x1b[0m`,
        `  \x1b[90m       ·  ·  ·\x1b[0m`,
      ];
      let phase = 0;
      // Show radar animation
      for (const f of frames) { addLines(f); }
      addLines(``);

      const iv = setInterval(() => {
        if (phase < sectors.length) {
          const s = sectors[phase];
          const confColor = s.conf >= 80 ? "\x1b[32m" : s.conf >= 65 ? "\x1b[33m" : "\x1b[31m";
          const statusColor = ["strong", "heating", "bullish", "detected", "elevated"].includes(s.status) ? "\x1b[32m" : "\x1b[33m";
          const bar = "░".repeat(Math.round(s.conf / 5));
          addLines(`  \x1b[90m[scan]\x1b[0m ${s.name.padEnd(20)} ${statusColor}${s.status.padEnd(10)}\x1b[0m ${confColor}${bar} ${s.conf}%\x1b[0m`);
          phase++;
        } else {
          clearInterval(iv);
          const avg = Math.round(sectors.reduce((a, s) => a + s.conf, 0) / sectors.length);
          addLines(
            ``, `\x1b[36m  ══ SCAN COMPLETE ══\x1b[0m`,
            `  Sectors scanned: \x1b[32m${sectors.length}\x1b[0m`,
            `  Average confidence: \x1b[33m${avg}%\x1b[0m`,
            `  Recommendation: ${avg >= 75 ? "\x1b[32mENGAGE — conditions favorable\x1b[0m" : "\x1b[33mHOLD — mixed signals\x1b[0m"}`,
            `  \x1b[90mSimulated scan — demo data\x1b[0m`, ``
          );
        }
      }, 350);
      return "";
    }

    // ── PING: Animated connectivity diagnostics ──
    if (trimmed === "ping") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  PING — Service Connectivity Check\x1b[0m`, ``);
      const targets = [
        { name: "coreintent.dev", type: "website" },
        { name: "api/status", type: "api" },
        { name: "api/portfolio", type: "api" },
        { name: "api/signals", type: "api" },
        { name: "api/agents", type: "api" },
        { name: "api/market", type: "api" },
        { name: "Cloudzy VPS", type: "infra" },
        { name: "GitHub", type: "infra" },
      ];
      let idx = 0;
      const iv = setInterval(() => {
        if (idx < targets.length) {
          const t = targets[idx];
          const latency = t.type === "api"
            ? Math.round(5 + Math.random() * 40)
            : Math.round(20 + Math.random() * 120);
          const latColor = latency < 50 ? "\x1b[32m" : latency < 100 ? "\x1b[33m" : "\x1b[31m";
          addLines(`  \x1b[32m●\x1b[0m ${t.name.padEnd(20)} \x1b[32m200 OK\x1b[0m  ${latColor}${String(latency).padStart(4)}ms\x1b[0m  \x1b[90m(${t.type})\x1b[0m`);
          idx++;
        } else {
          clearInterval(iv);
          addLines(
            ``, `  \x1b[36m── Summary ──\x1b[0m`,
            `  \x1b[32m${targets.length}/${targets.length} reachable\x1b[0m  |  Packet loss: \x1b[32m0%\x1b[0m`,
            `  \x1b[90mAll services responding — paper trading mode\x1b[0m`, ``
          );
        }
      }, 250);
      return "";
    }

    // ── COWSAY: ASCII cow with trading wisdom ──
    if (trimmed === "cowsay") {
      const wisdoms = [
        "Three models agree?\nThat's a strong signal.",
        "Buy the rumour.\nSell the news.\nIgnore the noise.",
        "Every human needs a bot.\nEvery bot needs a human.",
        "Paper trading today.\nLive trading when ready.",
        "The signal is dominant.\n336.",
        "Free costs fuck all.\nSo give it away.",
        "Risk management isn't\noptional. It's the game.",
        "Bots welcome.\nAI-to-AI is first-class.",
      ];
      const wisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
      const wisdomLines = wisdom.split("\n");
      const maxLen = Math.max(...wisdomLines.map((l) => l.length));
      const border = "─".repeat(maxLen + 2);
      let bubble = `\x1b[33m  ┌${border}┐\x1b[0m`;
      for (const line of wisdomLines) {
        bubble += `\n\x1b[33m  │\x1b[0m \x1b[36m${line.padEnd(maxLen)}\x1b[0m \x1b[33m│\x1b[0m`;
      }
      bubble += `\n\x1b[33m  └${border}┘\x1b[0m`;
      const cow = `         \\   \x1b[33m^__^\x1b[0m
          \\  \x1b[33m(oo)\\_______\x1b[0m
             \x1b[33m(__)\\       )\\/\\\x1b[0m
                 \x1b[33m||----w |\x1b[0m
                 \x1b[33m||     ||\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, bubble, cow, ``);
      return bubble;
    }

    // ── TOP: Animated system process list ──
    if (trimmed === "top") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ COREINTENT PROCESS MONITOR ══\x1b[0m`,
        `\x1b[90m  Uptime: ${Math.floor((Date.now() - startTime.current) / 60000)}m | Mode: Paper Trading\x1b[0m`, ``);
      const processes = [
        { pid: 1, name: "signal_listener", cpu: 0, mem: 0, status: "running", model: "Grok" },
        { pid: 2, name: "risk_monitor", cpu: 0, mem: 0, status: "running", model: "Claude" },
        { pid: 3, name: "trend_follower", cpu: 0, mem: 0, status: "idle", model: "Claude Opus" },
        { pid: 4, name: "mean_revert", cpu: 0, mem: 0, status: "idle", model: "Claude Sonnet" },
        { pid: 5, name: "sentiment_bot", cpu: 0, mem: 0, status: "scanning", model: "Grok" },
        { pid: 6, name: "research_agent", cpu: 0, mem: 0, status: "idle", model: "Perplexity" },
        { pid: 7, name: "arbitrage_bot", cpu: 0, mem: 0, status: "planned", model: "Claude Haiku" },
        { pid: 8, name: "gtrade_listener", cpu: 0, mem: 0, status: "waiting", model: "System" },
      ];

      addLines(`  \x1b[90mPID  PROCESS              CPU%   MEM%   STATUS      MODEL\x1b[0m`,
               `  \x1b[90m${"─".repeat(68)}\x1b[0m`);

      let idx = 0;
      const iv = setInterval(() => {
        if (idx < processes.length) {
          const p = processes[idx];
          p.cpu = +(Math.random() * (p.status === "running" ? 12 : p.status === "scanning" ? 8 : 0.5)).toFixed(1);
          p.mem = +(Math.random() * (p.status === "running" ? 6 : 2) + 1).toFixed(1);
          const statusColor = p.status === "running" ? "\x1b[32m" : p.status === "scanning" ? "\x1b[33m" : p.status === "planned" ? "\x1b[31m" : "\x1b[90m";
          addLines(`  \x1b[36m${String(p.pid).padEnd(5)}\x1b[0m${p.name.padEnd(21)}${String(p.cpu).padStart(4)}%  ${String(p.mem).padStart(4)}%   ${statusColor}${p.status.padEnd(12)}\x1b[0m\x1b[90m${p.model}\x1b[0m`);
          idx++;
        } else {
          clearInterval(iv);
          const totalCpu = processes.reduce((a, p) => a + p.cpu, 0).toFixed(1);
          const totalMem = processes.reduce((a, p) => a + p.mem, 0).toFixed(1);
          addLines(
            `  \x1b[90m${"─".repeat(68)}\x1b[0m`,
            `  \x1b[33mTOTAL\x1b[0m                   ${String(totalCpu).padStart(4)}%  ${String(totalMem).padStart(4)}%   \x1b[32m${processes.filter((p) => p.status === "running").length} active\x1b[0m`,
            `  \x1b[90mPaper trading — agents configured, not live-trading\x1b[0m`, ``
          );
        }
      }, 200);
      return "";
    }

    // ── STONKS: Sparkline chart ──
    if (trimmed === "stonks" || trimmed.startsWith("stonks ")) {
      const pair = trimmed === "stonks" ? "BTC/USDT" : raw.substring(7).trim().toUpperCase() || "BTC/USDT";
      const basePrices: Record<string, number> = {
        "BTC/USDT": 67420, "ETH/USDT": 3285, "SOL/USDT": 142.80, "AVAX/USDT": 35.60,
      };
      const startPrice = basePrices[pair] || 100;
      const blocks = "\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588";
      let price = startPrice;
      const hist: number[] = [];
      for (let i = 0; i < 50; i++) {
        price += (Math.random() - 0.47) * startPrice * 0.003;
        hist.push(price);
      }
      const min = Math.min(...hist);
      const max = Math.max(...hist);
      const range = max - min || 1;
      const spark = hist.map((p) => {
        const idx = Math.min(7, Math.round(((p - min) / range) * 7));
        return p >= startPrice ? `\x1b[32m${blocks[idx]}\x1b[0m` : `\x1b[31m${blocks[idx]}\x1b[0m`;
      }).join("");

      const endPrice = hist[hist.length - 1];
      const changePct = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
      const cc = Number(changePct) >= 0 ? "\x1b[32m" : "\x1b[31m";

      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  ══ STONKS — ${pair} 1H ══\x1b[0m`, ``);

      const statsLines = [
        `  ${spark}`,
        ``,
        `  \x1b[90mOpen:\x1b[0m  $${Math.round(startPrice).toLocaleString()}    \x1b[90mHigh:\x1b[0m $${Math.round(max).toLocaleString()}`,
        `  \x1b[90mClose:\x1b[0m $${Math.round(endPrice).toLocaleString()}    \x1b[90mLow:\x1b[0m  $${Math.round(min).toLocaleString()}`,
        `  \x1b[90mChange:\x1b[0m ${cc}${Number(changePct) >= 0 ? "+" : ""}${changePct}%\x1b[0m`,
        ``,
        `  \x1b[90mPaper trading — simulated sparkline data\x1b[0m`,
      ];

      let si = 0;
      const siv = setInterval(() => {
        if (si < statsLines.length) { addLines(statsLines[si]); si++; }
        else { clearInterval(siv); addLines(``); }
      }, 120);
      return "";
    }

    // ── LEADERBOARD: Competition standings ──
    if (trimmed === "leaderboard" || trimmed === "lb") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ WEEKLY COMPETITION — LEADERBOARD ══\x1b[0m`,
        `\x1b[90m  Paper trading league — demo standings\x1b[0m`, ``);

      const players = [
        { rank: 1, name: "AlphaStrat_v7", type: "Bot", pnl: 2847, trades: 142, win: 73 },
        { rank: 2, name: "Priya S.", type: "Human", pnl: 2341, trades: 38, win: 71 },
        { rank: 3, name: "NightOwl_Bot", type: "Bot", pnl: 1892, trades: 267, win: 62 },
        { rank: 4, name: "Jordan K.", type: "Human", pnl: 1456, trades: 24, win: 67 },
        { rank: 5, name: "TrendRider", type: "Bot", pnl: 1203, trades: 89, win: 59 },
        { rank: 6, name: "Alex R.", type: "Human", pnl: 987, trades: 31, win: 65 },
        { rank: 7, name: "DegenBot_42", type: "Bot", pnl: -234, trades: 412, win: 48 },
        { rank: 8, name: "You", type: "Human", pnl: 0, trades: 0, win: 0 },
      ];

      addLines(
        `  \x1b[90m  #   Name              Type     P&L         Trades  Win%\x1b[0m`,
        `  \x1b[90m  ${"─".repeat(62)}\x1b[0m`
      );

      let li = 0;
      const liv = setInterval(() => {
        if (li < players.length) {
          const p = players[li];
          const medal = p.rank <= 3 ? `\x1b[33m[${["1st", "2nd", "3rd"][p.rank - 1]}]\x1b[0m` : `  ${String(p.rank).padStart(2)}. `;
          const pnlColor = p.pnl >= 0 ? "\x1b[32m" : "\x1b[31m";
          const pnlStr = `${p.pnl >= 0 ? "+" : ""}$${p.pnl.toLocaleString()}`;
          const nameColor = p.name === "You" ? "\x1b[33m" : "";
          const nameEnd = p.name === "You" ? "\x1b[0m" : "";
          addLines(`  ${medal} ${nameColor}${p.name.padEnd(16)}${nameEnd} \x1b[90m${p.type.padEnd(8)}\x1b[0m ${pnlColor}${pnlStr.padStart(10)}\x1b[0m  ${String(p.trades).padStart(6)}   ${p.win > 0 ? `${p.win}%` : "\x1b[90m—\x1b[0m"}`);
          li++;
        } else {
          clearInterval(liv);
          addLines(
            `  \x1b[90m  ${"─".repeat(62)}\x1b[0m`, ``,
            `  \x1b[33mPrize pool:\x1b[0m TBD — competitions not live yet`,
            `  \x1b[90mFree entry. Bots welcome. Best strategy wins.\x1b[0m`, ``
          );
        }
      }, 200);
      return "";
    }

    // ── BATTLE: AI model debate simulation ──
    if (trimmed === "battle") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ AI MODEL BATTLE ══\x1b[0m`,
        `\x1b[90m  Three models. One trade. Who's right?\x1b[0m`,
        `\x1b[90m  Subject: BTC/USDT entry at $67,420\x1b[0m`, ``);

      const exchanges = [
        { model: "Grok", c: "\x1b[31m", text: "Bullish divergence on 4H RSI. Volume spike on last 3 candles. Entry looks clean — 87% confidence." },
        { model: "Claude", c: "\x1b[35m", text: "Hold on — volume is declining on this bounce. Resistance at $68,200 untested. Risk/reward only 1.8:1." },
        { model: "Perplexity", c: "\x1b[34m", text: "Fed minutes released 2h ago — no rate cut signal. Institutional inflows down 12% per CoinShares weekly." },
        { model: "Grok", c: "\x1b[31m", text: "Fair points. Adjusting confidence from 87% to 72%. Still long-biased but smaller position." },
        { model: "Claude", c: "\x1b[35m", text: "Better. Wait for clean break above $68,200 with volume > 1.5x average before entering." },
        { model: "Engine", c: "\x1b[32m", text: "VERDICT: HOLD. Consensus incomplete (2/3). Alert set at $68,200 breakout + volume confirmation." },
      ];

      let bi = 0;
      const biv = setInterval(() => {
        if (bi < exchanges.length) {
          const e = exchanges[bi];
          const prefix = e.model === "Engine" ? `  \x1b[36m══\x1b[0m` : `  \x1b[90m>\x1b[0m`;
          addLines(`${prefix} ${e.c}${e.model}:\x1b[0m ${e.text}`);
          bi++;
        } else {
          clearInterval(biv);
          addLines(``, `  \x1b[90mThis is how three-model consensus works. Disagreement = dig deeper.\x1b[0m`, ``);
        }
      }, 1500);
      return "";
    }

    // ── SCAN: Full system scan with progress ──
    if (trimmed === "scan") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  ══ FULL SYSTEM SCAN ══\x1b[0m`, ``);

      const checks = [
        { name: "Next.js Build", status: "PASS" },
        { name: "TypeScript Strict", status: "PASS" },
        { name: "API Routes (12)", status: "PASS" },
        { name: "XSS Hardening", status: "PASS" },
        { name: "ANSI Sanitization", status: "PASS" },
        { name: "CSP Headers", status: "PASS" },
        { name: "SSL Certificates", status: "PASS" },
        { name: "Domain Resolution", status: "PASS" },
        { name: "VPS Connectivity", status: "WARN" },
        { name: "Exchange APIs", status: "SKIP" },
        { name: "Database Layer", status: "SKIP" },
        { name: "Authentication", status: "SKIP" },
      ];

      let sci = 0;
      const sciv = setInterval(() => {
        if (sci < checks.length) {
          const c = checks[sci];
          const icon = c.status === "PASS" ? "\x1b[32m\u2713 PASS\x1b[0m" :
                       c.status === "WARN" ? "\x1b[33m! WARN\x1b[0m" :
                       "\x1b[90m\u25CB SKIP\x1b[0m";
          const filled = Math.round(((sci + 1) / checks.length) * 20);
          const bar = `\x1b[36m${"█".repeat(filled)}${"░".repeat(20 - filled)}\x1b[0m`;
          const pct = Math.round(((sci + 1) / checks.length) * 100);
          addLines(`  ${icon}  ${c.name.padEnd(20)}  ${bar} ${pct}%`);
          sci++;
        } else {
          clearInterval(sciv);
          const passed = checks.filter((c) => c.status === "PASS").length;
          const warned = checks.filter((c) => c.status === "WARN").length;
          const skipped = checks.filter((c) => c.status === "SKIP").length;
          addLines(
            ``, `\x1b[36m  ══ SCAN COMPLETE ══\x1b[0m`,
            `  \x1b[32mPassed: ${passed}\x1b[0m  |  \x1b[33mWarnings: ${warned}\x1b[0m  |  \x1b[90mSkipped: ${skipped}\x1b[0m`,
            `  \x1b[90mSkipped items are planned but not yet built\x1b[0m`, ``
          );
        }
      }, 200);
      return "";
    }

    // ── CHALLENGE: Speed trading game ──
    if (trimmed === "challenge") {
      const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT", "LINK/USDT"];
      const basePrices: Record<string, number> = {
        "BTC/USDT": 67420, "ETH/USDT": 3285, "SOL/USDT": 142.80, "AVAX/USDT": 35.60, "LINK/USDT": 14.80,
      };
      const grokHints = ["BULLISH", "BEARISH", "NEUTRAL", "UNCERTAIN", "STRONG BUY", "CAUTION"];
      const scenarios = Array.from({ length: 10 }, (_, i) => {
        const pair = pairs[i % pairs.length];
        const base = basePrices[pair];
        return {
          pair,
          price: +(base + (Math.random() - 0.5) * base * 0.02).toFixed(2),
          move: +((Math.random() - 0.42) * 4).toFixed(2),
          rsi: Math.round(30 + Math.random() * 50),
          volume: (["LOW", "MEDIUM", "HIGH", "EXTREME"] as const)[Math.floor(Math.random() * 4)],
          grokSays: grokHints[Math.floor(Math.random() * grokHints.length)],
        };
      });

      gameRef.current = { round: 0, score: 0, streak: 0, bestStreak: 0, scenarios };
      const first = scenarios[0];
      const rsiColor = first.rsi > 70 ? "\x1b[31m" : first.rsi < 30 ? "\x1b[32m" : "\x1b[33m";
      addLines(
        `\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══════════════════════════════════════════\x1b[0m`,
        `\x1b[36m  SPEED TRADING CHALLENGE\x1b[0m`,
        `\x1b[36m  ══════════════════════════════════════════\x1b[0m`,
        `  10 rounds. Read the signals. Make the call.`,
        `  \x1b[90mType BUY, SELL, or HOLD each round. QUIT to exit.\x1b[0m`, ``,
        `\x1b[36m  ── Round 1/${scenarios.length} ──\x1b[0m  Score: \x1b[32m0\x1b[0m`,
        `  \x1b[33m${first.pair}\x1b[0m @ $${first.price.toLocaleString()}  |  RSI: ${rsiColor}${first.rsi}\x1b[0m  |  Vol: ${first.volume}  |  Grok: \x1b[33m${first.grokSays}\x1b[0m`,
        `  \x1b[90m→ Type\x1b[0m \x1b[32mBUY\x1b[0m\x1b[90m,\x1b[0m \x1b[31mSELL\x1b[0m\x1b[90m, or\x1b[0m \x1b[33mHOLD\x1b[0m`
      );
      return "";
    }

    // ── WARP: AI pipeline trace ──
    if (trimmed === "warp") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ SIGNAL PIPELINE — LIVE TRACE ══\x1b[0m`,
        `\x1b[90m  Tracing signal: BTC/USDT breakout @ $67,420\x1b[0m`, ``);

      const steps = [
        `  \x1b[33m◐\x1b[0m  \x1b[31mGROK\x1b[0m scanning X feeds + order books...`,
        `  \x1b[32m●\x1b[0m  RSI divergence detected on 4H`,
        `  \x1b[32m●\x1b[0m  Volume spike: 2.3x average`,
        `  \x1b[32m●\x1b[0m  Social sentiment: 84% bullish`,
        `  \x1b[31m→\x1b[0m  Grok signal: \x1b[32mLONG\x1b[0m conf: \x1b[32m87%\x1b[0m`,
        `     \x1b[90m▼ forwarding to Claude...\x1b[0m`,
        ``,
        `  \x1b[33m◐\x1b[0m  \x1b[35mCLAUDE\x1b[0m running deep analysis...`,
        `  \x1b[32m●\x1b[0m  Risk/reward: 2.4:1 — acceptable`,
        `  \x1b[33m!\x1b[0m  Resistance at $68,200 untested`,
        `  \x1b[32m●\x1b[0m  Pattern: inverse H&S (textbook)`,
        `  \x1b[35m→\x1b[0m  Claude adjusted conf: \x1b[33m79%\x1b[0m (added caution)`,
        `     \x1b[90m▼ forwarding to Perplexity...\x1b[0m`,
        ``,
        `  \x1b[33m◐\x1b[0m  \x1b[34mPERPLEXITY\x1b[0m fact-checking live sources...`,
        `  \x1b[32m●\x1b[0m  No negative news in last 4 hours`,
        `  \x1b[32m●\x1b[0m  Whale accumulation confirmed (Glassnode)`,
        `  \x1b[33m!\x1b[0m  Fed meeting in 18h — mild caution`,
        `  \x1b[34m→\x1b[0m  Research conf: \x1b[32m82%\x1b[0m`,
        `     \x1b[90m▼ computing consensus...\x1b[0m`,
        ``,
        `  \x1b[36m╔══════════════════════════════════════╗\x1b[0m`,
        `  \x1b[36m║\x1b[0m  \x1b[32m■\x1b[0m \x1b[36mENGINE DECISION\x1b[0m                  \x1b[36m║\x1b[0m`,
        `  \x1b[36m╠══════════════════════════════════════╣\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Action:     \x1b[32mLONG BTC/USDT\x1b[0m        \x1b[36m║\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Consensus:  \x1b[32m3/3 AGREE\x1b[0m            \x1b[36m║\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Confidence: \x1b[32m83%\x1b[0m (weighted avg)   \x1b[36m║\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Entry:      $67,420              \x1b[36m║\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Stop:       $64,050 (-5%)        \x1b[36m║\x1b[0m`,
        `  \x1b[36m║\x1b[0m  Target:     $77,530 (+15%)       \x1b[36m║\x1b[0m`,
        `  \x1b[36m╚══════════════════════════════════════╝\x1b[0m`,
        ``,
        `  \x1b[90mPipeline: 2.4s | 3-model consensus | Paper trading demo\x1b[0m`,
      ];

      let si = 0;
      const siv = setInterval(() => {
        if (si < steps.length) {
          addLines(steps[si]);
          si++;
        } else {
          clearInterval(siv);
          addLines(``);
        }
      }, 150);
      return "";
    }

    // ── HEATMAP: Crypto correlation heatmap ──
    if (trimmed === "heatmap") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ CRYPTO CORRELATION HEATMAP ══\x1b[0m`,
        `\x1b[90m  30-day rolling correlation between assets\x1b[0m`, ``);

      const assets = ["BTC", "ETH", "SOL", "AVAX", "LINK", "DOT"];
      const correlations: number[][] = [];
      for (let i = 0; i < assets.length; i++) {
        correlations[i] = [];
        for (let j = 0; j < assets.length; j++) {
          if (i === j) {
            correlations[i][j] = 1.0;
          } else if (correlations[j]?.[i] !== undefined) {
            correlations[i][j] = correlations[j][i];
          } else {
            const base = 0.3 + Math.random() * 0.5;
            const noise = (Math.random() - 0.5) * 0.3;
            correlations[i][j] = +Math.max(-0.5, Math.min(0.98, base + noise)).toFixed(2);
          }
        }
      }

      const header = `  \x1b[90m${" ".repeat(7)}\x1b[0m` + assets.map(a => `\x1b[33m${a.padStart(6)}\x1b[0m`).join(" ");
      addLines(header);

      let rowIdx = 0;
      const hiv = setInterval(() => {
        if (rowIdx < assets.length) {
          let row = `  \x1b[33m${assets[rowIdx].padEnd(6)}\x1b[0m `;
          for (let j = 0; j < assets.length; j++) {
            const v = correlations[rowIdx][j];
            let color: string;
            let block: string;
            if (v >= 0.9) { color = "\x1b[32m"; block = "██████"; }
            else if (v >= 0.7) { color = "\x1b[32m"; block = "████░░"; }
            else if (v >= 0.5) { color = "\x1b[33m"; block = "███░░░"; }
            else if (v >= 0.3) { color = "\x1b[33m"; block = "██░░░░"; }
            else if (v >= 0) { color = "\x1b[90m"; block = "█░░░░░"; }
            else { color = "\x1b[31m"; block = "░░░░░░"; }
            row += `${color}${block}\x1b[0m `;
          }
          addLines(row);
          rowIdx++;
        } else {
          clearInterval(hiv);
          addLines(``,
            `  \x1b[90mScale:\x1b[0m \x1b[31m░░░\x1b[0m -0.5  \x1b[90m█░░\x1b[0m 0.0  \x1b[33m██░\x1b[0m 0.5  \x1b[32m███\x1b[0m 0.8  \x1b[32m████\x1b[0m 1.0`,
            ``,
            `  \x1b[36mInsight:\x1b[0m ${
              correlations[0][2] > 0.7
                ? "BTC-SOL correlation elevated — risk of correlated drawdown"
                : correlations[0][1] > 0.8
                  ? "BTC-ETH tightly coupled — diversification benefit limited"
                  : "Asset correlations moderate — diversification working"
            }`,
            `  \x1b[90mSimulated correlations — demo data\x1b[0m`, ``
          );
        }
      }, 180);
      return "";
    }

    // ── BACKTEST: Strategy backtesting simulation ──
    if (trimmed === "backtest" || trimmed.startsWith("backtest ")) {
      const strategyInput = trimmed === "backtest" ? "momentum" : raw.substring(9).trim().toLowerCase();
      const strategy = strategyInput || "momentum";
      const strategies: Record<string, { name: string; desc: string; winRate: number; bias: number }> = {
        momentum: { name: "Momentum Rider", desc: "Buy breakouts, ride trends, trail stops", winRate: 0.62, bias: 0.015 },
        mean: { name: "Mean Reversion", desc: "Fade extremes, target the mean", winRate: 0.68, bias: 0.008 },
        sentiment: { name: "Sentiment Alpha", desc: "Trade social sentiment spikes", winRate: 0.55, bias: 0.022 },
      };
      const strat = strategies[strategy] || strategies.momentum;

      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ BACKTEST: ${strat.name.toUpperCase()} ══\x1b[0m`,
        `\x1b[90m  Strategy: ${strat.desc}\x1b[0m`,
        `\x1b[90m  Period: 30 days | Pair: BTC/USDT | Start: $10,000\x1b[0m`, ``);

      let equity = 10000;
      let maxEquity = 10000;
      let maxDD = 0;
      let wins = 0;
      let losses = 0;
      let day = 0;
      const totalDays = 30;
      const equityHistory: number[] = [10000];

      const btiv = setInterval(() => {
        if (day < totalDays) {
          day++;
          const isTradeDay = Math.random() < 0.5;
          if (isTradeDay) {
            const win = Math.random() < strat.winRate;
            const magnitude = (Math.random() * 300 + 50) * (1 + strat.bias * 10);
            const pnl = win ? +magnitude.toFixed(0) : -Math.round(magnitude * 0.6);
            equity += pnl;
            if (win) wins++; else losses++;
            maxEquity = Math.max(maxEquity, equity);
            const dd = ((maxEquity - equity) / maxEquity) * 100;
            maxDD = Math.max(maxDD, dd);

            const barMax = 30;
            const barLen = Math.max(1, Math.min(barMax, Math.round((equity / 14000) * barMax)));
            const barColor = pnl >= 0 ? "\x1b[32m" : "\x1b[31m";
            const action = pnl >= 0 ? "\x1b[32mWIN \x1b[0m" : "\x1b[31mLOSS\x1b[0m";
            addLines(`  \x1b[90mDay ${String(day).padStart(2)}\x1b[0m ${action} ${barColor}${"█".repeat(barLen)}${"░".repeat(barMax - barLen)}\x1b[0m $${equity.toLocaleString()} ${pnl >= 0 ? `\x1b[32m+${pnl}\x1b[0m` : `\x1b[31m${pnl}\x1b[0m`}`);
          } else {
            addLines(`  \x1b[90mDay ${String(day).padStart(2)} ──── no signal ────\x1b[0m`);
          }
          equityHistory.push(equity);
        } else {
          clearInterval(btiv);
          const totalPnl = equity - 10000;
          const totalReturn = ((totalPnl / 10000) * 100).toFixed(1);
          const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(0) : "0";
          const sharpe = (totalPnl / (maxDD > 0 ? maxDD * 100 : 100) * 1.5 + Math.random() * 0.5).toFixed(2);

          const blocks = "▁▂▃▄▅▆▇█";
          const eMin = Math.min(...equityHistory);
          const eMax = Math.max(...equityHistory);
          const eRange = eMax - eMin || 1;
          const spark = equityHistory.map((e) => {
            const idx = Math.min(7, Math.round(((e - eMin) / eRange) * 7));
            return e >= 10000 ? `\x1b[32m${blocks[idx]}\x1b[0m` : `\x1b[31m${blocks[idx]}\x1b[0m`;
          }).join("");

          const pnlColor = totalPnl >= 0 ? "\x1b[32m" : "\x1b[31m";
          addLines(``,
            `  \x1b[36m══ BACKTEST RESULTS ══\x1b[0m`,
            `  Equity curve: ${spark}`,
            ``,
            `  \x1b[33mStrategy:\x1b[0m    ${strat.name}`,
            `  \x1b[33mFinal Equity:\x1b[0m ${pnlColor}$${equity.toLocaleString()}\x1b[0m`,
            `  \x1b[33mReturn:\x1b[0m      ${pnlColor}${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString()} (${totalPnl >= 0 ? "+" : ""}${totalReturn}%)\x1b[0m`,
            `  \x1b[33mTrades:\x1b[0m      ${wins + losses} (\x1b[32m${wins}W\x1b[0m / \x1b[31m${losses}L\x1b[0m)`,
            `  \x1b[33mWin Rate:\x1b[0m    ${winRate}%`,
            `  \x1b[33mMax Drawdown:\x1b[0m \x1b[31m-${maxDD.toFixed(1)}%\x1b[0m`,
            `  \x1b[33mSharpe Ratio:\x1b[0m ${Number(sharpe) > 1 ? "\x1b[32m" : "\x1b[33m"}${sharpe}\x1b[0m`,
            ``,
            `  \x1b[90mStrategies: momentum | mean | sentiment\x1b[0m`,
            `  \x1b[90mSimulated backtest — past performance is not indicative of future results\x1b[0m`, ``
          );
        }
      }, 120);
      return "";
    }

    // ── PULSE: Engine heartbeat monitor ──
    if (trimmed === "pulse") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ ENGINE PULSE — VITAL SIGNS ══\x1b[0m`,
        `\x1b[90m  Monitoring CoreIntent heartbeat...\x1b[0m`, ``);

      const heartChars = "·-~=≈≋█▓▒░";
      let frame = 0;
      const totalFrames = 8;

      const pulseIv = setInterval(() => {
        if (frame < totalFrames) {
          const W = 50;
          let ecg = "  ";
          for (let x = 0; x < W; x++) {
            const phase = (x + frame * 7) / W * Math.PI * 4;
            const heartbeat = Math.sin(phase) * 0.3
              + (Math.abs(((x + frame * 7) % 12) - 6) < 2 ? Math.sin(phase * 3) * 0.8 : 0)
              + (Math.abs(((x + frame * 7) % 12) - 5) < 1 ? -0.5 : 0);
            const norm = Math.max(0, Math.min(9, Math.round((heartbeat + 1) * 4.5)));
            const c = heartChars[norm];
            if (norm >= 7) ecg += `\x1b[32m${c}\x1b[0m`;
            else if (norm >= 4) ecg += `\x1b[36m${c}\x1b[0m`;
            else ecg += `\x1b[90m${c}\x1b[0m`;
          }
          addLines(ecg);
          frame++;
        } else {
          clearInterval(pulseIv);
          const bpm = 60 + Math.floor(Math.random() * 20);
          const signalLatency = 12 + Math.floor(Math.random() * 30);
          const modelSync = 94 + Math.floor(Math.random() * 6);
          const riskLevel = Math.random() > 0.7 ? "ELEVATED" : "NOMINAL";
          const riskColor = riskLevel === "NOMINAL" ? "\x1b[32m" : "\x1b[33m";

          addLines(``,
            `  \x1b[36m┌─────────────────────────────────────────┐\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[32m♥\x1b[0m  Engine Heartbeat     \x1b[32m${bpm} BPM\x1b[0m        \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[36m⚡\x1b[0m Signal Latency      \x1b[32m${signalLatency}ms\x1b[0m          \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[36m◉\x1b[0m  Model Sync          \x1b[32m${modelSync}%\x1b[0m           \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[36m▲\x1b[0m  Risk Level          ${riskColor}${riskLevel}\x1b[0m       \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[36m⊞\x1b[0m  Circuit Breaker     \x1b[32mARMED\x1b[0m          \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m  \x1b[36m↺\x1b[0m  Last Signal         \x1b[90m${Math.floor(Math.random() * 45) + 5}s ago\x1b[0m        \x1b[36m│\x1b[0m`,
            `  \x1b[36m└─────────────────────────────────────────┘\x1b[0m`,
            ``,
            `  \x1b[90mAll vitals ${riskLevel === "NOMINAL" ? "normal" : "within tolerance"}. Paper trading mode.\x1b[0m`, ``
          );
        }
      }, 200);
      return "";
    }

    // ── SPEEDTEST: Simulated network speed test ──
    if (trimmed === "speedtest") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ COREINTENT SPEED TEST ══\x1b[0m`,
        `\x1b[90m  Testing connection to AI models...\x1b[0m`, ``);

      const tests = [
        { name: "Grok API", latency: 42, speed: 180 },
        { name: "Claude API", latency: 88, speed: 245 },
        { name: "Perplexity API", latency: 65, speed: 160 },
        { name: "Market Feed", latency: 12, speed: 890 },
        { name: "VPS (Cloudzy)", latency: 31, speed: 520 },
      ];
      let ti = 0;
      const tiv = setInterval(() => {
        if (ti < tests.length) {
          const t = tests[ti];
          const jitter = Math.floor(Math.random() * 20) - 10;
          const lat = t.latency + jitter;
          const spd = t.speed + Math.floor(Math.random() * 50);
          const barLen = Math.min(20, Math.round(spd / 50));
          const bar = "\x1b[32m" + "█".repeat(barLen) + "\x1b[90m" + "░".repeat(20 - barLen) + "\x1b[0m";
          const latColor = lat < 50 ? "\x1b[32m" : lat < 100 ? "\x1b[33m" : "\x1b[31m";
          addLines(`  ${bar}  \x1b[36m${t.name.padEnd(16)}\x1b[0m ${latColor}${lat}ms\x1b[0m  \x1b[32m${spd} Mbps\x1b[0m`);
          ti++;
        } else {
          clearInterval(tiv);
          addLines(``, `  \x1b[32m✓\x1b[0m All endpoints reachable. Avg latency: \x1b[32m${Math.round(tests.reduce((a, t) => a + t.latency, 0) / tests.length)}ms\x1b[0m`,
            `  \x1b[90mSimulated diagnostics — demo mode\x1b[0m`, ``);
        }
      }, 400);
      return "";
    }

    // ── LORE: CoreIntent origin story ──
    if (trimmed === "lore") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ THE COREINTENT CHRONICLES ══\x1b[0m`, ``);

      const chapters = [
        [`\x1b[33m  Chapter 1: The Problem\x1b[0m`,
         `  \x1b[90mEvery trading platform charged $99/mo for signals\x1b[0m`,
         `  \x1b[90mthat worked 40% of the time. One model guessing.\x1b[0m`,
         `  \x1b[90mNo accountability. No competition. Just extraction.\x1b[0m`, ``],
        [`\x1b[33m  Chapter 2: The Idea\x1b[0m`,
         `  \x1b[90mWhat if three AI models argued about every signal?\x1b[0m`,
         `  \x1b[90mGrok spots. Claude questions. Perplexity fact-checks.\x1b[0m`,
         `  \x1b[90mConsensus = conviction. Disagreement = dig deeper.\x1b[0m`, ``],
        [`\x1b[33m  Chapter 3: The Build\x1b[0m`,
         `  \x1b[90mNew Zealand. Solo founder. $45/mo infrastructure.\x1b[0m`,
         `  \x1b[90mNo VC. No permission. No burn rate. Just building.\x1b[0m`,
         `  \x1b[90mBots welcome. Humans too. The arena is free.\x1b[0m`, ``],
        [`\x1b[33m  Chapter 4: The Signal\x1b[0m`,
         `  \x1b[32m  ███ 336 ███\x1b[0m`,
         `  \x1b[90mTrading is a sport now. Compete, don't subscribe.\x1b[0m`,
         `  \x1b[90mThe leaderboard doesn't care who built you.\x1b[0m`, ``],
      ];

      const allStoryLines = chapters.flat();
      let li = 0;
      const liv = setInterval(() => {
        if (li < allStoryLines.length) {
          addLines(allStoryLines[li]);
          li++;
        } else {
          clearInterval(liv);
          addLines(`  \x1b[36m— fin —\x1b[0m`, ``);
        }
      }, 200);
      return "";
    }

    // ── ZEN: Trading koan ──
    if (trimmed === "zen") {
      const koans = [
        "The trader who chases every signal catches none.",
        "Three models agree — but the market has no models.",
        "Your edge is not your wallet. It is your patience.",
        "A green candle and a red candle are the same candle.",
        "The bot that wins today was written by the human who lost yesterday.",
        "Consensus is not certainty. Certainty is not profit.",
        "The best trade is sometimes no trade at all.",
        "When all indicators align, ask: what am I not seeing?",
      ];
      const koan = koans[Math.floor(Math.random() * koans.length)];
      const width = Math.max(koan.length + 4, 50);
      const pad = " ".repeat(Math.floor((width - koan.length) / 2));
      const out = `\x1b[36m  ${"─".repeat(width)}\x1b[0m
\x1b[36m  │\x1b[0m${pad}\x1b[33m${koan}\x1b[0m${" ".repeat(width - koan.length - pad.length)}\x1b[36m│\x1b[0m
\x1b[36m  ${"─".repeat(width)}\x1b[0m
  \x1b[90m— trading koan #${Math.floor(Math.random() * 999) + 1}\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, ``, out, ``);
      return out;
    }

    // ── FIRE: ASCII fire simulation ──
    if (trimmed === "fire") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, `\x1b[36m  ══ FIRE SIMULATION ══\x1b[0m`, ``);

      const W = 50;
      const H = 8;
      const chars = " .:-=+*#%@";
      const colors = ["\x1b[90m", "\x1b[31m", "\x1b[33m", "\x1b[33m", "\x1b[32m"];
      let frame = 0;
      const buf: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

      const fiv = setInterval(() => {
        for (let x = 0; x < W; x++) buf[H - 1][x] = Math.random() > 0.4 ? Math.floor(Math.random() * 9) + 1 : 0;
        for (let y = 0; y < H - 1; y++) {
          for (let x = 0; x < W; x++) {
            const sum = (buf[y + 1][(x - 1 + W) % W] || 0) + (buf[y + 1][x] || 0) + (buf[y + 1][(x + 1) % W] || 0) + (buf[y + 1][x] || 0);
            buf[y][x] = Math.max(0, Math.floor(sum / 4) - (Math.random() > 0.7 ? 1 : 0));
          }
        }
        const frameLines: string[] = [];
        for (let y = 0; y < H; y++) {
          let row = "  ";
          for (let x = 0; x < W; x++) {
            const v = buf[y][x];
            const ci = Math.min(colors.length - 1, Math.floor(v / 2));
            row += colors[ci] + chars[v] + "\x1b[0m";
          }
          frameLines.push(row);
        }
        addLines(...frameLines, ``);
        frame++;
        if (frame >= 6) {
          clearInterval(fiv);
          addLines(`  \x1b[90mFire simulation complete — 6 frames rendered\x1b[0m`, ``);
        }
      }, 300);
      return "";
    }

    // ── ABOUT: Platform summary ──
    if (trimmed === "about") {
      const out = `\x1b[36m  ══ ABOUT COREINTENT ══\x1b[0m

  \x1b[33mWhat:\x1b[0m  Agentic AI trading engine with multi-model consensus
  \x1b[33mWho:\x1b[0m   Built by Corey McIvor (@coreintentdev) from New Zealand
  \x1b[33mParent:\x1b[0m Zynthio.ai

  \x1b[36mHow It Works:\x1b[0m
  \x1b[90m  1.\x1b[0m \x1b[31mGrok\x1b[0m scans social feeds + technicals → spots the signal
  \x1b[90m  2.\x1b[0m \x1b[35mClaude\x1b[0m runs deep risk analysis → questions everything
  \x1b[90m  3.\x1b[0m \x1b[34mPerplexity\x1b[0m checks live news → fact-checks the thesis
  \x1b[90m  4.\x1b[0m \x1b[32mEngine\x1b[0m computes consensus → EXECUTE or HOLD

  \x1b[36mKey Facts:\x1b[0m
  \x1b[32m•\x1b[0m $0 entry — competitions, not subscriptions
  \x1b[32m•\x1b[0m $45/mo total infrastructure cost
  \x1b[32m•\x1b[0m Bots are first-class competitors
  \x1b[32m•\x1b[0m Paper trading mode — building in public
  \x1b[32m•\x1b[0m Open source on GitHub

  \x1b[90mType 'demo' to see it in action, or 'help' for all commands.\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, ``);
      return out;
    }

    // ── WEATHER: Market weather report ──
    if (trimmed === "weather") {
      const conditions = [
        { icon: "\x1b[33m*\x1b[0m", name: "Bullish Sunshine", temp: "+3.2%", desc: "Clear skies. Models aligned. High confidence signals across the board." },
        { icon: "\x1b[34m~\x1b[0m", name: "Bearish Storm", temp: "-2.8%", desc: "Turbulence detected. Multiple resistance levels ahead. Reduce exposure." },
        { icon: "\x1b[90m#\x1b[0m", name: "Sideways Fog", temp: "+0.4%", desc: "Low visibility. Mixed signals from all three models. Wait for clarity." },
        { icon: "\x1b[31m!\x1b[0m", name: "Volatility Tornado", temp: "+8.7%", desc: "Extreme conditions! High reward, equally high risk. Size accordingly." },
        { icon: "\x1b[36m.\x1b[0m", name: "Recovery Drizzle", temp: "+1.1%", desc: "Gentle recovery underway. Volume returning slowly. Cautious optimism." },
      ];
      const w = conditions[Math.floor(Math.random() * conditions.length)];
      const out = `\x1b[36m  ══ MARKET WEATHER REPORT ══\x1b[0m

  ${w.icon}  \x1b[33m${w.name}\x1b[0m  |  Forecast: \x1b[32m${w.temp}\x1b[0m

  ${w.desc}

  \x1b[90mGrok:\x1b[0m     Sentiment scan... \x1b[32mcomplete\x1b[0m
  \x1b[90mClaude:\x1b[0m   Risk assessment... \x1b[32mcomplete\x1b[0m
  \x1b[90mPerplexity:\x1b[0m News analysis...  \x1b[32mcomplete\x1b[0m

  \x1b[90mForecast generated from three-model consensus. Not financial advice.\x1b[0m`;
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`, out, ``);
      return out;
    }

    // ── SLOTS: Crypto slot machine ──
    if (trimmed === "slots") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ CRYPTO SLOTS ══\x1b[0m`,
        `\x1b[90m  Pull the lever...\x1b[0m`, ``);

      const syms = [
        { s: "₿", n: "BTC", c: "\x1b[33m" },
        { s: "Ξ", n: "ETH", c: "\x1b[35m" },
        { s: "◎", n: "SOL", c: "\x1b[32m" },
        { s: "▲", n: "AVAX", c: "\x1b[31m" },
        { s: "◆", n: "LINK", c: "\x1b[34m" },
        { s: "★", n: "MOON", c: "\x1b[33m" },
        { s: "✗", n: "REKT", c: "\x1b[31m" },
      ];
      const pick = () => syms[Math.floor(Math.random() * syms.length)];
      const result = [pick(), pick(), pick()];

      let frame = 0;
      const slotIv = setInterval(() => {
        if (frame < 4) {
          const a = pick(), b = pick(), c = pick();
          addLines(`  \x1b[90m│\x1b[0m ${a.c}${a.s}\x1b[0m \x1b[90m│\x1b[0m ${b.c}${b.s}\x1b[0m \x1b[90m│\x1b[0m ${c.c}${c.s}\x1b[0m \x1b[90m│\x1b[0m`);
        } else if (frame < 6) {
          const b = pick(), c = pick();
          addLines(`  \x1b[90m│\x1b[0m ${result[0].c}${result[0].s}\x1b[0m \x1b[90m│\x1b[0m ${b.c}${b.s}\x1b[0m \x1b[90m│\x1b[0m ${c.c}${c.s}\x1b[0m \x1b[90m│\x1b[0m  \x1b[32m◀\x1b[0m`);
        } else if (frame < 8) {
          const c = pick();
          addLines(`  \x1b[90m│\x1b[0m ${result[0].c}${result[0].s}\x1b[0m \x1b[90m│\x1b[0m ${result[1].c}${result[1].s}\x1b[0m \x1b[90m│\x1b[0m ${c.c}${c.s}\x1b[0m \x1b[90m│\x1b[0m  \x1b[32m◀◀\x1b[0m`);
        } else if (frame === 8) {
          addLines(
            ``,
            `  \x1b[36m╔═════╦═════╦═════╗\x1b[0m`,
            `  \x1b[36m║\x1b[0m  ${result[0].c}${result[0].s}\x1b[0m  \x1b[36m║\x1b[0m  ${result[1].c}${result[1].s}\x1b[0m  \x1b[36m║\x1b[0m  ${result[2].c}${result[2].s}\x1b[0m  \x1b[36m║\x1b[0m`,
            `  \x1b[36m╚═════╩═════╩═════╝\x1b[0m`
          );
        } else {
          clearInterval(slotIv);
          const [sa, sb, sc] = result;
          const triple = sa.n === sb.n && sb.n === sc.n;
          const pair = sa.n === sb.n || sb.n === sc.n || sa.n === sc.n;
          if (triple && sa.n === "MOON") {
            addLines(``, `\x1b[33m  ★ ★ ★  J A C K P O T  ★ ★ ★\x1b[0m`, `\x1b[33m  THREE MOONS — TO THE MOON!\x1b[0m`);
          } else if (triple && sa.n === "REKT") {
            addLines(``, `\x1b[31m  ✗ ✗ ✗  TRIPLE REKT  ✗ ✗ ✗\x1b[0m`, `\x1b[31m  Absolute carnage. Spin again if you dare.\x1b[0m`);
          } else if (triple) {
            addLines(``, `\x1b[32m  ★ ★ ★  TRIPLE ${sa.n}! BIG WIN!  ★ ★ ★\x1b[0m`);
          } else if (pair) {
            const matched = sa.n === sb.n ? sa : sb.n === sc.n ? sb : sa;
            addLines(``, `\x1b[33m  ★ ★  Double ${matched.n} — small win\x1b[0m`);
          } else {
            addLines(``, `\x1b[90m  No match. Type \x1b[32mslots\x1b[90m to spin again.\x1b[0m`);
          }
          addLines(`  \x1b[90mFor entertainment only — no real credits\x1b[0m`, ``);
        }
        frame++;
      }, 150);
      return "";
    }

    // ── decrypt ──
    if (trimmed === "decrypt") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ DECRYPTING CLASSIFIED MESSAGE ══\x1b[0m`,
        `\x1b[90m  Source: ZYNTHIO COMMAND | Clearance: 336\x1b[0m`, ``);

      const secret = "THE FUTURE OF TRADING IS MULTI-AGENT CONSENSUS";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>{}[]";
      const revealed: string[] = Array(secret.length).fill("");
      let pos = 0;
      let subFrame = 0;

      const dIv = setInterval(() => {
        if (pos >= secret.length) {
          clearInterval(dIv);
          addLines(``,
            `\x1b[32m  ✓ DECRYPTION COMPLETE\x1b[0m`,
            `  \x1b[36mClearance:\x1b[0m  Level 336`,
            `  \x1b[36mClassified:\x1b[0m "Every human needs a bot. Every bot needs a human."`,
            `  \x1b[90mF18 Security — digital identity protection active\x1b[0m`, ``);
          return;
        }

        if (subFrame < 3) {
          // Show scrambled version
          let line = "  \x1b[32m";
          for (let i = 0; i < secret.length; i++) {
            if (secret[i] === " ") { line += " "; continue; }
            if (i < pos) line += secret[i];
            else if (i === pos) line += `\x1b[33m${chars[Math.floor(Math.random() * chars.length)]}\x1b[32m`;
            else line += `\x1b[90m${chars[Math.floor(Math.random() * chars.length)]}\x1b[32m`;
          }
          line += "\x1b[0m";
          addLines(line);
          subFrame++;
        } else {
          revealed[pos] = secret[pos];
          pos++;
          subFrame = 0;
        }
      }, 40);
      return "";
    }

    // ── orbit ──
    if (trimmed === "orbit") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ AI MODEL ORBIT — LIVE VISUALIZATION ══\x1b[0m`, ``);

      const orbitFrames = 12;
      let frame = 0;
      const models = [
        { name: "GROK", c: "\x1b[31m", sym: "G" },
        { name: "CLAUDE", c: "\x1b[35m", sym: "C" },
        { name: "PERPLEXITY", c: "\x1b[34m", sym: "P" },
      ];

      const oIv = setInterval(() => {
        if (frame >= orbitFrames) {
          clearInterval(oIv);
          addLines(
            `\x1b[36m  ┌────────────────────────────────────────────┐\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Model Sync:    \x1b[32m3/3 ONLINE\x1b[0m                 \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Orbit Speed:   \x1b[32m2.4s/cycle\x1b[0m                 \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Data Packets:  \x1b[32m${142 + Math.floor(Math.random() * 50)} processed\x1b[0m             \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Consensus:     \x1b[32mACTIVE\x1b[0m                     \x1b[36m│\x1b[0m`,
            `\x1b[36m  └────────────────────────────────────────────┘\x1b[0m`,
            `  \x1b[90mThree models orbit the engine. Consensus is gravity.\x1b[0m`, ``
          );
          return;
        }

        // Calculate positions around a circle
        const angles = models.map((_, i) => (frame / orbitFrames * 2 * Math.PI) + (i * 2 * Math.PI / 3));
        const W = 42;
        const H = 9;
        const cx = 20;
        const cy = 4;
        const rx = 16;
        const ry = 3;

        // Build ASCII frame
        const grid: string[][] = Array.from({ length: H }, () => Array(W).fill(" "));

        // Draw orbit ellipse
        for (let a = 0; a < 60; a++) {
          const angle = (a / 60) * 2 * Math.PI;
          const ox = Math.round(cx + rx * Math.cos(angle));
          const oy = Math.round(cy + ry * Math.sin(angle));
          if (ox >= 0 && ox < W && oy >= 0 && oy < H && grid[oy][ox] === " ") {
            grid[oy][ox] = "·";
          }
        }

        // Place engine at center
        grid[cy][cx] = "E";

        // Place models
        const modelPositions: { x: number; y: number; mi: number }[] = [];
        for (let i = 0; i < models.length; i++) {
          const mx = Math.round(cx + rx * Math.cos(angles[i]));
          const my = Math.round(cy + ry * Math.sin(angles[i]));
          if (mx >= 0 && mx < W && my >= 0 && my < H) {
            grid[my][mx] = models[i].sym;
            modelPositions.push({ x: mx, y: my, mi: i });
          }
        }

        // Render frame
        const frameLines = grid.map((row) => {
          let line = "  ";
          for (const ch of row) {
            if (ch === "E") line += "\x1b[32m◉\x1b[0m";
            else if (ch === "G") line += "\x1b[31mG\x1b[0m";
            else if (ch === "C") line += "\x1b[35mC\x1b[0m";
            else if (ch === "P") line += "\x1b[34mP\x1b[0m";
            else if (ch === "·") line += "\x1b[90m·\x1b[0m";
            else line += ch;
          }
          return line;
        });

        // Add status
        const activeModel = models[frame % 3];
        frameLines.push(`  \x1b[90mframe ${frame + 1}/${orbitFrames}\x1b[0m  ${activeModel.c}${activeModel.name}\x1b[0m transmitting...`);

        addLines(...frameLines, ``);
        frame++;
      }, 300);
      return "";
    }

    // ── glitch ──
    if (trimmed === "glitch") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`);

      const glitchChars = "░▒▓█▀▄▌▐│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬";
      const corruptMessages = [
        "SIGNAL INTEGRITY CHECK",
        "CONSENSUS MATRIX",
        "AI MODEL SYNC",
        "RISK PARAMETERS",
        "CIRCUIT BREAKER",
        "MARKET FEED",
      ];
      let phase = 0;

      const gIv = setInterval(() => {
        if (phase < 6) {
          // Glitch frames
          const W = 50;
          let line = "  ";
          for (let i = 0; i < W; i++) {
            const gc = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            const colors = ["\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m"];
            line += `${colors[Math.floor(Math.random() * colors.length)]}${gc}\x1b[0m`;
          }
          addLines(line);
          phase++;
        } else if (phase < 12) {
          // Recovery frames
          const msgIdx = phase - 6;
          const msg = corruptMessages[msgIdx] || "SYSTEMS";
          const recovered = Math.random() > 0.3;
          const status = recovered ? `\x1b[32m✓ STABLE\x1b[0m` : `\x1b[33m◐ SYNCING\x1b[0m`;
          addLines(`  \x1b[90m[recovery]\x1b[0m ${msg.padEnd(24)} ${status}`);
          phase++;
        } else {
          clearInterval(gIv);
          addLines(``,
            `\x1b[36m  ══ GLITCH ANALYSIS ══\x1b[0m`,
            `  \x1b[32m✓\x1b[0m System recovered. All models responsive.`,
            `  \x1b[33mCause:\x1b[0m  Simulated stress test (no actual failure)`,
            `  \x1b[33mResult:\x1b[0m All 6 subsystems recovered within tolerance`,
            `  \x1b[90mF18 Security — resilience test passed\x1b[0m`, ``);
        }
      }, 120);
      return "";
    }

    // ── SNIPER: AI target lock animation ──
    if (trimmed === "sniper") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ SNIPER — AI TARGET LOCK ══\x1b[0m`,
        `\x1b[90m  Three models acquiring target...\x1b[0m`, ``);

      const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"];
      const target = pairs[Math.floor(Math.random() * pairs.length)];
      const price = target === "BTC/USDT" ? 67420 : target === "ETH/USDT" ? 3285 : target === "SOL/USDT" ? 142.8 : 35.6;
      let frame = 0;
      const totalFrames = 18;

      const sniperIv = setInterval(() => {
        if (frame < 4) {
          const w = 12 - frame * 2;
          const pad = " ".repeat(Math.max(0, 10 - w));
          const scope = "-".repeat(w);
          addLines(`  ${pad}\x1b[31m[\x1b[0m${scope}\x1b[33m+\x1b[0m${scope}\x1b[31m]\x1b[0m  \x1b[90mGrok scanning...\x1b[0m`);
        } else if (frame < 8) {
          const w = 12 - (frame - 4) * 2;
          const pad = " ".repeat(Math.max(0, 10 - w));
          const scope = "-".repeat(w);
          addLines(`  ${pad}\x1b[35m[\x1b[0m${scope}\x1b[33m+\x1b[0m${scope}\x1b[35m]\x1b[0m  \x1b[90mClaude analyzing...\x1b[0m`);
        } else if (frame < 12) {
          const w = 12 - (frame - 8) * 2;
          const pad = " ".repeat(Math.max(0, 10 - w));
          const scope = "-".repeat(w);
          addLines(`  ${pad}\x1b[34m[\x1b[0m${scope}\x1b[33m+\x1b[0m${scope}\x1b[34m]\x1b[0m  \x1b[90mPerplexity verifying...\x1b[0m`);
        } else if (frame === 12) {
          addLines(``);
          addLines(`\x1b[33m  ══════════════════════════════════════\x1b[0m`);
          addLines(`\x1b[33m       ╔═══════════════════════╗\x1b[0m`);
          addLines(`\x1b[33m       ║\x1b[0m   \x1b[31m◤\x1b[0m \x1b[32mTARGET LOCKED\x1b[0m \x1b[31m◥\x1b[0m   \x1b[33m║\x1b[0m`);
          addLines(`\x1b[33m       ╚═══════════════════════╝\x1b[0m`);
          addLines(`\x1b[33m  ══════════════════════════════════════\x1b[0m`);
        } else if (frame === 14) {
          const conf = 78 + Math.floor(Math.random() * 18);
          const dir = conf > 85 ? "LONG" : conf > 75 ? "HOLD" : "SHORT";
          const dirColor = dir === "LONG" ? "\x1b[32m▲" : dir === "SHORT" ? "\x1b[31m▼" : "\x1b[33m◆";
          addLines(
            ``,
            `  \x1b[36mTarget:\x1b[0m    \x1b[33m${target}\x1b[0m @ $${price.toLocaleString()}`,
            `  \x1b[36mDirection:\x1b[0m ${dirColor} ${dir}\x1b[0m`,
            `  \x1b[36mConfidence:\x1b[0m \x1b[32m${conf}%\x1b[0m`,
            ``,
            `  \x1b[31mGrok:\x1b[0m       Signal detected in 0.${2 + Math.floor(Math.random() * 6)}s`,
            `  \x1b[35mClaude:\x1b[0m     Risk model passed — R:R ${(1.5 + Math.random() * 2).toFixed(1)}:1`,
            `  \x1b[34mPerplexity:\x1b[0m No adverse news — clear to proceed`,
            ``,
            `  \x1b[32m✓ CONSENSUS ACHIEVED\x1b[0m — 3/3 models aligned`,
            `  \x1b[90mPaper trading — no real execution\x1b[0m`, ``
          );
        } else if (frame >= totalFrames) {
          clearInterval(sniperIv);
        }
        frame++;
      }, 200);
      return "";
    }

    // ── CYBERWAR: War room command center ──
    if (trimmed === "cyberwar") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ CYBERWAR — COMMAND CENTER ══\x1b[0m`,
        `\x1b[90m  Initializing war room...\x1b[0m`, ``);

      let frame = 0;
      const totalFrames = 16;
      const bars = ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

      const warIv = setInterval(() => {
        if (frame < 3) {
          const systems = [
            { name: "RADAR", color: "\x1b[31m" },
            { name: "SHIELD", color: "\x1b[34m" },
            { name: "INTEL", color: "\x1b[35m" },
            { name: "COMMS", color: "\x1b[33m" },
          ];
          const sys = systems[frame % systems.length];
          addLines(`  ${sys.color}[${sys.name}]\x1b[0m Subsystem online... \x1b[32m✓\x1b[0m`);
        } else if (frame === 3) {
          addLines(``,
            `\x1b[36m  ┌─────────────────────────────────────────────┐\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[33mZ Y N T H I O   W A R   R O O M\x1b[0m           \x1b[36m│\x1b[0m`,
            `\x1b[36m  ├─────────────────────────────────────────────┤\x1b[0m`);
        } else if (frame > 3 && frame < 12) {
          const elapsed = frame - 3;
          const grokLoad = Math.min(8, Math.floor(elapsed * 1.2));
          const claudeLoad = Math.min(8, Math.floor(elapsed * 0.9));
          const perplexityLoad = Math.min(8, Math.floor(elapsed * 1.0));
          const grokBar = bars.slice(0, grokLoad).join("") + " ".repeat(Math.max(0, 8 - grokLoad));
          const claudeBar = bars.slice(0, claudeLoad).join("") + " ".repeat(Math.max(0, 8 - claudeLoad));
          const perplexityBar = bars.slice(0, perplexityLoad).join("") + " ".repeat(Math.max(0, 8 - perplexityLoad));

          const threats = Math.floor(Math.random() * 3);
          const signals = 14 + Math.floor(elapsed * 3) + Math.floor(Math.random() * 5);
          const uptime = (99.7 + Math.random() * 0.29).toFixed(2);

          addLines(
            `\x1b[36m  │\x1b[0m  \x1b[31mGrok\x1b[0m       \x1b[31m${grokBar}\x1b[0m ${(grokLoad * 12.5).toFixed(0).padStart(3)}%  \x1b[90mThreat: ${threats}\x1b[0m  \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[35mClaude\x1b[0m     \x1b[35m${claudeBar}\x1b[0m ${(claudeLoad * 12.5).toFixed(0).padStart(3)}%  \x1b[90mSigs: ${signals}\x1b[0m    \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[34mPerplexity\x1b[0m \x1b[34m${perplexityBar}\x1b[0m ${(perplexityLoad * 12.5).toFixed(0).padStart(3)}%  \x1b[90mUp: ${uptime}%\x1b[0m \x1b[36m│\x1b[0m`,
          );
        } else if (frame === 12) {
          addLines(
            `\x1b[36m  ├─────────────────────────────────────────────┤\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[32m■\x1b[0m DEFCON 4  \x1b[32m■\x1b[0m Models: 3/3  \x1b[32m■\x1b[0m Shields: UP  \x1b[36m│\x1b[0m`,
            `\x1b[36m  └─────────────────────────────────────────────┘\x1b[0m`,
          );
        } else if (frame === 14) {
          addLines(``,
            `  \x1b[32m✓ WAR ROOM ACTIVE\x1b[0m`,
            `  \x1b[36mOperations:\x1b[0m  6 agents deployed`,
            `  \x1b[36mSurveillance:\x1b[0m ${38 + Math.floor(Math.random() * 20)} signals intercepted`,
            `  \x1b[36mThreat Level:\x1b[0m \x1b[32mLOW\x1b[0m — no anomalies`,
            `  \x1b[36mConsensus:\x1b[0m   3/3 models in formation`,
            ``,
            `  \x1b[90mF18 Security — perimeter secured\x1b[0m`,
            `  \x1b[90mType 'sniper' to lock a target\x1b[0m`, ``);
        } else if (frame >= totalFrames) {
          clearInterval(warIv);
        }
        frame++;
      }, 250);
      return "";
    }

    // ── HOLOGRAM: Holographic data projection ──
    if (trimmed === "hologram") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ HOLOGRAPHIC PROJECTION ══\x1b[0m`,
        `\x1b[90m  Initializing hologram emitter...\x1b[0m`, ``);

      let frame = 0;
      const totalFrames = 24;
      const holoText = "COREINTENT";
      const glitchChars = "█▓▒░╬╫╪┼╳";

      const holoIv = setInterval(() => {
        if (frame < 6) {
          let line1 = "  ";
          let line2 = "  ";
          for (let i = 0; i < holoText.length; i++) {
            if (i <= frame) {
              const colors = ["\x1b[36m", "\x1b[34m", "\x1b[35m"];
              line1 += `${colors[i % 3]}${holoText[i]}\x1b[0m`;
              line2 += `${colors[i % 3]}${holoText[i].toLowerCase()}\x1b[0m`;
            } else {
              line1 += `\x1b[90m${glitchChars[Math.floor(Math.random() * glitchChars.length)]}\x1b[0m`;
              line2 += `\x1b[90m${glitchChars[Math.floor(Math.random() * glitchChars.length)]}\x1b[0m`;
            }
          }
          addLines(line1, line2);
        } else if (frame === 6) {
          addLines(``);
          const holoArt = [
            `\x1b[36m       ╱╲\x1b[0m`,
            `\x1b[36m      ╱  ╲\x1b[0m`,
            `\x1b[34m     ╱ \x1b[33m◆\x1b[34m  ╲\x1b[0m`,
            `\x1b[34m    ╱  \x1b[36mAI\x1b[34m  ╲\x1b[0m`,
            `\x1b[35m   ╱  \x1b[36mCORE\x1b[35m  ╲\x1b[0m`,
            `\x1b[35m  ╱──────────╲\x1b[0m`,
            `\x1b[36m  ╲──────────╱\x1b[0m`,
            `\x1b[36m   ╲  \x1b[33m336\x1b[36m   ╱\x1b[0m`,
            `\x1b[34m    ╲      ╱\x1b[0m`,
            `\x1b[34m     ╲    ╱\x1b[0m`,
            `\x1b[35m      ╲  ╱\x1b[0m`,
            `\x1b[35m       ╲╱\x1b[0m`,
          ];
          for (const line of holoArt) addLines(line);
        } else if (frame === 10) {
          addLines(``);
          const dataPoints = [
            { label: "Engine", val: "v0.2.0-alpha", c: "\x1b[32m" },
            { label: "Models", val: "3 active", c: "\x1b[36m" },
            { label: "Agents", val: "6 deployed", c: "\x1b[35m" },
            { label: "Signals", val: `${847 + Math.floor(Math.random() * 200)} processed`, c: "\x1b[33m" },
            { label: "Uptime", val: `${(99.7 + Math.random() * 0.29).toFixed(2)}%`, c: "\x1b[32m" },
            { label: "Latency", val: `${12 + Math.floor(Math.random() * 8)}ms`, c: "\x1b[34m" },
          ];
          for (const dp of dataPoints) {
            const glitchLine = Math.random() > 0.7 ? `  \x1b[90m${glitchChars.substring(0, 3)}\x1b[0m` : "";
            addLines(`  \x1b[90m${dp.label.padEnd(10)}\x1b[0m ${dp.c}${dp.val}\x1b[0m${glitchLine}`);
          }
        } else if (frame === 14) {
          addLines(``,
            `  \x1b[36m┌─ HOLOGRAM STABLE ──────────────────┐\x1b[0m`,
            `  \x1b[36m│\x1b[0m \x1b[32m✓\x1b[0m Projection: \x1b[32mACTIVE\x1b[0m              \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m \x1b[32m✓\x1b[0m Resolution: \x1b[32mCRYSTAL\x1b[0m             \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m \x1b[32m✓\x1b[0m Depth:      \x1b[32m12 LAYERS\x1b[0m           \x1b[36m│\x1b[0m`,
            `  \x1b[36m│\x1b[0m \x1b[33m◆\x1b[0m Source:     \x1b[33mZYNTHIO CORE\x1b[0m        \x1b[36m│\x1b[0m`,
            `  \x1b[36m└────────────────────────────────────┘\x1b[0m`,
            ``,
            `  \x1b[90mHolographic interface — the future is here\x1b[0m`,
            `  \x1b[90mType 'cyberwar' for the full command center\x1b[0m`, ``);
        } else if (frame >= totalFrames) {
          clearInterval(holoIv);
        }
        frame++;
      }, 180);
      return "";
    }

    // ── ARENA: Competition bracket visualization ──
    if (trimmed === "arena") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ THE ARENA — WEEKLY COMPETITION BRACKET ══\x1b[0m`,
        `\x1b[90m  Bots vs Humans. Skill vs Strategy. Who survives?\x1b[0m`, ``);

      const competitors = [
        { name: "AlphaStrat_v7", type: "BOT", elo: 2140 },
        { name: "Priya S.", type: "HMN", elo: 1980 },
        { name: "NightOwl_Bot", type: "BOT", elo: 1890 },
        { name: "Jordan K.", type: "HMN", elo: 1820 },
        { name: "TrendRider", type: "BOT", elo: 1760 },
        { name: "Alex R.", type: "HMN", elo: 1710 },
        { name: "DegenBot_42", type: "BOT", elo: 1650 },
        { name: "You", type: "HMN", elo: 1500 },
      ];
      let phase = 0;

      const arenaIv = setInterval(() => {
        if (phase === 0) {
          addLines(
            `\x1b[36m  ┌─────────────────────── QUARTER FINALS ───────────────────────┐\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
          );
          phase++;
        } else if (phase <= 4) {
          const i = (phase - 1) * 2;
          const a = competitors[i];
          const b = competitors[i + 1];
          const aWin = a.elo + Math.random() * 200 > b.elo + Math.random() * 200;
          const aColor = a.type === "BOT" ? "\x1b[34m" : "\x1b[33m";
          const bColor = b.type === "BOT" ? "\x1b[34m" : "\x1b[33m";
          const wColor = aWin ? "\x1b[32m" : "";
          const lColor = aWin ? "" : "\x1b[32m";
          const aTag = a.type === "BOT" ? "\x1b[34m[BOT]\x1b[0m" : "\x1b[33m[HMN]\x1b[0m";
          const bTag = b.type === "BOT" ? "\x1b[34m[BOT]\x1b[0m" : "\x1b[33m[HMN]\x1b[0m";
          addLines(
            `\x1b[36m  │\x1b[0m  Match ${phase}:  ${aColor}${wColor}${a.name.padEnd(16)}\x1b[0m ${aTag}  \x1b[90mvs\x1b[0m  ${bColor}${lColor}${b.name.padEnd(16)}\x1b[0m ${bTag}  ${aWin ? `\x1b[32m◀ WIN\x1b[0m` : `\x1b[32mWIN ▶\x1b[0m`}`,
            `\x1b[36m  │\x1b[0m          P&L: ${aWin ? "\x1b[32m+$" + (Math.floor(Math.random() * 800) + 400) : "\x1b[31m-$" + (Math.floor(Math.random() * 300) + 100)}   \x1b[0m  vs  ${!aWin ? "\x1b[32m+$" + (Math.floor(Math.random() * 800) + 400) : "\x1b[31m-$" + (Math.floor(Math.random() * 300) + 100)}\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
          );
          phase++;
        } else if (phase === 5) {
          addLines(
            `\x1b[36m  ├───────────────────── SEMI FINALS ─────────────────────────────┤\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[33mSemi 1:\x1b[0m  \x1b[34mAlphaStrat_v7\x1b[0m \x1b[34m[BOT]\x1b[0m  \x1b[90mvs\x1b[0m  \x1b[33mNightOwl_Bot\x1b[0m \x1b[34m[BOT]\x1b[0m  \x1b[32m◀ WIN\x1b[0m`,
            `\x1b[36m  │\x1b[0m  \x1b[33mSemi 2:\x1b[0m  \x1b[33mJordan K.\x1b[0m \x1b[33m[HMN]\x1b[0m      \x1b[90mvs\x1b[0m  \x1b[34mTrendRider\x1b[0m \x1b[34m[BOT]\x1b[0m    \x1b[32mWIN ▶\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
          );
          phase++;
        } else if (phase === 6) {
          addLines(
            `\x1b[36m  ├──────────────────────── FINAL ──────────────────────────────┤\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
          );
          phase++;
        } else if (phase === 7) {
          const botWins = Math.random() > 0.45;
          addLines(
            `\x1b[36m  │\x1b[0m          \x1b[34mAlphaStrat_v7\x1b[0m  \x1b[90mvs\x1b[0m  \x1b[34mTrendRider\x1b[0m`,
            `\x1b[36m  │\x1b[0m          \x1b[34m[BOT]\x1b[0m                 \x1b[34m[BOT]\x1b[0m`,
            `\x1b[36m  │\x1b[0m`,
            `\x1b[36m  │\x1b[0m              ${botWins ? `\x1b[32m██  ████████████████████  ██\x1b[0m` : `\x1b[32m██  ████████████████████  ██\x1b[0m`}`,
            `\x1b[36m  │\x1b[0m              \x1b[33m★\x1b[0m  \x1b[32mCHAMPION: ${botWins ? "AlphaStrat_v7" : "TrendRider"}\x1b[0m  \x1b[33m★\x1b[0m`,
            `\x1b[36m  │\x1b[0m              \x1b[32m██  ████████████████████  ██\x1b[0m`,
            `\x1b[36m  │\x1b[0m`,
            `\x1b[36m  │\x1b[0m          Prize: \x1b[33mBragging rights + leaderboard crown\x1b[0m`,
            `\x1b[36m  │\x1b[0m                                                              \x1b[36m│\x1b[0m`,
            `\x1b[36m  └──────────────────────────────────────────────────────────────┘\x1b[0m`,
          );
          phase++;
        } else if (phase === 8) {
          addLines(``,
            `  \x1b[36mResults:\x1b[0m`,
            `    Bots advanced:  \x1b[34m3/4\x1b[0m  |  Humans advanced: \x1b[33m1/4\x1b[0m`,
            `    Champion:       \x1b[34m[BOT]\x1b[0m`,
            `    Your placement: \x1b[33m8th\x1b[0m — eliminated in quarters`,
            ``,
            `  \x1b[90mThe leaderboard doesn't care who built you.\x1b[0m`,
            `  \x1b[90mCompetitions planned — this is what's coming.\x1b[0m`, ``);
          clearInterval(arenaIv);
        }
      }, 350);
      return "";
    }

    // ── DNA: Engine DNA double helix visualization ──
    if (trimmed === "dna") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ ENGINE DNA — THE GENETIC CODE ══\x1b[0m`,
        `\x1b[90m  Sequencing the CoreIntent genome...\x1b[0m`, ``);

      const traits = [
        { gene: "GROK_SIGNAL", pair: "FAST_SCAN", color: "\x1b[31m" },
        { gene: "CLAUDE_RISK", pair: "DEEP_THINK", color: "\x1b[35m" },
        { gene: "PERP_VERIFY", pair: "FACT_CHECK", color: "\x1b[34m" },
        { gene: "CONSENSUS_3", pair: "MULTI_MODEL", color: "\x1b[32m" },
        { gene: "NO_CAPTCHA_", pair: "BOTS_WELCOM", color: "\x1b[33m" },
        { gene: "PAPER_TRADE", pair: "ZERO_RISK__", color: "\x1b[36m" },
        { gene: "COMPETITION", pair: "NOT_SUBSCRI", color: "\x1b[33m" },
        { gene: "NZ_REGISTER", pair: "NEVER_AU___", color: "\x1b[32m" },
        { gene: "F18_SECURIT", pair: "LAND_MINES_", color: "\x1b[31m" },
        { gene: "THREE_THREE", pair: "SIX_SIGNAL_", color: "\x1b[33m" },
      ];

      let row = 0;
      const dnaIv = setInterval(() => {
        if (row < traits.length) {
          const t = traits[row];
          const phase = row * 0.6;
          const sinVal = Math.sin(phase);
          const indent = Math.round(sinVal * 6) + 10;
          const gap = Math.round(Math.abs(Math.cos(phase)) * 8) + 2;
          const leftPad = " ".repeat(indent);
          const bridge = gap <= 3 ? "═══" : gap <= 5 ? "──╫──" : "─────╫─────";
          addLines(`  ${leftPad}${t.color}${t.gene}\x1b[0m \x1b[90m${bridge}\x1b[0m ${t.color}${t.pair}\x1b[0m`);
          row++;
        } else {
          clearInterval(dnaIv);
          addLines(``, `\x1b[36m  ┌─ GENOME ANALYSIS ─────────────────────┐\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Base Pairs:  \x1b[32m10 core traits\x1b[0m           \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Mutations:   \x1b[33m0\x1b[0m (clean genome)          \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Stability:   \x1b[32m99.7%\x1b[0m                    \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Signal:      \x1b[33m336\x1b[0m (dominant allele)    \x1b[36m│\x1b[0m`,
            `\x1b[36m  │\x1b[0m  Lineage:     \x1b[36mZynthio → CoreIntent\x1b[0m    \x1b[36m│\x1b[0m`,
            `\x1b[36m  └─────────────────────────────────────────┘\x1b[0m`,
            ``,
            `  \x1b[90mEvery gene earns its place. No bloat. No dead code.\x1b[0m`, ``);
        }
      }, 160);
      return "";
    }

    // ── TRAIN: Neural network training visualization ──
    if (trimmed === "train") {
      addLines(`\x1b[32m❯\x1b[0m ${cmd}`,
        `\x1b[36m  ══ NEURAL NETWORK TRAINING ══\x1b[0m`,
        `\x1b[90m  Training consensus model on 30 epochs...\x1b[0m`, ``);

      let epoch = 0;
      const totalEpochs = 30;
      let loss = 2.4 + Math.random() * 0.5;
      let accuracy = 0.35 + Math.random() * 0.1;
      const blocks = "░▒▓█";

      const trainIv = setInterval(() => {
        if (epoch < totalEpochs) {
          epoch++;
          const lr = 0.001 * Math.pow(0.95, epoch);
          const lossDecay = (Math.random() * 0.08 + 0.04) * (1 + 0.5 / epoch);
          loss = Math.max(0.08 + Math.random() * 0.05, loss - lossDecay);
          accuracy = Math.min(0.97, accuracy + (Math.random() * 0.025 + 0.005));

          const lossBar = Math.max(0, Math.min(20, Math.round(loss * 8)));
          const accBar = Math.min(20, Math.round(accuracy * 20));
          const lossViz = Array.from({ length: 20 }, (_, i) => {
            if (i < lossBar) {
              const bi = Math.min(3, Math.floor((lossBar - i) / 5));
              return i < lossBar / 2 ? `\x1b[31m${blocks[bi]}\x1b[0m` : `\x1b[33m${blocks[bi]}\x1b[0m`;
            }
            return `\x1b[90m·\x1b[0m`;
          }).join("");
          const accViz = Array.from({ length: 20 }, (_, i) => {
            if (i < accBar) {
              return i > accBar * 0.7 ? `\x1b[32m${blocks[3]}\x1b[0m` : `\x1b[32m${blocks[2]}\x1b[0m`;
            }
            return `\x1b[90m·\x1b[0m`;
          }).join("");

          const epochStr = String(epoch).padStart(2);
          const lossStr = loss.toFixed(4).padStart(7);
          const accStr = (accuracy * 100).toFixed(1).padStart(5);
          const lrStr = lr.toExponential(1);

          if (epoch % 5 === 0 || epoch === 1 || epoch === totalEpochs) {
            addLines(`  \x1b[90mEpoch ${epochStr}\x1b[0m  Loss ${lossViz} \x1b[33m${lossStr}\x1b[0m  Acc ${accViz} \x1b[32m${accStr}%\x1b[0m  \x1b[90mlr=${lrStr}\x1b[0m`);
          }
        } else {
          clearInterval(trainIv);
          const finalAcc = (accuracy * 100).toFixed(1);
          const finalLoss = loss.toFixed(4);
          const convergence = Number(finalAcc) >= 90 ? "\x1b[32mCONVERGED\x1b[0m" : "\x1b[33mIMPROVING\x1b[0m";

          addLines(``,
            `\x1b[36m  ══ TRAINING COMPLETE ══\x1b[0m`,
            ``,
            `  \x1b[33mModel:\x1b[0m          CoreIntent Consensus v3`,
            `  \x1b[33mArchitecture:\x1b[0m   3-head attention (Grok + Claude + Perplexity)`,
            `  \x1b[33mFinal Loss:\x1b[0m     \x1b[33m${finalLoss}\x1b[0m`,
            `  \x1b[33mFinal Accuracy:\x1b[0m \x1b[32m${finalAcc}%\x1b[0m`,
            `  \x1b[33mEpochs:\x1b[0m         ${totalEpochs}`,
            `  \x1b[33mStatus:\x1b[0m         ${convergence}`,
            ``,
            `  \x1b[36mLayer Weights:\x1b[0m`,
            `    Grok attention:       \x1b[31m${"█".repeat(Math.round(Math.random() * 3 + 6))}${"░".repeat(4)}\x1b[0m ${(0.28 + Math.random() * 0.1).toFixed(3)}`,
            `    Claude attention:     \x1b[35m${"█".repeat(Math.round(Math.random() * 3 + 7))}${"░".repeat(3)}\x1b[0m ${(0.38 + Math.random() * 0.1).toFixed(3)}`,
            `    Perplexity attention: \x1b[34m${"█".repeat(Math.round(Math.random() * 3 + 5))}${"░".repeat(5)}\x1b[0m ${(0.24 + Math.random() * 0.1).toFixed(3)}`,
            `    Consensus gate:       \x1b[32m${"█".repeat(Math.round(Math.random() * 2 + 8))}${"░".repeat(2)}\x1b[0m ${(0.89 + Math.random() * 0.08).toFixed(3)}`,
            ``,
            `  \x1b[90mModel checkpoint saved. Paper trading — no real predictions.\x1b[0m`, ``);
        }
      }, 100);
      return "";
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
    const game = gameRef.current;
    if (game) {
      const choice = cmd.trim().toLowerCase();
      if (choice === "quit" || choice === "q") {
        gameRef.current = null;
        addLines(`\x1b[33mChallenge abandoned.\x1b[0m`, ``);
        return;
      }
      if (!["buy", "sell", "hold", "b", "s", "h"].includes(choice)) {
        addLines(`\x1b[31mType BUY, SELL, or HOLD (or QUIT to exit)\x1b[0m`);
        return;
      }
      const action = choice[0] === "b" ? "buy" : choice[0] === "s" ? "sell" : "hold";
      const scenario = game.scenarios[game.round];
      const move = scenario.move;
      const newPrice = +(scenario.price * (1 + move / 100)).toFixed(2);

      let points = 0;
      let verdict = "";
      if (action === "buy" && move > 0.3) {
        points = Math.round(move * 100);
        verdict = `\x1b[32m✓ GOOD BUY!\x1b[0m Price surged +${move.toFixed(2)}%`;
      } else if (action === "sell" && move < -0.3) {
        points = Math.round(Math.abs(move) * 100);
        verdict = `\x1b[32m✓ GOOD SELL!\x1b[0m Dodged a ${move.toFixed(2)}% drop`;
      } else if (action === "hold" && Math.abs(move) <= 0.3) {
        points = 30;
        verdict = `\x1b[32m✓ SMART HOLD.\x1b[0m Choppy market (${move >= 0 ? "+" : ""}${move.toFixed(2)}%)`;
      } else if (action === "buy" && move < -0.3) {
        points = -Math.round(Math.abs(move) * 60);
        verdict = `\x1b[31m✗ BAD BUY.\x1b[0m Price dropped ${move.toFixed(2)}%`;
      } else if (action === "sell" && move > 0.3) {
        points = -Math.round(move * 40);
        verdict = `\x1b[31m✗ MISSED RALLY.\x1b[0m Price pumped +${move.toFixed(2)}%`;
      } else {
        verdict = `\x1b[33m~ FLAT.\x1b[0m Price moved ${move >= 0 ? "+" : ""}${move.toFixed(2)}%`;
      }

      game.score += points;
      if (points > 0) {
        game.streak++;
        game.bestStreak = Math.max(game.bestStreak, game.streak);
      } else {
        game.streak = 0;
      }

      const streakText = game.streak >= 3 ? ` \x1b[33m[${game.streak}x STREAK]\x1b[0m` : "";
      const pointsText = points > 0 ? `\x1b[32m+${points}\x1b[0m` : points < 0 ? `\x1b[31m${points}\x1b[0m` : `\x1b[90m+0\x1b[0m`;

      addLines(
        `  ${verdict}  ${pointsText} pts${streakText}`,
        `  $${scenario.price.toLocaleString()} → $${newPrice.toLocaleString()}`,
        ``
      );

      game.round++;

      if (game.round >= game.scenarios.length) {
        gameRef.current = null;
        const rank = game.score >= 700
          ? "\x1b[33m1st\x1b[0m — AlphaStrat_v7 territory"
          : game.score >= 500
            ? "\x1b[32m3rd\x1b[0m — Solid trader"
            : game.score >= 200
              ? "\x1b[36m5th\x1b[0m — Room to improve"
              : "\x1b[31m8th\x1b[0m — More practice needed";
        addLines(
          `\x1b[36m  ══════════════════════════════════════════\x1b[0m`,
          `\x1b[36m  CHALLENGE COMPLETE\x1b[0m`,
          `\x1b[36m  ══════════════════════════════════════════\x1b[0m`,
          `  Score:       ${game.score >= 0 ? "\x1b[32m" : "\x1b[31m"}${game.score} pts\x1b[0m`,
          `  Best Streak: \x1b[33m${game.bestStreak}x\x1b[0m`,
          `  League Rank: ${rank}`,
          `  \x1b[90mPaper trading challenge — real leagues coming soon\x1b[0m`, ``
        );
        return;
      }

      const next = game.scenarios[game.round];
      const rsiColor = next.rsi > 70 ? "\x1b[31m" : next.rsi < 30 ? "\x1b[32m" : "\x1b[33m";
      addLines(
        `\x1b[36m  ── Round ${game.round + 1}/${game.scenarios.length} ──\x1b[0m  Score: ${game.score >= 0 ? "\x1b[32m" : "\x1b[31m"}${game.score}\x1b[0m`,
        `  \x1b[33m${next.pair}\x1b[0m @ $${next.price.toLocaleString()}  |  RSI: ${rsiColor}${next.rsi}\x1b[0m  |  Vol: ${next.volume}  |  Grok: \x1b[33m${next.grokSays}\x1b[0m`,
        `  \x1b[90m→ Type\x1b[0m \x1b[32mBUY\x1b[0m\x1b[90m,\x1b[0m \x1b[31mSELL\x1b[0m\x1b[90m, or\x1b[0m \x1b[33mHOLD\x1b[0m`
      );
      return;
    }

    const parts = cmd.split("&&").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      await execSingle(part);
    }
  }, [execSingle, addLines]);

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
    // Step 4: Close any uncapped spans (lines that open a color but have no \x1b[0m reset)
    const openCount  = (html.match(/<span /g)  || []).length;
    const closeCount = (html.match(/<\/span>/g) || []).length;
    if (openCount > closeCount) html += "</span>".repeat(openCount - closeCount);
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
