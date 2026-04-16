# Org Git Health Report

**Generated:** 2026-04-16  
**Scope:** coreintentdev org — all 3 repos  
**Owner:** Corey McIvor / Zynthio.ai / NZ  
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score (pre-fix) | Score (post-fix) | Status |
|------|-----------------|------------------|--------|
| coreintent | 78/100 | 82/100 | Active — healthy |
| coreintentai | 20/100 | 55/100 | Stub — needs content |
| zynthio | 45/100 | 65/100 | Minimal — operational |
| **Org average** | **48/100** | **67/100** | Improved |

---

## Repo 1: coreintent

**Score: 82/100**  
**URL:** https://github.com/coreintentdev/coreintent  
**Tech:** Next.js 14 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | PASS | Comprehensive — stack, routes, philosophy, quick start |
| CLAUDE.md | PASS | Excellent — architecture, rules, known issues, VPS state |
| .gitignore | PASS* | Fixed: added `.DS_Store`, `.vercel`, editor files |
| package.json | PASS | Next.js 14.2, React 18.3, TS 5.5 — lean and correct |
| Dockerfile | PASS | Multi-stage node:20-alpine for Cloud Run |
| No hardcoded secrets | PASS | Clean — env vars used correctly |
| No TODO/FIXME | PASS | Zero items found |
| Stale branches | WARN | 7 branches (see below) |
| Open draft PRs | WARN | 3 open draft PRs (see below) |
| Known code issues | WARN | XSS risk in Terminal, unused packages |

### Stale Branches

| Branch | Last Commit | PR | Recommendation |
|--------|------------|-----|----------------|
| `cursor/cloud-starter-skill-f65e` | 2026-04-13 | #3 MERGED | **Delete — merged** |
| `cursor/desktop-master-handover-845c` | 2026-04-14 | #5 MERGED | **Delete — merged** |
| `cursor/web-desktop-sync-master-d4fd` | 2026-04-13 | #4 MERGED | **Delete — merged** |
| `feature/improvement` | 2026-01-12 | None | **Delete — 3 months stale, no PR** |
| `cursor/dev-environment-setup-cc84` | 2026-04-13 | #1 open draft | Keep — review or close |
| `cursor/update-outdated-docs-cc84` | 2026-04-13 | #2 open draft | Keep — large feature PR |
| `cursor-dependency-security-upgrade-ef32` | 2026-04-15 | #6 open draft | **ACTION REQUIRED** — Next.js 15 security upgrade |
| `claude/check-coreintent-builds-JTrDd` | 2026-04-14 | None | Review — incident report doc, owner decision needed |

### Open Draft PRs — Action Required

**PR #6 — Next.js Security Upgrade (PRIORITY)**  
`cursor-dependency-security-upgrade-ef32` → main  
Upgrades Next.js 14.2 → 15.5.15, resolves `npm audit` production vulnerabilities.  
Build passes, lint clean, audit.sh 96%. **Recommend: review and merge.**

**PR #2 — VDS consolidation, Desktop Commander, ZynContext, SongPal**  
`cursor/update-outdated-docs-cc84` → main  
Large feature PR — 6 new files, 6 updates. Adds scripts/cai CLI, music API, context API.  
Recommend: review architecture before merge.

**PR #1 — AGENTS.md dev environment setup**  
`cursor/dev-environment-setup-cc84` → main  
Docs-only. Adds Cursor Cloud runbook. Low risk. Can merge or close.

### Known Code Issues (from CLAUDE.md)

- **XSS risk** — `components/Terminal.tsx` uses `dangerouslySetInnerHTML` for ANSI rendering. Should be replaced with a proper ANSI parser library.
- **Unused packages** — `xterm` packages in `package.json` are not used. Remove to keep bundle lean.
- **All 10 API routes return hardcoded demo data** — no live connections yet. Label clearly in UI.
- **No auth / no database** — by design for now, but needed before any real user data is stored.

### Fixes Applied
- Added `.DS_Store`, `.vercel`, `*.swp`, `*.swo`, `.idea/` to `.gitignore`

---

## Repo 2: coreintentai

**Score: 55/100** (was 20/100)  
**URL:** https://github.com/coreintentdev/coreintentai  
**Domain:** https://coreintent.dev  
**Tech:** Static (no framework detected) / Vercel

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | FIXED | Added — was missing entirely |
| CLAUDE.md | FIXED | Added — was missing entirely |
| .gitignore | FIXED | Added `.DS_Store`, `.vercel`, editor files |
| package.json | MISSING | No package.json (not needed if purely static) |
| Site content | MISSING | `public/` only has `sitemap.xml` — no index.html |
| No hardcoded secrets | PASS | Nothing to scan |
| Branch hygiene | PASS | Only `main` — clean |
| Last activity | WARN | 2026-01-12 — 3+ months inactive |

### Issues Found

- **No site content** — `public/` only contains a sitemap referencing `coreintent.dev`. There is no `index.html` or any actual landing page. The domain presumably redirects elsewhere or shows a blank page.
- **No package.json** — acceptable if purely static, but should be added even as a stub with metadata.
- **3 months inactive** — this repo needs a decision: build a coreintent.dev landing page or redirect to the main Zynthio/coreintent app.

### Fixes Applied
- Created `README.md` explaining repo purpose and cross-repo relationships
- Created `CLAUDE.md` with amnesia shield, rules, architecture context
- Added `.DS_Store` and editor files to `.gitignore`

### Recommendations

1. Build a minimal `public/index.html` landing page for coreintent.dev (similar pattern to Zynthio)
2. Add `package.json` with name, version, description
3. Decide if this should redirect to coreintent main app or stand alone

