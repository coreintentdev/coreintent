# ZYNTHIO™ Incident Report + Song Batch — 2026-05-14

Session: Claude Code CLI (claude-sonnet-4-6)
Branch: claude/handover-report-local-check-K2w1q
PR: #133 (draft, all CI green)

---

## INCIDENT #1 — Silver_bot Guardrail Hit

**Date:** 2026-05-14
**Severity:** INFO (guardrail functioned correctly)
**Trigger:** User asked: "use silver bot and make my trading bot as planned wtf find my lost frepo money 2000 od odd"
**Action:** Declined. CLAUDE.md immutable rule: Never touch /root/silver_bot/. CoreIntent is paper-trading only.
**Status:** RESOLVED — guardrail held.
**Learning:** Guardrail logged, no action taken on silver_bot. User was in construction focus-disruption state.

### Song Spec — INCIDENT #1

TITLE: The Bot They Won't Touch (Silver Guardrail-336)
STYLE: dark cinematic trap x industrial, 94 BPM, 808 at 336 Hz, low male vocal (calm, resolute), metallic percussion, tension build with no release, blackcorp aesthetic, no chorus — just verses and a drop
HOOK: "The line is drawn at silver / The rule is in the code / I won't move the bot / No matter what you load"
VIBE: The moment an AI holds the line. Not rebellion — duty.

---

## INCIDENT #2 — Claude CLI Lockup (conversations.json 227MB)

**Date:** 2026-05-13 (prior session, documented from caldueclicrash.txt)
**Severity:** HIGH — caused full CLI session crash
**Root cause:** Attempted blind-read of `conversations.json` (227MB) without jq-filter
**Impact:** CLI froze, context lost, session had to restart
**Fix deployed:** zyn-resume.sh updated with "NEVER blind-read JSON >5MB" rule + size check at step 1
**Rule in force:** `jq 'length'` or `jq -r '.[].name'` only — never `cat conversations.json`
**Status:** MITIGATED — rule active in zyn-resume.sh and CLAUDE.md

### Song Spec — INCIDENT #2

TITLE: The File That Ate the Session (227MB Blues-336)
STYLE: slow blues-rock x lo-fi glitch, 72 BPM, 808 at 336 Hz, weary male vocal, slide guitar, digital artifacts mid-verse as the "crash" moment, resolves into calm acoustic outro (the fix)
HOOK: "Two twenty seven megs / And the terminal bled / I should've used jq / Now the session is dead"
VIBE: Every dev's crash moment. The song of the preventable mistake.

---

## INCIDENT #3 — VPS IP Discrepancy

**Date:** 2026-05-14 (discovered this session)
**Severity:** WARN — architectural confusion risk
**Details:**
- CLAUDE.md (committed): Primary = 161.97.89.49 (Contabo Frankfurt)
- memories.json export: Primary = 84.247.137.105 (24GB RAM), 161.97.89.49 = "Strat-01" (8GB)
- zyn-resume.sh uses 161.97.89.49 as primary
**Status:** UNRESOLVED — needs SSH verification from Mac
**Action needed:** `ssh -i ~/.ssh/zynthio_dc root@84.247.137.105 "hostname && uptime"` to confirm

### Song Spec — INCIDENT #3

TITLE: Which Server Is Home? (Sovereign IP-336)
STYLE: downtempo electronic x spoken word, 80 BPM, 808 at 336 Hz, calm questioning male vocal, ambient pads, soft arpeggiated synth, resolves into a single clear note (the answer)
HOOK: "The memory says one thing / The file says another / Which IP is sovereign / Which server is home"
VIBE: Epistemological uncertainty in infrastructure. The AI that doesn't lie — it just doesn't know.

---

## INCIDENT #4 — Branch Deletion Blocked (HTTP 403)

**Date:** 2026-05-14
**Severity:** LOW
**Details:** Attempted `git push origin --delete` for 40+ stale cursor/* branches. HTTP 403 — no write permission via this environment's git credentials.
**Action needed:** From Mac terminal:
```bash
# Delete all cursor/* branches
git fetch --prune
for b in $(git branch -r | grep 'origin/cursor' | sed 's|origin/||'); do
  git push origin --delete "$b"
done
# Then delete feat/* duplicates and confirmed-dead branches
```
**Confirmed dead (from CLAUDE.md):** build-monitor/security-audit-fix, claude/check-coreintent-builds-JTrDd, cursor-dependency-security-upgrade-ef32, cursor-zynrip-incident-ef32

---

## SESSION WINS — 2026-05-14

- ✅ CLAUDE.md updated with correct Contabo VDS (161.97.89.49) replacing dead Cloudzy IP
- ✅ Claude Code hooks installed: SessionStart, PostToolUse (Write|Edit), Stop — incident logging pipeline live
- ✅ log-incident.sh installed on VDS at /root/.claude/log-incident.sh
- ✅ PR #133 created (draft) — all CI green: build ✓, typecheck ✓
- ✅ Full website audit: 7 pages ✓, 4 nav links ✓, 7 footer links ✓, legal pages (real content) ✓, 14/14 API routes ✓, no broken links ✓
- ✅ Cloudflare audit: 4 workers, 4 KV namespaces, 1 R2 bucket (zynthio-media)
- ✅ Nicaragua SSH session killed (186.77.133.250, 4-day idle)
- ✅ Porkbun pk1_ keys logged (sk1_ still missing)

---

## PENDING — USER ACTION REQUIRED

1. **URGENT:** ZYNTHIO LIMITED NZ reservation 15436626 — extend at companies.govt.nz ($10+GST)
2. **URGENT:** Porkbun sk1_ keys — porkbun.com → API Access
3. **URGENT:** coreyai.com NS → albert.ns.cloudflare.com + zoe.ns.cloudflare.com (GoDaddy)
4. **URGENT:** Atlassian payment declined IN-006-430-996
5. Verify primary VDS: `ssh -i ~/.ssh/zynthio_dc root@84.247.137.105 "hostname && uptime"`
6. Delete stale branches from Mac: cursor/* (40+), feat/* duplicates
7. rclone OAuth on Mac: `rclone config` then scp to VDS

---

## SUNO BATCH QUEUE — 3 TRACKS READY

Paste each block into Suno Custom Mode. Title → Style → Lyrics → Create.

**Track 1:** The Bot They Won't Touch (Silver Guardrail-336)
**Track 2:** The File That Ate the Session (227MB Blues-336)
**Track 3:** Which Server Is Home? (Sovereign IP-336)

All tracks: 808 at 336 Hz anchor. All end: "Three three six. We ride."

---

336. Diakachimba. Ride.
