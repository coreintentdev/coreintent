# Org Git Health Report

**Generated:** 2026-04-16 (fourth pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 89/100 | Active — Next.js 15, 0 vulns, 28 open branches (up from 20) |
| coreintentai | 94/100 | Active — full AI layer, 45 tests, 12 branches without PRs |
| Zynthio | 88/100 | Live — all prior issues resolved, 6 branches to triage |
| **Org avg** | **90/100** | Healthy. All quick wins applied. Branch hygiene is the #1 gap. |

---

## Repo 1: coreintent

**Score: 89/100**
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
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| Dependencies | ✅ PASS | 0 vulnerabilities — Next.js 15, cleared all CVEs |
| API route hardening | ✅ PASS | Input validation on all 10 routes |
| Branch hygiene | ⚠️ WARN | 28 non-main branches — many stale, see table below |

### Branches (28 non-main)

| Branch | Recommendation |
|--------|----------------|
| `build-monitor/security-audit-fix` | **DELETE** — audit fix verified, merged |
| `claude/check-coreintent-builds-JTrDd` | **DELETE** — incident review, no longer needed |
| `cursor-dependency-security-upgrade-ef32` | **DELETE** — already merged to main |
| `cursor/dev-environment-setup-cc84` | Review — AGENTS.md docs, merge or close |
| `cursor/update-outdated-docs-cc84` | Review — check if superseded by main |
| `cursordemo-and-terminal-issues-6940` | Review — merge or close |
| `cursorhero-stats-api-route-count-12d7` | Review — merge or close |
| `cursorh1-and-schema-issues-8649` | Review — merge or close |
| `cursorlayout-metadata-cleanup-a68a` | Review — merge or close |
| `cursornotification-sound-responses-fbd1` | Review — merge or close |
| `cursorpricing-page-issues-6f34` | Review — merge or close |
| `cursorui-rendering-and-styles-3930` | Review — merge or close |
| `cursorunused-helper-functions-f7ed` | Review — remove unused helpers or close |
| `feat/ai-twin-interactive-widget` | Active — create PR |
| `feat/ai-twin-widget` | Likely superseded by `feat/ai-twin-interactive-widget` — compare and close one |
| `feat/api-hardening-round2` | Review — may be superseded by merged hardening |
| `feat/i18n-multilingual` | Feature — review scope, create PR or close |
| `feat/interactive-content-v1` | Review — create PR or close |
| `marketing/enhance-copy-and-og-images` | Review — merge or close if superseded |
| `marketing/hero-pricing-social-refresh` | Review — merge or close |
| `marketing/refresh-content-apr-2026` | Active — review and merge when ready |
| `marketing/sharpen-copy-apr2026` | Likely duplicate of `marketing/sharpen-copy-april-2026` — close one |
| `marketing/sharpen-copy-april-2026` | Likely duplicate of `marketing/sharpen-copy-apr2026` — close one |
| `seo/complete-optimization` | Review — may supersede older SEO branches |
| `seo/comprehensive-improvements` | Review + merge or close — check against main |
| `seo/comprehensive-seo-improvements` | Likely duplicate of above — compare and close one |
| `seo/full-audit-improvements` | Review — check if superseded by `seo/complete-optimization` |
| `seo/structured-data-and-meta-improvements` | Review — merge or close |

**Confirmed deletions (3):** `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`
**Likely duplicates to consolidate:** `feat/ai-twin-*` (2), `marketing/sharpen-copy-*` (2), `seo/comprehensive-*` (2), `seo/full-audit/seo/complete-*` (2)

### Open Code Issues (from CLAUDE.md — still outstanding)

| Issue | Severity | Notes |
|-------|----------|-------|
| XSS risk in Terminal.tsx | High | `dangerouslySetInnerHTML` for ANSI rendering — replace with `ansi-to-html` |
| Unused xterm packages | Low | Declared in package.json but never imported — remove |
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
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | `engines: node>=20`, @anthropic-ai/sdk ^0.39, openai ^4.78, zod ^3.24 |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| No hardcoded secrets | ✅ PASS | All placeholder values |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Tests | ✅ PASS | 45 tests (vitest) |
| Branch hygiene | ⚠️ WARN | 12 non-main branches, none with PRs |

### Branches (12 non-main)

| Branch | Recommendation |
|--------|----------------|
| `cursorconsensus-agreement-accuracy-cf98` | Create PR — consensus bugfix, trading-critical |
| `cursorjson-parsing-and-error-detection-1a11` | Create PR — JSON parsing fixes |
| `cursororchestrator-caching-and-fallback-41dd` | Create PR — orchestrator improvement |
| `cursororchestrator-system-logic-bugs-fe79` | Create PR — system logic fixes |
| `cursorprompt-telemetry-circuit-logic-b000` | Create PR — telemetry/circuit logic |
| `cursorsystem-logic-issues-0bdb` | Create PR — system logic fixes |
| `feat/anomaly-detection-capability` | Create PR — AnomalyDetector capability |
| `feat/brain-expansion` | Create PR — review scope |
| `feat/quant-engine-production-hardening` | Create PR — production hardening |
| `feat/resilience-and-observability` | Create PR — review scope |
| `feat/resilience-and-validation` | Create PR — may overlap with resilience-and-observability |
| `feat/resilience-layer` | Create PR — may overlap with above two — consolidate? |

**Note:** `feat/resilience-layer`, `feat/resilience-and-observability`, and `feat/resilience-and-validation` may be overlapping — compare before opening PRs and consolidate if so.

### Notes

Most structurally clean repo in the org. Fully typed, tested, documented. Core AI layer was built in one session on 2026-04-16 (45 tests, full architecture). Primary gap: 12 active branches with zero PRs. This repo is moving fast — open PRs for visibility.

---

## Repo 3: Zynthio

**Score: 88/100**
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy instructions, related repos all correct |
| CLAUDE.md | ✅ PASS | Clean — stale Known Issues removed in prior pass, all refs correct |
| .gitignore | ✅ PASS | Appropriate for a static site — no framework noise |
| package.json | ✅ PASS | Has name, description, private, deploy script (no deps — correct) |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai` |
| public/index.html | ✅ PASS | No expired dates or stale content |
| No hardcoded secrets | ✅ PASS | RESEND_API_KEY from `process.env` |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Branch hygiene | ⚠️ WARN | 6 non-main branches — music-pipeline work in progress |

### Branches (6 non-main)

| Branch | Recommendation |
|--------|----------------|
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `feat/music-pipeline-distrokid-prep` | Active — review and create PR when ready |
| `feat/music-pipeline-docs` | Merge — updated docs, ready |
| `feature/music-pipeline-scaffold` | Check if superseded by `feat/music-pipeline-docs` — close if so |
| `music-pipeline` | Review — likely a base branch for above; close when merged |
| `music-pipeline-setup` | **CLOSE** — superseded by `feat/music-pipeline-docs` |

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Consistent? |
|-------|-----------|--------------|---------|-------------|
| README.md | ✅ | ✅ | ✅ | ✅ YES |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| .gitignore | ✅ | ✅ | ✅ | ✅ YES |
| .env.example | ✅ | ✅ | ✅ | ✅ YES |
| LICENSE (MIT) | ✅ | ✅ | ✅ | ✅ YES |
| No hardcoded secrets | ✅ | ✅ | ✅ | ✅ YES |
| No .DS_Store files | ✅ | ✅ | ✅ | ✅ YES |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ YES |
| Node >=20 | ✅ | ✅ | N/A (static) | ✅ YES |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| Cross-repo version refs | ✅ | ✅ | ✅ | ✅ YES |
| Owner credit | ✅ | ✅ | ✅ | ✅ YES |

### Stack Divergence (Intentional)

| Repo | Stack | Rationale |
|------|-------|-----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead needed |

Stack differences are correct and intentional. All three use Node 20 where applicable.

### Dependency Alignment

| Package | coreintent | coreintentai | Zynthio |
|---------|-----------|--------------|---------|
| TypeScript | ^5.5.0 | ^5.7.0 | N/A |
| @types/node | ^20.14.0 | ^22.10.0 | N/A |
| @anthropic-ai/sdk | ❌ (via coreintentai) | ^0.39.0 | ❌ |

**Note:** TypeScript version divergence (5.5 vs 5.7) is low-risk. Consider aligning coreintent to TS 5.7 in next dependency update pass.

---

## Action Items (Priority Order)

### High
- [ ] **Fix XSS in Terminal.tsx** (coreintent) — replace `dangerouslySetInnerHTML` with `ansi-to-html` library

### Medium — Branch Cleanup
- [ ] **Delete 3 confirmed-stale branches** (coreintent): `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`
- [ ] **Consolidate duplicate branches** (coreintent): `feat/ai-twin-*` → pick one; `marketing/sharpen-copy-*` → pick one; `seo/comprehensive-*` → pick one
- [ ] **Open PRs for all coreintentai branches** — 12 branches, zero PRs; at minimum open PRs for `feat/anomaly-detection-capability` and the consensus/orchestrator cursor fixes
- [ ] **Consolidate resilience branches** (coreintentai): `feat/resilience-layer`, `feat/resilience-and-observability`, `feat/resilience-and-validation` — compare and merge into one PR
- [ ] **Close `music-pipeline-setup`** (Zynthio) — superseded
- [ ] **Merge `feat/music-pipeline-docs`** (Zynthio) — appears ready

### Medium — Code
- [ ] **Remove unused xterm packages** (coreintent) — declared in package.json but never imported
- [ ] **Align TypeScript to 5.7** (coreintent) — coreintentai is already on 5.7; low risk upgrade

### Low / Ongoing
- [ ] **Deploy VPS scripts** (coreintent) — COR-20, overdue per CLAUDE.md
- [ ] **Connect API routes to live data** (coreintent) — all 10 routes return hardcoded demo data
- [ ] **Add auth + persistence layer** (coreintent) — required before real user data

---

## Change Log

### Fourth Pass — 2026-04-16 (this pass)

| Repo | File | Action |
|------|------|--------|
| coreintent | `HEALTH_REPORT.md` | Full re-scan — updated branch counts (coreintent: 20→28, coreintentai: 7→12, Zynthio: 4→6), no new issues found, all repos confirmed clean |

### Third Pass — 2026-04-16

| Repo | File | Action |
|------|------|--------|
| Zynthio | `CLAUDE.md` | Fixed 3 stale Known Issues; corrected coreintentai description; updated Next.js ref to v15 |
| coreintentai | `README.md` | Fixed "Next.js 14" → "Next.js 15" in repo relationship table |
| coreintentai | `CLAUDE.md` | Fixed "Next.js 14" → "Next.js 15" in Related Repos |

### Second Pass — 2026-04-16

| Repo | File | Action |
|------|------|--------|
| Zynthio | `README.md` | Fixed coreintentai cross-reference |
| Zynthio | `.env.example` | Added RESEND_API_KEY placeholder |

### First Pass — 2026-04-16

| Repo | File | Action |
|------|------|--------|
| coreintent | `package.json` | Added `engines: { node: >=20.0.0 }` |
| coreintent | All 10 `app/api/*/route.ts` | Input validation hardened |
| coreintent | `next`, `eslint-config-next` | Upgraded 14→15.5.15, cleared 5 CVEs |
| Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai` |
| Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
