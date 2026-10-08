# MASTER HANDOVER — Read This First (Every Session)

**Owner:** Corey McIvor (@coreintentdev) — corey@coreyai.ai  
**Updated:** 2026-04-21  
**Purpose:** Stop amnesia. Corey pays. Work must not get tossed and never read.

---

## Mandatory read order (do not skip)

1. `MASTER_HANDOVER.md` (this file)
2. `docs/HANDOVER_VDS_GIT_2026-05-14.md` — **canonical git remote is VDS, not GitHub**
3. `docs/DEPLOY_INCIDENTS_SUMMARY.md` — 5-month deploy roll-call (21 Linear tickets)
4. `docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md` — old vs new handover diff
5. `docs/SESSION-HANDOVER-2026-03-23.md` — original full session context (270 lines)
6. `docs/CLAUDE_ON_VDS_BOOTSTRAP.md` — run work on VDS, not sandbox
7. `CLAUDE.md` — amnesia shield rules
8. `app/api/incidents/route.ts` — INC-001 through INC-023

---

## Operating mode (non-negotiable)

- **Safe:** verify before claiming connected/active/deployed
- **Logical:** read old posts before writing new ones
- **Helpful:** execute the next highest-value unfinished item — do not wait for Corey to re-ask
- **Direct:** actionable output, not passive summaries

If you finish a task, update this file and the accountability doc in the same commit.

---

## Reality check (2026-04-21)

| Area | Status | Evidence |
|------|--------|----------|
| Next.js build | ✅ Passes | `npm run build` |
| Site audit | ✅ 96% (52 pass, 2 warn) | `./scripts/audit.sh` |
| Pricing model rewrite | ✅ Done | `app/pricing/page.tsx` — leagues not subscriptions |
| VPS scripts deployed | ❌ Not done | scripts exist, COR-20 still open |
| Exchange connections | ❌ Not done | demo data only |
| API routes live data | ❌ Mostly demo | 10+ routes hardcoded until keys wired |
| March handover "Must Fix" list | ❌ ~6/8 still open | see accountability doc |
| April handover Nicaragua/MINED plan | ⚠️ Named only | no contact records in repo yet |
| VPS state files in repo | ❌ Missing | SESSION_STATE etc. live on VPS only |

---

## Git remote — push here, not GitHub

**ONE command (Mac or GHA with VDS_SSH_KEY):**

```bash
./scripts/vds-handover-all.sh cursor/handover-update-0fbd
```

This pushes to `vds-public:/root/git/zyn.git`, checks out `/root/zynthio/coreintent`, copies all handover docs to `/root/zynthio/state/handover/`, writes `SESSION_STATE.md`, installs systemd + cron on VDS.

GHA fallback: Actions → **VDS Handover Sync** → Run workflow.

Cloud sandbox **cannot** run this — INC-024. Do not claim VDS handover done from cloud without verification.

## VDS agents — you are not done

Contabo VDS: `vmi3205024` (5.189.143.170)  
Legacy Cloudzy IPs are stale — do not deploy there (INC-009)  

On VPS (not in this git repo):
- `/root/zynthio/SESSION_STATE.md`
- `/root/zynthio/MASTER_INDEX.md`
- `/root/zynthio/CONTENT_INTEL.md`
- `/root/zynthio/COREY_WORDS.md`

**Pull before you build:** `./scripts/vps-lens.sh` (needs SSH)

If you cannot SSH, say so — do not pretend VPS state was read.

---

## Next actions (pick one and ship)

1. Deploy VPS scripts (`scripts/deploy-vps.sh`) — blocked on credentials
2. Wire one API route to real data (pick `/api/status` or `/api/market`) — needs API keys in `.env`
3. Add `/api/competitions` skeleton with honest "not live" labels
4. Sync Linear tasks with repo checklist (26 tasks, 3 done per INC-006)
5. Fill Nicaragua/school/venue/MINED contact plan with real names/numbers when Corey provides them

Do not create a third handover doc that repeats the first two without new execution.

---

## Incident refs

- **INC-002** — AI session context loss (critical, open)
- **INC-005** — Project delivery gap (critical, open)
- **INC-021** — Response mode improved (resolved)
- **INC-022** — Handover churn / work tossed never read (critical, open)

---

*Corey pays for progress, not re-explanation. Read old posts. Ship one thing. Update this file.*
