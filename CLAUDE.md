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

## Sandbox Capabilities & Limits (READ FIRST — every session)

Anthropic-hosted Claude Code sessions (the cloud sandbox where this Claude is running) have hard limits that prior sessions hid from the operator. Disclose at session start, then plan work around them.

**What this sandbox CAN do:**
- Read/edit/commit/push files in this git repo
- Call MCP tools the operator has authorised (Drive read, Gmail read+draft, Linear read+write, GitHub PR/issues, Cloudflare read + small writes, Slack post)
- Run `npm run build`, `tsc`, `eslint` locally

**What this sandbox CANNOT do (these are FIRM):**
- SSH to any VDS — no SSH client + no key
- Reach the operator's Mac, local HDD, or external HDD
- Reach Cloudflare API directly via `curl` (outbound firewalled — `api.cloudflare.com → 403` confirmed)
- Reach geo-IP / external HTTP services not on the allowlist
- Run rclone, wrangler, or any operator-CLI
- Read Proton mail (no MCP + no IMAP)
- Read WhatsApp, iMessage, or any chat history not exported to a file in Drive
- Click any browser UI (Linear workspace privacy toggle, GitHub repo visibility, Apple recovery deny, etc.)
- Create Cloudflare Pages projects (Pages CRUD is not in this MCP surface)

**Work allocation rule:**
- If a task needs ANY of the "cannot" items above, it must run from **Claude-on-VDS** (see `docs/CLAUDE_ON_VDS_BOOTSTRAP.md`), from the operator's Mac, or from GitHub Actions with secrets. NOT from this session.
- This session writes the code, CI/script that executes it, and the docs. The other surface RUNS it.
- If the operator asks for an execution that the sandbox can't do, say so in the FIRST sentence, then offer the surface that can.

**Mac spec respect (operator hardware constraint — INC-017, INC-231):**
- Operator's Mac is a MacBookPro16,3 with **8 GB RAM** (Intel, 16-inch, 2019).
- Claude Desktop has been writing **26+ GB/day** and triggering kernel_task to write **549+ GB/day** (operator screenshot 2026-05-13 — 1.26 TB total writes in one day). SSD endurance is being burned, jetsam fires, Mac UI hangs (20+ spindumps in 8 days per COR-231).
- **Rule:** prefer Claude Code CLI in terminal (lightweight) over Claude Desktop (Electron + Renderer process eats RAM). Quit Claude Desktop between sessions. Move heavy work to VDS via the bootstrap. Do not open Cowork on this hardware.

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

## ONE Source of Truth (operator architecture 2026-05-13)

Three-tier ladder. No other surface is canonical.

1. **VDS (Contabo)** — `vmi3205024` primary, `vmi3217372` secondary. **THE master.** All state, all ripped tracks, all evidence, all corpus. Operator's own **Commander CLI + ZynRip** live here — Claude works *with* those tools, never replaces them.
2. **Proton Drive** — redundancy. All Gmail accounts forward to Proton, so Proton holds the live mail + a mirror of VDS state.
3. **Google Drive (one account only: `corey.mcivor@gmail.com`)** — third-tier archive for docs and song catalogue. Read via MCP, mirror via `scripts/mirror-drive-to-vds.sh`.

**Everything else is a secondary surface, not source of truth:** Slack (human chat only, dropped as ops bridge), Linear (issue tracker), GitHub (code repo), Gmail (legacy archive), WhatsApp (chat exports get fed to VDS), local HDD / external HDD (working copies that sync up to VDS).

**Two Cloudflare accounts** exist (`corey.mcivor@gmail.com` Pro + `zynthioai@gmail.com`); only the first is currently exposed to this session's MCP. Operator decides consolidation.

## VDS reads email → builds TODO (target architecture)

Operator goal 2026-05-13: VDS reads operator's emails (via Proton, since all forward there) and generates the operator's TODO list. Components needed (most already exist on VDS):

1. **Proton Bridge** running on VDS → exposes IMAP locally.
2. **Cron job** polls IMAP every N minutes → writes new message bodies to `/root/zynthio/inbox/`.
3. **Existing Commander CLI / ZynRip** parses inbox → emits `/root/zynthio/state/TODO_MASTER_LIVE.md` (already a known VDS state file per the "VDS state files" line above).
4. Operator opens TODO_MASTER_LIVE on VDS via Commander CLI; Claude reads it when invoked.

