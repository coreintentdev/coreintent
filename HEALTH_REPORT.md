# Org Git Health Report

**Generated:** 2026-04-16 (third pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 90/100 | Active — Next.js 15, 0 vulns, lean deps |
| coreintentai | 94/100 | Active — full AI layer, 45 tests, docs corrected |
| Zynthio | 87/100 | Live — all stale doc issues cleared this pass |
| **Org avg** | **90/100** | Healthy. Active development. All quick wins applied. |

---

## Repo 1: coreintent

**Score: 90/100**
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Excellent — architecture, rules, known issues, VPS context |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | All values are placeholders (sk-ant-xxx, xai-xxx, pplx-xxx, etc.) |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| Dependencies | ✅ PASS | 0 vulnerabilities — Next.js 15, cleared all CVEs |
| API route hardening | ✅ PASS | Input validation on all 10 routes |
| Branch hygiene | ⚠️ WARN | 20 non-main branches — see table below |

### Branches (20 non-main)

| Branch | Recommendation |
|--------|----------------|
| `seo/comprehensive-improvements` | Review + merge or close — check against main |
| `seo/comprehensive-seo-improvements` | Likely duplicate of above — compare and close one |
| `seo/structured-data-and-meta-improvements` | Review — merge or close |
| `marketing/refresh-content-apr-2026` | Active — review and merge when ready |
| `marketing/enhance-copy-and-og-images` | Review — merge or close if superseded |
| `marketing/hero-pricing-social-refresh` | Review — merge or close |
| `feat/ai-twin-interactive-widget` | Active feature — leave open, create PR |
| `feat/i18n-multilingual` | Feature — review scope, create PR or close |
| `feat/api-hardening-round2` | Review — may be superseded by merged hardening |
| `feat/interactive-content-v1` | Review — create PR or close |
| `cursorlayout-metadata-cleanup-a68a` | Review and merge or close |
| `cursornotification-sound-responses-fbd1` | Review and merge or close |
| `cursorh1-and-schema-issues-8649` | Review and merge or close |
| `cursorunused-helper-functions-f7ed` | Review — remove unused helpers or close |
| `cursorui-rendering-and-styles-3930` | Review and merge or close |
| `cursordemo-and-terminal-issues-6940` | Review and merge or close |
| `cursor-dependency-security-upgrade-ef32` | **DELETE** — already merged to main |
| `cursor/update-outdated-docs-cc84` | Review — large feature, check if superseded |
| `cursor/dev-environment-setup-cc84` | Review — AGENTS.md docs, merge or close |
| `claude/check-coreintent-builds-JTrDd` | **DELETE** — incident review branch, no longer needed |
| `build-monitor/security-audit-fix` | **DELETE** — audit fix verified, no longer needed |

### Open Code Issues (from CLAUDE.md — still outstanding)

| Issue | Severity | Notes |
|-------|----------|-------|
| XSS risk in Terminal.tsx | High | `dangerouslySetInnerHTML` for ANSI rendering — replace with `ansi-to-html` |
| Unused xterm packages | Low | Declared in package.json but never used — remove |
| All 10 API routes return demo data | Medium | No live backend yet — clearly labelled |
| No auth / no database | Medium | Intentional for now |
| VPS scripts never deployed | Medium | COR-20, overdue per CLAUDE.md |

---

## Repo 2: coreintentai

**Score: 94/100**
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript / Node 20 / Vitest / npm package (`@coreintent/ai`)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII diagram, usage examples, multi-model table. Fixed "Next.js 14 → 15" this pass. |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns. Fixed "Next.js 14 → 15" this pass. |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | `engines: node>=20`, @anthropic-ai/sdk, openai, zod, vitest |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| No hardcoded secrets | ✅ PASS | All placeholder values |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Tests | ✅ PASS | 45 tests |
| Branch hygiene | ⚠️ WARN | 7 non-main branches |

### Branches (7 non-main)

| Branch | Recommendation |
|--------|----------------|
| `cursorconsensus-agreement-accuracy-cf98` | Create PR — consensus bugfix, trading-critical |
| `cursororchestrator-caching-and-fallback-41dd` | Create PR — orchestrator improvement |
| `cursororchestrator-system-logic-bugs-fe79` | Create PR — system logic fixes |
| `cursorprompt-telemetry-circuit-logic-b000` | Create PR — telemetry/circuit logic |
| `feat/anomaly-detection-capability` | Review PR #1 — AnomalyDetector capability, ready to merge |
| `feat/brain-expansion` | Create PR — review scope |
| `feat/resilience-and-observability` | Create PR — review scope |
| `feat/resilience-layer` | Create PR — may overlap with resilience-and-observability |

### Notes

Most structurally clean repo in the org. Fully typed, tested, documented. All doc references now correct. Eight active branches — all committed today — this repo is moving fast. Primary gap: most branches still have no PR. Recommend opening PRs for visibility and review.

---

## Repo 3: Zynthio

**Score: 87/100** (was 84/100 — improved this pass)
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy instructions, related repos all correct |
| CLAUDE.md | ✅ FIXED | Cleared 3 stale Known Issues (JAN 17, CORS wildcard, package.json stub) and corrected coreintentai description this pass |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | Has name, description, private, deploy script |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai` (not wildcard) |
| public/index.html | ✅ PASS | No expired dates — shows "OPEN SOURCE — LIVE NOW" |
| No hardcoded secrets | ✅ PASS | RESEND_API_KEY from `process.env` |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Branch hygiene | ⚠️ WARN | 4 non-main branches — some redundant |

### Branches (4 non-main)

| Branch | Recommendation |
|--------|----------------|
| `feat/music-pipeline-docs` | Merge — updated docs, clean |
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `feature/music-pipeline-scaffold` | Check if superseded by `feat/music-pipeline-docs` — close if so |
| `music-pipeline-setup` | **CLOSE** — superseded by `feat/music-pipeline-docs` |

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Consistent? |
|-------|-----------|--------------|---------|-------------|
| README.md | ✅ | ✅ | ✅ | ✅ YES |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| .gitignore | ✅ | ✅ | ✅ | ✅ YES |
| .env.example | ✅ | ✅ | ✅ | ✅ YES |
| No secrets | ✅ | ✅ | ✅ | ✅ YES |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ YES |
| License (MIT) | ✅ | ✅ | ✅ | ✅ YES |
| Node >=20 | ✅ | ✅ | N/A | ✅ YES |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| Cross-repo version refs | ✅ | ✅ Fixed | ✅ Fixed | ✅ YES |
| coreintentai description | ✅ | ✅ | ✅ Fixed | ✅ YES |
| Active development | ✅ | ✅ | ✅ | ✅ YES |

### Stack Divergence (Intentional)

Stack differences across repos are correct and intentional:

| Repo | Stack | Rationale |
|------|-------|-----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead needed |

---

## Action Items (Priority Order)

### High
- [ ] **Fix XSS in Terminal.tsx** (coreintent) — replace `dangerouslySetInnerHTML` with `ansi-to-html` library
- [ ] **Merge PR #1** (coreintentai) — AnomalyDetector capability, ready for review
- [ ] **Create PRs for coreintentai cursor/* branches** — consensus fix is trading-critical

### Medium
- [ ] **Remove unused xterm packages** (coreintent) — declared in package.json but never imported
- [ ] **Prune confirmed-stale branches** (coreintent): `cursor-dependency-security-upgrade-ef32`, `claude/check-coreintent-builds-JTrDd`, `build-monitor/security-audit-fix`
- [ ] **Consolidate duplicate SEO branches** (coreintent): `seo/comprehensive-improvements` and `seo/comprehensive-seo-improvements` — pick one, close the other
- [ ] **Merge or close music-pipeline branches** (Zynthio): close `music-pipeline-setup`, resolve `feat/music-pipeline-docs`
- [ ] **Create PRs for feat/* branches in coreintentai**: `feat/brain-expansion`, `feat/resilience-and-observability`, `feat/resilience-layer`

### Low / Ongoing
- [ ] **Deploy VPS scripts** (coreintent) — COR-20, overdue per CLAUDE.md
- [ ] **Connect API routes to live data** (coreintent) — all 10 routes return hardcoded demo data
- [ ] **Add auth + persistence layer** (coreintent) — required before real user data

---

## Files Changed This Pass (Third Pass — Apr 16 2026)

| Repo | File | Action |
|------|------|--------|
| Zynthio | `CLAUDE.md` | Fixed 3 stale Known Issues; corrected coreintentai description ("coreintent.dev marketing site" → "AI intelligence layer"); updated Next.js ref to v15 |
| coreintentai | `README.md` | Fixed "Next.js 14" → "Next.js 15" in repo relationship table |
| coreintentai | `CLAUDE.md` | Fixed "Next.js 14" → "Next.js 15" in Related Repos |
| coreintent | `HEALTH_REPORT.md` | Updated — this file |

## Files Changed Prior Passes (confirmed applied)

| Pass | Repo | File | Action |
|------|------|------|--------|
| 2nd | Zynthio | `README.md` | Fixed coreintentai cross-reference |
| 2nd | Zynthio | `.env.example` | Added RESEND_API_KEY placeholder |
| 1st | coreintent | `package.json` | Added `engines: { node: >=20.0.0 }` |
| 1st | coreintent | All 10 `app/api/*/route.ts` | Input validation hardened |
| 1st | coreintent | `next`, `eslint-config-next` | Upgraded 14→15.5.15, cleared 5 CVEs |
| 1st | Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| 1st | Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai` |
| 1st | Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
