# CoreIntent — AI Session Context (Amnesia Shield)

## Owner
Corey McIvor (@coreintentdev / @coreintentai)
Contact: corey@coreyai.ai ONLY
Based in: New Zealand (NEVER register anything in Australia)

## What This Project IS
- Agentic AI trading engine (paper trading mode)
- Competition-based platform (daily/weekly/monthly leagues, NOT subscriptions)
- Multi-AI orchestration: Grok (fast signals), Claude (deep analysis), Perplexity (research), Gemini (scanning/coding)
- Parent brand: Zynthio.ai
- v3.0: Deterministic, local-first sovereign computing architecture

## What This Project IS NOT
- Not live trading yet
- Not connected to exchanges (Binance/Coinbase are PLANNED, not connected)
- API routes return demo data until API keys are configured
- Agents are code-ready, not running
- Drools rules engine is DESIGNED, not deployed yet

## Rules for AI Sessions
1. READ before you write. Search the codebase before assuming anything.
2. NEVER say something is "connected" or "active" unless you've verified it works.
3. NEVER fabricate family data. If unsure, say "I don't know."
4. NEVER register anything in Australia. NZ-first for all legal/business.
5. Deploy files immediately — VPS, GitHub, Google Drive.
6. Build passes clean or you don't push.
7. If you see fake/demo data, label it honestly. Don't hide behind green dots.
8. Run `./scripts/audit.sh` after making changes to verify nothing broke.
9. NEVER rm -rf without explicit confirmation.
10. NEVER touch /root/silver_bot/ — not ours, live trading bot.
11. Surname is McIVOR (not McIvor, not Mcivor).
12. 336 is the signal — always.

## Architecture
- Next.js 14 (App Router) + TypeScript (strict mode)
- 6 pages: /, /pricing, /stack, /privacy, /terms, /disclaimer
- 12 API routes in app/api/ (3 real, 2 live, 1 semi-real, 6 demo)
- AI service layer: lib/ai.ts (Grok, Claude, Perplexity with graceful fallback)
- Commander Terminal: tab completion, aliases, watch, chaining, AI chat
- VPS scripts: scripts/risk_monitor.ts, signal_listener.ts, gtrade_listener.ts
- Deploy scripts: scripts/deploy-vercel.sh, deploy-vps.sh, deploy-all.sh
- Audit: scripts/audit.sh
- VPS Lens: scripts/vps-lens.sh

## VPS Infrastructure (v3.0 — April 2026)
Three nodes, Tailscale zero-trust mesh (100.122.99.x subnet):

| Node | IP | Provider | Role |
|------|-----|----------|------|
| The Mansion (legacy) | 104.194.156.109 | Cloudzy | Nginx reverse proxy, domain routing |
| Deployment Alpha | 161.97.89.49 | Contabo | Primary deploy target, rsync receiver |
| Execution Beta | 84.247.137.105 | Contabo | Heavy compute, Drools engine (planned) |

- Tailscale IP: 100.122.99.34
- VPS state files: SESSION_STATE.md, MASTER_HANDOVER.md, TODO_MASTER_LIVE.md, COREY_WORDS.md
- Port 22 closed on all nodes — access via Tailscale only
- Port 7681 (ttyd) was P0 vulnerability — must be killed and blocked

## 4-Way Deploy Protocol
Every critical change must be pushed to ALL four destinations:
1. **rsync** to Contabo (161.97.89.49) over Tailscale tunnel
2. **git** commit to coreintentdev/zyn (data-backup branch)
3. **Google Drive** to /alpha-backup via rclone
4. **Notion Hub** via push_state_to_notion.py

## Domain Portfolio (16+ domains)
- coreyai.ai, zynthio.ai, coreintent.dev (ACTIVE)
- mosoko.ai, kervalon.ai, zyncontext.ai, coreylive.com, coreylive.ai (PARKED)
- songpal.ai, theripper.ai, macthezipper.ai, f18security.ai (PLANNED)
- pelicancharters.ai (Pete's business, PARKED)
- discoversanjuandelsur.com, discoversjds.com (CLIENT, ACTIVE)

## Trademark Portfolio
- ZYNTHIO — TM 2619731 (AU)
- CoreyAI — TM 2632610 (AU)
- SongPal — #1318588 (NZ)

## Key Decisions (March–April 2026)
- Pricing: Competitions, not subscriptions. "Free costs fuck all to serve."
- Bots welcome: No captcha, AI-to-AI is first-class.
- The Mansion: Gamified world (rooms, story missions) — not yet built.
- SongPal: Music layer (Corey's originals, not Suno AI generation).
- F18 Security: Digital identity protection with land mines for bad actors.
- Protocol 336: Disaster recovery via acoustic steganography in music tracks.
- Balance Pivot: SRP framework (Solution, Reaction, Problem) — lead with hero stories.
- Contabo over Cloudzy: 4x RAM, 3.4x NVMe. Old Mansion is legacy routing only.

## Known Issues
- 6 of 12 API routes return hardcoded demo data
- VPS scripts written but never deployed (COR-20, overdue)
- No user authentication yet
- No database/persistence layer
- XSS in Terminal fixed (ANSI escaping + allowlist)
- xterm packages removed from package.json
- Proton Drive rclone sync broken (HTTP 422 loop — use single-thread throttled transfers)
- GCP free trial expiring ~April 9, 2026 — burn credits on Cloud Build

## Family (NEVER fabricate)
- Michelle (wife), Ruby (~14, daughter), Wesley (son)
- Hannah is NOT Corey's child. Her mum took her own life. NEVER list as daughter.
- Chas (dad), Willy/Wilhelmina (mum), Pete (brother, The Pelican), Joel (brother), Peter (third brother)
- Ben Innes (best friend, Perth)