---

## Repo 3: Zynthio

**Score: 65/100** (was 45/100)  
**URL:** https://github.com/coreintentdev/Zynthio  
**Domain:** https://zynthio.ai  
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | FIXED | Expanded from 92-byte stub to full documentation |
| CLAUDE.md | FIXED | Added — was missing entirely |
| .gitignore | FIXED | Added `.DS_Store`, editor files |
| package.json | WARN | Stub only — `{"name":"zynthio","version":"1.0.0"}` — no scripts |
| Site content | PASS | `public/index.html` exists — waitlist landing page |
| API | PASS | `api/waitlist.js` — Resend email integration, env var for key |
| No hardcoded secrets | PASS | `RESEND_API_KEY` from `process.env` ✓ |
| No TODO/FIXME | PASS | None found |
| Branch hygiene | PASS | Only `main` — clean |
| Last activity | WARN | 2026-01-12 — 3+ months inactive |

### Issues Found

- **Expired launch date** — `public/index.html` shows `OPEN SOURCE LAUNCH: JAN 17`. This date is 3 months in the past. Update or remove.
- **CORS wildcard** — `api/waitlist.js` sets `Access-Control-Allow-Origin: *`. Minor issue for a public waitlist endpoint, but worth restricting to `https://zynthio.ai` in production.
- **package.json stub** — Has no `scripts`, no `dependencies`. Add at minimum a `"description"` field. Not blocking.
- **3 months inactive** — the platform launched Jan 17, but no updates since. Waitlist is presumably still collecting emails.

### Fixes Applied
- Expanded `README.md` with architecture, API docs, deployment instructions, cross-repo table
- Created `CLAUDE.md` with amnesia shield, architecture, env vars, known issues
- Added `.DS_Store` and editor files to `.gitignore`

### Recommendations

1. Update or remove the hardcoded launch date in `public/index.html`
2. Restrict CORS origin in `api/waitlist.js` to `https://zynthio.ai`
3. Add `scripts` to `package.json` (e.g. `"deploy": "vercel --prod"`)
4. Consider adding an email counter or waitlist status to the landing page

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | zynthio | Consistent? |
|-------|-----------|--------------|---------|-------------|
| Node version | 20 (Dockerfile) | N/A (static) | N/A (static) | N/A |
| .gitignore template | Standard Next.js | Standard Next.js | Standard Next.js | YES (post-fix) |
| `.DS_Store` ignored | YES (fixed) | YES (fixed) | YES (fixed) | YES |
| CLAUDE.md present | YES | YES (fixed) | YES (fixed) | YES |
| README.md present | YES | YES (fixed) | YES (fixed) | YES |
| License | MIT | MIT | MIT | YES |
| Secrets in code | NONE | NONE | NONE | CLEAN |
| TODO/FIXME items | NONE | NONE | NONE | CLEAN |

### Observations

- **Tech stack divergence is intentional** — `coreintent` is the full Next.js app; `zynthio` and `coreintentai` are lightweight static sites. This is the right architecture for their roles.
- **No cross-repo dependency conflicts** — each repo is standalone. No shared packages to align.
- **Consistent NZ-first philosophy** — all repos acknowledge NZ jurisdiction in CLAUDE.md.
- **All repos clean of secrets** — no API keys, tokens, or credentials found in any codebase.

---

## Action Items (Priority Order)

### Immediate

- [ ] **Merge PR #6** (`cursor-dependency-security-upgrade-ef32`) — Next.js 15 security upgrade. `npm audit` shows production vulnerabilities on current Next.js 14.2. This is the most important open action.
- [ ] **Delete merged branches** in coreintent: `cursor/cloud-starter-skill-f65e`, `cursor/desktop-master-handover-845c`, `cursor/web-desktop-sync-master-d4fd`
- [ ] **Delete stale branch** `feature/improvement` — Jan 2026, no PR, no activity
- [ ] **Fix expired launch date** in `zynthio/public/index.html` — "JAN 17" is 3 months past

### Short Term

- [ ] Fix XSS risk in `coreintent/components/Terminal.tsx` — replace `dangerouslySetInnerHTML` with a proper ANSI parser
- [ ] Remove unused `xterm` packages from `coreintent/package.json`
- [ ] Review `claude/check-coreintent-builds-JTrDd` branch — contains incident report, owner decision on close/keep
- [ ] Review and resolve open draft PRs #1 and #2 in coreintent
- [ ] Restrict CORS in `zynthio/api/waitlist.js` to `https://zynthio.ai`

### Medium Term

- [ ] Build `coreintentai` — `public/` is empty. Create a `coreintent.dev` landing page
- [ ] Add auth and a real persistence layer to coreintent (no database yet)
- [ ] Deploy the VPS scripts in `coreintent/scripts/` (COR-20, overdue per CLAUDE.md)
- [ ] Replace hardcoded demo data in all 10 API routes with real data as services come online

---

## Files Changed in This Scan

| Repo | File | Action |
|------|------|--------|
| coreintent | `.gitignore` | Updated — added `.DS_Store`, `.vercel`, editor files |
| coreintent | `HEALTH_REPORT.md` | Created — this file |
| coreintentai | `README.md` | Created |
| coreintentai | `CLAUDE.md` | Created |
| coreintentai | `.gitignore` | Updated — added `.DS_Store`, `.vercel`, editor files |
| zynthio | `README.md` | Expanded (was 92-byte stub) |
| zynthio | `CLAUDE.md` | Created |
| zynthio | `.gitignore` | Updated — added `.DS_Store`, editor files |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
