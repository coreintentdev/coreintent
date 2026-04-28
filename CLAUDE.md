# CoreIntent — AI Session Context (Amnesia Shield)

## Owner
Corey McIvor (@coreintentdev / @coreintentai)
Contact: corey@coreyai.ai ONLY
Based in: New Zealand (NEVER register anything in Australia)

## What This Project IS
- Agentic AI trading engine (paper trading mode)
- Competition-based platform (daily/weekly/monthly leagues, NOT subscriptions)
- Multi-AI orchestration: Grok (fast signals), Claude (deep analysis), Perplexity (research)
- Parent brand: Zynthio.ai

## What This Project IS NOT
- Not live trading yet
- Not connected to exchanges (Binance/Coinbase are PLANNED, not connected)
- API routes return demo data until API keys are configured
- Agents are code-ready, not running

## Rules for AI Sessions
1. READ before you write. Search the codebase before assuming anything.
2. NEVER say something is "connected" or "active" unless you've verified it works.
3. NEVER fabricate family data. If unsure, say "I don't know."
4. NEVER register anything in Australia. NZ-first for all legal/business.
5. Deploy files immediately — VPS, GitHub, Google Drive.
6. Build passes clean or you don't push.
7. If you see fake/demo data, label it honestly. Don't hide behind green dots.
8. Run `./scripts/audit.sh` after making changes to verify nothing broke.

## Architecture
- Next.js 15 (App Router) + TypeScript (strict mode)
- 7 pages: /, /pricing, /stack, /privacy, /terms, /disclaimer, /demo
- 14 API routes in app/api/
- AI service layer: lib/ai.ts (Grok, Claude, Perplexity with graceful fallback)
- VPS scripts: scripts/risk_monitor.ts, signal_listener.ts, gtrade_listener.ts
- Deploy scripts: scripts/deploy-vercel.sh, deploy-vps.sh, deploy-all.sh
- Audit: scripts/audit.sh
- VPS Lens: scripts/vps-lens.sh

## VPS
- Cloudzy: 100.122.99.34
- VPS state files: SESSION_STATE.md, MASTER_HANDOVER.md, TODO_MASTER_LIVE.md, COREY_WORDS.md
- 32,503 files, ~19GB

## Key Decisions (March 2026)
- Pricing: Competitions, not subscriptions. "Free costs fuck all to serve."
- Bots welcome: No captcha, AI-to-AI is first-class.
- The Mansion: Gamified world (rooms, story missions) — not yet built.
- SongPal: Music layer (Corey's originals, not Suno AI generation).
- F18 Security: Digital identity protection with land mines for bad actors.

## Known Issues
- Exchange/market routes (market, portfolio, signals, agents) return hardcoded demo data — no live exchange connections
- protect/research/content routes call live AI APIs when env keys are set; fall back to [DEMO] gracefully when not
- health/status/connections derive real values from env vars (no hardcoded data)
- VPS scripts written but never deployed (COR-20, overdue)
- No user authentication yet
- No database/persistence layer
- Terminal uses dangerouslySetInnerHTML for ANSI rendering (XSS mitigated: HTML escaped first, only allowlisted ANSI codes converted to spans)
- xterm packages removed from package.json (resolved 2026-04-27)
- `security/remove-runtime-fingerprint` and `security/sanitize-api-error-leakage` patches CONFIRMED on main (2026-04-27 audit): poweredByHeader:false in next.config.js + serverError() sanitizes all API error responses
- 30 non-main branches as of 2026-04-25 — cursor/AI tool sprawl; review and delete stale branches regularly; enable branch auto-delete on merge in GitHub settings
- Audit score: 96% (52/54, 0 failures) as of 2026-04-28 — rate limiting wired up (checkRateLimit stub ready for Cloudflare KV / Upstash Redis)

## Family (NEVER fabricate)
- Michelle (wife), Ruby (~14, daughter), Wesley (son)
- Hannah is NOT Corey's child. Her mum took her own life. NEVER list as daughter.
- Chas (dad), Willy/Wilhelmina (mum), Pete (brother, The Pelican), Joel (brother), Peter (third brother)
- Ben Innes (best friend, Perth)
