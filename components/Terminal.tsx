"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { formatTime } from "@/lib/i18n";

const LOCALE_GREETINGS: Record<string, string> = {
  en: "Welcome to CoreIntent. Type help for commands.",
  es: "Bienvenido a CoreIntent. Escribe help para ver comandos.",
  mi: "Nau mai ki CoreIntent. Patohia help mo nga tohutohu.",
  zh: "\u6b22\u8fce\u6765\u5230 CoreIntent\u3002\u8f93\u5165 help \u67e5\u770b\u547d\u4ee4\u3002",
  ja: "CoreIntent \u3078\u3088\u3046\u3053\u305d\u3002help \u3067\u30b3\u30de\u30f3\u30c9\u4e00\u89a7\u3002",
  pt: "Bem-vindo ao CoreIntent. Digite help para ver comandos.",
  fr: "Bienvenue sur CoreIntent. Tapez help pour les commandes.",
  de: "Willkommen bei CoreIntent. Tippe help f\u00fcr Befehle.",
  ar: "\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0643 \u0641\u064a CoreIntent. \u0627\u0643\u062a\u0628 help \u0644\u0644\u0623\u0648\u0627\u0645\u0631.",
  hi: "CoreIntent \u092e\u0947\u0902 \u0906\u092a\u0915\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948\u0964 \u0915\u092e\u093e\u0902\u0921 \u0915\u0947 \u0932\u093f\u090f help \u091f\u093e\u0907\u092a \u0915\u0930\u0947\u0902\u0964",
};

function buildWelcomeBanner(locale: string): string {
  const greeting = LOCALE_GREETINGS[locale] || LOCALE_GREETINGS.en;
  const now = formatTime(new Date(), locale);
  return `\x1b[36m
 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557
\u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d
\u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u255a\u2588\u2588\u2554\u255d\u2588\u2588\u2551\u2588\u2588\u2551\u255a\u2588\u2588\u2554\u255d\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u255a\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255d  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557
\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551 \u255a\u2550\u255d \u2588\u2588\u2551\u2588\u2588\u2551 \u255a\u2550\u255d \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551
 \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d     \u255a\u2550\u255d\u255a\u2550\u255d     \u255a\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d
\x1b[0m
\x1b[33mZynthio.ai Commander v0.2.0 \u2014 CoreIntent Trading Engine\x1b[0m
\x1b[90m${greeting}\x1b[0m
Type \x1b[32mhelp\x1b[0m for commands. Tab to autocomplete. \x1b[32mcai\x1b[0m to start.
\x1b[90m${now}\x1b[0m
`;
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
  \x1b[32mradar\x1b[0m       - Animated market radar scan
  \x1b[32mping\x1b[0m        - Service connectivity diagnostics
  \x1b[32mtop\x1b[0m         - Live process monitor

  \x1b[33m── EASTER EGGS ──\x1b[0m
  \x1b[32mfortune\x1b[0m     - Trading wisdom
  \x1b[32mcowsay\x1b[0m      - ASCII cow wisdom
  \x1b[32mmatrix\x1b[0m      - Enter the matrix
  \x1b[32m336\x1b[0m         - The signal
  \x1b[32mhack\x1b[0m        - F18 security scan
  \x1b[32mneofetch\x1b[0m    - System info
  \x1b[32mparty\x1b[0m       - Competition mode

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
];

export default function Terminal({ locale = "en" }: { locale?: string }) {
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
