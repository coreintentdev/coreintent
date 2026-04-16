# Org Git Health Report

**Generated:** 2026-04-16  
**Scope:** coreintentdev org — 3 repos  
**Owner:** Corey McIvor / Zynthio.ai / NZ  
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 85/100 | Active — healthy, 4 open draft PRs |
| coreintentai | 92/100 | Active — excellent, 84 tests, ready to ship |
| Zynthio | 78/100 | Live — 3 quick wins fixed this scan |
| **Org avg** | **85/100** | Good overall health |

---

## Repo 1: coreintent

**Score: 85/100**  
**URL:** https://github.com/coreintentdev/coreintent  
**Tech:** Next.js 14 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack, routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Excellent — architecture, rules, known issues, VPS context |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 14.2, React 18.3, TS 5.5, lean deps |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| No hardcoded secrets | ✅ PASS | .env.example uses placeholder values only |
| No TODO/FIXME | ✅ PASS | Zero items found across entire codebase |
| engines field | ✅ FIXED | Added `node: >=20.0.0` (was missing, inconsistent with coreintentai) |
| Branch hygiene | ⚠️ WARN | 10 non-main branches (see below) |
| Open draft PRs | ⚠️ WARN | 4 open draft PRs |
| Known code issues | ⚠️ WARN | XSS in Terminal, unused xterm packages, demo data in all routes |

### Branches (10 non-main)

| Branch | Last Commit | PR | Action |
|--------|------------|-----|--------|
| `seo/comprehensive-improvements` | Apr 16 | #7 draft | Review + merge — low risk SEO |
| `cursorlayout-metadata-cleanup-a68a` | Apr 16 | None | Review and merge or close |
| `cursor-dependency-security-upgrade-ef32` | Apr 15 | #6 draft | **PRIORITY: security upgrade** |
| `claude/check-coreintent-builds-JTrDd` | Apr 14 | None | Owner decision — incident report |
| `cursor/desktop-master-handover-845c` | Apr 14 | None | No PR — likely obsolete, delete |
| `cursor/update-outdated-docs-cc84` | Apr 13 | #2 draft | Large feature — review architecture |
| `cursor/dev-environment-setup-cc84` | Apr 13 | #1 draft | Docs only — merge or close |
| `cursor/web-desktop-sync-master-d4fd` | Apr 13 | None | No PR — delete |
| `cursor/cloud-starter-skill-f65e` | Apr 13 | None | No PR — delete |
| `feature/improvement` | Jan 12 | None | **DELETE — 3+ months stale, no PR** |

### Open Draft PRs

| PR | Branch | Summary | Risk | Action |
|----|--------|---------|------|--------|
| #7 | `seo/comprehensive-improvements` | SEO: JSON-LD, OG tags, aria labels, heading hierarchy | Low | Merge |
| #6 | `cursor-dependency-security-upgrade-ef32` | Next.js 14→15.5.15, clears npm audit vulnerabilities | Low | **Priority: merge** |
| #2 | `cursor/update-outdated-docs-cc84` | VDS deploy scripts, Desktop Commander CLI, ZynContext + SongPal APIs | Medium | Review architecture first |
| #1 | `cursor/dev-environment-setup-cc84` | AGENTS.md dev environment setup docs | Low | Merge or close |

### Known Code Issues (from CLAUDE.md)

- **XSS risk** — `components/Terminal.tsx` uses `dangerouslySetInnerHTML` for ANSI rendering. Replace with a proper ANSI parser library.
- **Unused packages** — `xterm` packages in `package.json` are not used. Remove to reduce install footprint.
- **All API routes return hardcoded demo data** — no live connections yet. Label clearly in UI.
- **No auth / no database** — intentional for now, required before any real user data is stored.

---

## Repo 2: coreintentai

**Score: 92/100**  
**URL:** https://github.com/coreintentdev/coreintentai  
**Tech:** TypeScript / Node 20 / Vitest / npm package (`@coreintent/ai`)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | `engines: node>=20`, proper deps (anthropic-ai/sdk, openai, zod), vitest |
| No hardcoded secrets | ✅ PASS | .env.example placeholder values only |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Branch hygiene | ⚠️ WARN | 2 active non-main branches |

### Branches (2 non-main)

| Branch | Last Commit | PR | Action |
|--------|------------|-----|--------|
| `feat/anomaly-detection-capability` | Apr 16 | #1 draft | **Merge** — 84/84 tests pass, clean typecheck |
| `cursorconsensus-agreement-accuracy-cf98` | Apr 16 | None | **Create PR** — consensus bugfix has no PR yet |

### Open Draft PRs

| PR | Summary | Tests | Action |
|----|---------|-------|--------|
| #1 | AnomalyDetector capability + fallback `"timed out"` bugfix + pipeline truncation fix | 84/84 passing | **Merge when ready** |

### Notes

This is the cleanest repo in the org. Active development today, well-structured, fully typed and tested. Two items need attention:

1. `cursorconsensus-agreement-accuracy-cf98` has no PR — the consensus bugfix (prevents inflated agreement when only one model responds) is critical for trading accuracy. Create a PR.
2. PR #1 (AnomalyDetector) is ready — 84 tests, clean typecheck. No blockers.

