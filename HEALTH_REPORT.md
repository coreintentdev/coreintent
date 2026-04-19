# Org Git Health Report

**Generated:** 2026-04-19 (fifth pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 91/100 | Active — audit 96% (52/54), SEO improved, 28 non-main branches |
| coreintentai | 93/100 | Active — full AI layer, 45 tests, 16 branches (up from 12) |
| Zynthio | 90/100 | Live — music pipeline docs added, 7 non-main branches |
| **Org avg** | **91/100** | Healthy. All essentials present across all repos. Branch hygiene remains #1 gap. |

---

## Repo 1: coreintent

**Score: 91/100** _(was 89 — improved: SEO metadata added, audit score 96%)_
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Excellent — architecture, rules, known issues, VPS context |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, .vscode/, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | All values are placeholders (sk-ant-xxx, xai-xxx, pplx-xxx) |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| Dependencies | ✅ PASS | 0 vulnerabilities — Next.js 15, all CVEs cleared |
| Audit score | ✅ PASS | 96% (52/54) — build, lint, SEO, legal, security all passing |
| XSS warning | ⚠️ WARN | `dangerouslySetInnerHTML` in `components/Terminal.tsx:1347` — `ansi-to-html` in use but raw div render |
| API routes | ⚠️ WARN | 12 routes still return hardcoded demo data — labelled correctly |
| Branch hygiene | ⚠️ WARN | 28 non-main branches — composition changed since last scan (7 SEO branches cleaned, 8 new added) |

### Audit Report Summary (2026-04-19)

| Category | Result |
|----------|--------|
| Build (npm run build) | ✅ PASS |
| TypeScript strict mode | ✅ PASS |
| ESLint | ✅ PASS |
| Pages (6) | ✅ PASS |
| Legal compliance (NZ) | ✅ PASS |
| SEO / OpenGraph / Twitter | ✅ PASS |
| Security headers | ✅ PASS |
| No exposed secrets | ✅ PASS |
| `dangerouslySetInnerHTML` | ⚠️ WARN (Terminal.tsx:1347) |
| Misleading status strings | ⚠️ WARN (domain table labels "active") |
| **Score** | **96% (52/54)** |

### Branch Inventory (28 non-main)

Changes since 4th pass: 7 SEO/marketing branches cleaned up ✅; 8 new cursor/feature branches appeared.

| Branch | Status | Recommendation |
|--------|--------|----------------|
| `build-monitor/security-audit-fix` | Stale | **DELETE** — audit fix verified on main |
| `claude/check-coreintent-builds-JTrDd` | Stale | **DELETE** — incident review, done |
| `cursor-dependency-security-upgrade-ef32` | Stale | **DELETE** — already on main |
| `cursor-zynrip-incident-ef32` | NEW | Review — zynrip incident fix, merge or close |
| `cursor/dev-environment-setup-cc84` | Stale | Review — AGENTS.md docs, merge or close |
| `cursor/update-outdated-docs-cc84` | Stale | Review — check if superseded by main |
| `cursordemo-and-terminal-issues-6940` | Stale | Review — merge or close |
| `cursorh1-and-schema-issues-8649` | Stale | Review — merge or close |
| `cursorhero-stats-api-route-count-12d7` | Stale | Review — merge or close |
| `cursori18n-bug-fixes-5499` | NEW | Review — may overlap with `feat/i18n-multilingual` |
| `cursorlayout-metadata-cleanup-a68a` | Stale | Review — merge or close |
| `cursornotification-sound-responses-fbd1` | Stale | Review — merge or close |
| `cursorpricing-page-issues-6f34` | Stale | Review — merge or close |
| `cursortypewriter-phrase-context-1450` | NEW | Review — UI fix, merge or close |
| `cursorui-rendering-and-styles-3930` | Stale | Review — merge or close |
| `cursorunused-exported-functions-002a` | NEW | Review — cleanup, worth merging |
| `cursorunused-helper-functions-f7ed` | Stale | Review — cleanup, worth merging |
| `feat/ai-twin-interactive-widget` | Active | Create PR — interactive widget |
| `feat/ai-twin-widget` | Possible dup | Compare with `feature/ai-twin-widget` — close one |
| `feat/api-hardening-round2` | Review | Check if superseded by current main |
| `feat/i18n-multilingual` | Active | Compare with `i18n-multilingual` and `cursori18n-*` — consolidate |
| `feat/interactive-content-v1` | Superseded? | Compare with `interactive-content-v2` — close v1 if superseded |
| `feature/ai-twin-widget` | NEW dup? | Compare with `feat/ai-twin-widget` and `feat/ai-twin-interactive-widget` |
| `feature/api-production-grade` | NEW | Review — may supersede `feat/api-hardening-round2` |
| `i18n-multilingual` | NEW | Likely base branch for `feat/i18n-multilingual` — close when merged |
| `interactive-content-v2` | NEW | Evolution of `feat/interactive-content-v1` — create PR |
| `marketing/enhance-copy-and-og-images` | Review | Merge or close |
| `marketing/hero-pricing-social-refresh` | Review | Merge or close |
| `marketing/refresh-content-apr-2026` | Active | Review and merge when ready |

**Confirmed deletions (3):** `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`

**Duplicate clusters to consolidate:**
- i18n: `feat/i18n-multilingual` + `i18n-multilingual` + `cursori18n-bug-fixes-5499` → pick one, close rest
- ai-twin: `feat/ai-twin-widget` + `feat/ai-twin-interactive-widget` + `feature/ai-twin-widget` → pick one
- api hardening: `feat/api-hardening-round2` + `feature/api-production-grade` → close older one

### Outstanding Code Issues (from CLAUDE.md)

| Issue | Severity | Status |
|-------|----------|--------|
| XSS risk in `components/Terminal.tsx:1347` | High | **Open** — `dangerouslySetInnerHTML` for ANSI rendering |
| All 12 API routes return demo data | Medium | Open — intentional, labelled correctly |
| No auth / no database | Medium | Open — intentional for now |
| VPS scripts never deployed | Medium | Open — COR-20, overdue |

---

## Repo 2: coreintentai

**Score: 93/100** _(was 94 — slight dip: 4 new branches with no PRs opened)_
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript library / Node 20 / Vitest / npm package (`@coreintent/ai`)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vscode/, all common patterns |
| package.json | ✅ PASS | `node>=20`, @anthropic-ai/sdk ^0.39, openai ^4.78, zod ^3.24, TS 5.7 |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| No hardcoded secrets | ✅ PASS | All placeholder values |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items |
| Tests | ✅ PASS | 45 tests (vitest) |
| Branch hygiene | ⚠️ WARN | 16 non-main branches (up from 12), zero have open PRs |

### Branch Inventory (16 non-main)

New since 4th pass: `cursorcircuit-breaker-timer-reset-c349`, `cursorsystem-logic-and-config-db89`, `feat/brain-expander-circuit-breaker-regime-detection`, `feat/consensus-engine-regime-detection`

| Branch | Status | Recommendation |
|--------|--------|----------------|
| `cursorcircuit-breaker-timer-reset-c349` | NEW | Create PR — circuit breaker fix |
| `cursorconsensus-agreement-accuracy-cf98` | Active | Create PR — consensus bugfix, trading-critical |
| `cursorjson-parsing-and-error-detection-1a11` | Active | Create PR — JSON parsing fixes |
| `cursororchestrator-caching-and-fallback-41dd` | Active | Create PR — orchestrator improvement |
| `cursororchestrator-system-logic-bugs-fe79` | Active | Create PR — system logic fixes |
| `cursorprompt-telemetry-circuit-logic-b000` | Active | Create PR — telemetry/circuit logic |
| `cursorsystem-logic-and-config-db89` | NEW | Create PR — system logic & config |
| `cursorsystem-logic-issues-0bdb` | Active | Create PR — may overlap with `cursorsystem-logic-and-config-db89` |
| `feat/anomaly-detection-capability` | Active | Create PR — AnomalyDetector capability |
| `feat/brain-expander-circuit-breaker-regime-detection` | NEW | Create PR — brain expansion + circuit breaker |
| `feat/brain-expansion` | Active | Compare with `feat/brain-expander-*` — consolidate if overlapping |
| `feat/consensus-engine-regime-detection` | NEW | Create PR — consensus + regime detection |
| `feat/quant-engine-production-hardening` | Active | Create PR — production hardening |
| `feat/resilience-and-observability` | Active | Create PR |
| `feat/resilience-and-validation` | Active | Compare with `feat/resilience-and-observability` — may overlap |
| `feat/resilience-layer` | Active | Compare with above two — consolidate if overlapping |

**Duplicate clusters to consolidate:**
- Brain: `feat/brain-expansion` + `feat/brain-expander-circuit-breaker-regime-detection` → compare and close one
- System logic: `cursorsystem-logic-issues-0bdb` + `cursorsystem-logic-and-config-db89` → compare and close one
- Resilience: `feat/resilience-layer` + `feat/resilience-and-observability` + `feat/resilience-and-validation` → compare and merge into one PR

**Positive note:** Most structurally clean repo in the org. Fully typed, tested, documented. Primary gap: 16 active branches with zero open PRs.

---

## Repo 3: Zynthio

**Score: 90/100** _(was 88 — improved: music pipeline docs added to main)_
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy, related repos all correct |
| CLAUDE.md | ✅ PASS | Clean — no stale Known Issues |
| .gitignore | ✅ PASS | Appropriate for static site — audio binary exclusions, .vscode/ added |
| package.json | ✅ PASS | Minimal and correct — no deps, vercel deploy script |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai` |
| public/index.html | ✅ PASS | No expired dates or stale content |
| Music pipeline docs | ✅ PASS | TRACK_MANIFEST.md, DISTROKID_CHECKLIST.md, MUSIC_MARKETING.md, RELEASE_CALENDAR.md added |
| Asset directories | ✅ PASS | lyrics/, artwork/, audio/ directories scaffolded with spec READMEs |
| No hardcoded secrets | ✅ PASS | RESEND_API_KEY from `process.env` |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | Zero items |
| Branch hygiene | ⚠️ WARN | 7 non-main branches — all music-pipeline related |

### Branch Inventory (7 non-main)

New since 4th pass: `music/pipeline-setup`

| Branch | Status | Recommendation |
|--------|--------|----------------|
| `cursorisrc-readiness-requirement-7f98` | Stale | Include in music-pipeline PR or close |
| `feat/music-pipeline-distrokid-prep` | Active | Review and create PR when ready |
| `feat/music-pipeline-docs` | Active | Merge — updated docs, likely ready |
| `feature/music-pipeline-scaffold` | Stale | Compare with `feat/music-pipeline-docs` — close if superseded |
| `music-pipeline` | Stale | Review — base branch likely superseded, close when work merges |
| `music-pipeline-setup` | Stale | **CLOSE** — superseded by `feat/music-pipeline-docs` |
| `music/pipeline-setup` | NEW | Compare with `music-pipeline-setup` — likely duplicate, close one |

**Duplicate:** `music-pipeline-setup` and `music/pipeline-setup` appear to be the same work with different naming — close one.

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Status |
|-------|-----------|--------------|---------|--------|
| README.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| .gitignore (.vscode/ added) | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| .env.example | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| LICENSE (MIT) | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No hardcoded secrets | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No .DS_Store | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Node >=20 | ✅ | ✅ | N/A (static) | ✅ CONSISTENT |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Cross-repo version refs | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Owner credit | ✅ | ✅ | ✅ | ✅ CONSISTENT |

### Stack Divergence (Intentional — Correct)

| Repo | Stack | Rationale |
|------|-------|-----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead needed |

### Dependency Alignment

| Package | coreintent | coreintentai | Zynthio |
|---------|-----------|--------------|---------|
| TypeScript | ^5.5.0 | ^5.7.0 | N/A |
| @types/node | ^20.14.0 | ^22.10.0 | N/A |
| Node engine | >=20.0.0 | >=20.0.0 | N/A (static) |
| @anthropic-ai/sdk | ❌ (via coreintentai) | ^0.39.0 | ❌ |

**Recommendation:** Align coreintent TypeScript to 5.7 (low risk) on next dep update pass.

---

## Action Items (Priority Order)

### High
- [ ] **Fix XSS in `components/Terminal.tsx:1347`** (coreintent) — `dangerouslySetInnerHTML` renders ANSI output; ensure input is fully sanitized via `ansi-to-html` with no raw HTML injection path

### Medium — Branch Cleanup
- [ ] **Delete 3 confirmed-stale branches** (coreintent): `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`
- [ ] **Consolidate i18n cluster** (coreintent): `feat/i18n-multilingual` + `i18n-multilingual` + `cursori18n-bug-fixes-5499` → one PR
- [ ] **Consolidate ai-twin cluster** (coreintent): 3 branches → pick the interactive-widget one, close rest
- [ ] **Open PRs for all coreintentai branches** — 16 branches, zero PRs; start with anomaly detection + consensus engine + brain expander
- [ ] **Consolidate resilience branches** (coreintentai): 3 resilience-* branches → one PR
- [ ] **Close `music-pipeline-setup` and `music/pipeline-setup`** (Zynthio) — duplicates; close both, work is on main or in `feat/` branches
- [ ] **Merge `feat/music-pipeline-docs`** (Zynthio) — appears ready

### Medium — Code
- [ ] **Align TypeScript to 5.7** (coreintent) — coreintentai already on 5.7; low-risk upgrade
- [ ] **Remove unused xterm packages** (coreintent) — declared in package.json but not imported
- [ ] **Connect API routes to live data** (coreintent) — 12 routes return hardcoded demo data

### Low / Ongoing
- [ ] **Deploy VPS scripts** (coreintent) — COR-20, overdue per CLAUDE.md
- [ ] **Add auth + persistence layer** (coreintent) — required before real user data

---

## Change Log

### Fifth Pass — 2026-04-19 (this pass)

| Repo | File | Action |
|------|------|--------|
| coreintent | `.gitignore` | Added `.vscode/` to editor section |
| coreintentai | `.gitignore` | Added `.vscode/` to editor section |
| Zynthio | `.gitignore` | Added `.vscode/` to editor section |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — updated scores (coreintent 89→91, coreintentai 94→93, Zynthio 88→90), updated branch tables (coreintent 28 non-main, coreintentai 16 non-main, Zynthio 7 non-main), documented audit score 96%, music pipeline additions to Zynthio |

### Fourth Pass — 2026-04-16

| Repo | File | Action |
|------|------|--------|
| coreintent | `HEALTH_REPORT.md` | Full re-scan — updated branch counts (coreintent: 20→28, coreintentai: 7→12, Zynthio: 4→6) |

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
