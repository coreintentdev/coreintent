# CoreIntent — AI Session Knowledge Index

> Read this first. Then `docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md`. You already know what you need — don't "find" it, look it up.

## Owner
Corey McIvor (@coreintentdev / @coreintentai)
Contact: corey@coreyai.ai ONLY
Business rule: NEVER register anything in Australia. Jurisdiction decisions are operator-only — AI must not infer or recommend a country.
(Operator location is redacted from all AI-context files. See docs/SECURITY_HARDENING_CHECKLIST.md §0.)

## What This Project IS
- Agentic AI trading engine (paper trading mode)
- Competition-based platform (daily/weekly/monthly leagues, NOT subscriptions)
- Multi-AI orchestration: Grok (fast signals), Claude (deep analysis), Perplexity (research)
- **Digital Twin layer** — an interactive "young me" AI twin trained on operator's own corpus (WhatsApp threads × 3 accounts, Gmail archive, Drive, VDS state files, COREY_WORDS, 100+ original songs about The Mansion, lyrics, doctrine) that teaches the operator and is then replicated to chosen people: family first, then network (Kelvin, David from the Hyatt, workers, managers). This is the WHY behind the 5-month push — not "marketing sites," but persona-personalised instances each given to one person.
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
4. NEVER register anything in Australia. Other jurisdiction decisions are operator-only — AI must not infer or recommend a country.
5. Deploy files immediately — VDS, GitHub, Google Drive.
6. Build passes clean or you don't push.
7. If you see fake/demo data, label it honestly. Don't hide behind green dots.
8. Run `./scripts/audit.sh` after making changes to verify nothing broke.

## Architecture
- Next.js 15 (App Router) + TypeScript (strict mode)
- 7 pages: /, /pricing, /stack, /privacy, /terms, /disclaimer, /demo
- 14 API routes in app/api/
- AI service layer: lib/ai.ts (Grok, Claude, Perplexity with graceful fallback)
- VDS scripts: scripts/risk_monitor.ts, signal_listener.ts, gtrade_listener.ts
- Deploy scripts: scripts/deploy-vercel.sh, deploy-vds.sh, deploy-all.sh, deploy-cf-skeletons.sh
- Audit: scripts/audit.sh
- VDS Lens: scripts/vds-lens.sh

## VDS (Contabo — NEW provider. Cloudzy is OLD VPS, being decommissioned)
- Provider: **Contabo** (vmi-prefix hostname is Contabo's format). NOT Cloudzy.
- Primary VDS: vmi3205024 (Tailscale: 100.125.12.4; public IP unverified — CLAUDE.md previously said 161.97.89.49, operator terminal showed 104.194.156.109 — needs SSH probe to lock canonical)
- Secondary VDS: vmi3217372 (Tailscale: 100.121.107.112)
- NOTE: 100.122.99.34 is WRONG — not reachable, do not use. Use Tailscale hostnames.
- Auth: SSH key at ~/.ssh/zynthio_dc (VDS_SSH_KEY) + panel API token (VDS_TOKEN) for Contabo lifecycle ops
- VDS state files: SESSION_STATE.md, MASTER_HANDOVER.md, TODO_MASTER_LIVE.md, COREY_WORDS.md
- **READ COREY_WORDS BEFORE INFERRING ANYTHING.** Pointer + rule: docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md. Do not paste verbatim from that file into commits/public logs.
- 32,503 files, ~19GB on vmi3205024
- MIGRATION: Cloudzy → Contabo transfer + closure of 3 old Cloudzy VPS hosts: status UNVERIFIED by AI sessions. Operator action required to confirm migration complete and Cloudzy billing closed (see INC-009).

## Key Decisions (March 2026)
- Pricing: Competitions, not subscriptions. "Free costs fuck all to serve."
- Bots welcome: No captcha, AI-to-AI is first-class.
- The Mansion: BOTH a real owned physical property (operator's actual mansion) AND a gamified world layer (rooms, story missions) — sessions have repeatedly missed that it is also a real place. 100+ original songs by Corey reference this mansion. Do not treat as metaphor-only. The Mansion is also the **home / UI shell** for the Digital Twin layer above — rooms become twin contexts, missions become tasks, the twin lives in the mansion.
- SongPal: Music layer (Corey's originals, not Suno AI generation). 100+ songs about The Mansion live in his catalogue. Suno tracks across 7 Suno accounts are ripped to VDS for backup + corpus (see `scripts/suno-pull-by-uid.sh`).

## Data Surfaces (where the corpus lives)
- **WhatsApp:** 3 operator accounts. Source of conversational truth (defamation evidence, family threads, work threads). No native MCP; ingest via manual chat export → file → VDS.
- **Gmail:** historical archive only. **All new mail is forwarded to Proton.** Gmail MCP reads remain valid for archive; new context lives in Proton.
- **Proton Mail:** receives all new mail from Gmail forwarding. No MCP in this session yet; if continuous email context for the twin is needed, run Proton Bridge on the VDS and IMAP-pull from there.
- **Google Drive:** operator's primary doc / song / evidence store. Drive MCP read-only for permissions. Mirror to VDS via `scripts/mirror-drive-to-vds.sh`.
- **VDS (Contabo vmi3205024):** canonical master for everything. /root/zynthio/ holds state files, ripped Suno tracks, legal evidence packs, mirror.
- **COREY_WORDS** (Drive + VDS): doctrine and operator voice — see `docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md`. The twin's voice comes from this file + the song catalogue, NOT from generic LLM defaults.
- F18 Security: Digital identity protection with land mines for bad actors.

## Known Issues
- Exchange/market routes (market, portfolio, signals, agents) return hardcoded demo data — no live exchange connections
- protect/research/content routes call live AI APIs when env keys are set; fall back to [DEMO] gracefully when not
- health/status/connections derive real values from env vars (no hardcoded data)
- VDS scripts written but never deployed (COR-20, overdue)
- 48 Cloudflare Pages skeleton sites pending deploy — Claude Desktop sessions report "no token". Set CLOUDFLARE_API_TOKEN in .env; use scripts/deploy-cf-skeletons.sh.
- Terminology: it's VDS (Virtual Dedicated Server) per Cloudzy, NOT VPS. Earlier sessions used VPS; corrected on branch claude/fix-vds-token-tvSRH (2026-05-07).
- No user authentication yet
- No database/persistence layer
- Terminal uses dangerouslySetInnerHTML for ANSI rendering (XSS mitigated: HTML escaped first, only allowlisted ANSI codes converted to spans)
- xterm packages removed from package.json (resolved 2026-04-27)
- Security patches confirmed on main (2026-04-30 audit): poweredByHeader:false in next.config.js + serverError() sanitizes all API error responses
- 30 non-main branches as of 2026-04-30 — cursor/AI tool sprawl; 4 confirmed-stale branches persist (build-monitor/security-audit-fix, claude/check-coreintent-builds-JTrDd, cursor-dependency-security-upgrade-ef32, cursor-zynrip-incident-ef32) — delete these; enable branch auto-delete on merge in GitHub settings
- Audit score: 96% (52/54, 0 failures) as of 2026-04-30 — rate limiting wired up (checkRateLimit stub ready for Cloudflare KV / Upstash Redis)

## Family (NEVER fabricate)
- Michelle (wife), Ruby (~14, daughter), Wesley (son)
- Hannah is NOT Corey's child. Her mum took her own life. NEVER list as daughter.
- Chas (dad), Willy/Wilhelmina (mum), Pete (brother, The Pelican), Joel (brother), Peter (third brother)
- Ben Innes (best friend, Perth)
