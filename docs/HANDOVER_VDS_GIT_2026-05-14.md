# VDS Git Handover — Canonical Remote (NOT GitHub)

**Operator correction (2026-05-14):** This branch has **no GitHub upstream** for operator workflow.  
**Canonical remote:** `vds-public:/root/git/zyn.git`  
Pushing to `origin` (GitHub) was the **wrong target** for handover/incident work.

---

## 5-month thread — lost work / not done

Full roll-call: `docs/DEPLOY_INCIDENTS_SUMMARY.md` (21 Urgent Linear deploy tickets, Jan–May 2026).

| Category | Status | Notes |
|----------|--------|-------|
| VDS trading scripts deployed | ❌ | COR-20, INC-003 — scripts in repo, never live on vmi3205024 |
| 48 Cloudflare sites live | ❌ | INC-011, INC-013 — workflows exist, secrets not pasted |
| 336 Claude builds → production | ❌ | INC-018 — lost alpha/content |
| API routes real data | ❌ | INC-005 — demo/hardcoded |
| March handover must-fix (8 items) | ❌ 1/8 | pricing rewrite only |
| Handover docs read by next session | ❌ | INC-015, INC-022 — "always finding, never remembering" |
| Git push to correct remote | ❌ | INC-023 — agents pushed GitHub instead of VDS git |

**What did ship (durable):** deploy GHA workflows, DEPLOY_INCIDENTS_SUMMARY, CLAUDE_ON_VDS_BOOTSTRAP, incident tracker INC-001–INC-023, MASTER_HANDOVER, accountability docs.

---

## Branch fragmentation (why work looks "lost")

Same INC numbers, **different content** on different branches:

| IDs | `claude/fix-vds-token-tvSRH` (May) | `cursor-incident-zynrip-*` (April) |
|-----|--------------------------------------|-------------------------------------|
| INC-009 | VDS provider truth | (different / missing) |
| INC-010 | Public workspace exposure | IDE context limits |
| INC-011 | 48 CF sites | Cursor client strain |
| INC-012 | Location/Nicaragua | ZynRip pipeline |
| INC-013 | 5 months no deploy | Workspace scale |
| INC-014 | ACCC appendix | Expectations mismatch |
| INC-015 | Found-again pattern | Repo branch mismatch |
| INC-016 | Sandbox limits | Claude Desktop setup |
| INC-017 | Mac 1.26TB disk writes | Session termination |

**Canonical for deploy truth:** May VDS branch entries (INC-009–017).  
April entries preserved in git history on `origin/cursor-incident-zynrip-repo-mismatch-ef32`.

This merge commit consolidates May deploy incidents + INC-018–023 on `cursor/handover-update-0fbd`.

---

## Push to VDS git (operator or Claude-on-VDS)

From Mac with `vds-public` SSH alias:

```bash
cd /path/to/coreintent   # or zynthio clone
git fetch vds 2>/dev/null || git remote add vds vds-public:/root/git/zyn.git
./scripts/push-to-vds-git.sh cursor/handover-update-0fbd
```

From cloud sandbox (if SSH unavailable):

```bash
git bundle create /tmp/zyn-handover.bundle cursor/handover-update-0fbd
scp /tmp/zyn-handover.bundle vds-public:/tmp/
ssh vds-public 'cd /root/git/zyn.git && git fetch /tmp/zyn-handover.bundle cursor/handover-update-0fbd:cursor/handover-update-0fbd'
```

---

## Read order on VDS

1. `MASTER_HANDOVER.md`
2. `docs/DEPLOY_INCIDENTS_SUMMARY.md`
3. `docs/CLAUDE_ON_VDS_BOOTSTRAP.md`
4. `docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md`
5. `app/api/incidents/route.ts` — INC-001 through INC-023

---

## INC-023

Logged in incidents API: agents pushed handover/incident commits to GitHub `origin` when operator canonical store is VDS bare repo. Fix: use `./scripts/push-to-vds-git.sh` after every handover commit.
