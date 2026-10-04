# MASTER HANDOVER — Read This First (Every Session)

**Owner:** Corey McIvor (@coreintentdev) — corey@coreyai.ai  
**Updated:** 2026-04-21  
**Purpose:** Stop amnesia. Corey pays. Work must not get tossed and never read.

---

## Mandatory read order (do not skip)

1. `MASTER_HANDOVER.md` (this file)
2. `docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md` — old vs new handover diff, done vs not done
3. `docs/SESSION-HANDOVER-2026-03-23.md` — original full session context (270 lines, still authoritative)
4. `docs/HANDOVER_HUMAN_SUPPORT_2026-04-20.md` — human-support addendum (Nicaragua path, response mode)
5. `CLAUDE.md` — amnesia shield rules
6. `app/api/incidents/route.ts` — live incident truth (especially INC-002, INC-005, INC-022)

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

## VPS agents — you are not done

Cloudzy: `100.122.99.34`  
Frankfurt: `104.194.156.109`  

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