---

## Repo 3: Zynthio

**Score: 78/100** (was 68/100 before fixes)  
**URL:** https://github.com/coreintentdev/Zynthio  
**Live:** https://zynthio.ai  
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Good — architecture, API docs, deployment, cross-repo table |
| CLAUDE.md | ✅ PASS | Good — env vars, architecture, known issues |
| .gitignore | ✅ PASS | Comprehensive |
| No hardcoded secrets | ✅ PASS | `RESEND_API_KEY` from `process.env` ✓ |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Expired launch date | ✅ FIXED | "JAN 17" removed from `index.html` and waitlist email body |
| CORS wildcard | ✅ FIXED | Restricted `Access-Control-Allow-Origin` to `https://zynthio.ai` |
| package.json | ✅ FIXED | Added description + deploy script (was a bare stub) |
| Branch hygiene | ⚠️ WARN | 3 non-main branches, duplicate music pipeline PRs |

### Branches (3 non-main)

| Branch | Last Commit | PR | Action |
|--------|------------|-----|--------|
| `feat/music-pipeline-docs` | Apr 16 | #2 draft | Merge — updated, clean, docs only |
| `cursorisrc-readiness-requirement-7f98` | Apr 16 | None | Addresses Bugbot comment on PR #2 content — include in that PR or close |
| `music-pipeline-setup` | Apr 16 | #1 draft | **Close — superseded by PR #2** |

### Open Draft PRs

| PR | Summary | Action |
|----|---------|--------|
| #2 | Music pipeline docs for DJ Zynrose (TRACK_MANIFEST, DISTROKID_CHECKLIST, MUSIC_MARKETING, RELEASE_CALENDAR) | Merge |
| #1 | Same content, earlier version, without bugfix | **Close — superseded by #2** |

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Consistent? |
|-------|-----------|--------------|---------|-------------|
| README.md | ✅ | ✅ | ✅ | ✅ YES |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| .gitignore | ✅ | ✅ | ✅ | ✅ YES |
| No secrets | ✅ | ✅ | ✅ | ✅ YES |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ YES |
| License (MIT) | ✅ | ✅ | ✅ | ✅ YES |
| Node >=20 documented | ✅ Fixed | ✅ | N/A | ✅ YES |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| Active today (Apr 16) | ✅ | ✅ | ✅ | ✅ YES |

### Observations

- **Stack divergence is intentional and correct** — coreintent is the Next.js engine, coreintentai is the TypeScript AI library, Zynthio is a static landing page. Each is right-sized for its role.
- **No cross-repo dependency conflicts** — all repos are standalone. No shared package version alignment required.
- **All repos clean of secrets** — zero API keys, tokens, or credentials found in any codebase.
- **All repos clean of TODO/FIXME** — zero items across all 3 repos.
- **Org is live and moving** — all 3 repos had commits on Apr 16 (today).

---

## Action Items (Priority Order)

### Critical
- [ ] **Merge PR #6** (coreintent) — Next.js 14→15.5.15 security upgrade. `npm audit` has production vulnerabilities on current 14.2. Build passes, lint clean.

### High
- [ ] **Create PR for `cursorconsensus-agreement-accuracy-cf98`** (coreintentai) — Today's consensus bugfix has no PR. Prevents overestimated confidence in trading signals when only one model responds.
- [ ] **Merge PR #1** (coreintentai) — AnomalyDetector + fallback bugfixes. 84/84 tests passing, typecheck clean.

### Medium
- [ ] **Merge PR #7** (coreintent) — SEO improvements. Low risk, build passes.
- [ ] **Merge PR #2** (Zynthio) — Music pipeline docs. Docs only, low risk.
- [ ] **Close PR #1** (Zynthio) — Superseded by PR #2.
- [ ] **Review and merge or close PR #2** (coreintent) — Large feature (VDS deploy, Desktop Commander CLI, ZynContext API, SongPal API). Validate architecture before merge.
- [ ] **Delete stale branches** (coreintent): `feature/improvement` (Jan 2026), `cursor/desktop-master-handover-845c`, `cursor/web-desktop-sync-master-d4fd`, `cursor/cloud-starter-skill-f65e`
- [ ] **Fix XSS in `components/Terminal.tsx`** (coreintent) — replace `dangerouslySetInnerHTML` with proper ANSI parser
- [ ] **Remove unused xterm packages** (coreintent) — installed but not used

### Low / Ongoing
- [ ] **Deploy VPS scripts** (coreintent) — COR-20, overdue per CLAUDE.md
- [ ] **Connect API routes to live data** (coreintent) — all 10 routes still return hardcoded demo data
- [ ] **Add auth + persistence layer** (coreintent) — no database yet, required before real user data
- [ ] **Merge PR #1** (coreintent) — AGENTS.md docs, low risk, merge or close

---

## Files Changed This Scan

| Repo | File | Action |
|------|------|--------|
| coreintent | `package.json` | Added `engines: { node: >=20.0.0 }` |
| coreintent | `HEALTH_REPORT.md` | Updated (this file) |
| Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai`; removed expired date from email |
| Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