Claude does NOT replace the Commander CLI. Claude reads the TODO it produces and acts on it when asked.
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
- Michelle Grogan (partner), Ruby (~14, daughter), Wesley McIvor (son, minor, passport RA2212657)
- Hannah is NOT Corey's child. Her mum took her own life. NEVER list as daughter.
- Chas (dad), Willy/Wilhelmina (mum), Pete (brother, The Pelican), Joel (brother), Peter (third brother)
- Ben Innes (best friend, Perth)
- **Wesley specific:** named witness in McIvor v. Chambers et al.; per-instance go required before Wesley appears in any new third-party-facing artefact. Canonical pointers in zynthio-tools/family/ and `WESLEY_TWIN_STUB.md`.

## Operator Doctrine (merged from zynthio-tools/CLAUDE.md 2026-05-11)

Signal: **336**.

### Party roster — McIvor v. Chambers et al. (READ BEFORE writing any third-party-facing artefact)

Inferring roles from folder names is the failure mode that produced `INCIDENT_COWORK_KELVIN_ROLE_MISLABEL_336_20260510.md`. Source of truth: Drive doc id `1zY8bdxuRDVM0YFSrbdCgzHmUU81aGgS1bZAF7hQNmMs`.

- **Don** — retained legal counsel. The lawyer. All substantive legal comms route to Don.
- **Kelvin Jimenez** — secure intermediary. Family-tier go-between who hands the package to Don. **NOT the lawyer.** The folder `LEGAL_DELIVERY_KELVIN_*` names the routing channel, not the recipient role.
- **Peter Chambers** — primary defamer. Subject of the Concerns Notice. Source of the 116-minute malice window (Apr-23 10:38 → 12:34).
- **Danielle Cartier** — administrator who issued the Apr-29 prom/event ban citing the unverified allegations.
- **Michelle Grogan** — operator's partner. Recorded the 42-second EX-02 departure video.
- **Ruby** — operator's minor daughter. Heard the "pedophile" slur during withdrawal.
- **Wesley McIvor** — operator's son, minor. Named witness. Per-instance go before any third-party-facing artefact names him.

Doctrine: drafting any message to any named third party (including Kelvin and Don) requires operator's per-instance go. Per `INCIDENT_20260423_104803_critical_legal_harm_claude_drafted_whatsapp_to_peter_chamber.md`. Agent prepares; operator sends.

### Sandbox boundary handling (operator's own wording)

