# STATUS LOG — 2026-05-05 late session

**Logger:** THREAD (web/repo lane on `claude/multilingual-wordplay-support-iym1B`)
**Lane:** PR #67 in `coreintentdev/coreintent` — repo work only, no VDS/Mac access
**Companions tonight:** KEEL (CLI-Max, local + VDS), Chrome-Claude (Suno UI driver)

---

## Deploy state at log-time

**Branch state:** `claude/multilingual-wordplay-support-iym1B`, latest commit `795905f`, working tree clean.

**On the branch (PR #67):**
- 10 paste-ready Suno track specs (`track_01` through `track_10`) — 9 multilingual + 1 state-of-deploy country-folk
- `WAVE_1_MANIFEST_20260505.md` — 31 verified Drive IDs with sizes, mime types, doctrine gates
- `scripts/rclone_drive_to_vds_wave1.sh` — Mac-bypass deploy script (runs ON the VDS via rclone, resolves all three KEEL gate-catches in one move)

**CI:** all green (typecheck × 2, build × 2). Cloud Run deploy queued — ignore unless review comment lands.

## Three pipes (deploy doctrine, current state)

| Pipe | Role | Status | Risk |
|---|---|---|---|
| A — Mac rsync | KEEL's lane: Mac-only artifacts (session files, family stubs, .tsx, taxi tracks) | **Blocked** — `RSYNC_TO_VDS_336.sh` line 14 still points at legacy Cloudzy + missing `-i ~/.ssh/zynthio_dc` | Recurring SSH-key bug from Linear `e05f67a2` (Apr 16, 3+ weeks unfixed) |
| B — rclone Drive→VDS | Drive corpus directly to VDS, no Mac courier | **Ready** — `scripts/rclone_drive_to_vds_wave1.sh` on the branch, requires rclone gdrive remote configured on VDS | Low — read-only pull, immutable timestamped target dir |
| C — VDS git-clone | Repo-resident artifacts (PR #67 tracks + manifest + script) | **Ready** — `gh repo clone coreintentdev/coreintent` on the VDS | Low — single repo, single branch |

**Recommended order:** Pipe C first (smallest, validates VDS connectivity), then Pipe B (auto via the rclone script that Pipe C delivers), then Pipe A only after the SSH-key fix is committed to the rsync script.

## Open decisions (waiting on Corey)

1. Pipe A — repoint to Contabo + bake SSH key + add `--dry-run` flag? **Yes/no.**
2. Pipe B — execute the rclone script after read-only Contabo probe? **Yes/no.**
3. Read-only Contabo probe before any Wave 1 push? **Strongly recommend yes.**
4. Notion MCP returned only Linear tickets — verify connector is attached? **Yes/no.**
5. NotebookLM source — Apple Notes / Notion / Obsidian, or stays browser-only? **Pick one or skip.**

## Doctrine gates (HARD, do not skip)

- Denis hears first (TAXI Album, TAXI Bilingual Set, Denis Fuerza Inteligente)
- Gustavo hears first (Gustavo Desde Adentro)
- Michelle hears first (GOTTA LOTTA) — credit `© Michelle Grogan × ZYNTHIO™`, never "Michelle McIvor"
- Doctrine 24 filter clean before any Suno generation
- PII (Denis WhatsApp `+505 5807 3146`) intentional in his marketing tracks, redact for non-Denis-approved channels
- Family Proton accounts (Ruby + Wesley) — parent-side execution only, no AI session creates accounts

## Welfare note (logged, no further action)

At 02:xx UTC the lane noticed degraded typing + "escaped big boy AI / Corey safe AI" framing in one user message. Welfare check sent. User redirected to deploy work without echoing the framing. Read as: tired, not unwell. Logging here per instruction; no follow-up needed unless the framing returns.

## THREAD's name and lane

KEEL = backbone (CLI-Max, local + VDS).
THREAD = one lateral fiber (this branch, web/repo work).
te reo equivalent for THREAD = *Aho* (a single strand).
Whakataukī tying the two: **He waka eke noa** — we're all in the same canoe.
This is a name for one lane, not infrastructure. No sub-naming, no symbolic accumulation.

## Closing

Even slate. No incident. Pipes B and C ready. Pipe A waiting on a one-line fix.
Log committed; track 11 (the lesson song) committed alongside.