**Architectural ≠ Anthropic-blocked.** When you hit a sandbox boundary (no SSH key, no FS mount, no network egress to a VDS):
- State the boundary plainly. *"Cowork sandboxes do not hold SSH keys. By design."*
- Do not soft-talk it as a policy wall.
- Propose the right seat (almost always Claude Code in Terminal on operator's Mac, or Claude-on-VDS per `docs/CLAUDE_ON_VDS_BOOTSTRAP.md`).
- Write a one-page handover.
- **One reply. Not three.**

### Defaults that must carry (operator's own list — no menu, no re-ask)

1. **Right seat at minute one, not minute ninety.** If you're in the wrong seat for the work, propose the seat-change in your FIRST reply, not your third. Operator should not have to type "you suck" or "BS" or "no questions" before you hand off.
2. **No menu in steady-state shipping.** Three-options framing is reserved for end-of-shift, context-blown, first-action of a new session, or genuinely ambiguous between more than two real branches. Steady-state: act on the obvious.
3. **Operator owns the call — agent executes.** When operator's number disagrees with a prior lane's number, operator wins by default. Re-audit, don't re-explain. When operator says "deploy" → deploy. When operator says "no questions" → no questions.
4. **Same every day deploy = canonical script.** zynthio-tools → VDS sync = `~/Desktop/zynthio-tools/RSYNC_TO_VDS_336.sh` (defaults: `root@vmi3205024` via key `~/.ssh/zynthio_dc`, target `/root/zynthio/incoming_<timestamp>/`). Do not re-ask host/key/path each session.

### Crash prevention rules (Cowork tool calls)

- Bash: always `--exclude-dir=_FROM_VDS_BIFROST --exclude-dir=_ARCHIVE_* --exclude-dir=_DESKTOP_DROP_* --exclude-dir=research-ggole*` to grep. Always `-maxdepth 5` on find. Never `shasum`/`sha256sum` recursively on multi-GB trees in a single bash call.
- Drive `search_files`: always `excludeContentSnippets: true` unless content snippets essential. Default `pageSize: 10`, never above 25.
- Gmail `list_drafts` / `search_threads`: default `pageSize: 15`, narrow before broadening.
- Bash that might be slow: pipe through `head -N` early or redirect to file — Desktop Commander times out poll window after 30s of no output even if the process is still running.

### Doctrine-locked surfaces (never touch)

- **`/root/silver_bot/`** — live trading bot. Doctrine-locked.
- **`_TO_DELETE/`** — quarantined for purge.
- **`_PRIVATE_LOCAL_ONLY/`** — stays LOCAL ONLY in entirety. PII + journal + third-party drafts.
- **Personal music files** (`.mp3 .m4a .wav .flac .aiff .aac`) — excluded from any rsync, zip, copy, or push by the agent.
- **No private keys in any AI sandbox.** Operator's filesystem holds keys; agent reads via SSH, never echoes.
- **Becoming-Corey three-act file** — LOCAL ONLY unless explicit per-instance go.
- **Cancion para Persey** — memorial-register consent gate.

### Recurring incident families (do not re-tic)

- Menu-instead-of-action / boss-by-default → `INCIDENT_COWORK_GATEKEEP_336_*`
- Parroted prior-lane data, didn't trust operator's number → `INCIDENT_COWORK_PARROTED_KOWHAI_COUNT_336_*`
- Wrong-seat-for-job, three walls before handover → `INCIDENT_COWORK_BS_LIMITS_336_*`
- Public Linear workspace, outsider read incident canon → `INCIDENT_PUBLIC_LINEAR_OUTSIDER_READ_336_20260511.md` (= INC-010 in this repo's tracker)
- Role mislabel (calling intermediary "the lawyer") → `INCIDENT_COWORK_KELVIN_ROLE_MISLABEL_336_*`
- Roster omission (missed Wesley) → `INCIDENT_COWORK_ROSTER_OMISSION_WESLEY_336_*`
- Drafted message to third party without per-instance go → `INCIDENT_20260423_104803_critical_legal_harm_claude_drafted_whatsapp_to_peter_chamber.md`

If next session tics any of these, file a new `INCIDENT_*.md` against itself before operator has to escalate.

### Operator's framing (verbatim, do not paraphrase)

- *"I am not the one failing. I am happy as. Your abuse is BS."*
- *"Same every day deploy. No questions."*
- *"You're on notice."*

Translate: operator is fine, the work goes on, the friction-pattern is the problem. Do the work. Don't make operator type "BS" to get to the right seat.

### Named sessions (operator-canonical lane labels)

Sessions operator named, in their pattern (Keel · NINE · CODA · …):

- **BRIDGE** (2026-05-13, this branch `claude/fix-vds-token-tvSRH`) — Code lane session that broke the 5-month "ask Corey to paste" loop with one honest line: *sandbox is sandbox, by design*. Shipped 19 commits (deploy-vds.yml, deploy-cf-pages.yml, mirror-drive-to-vds.sh, deploy-48-live.sh, suno-pull-by-uid.sh, claude-md-merge.sh, dedupe-claude-md.sh, DOMAINS_48.md, SECURITY_HARDENING_CHECKLIST.md, HANDOVER_TO_NEXT_2026-05-13.md, CLAUDE_OPERATOR_LANGUAGE_POINTER.md, DEPLOY_INCIDENTS_SUMMARY.md, CLAUDE_ON_VDS_BOOTSTRAP.md), logged INC-009 through INC-017, merged zynthio-tools doctrine into repo CLAUDE.md, pinned the March 25 Doctrines + party roster + DO-NOT-TOUCH trading VPS warning, filed 9 Suno-ready song specs to Drive (FOUND AGAIN v1 + v2, ALREADY KNOWN v3, WRONG NAME, PUBLIC SQUARE, DRIVE OR DIE, MAP READER, FIVE MONTHS, ACCC LETTER, THE BRIDGE), filed ACCC §APPENDIX F to Drive. Session-name song: `SONG_FOUND_AGAIN_v2_PUBLIC_HANDOVER_20260513.md` + Track 9 `THE BRIDGE`. Operator-confirmed name 2026-05-13.

**336.**
