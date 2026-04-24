# Org Git Health Report

**Generated:** 2026-04-24 (eighth pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Delta | Status |
|------|-------|-------|--------|
| coreintent | 80/100 | ▼ −8 | **Branch explosion** — 30 → 61 non-main (SEO/marketing/i18n sprawl regrew since 7th pass) |
| coreintentai | 93/100 | ▼ −1 | Active — 19 → 22 non-main; 3 new capability branches added |
| Zynthio | 90/100 | — | Live — 7 non-main (stable, no change) |
| **Org avg** | **88/100** | ▼ −3 | Regression driven entirely by coreintent branch sprawl |

> **8th pass highlights:** coreintent branch count doubled from 30 → 61 non-main in 2 days. The same SEO and marketing branch clusters deleted in the 7th pass have regrown with more branches — now 10 SEO + 8 marketing + 5 i18n + 3 interactive-content + 2 security + 3 duplicate feature branches. This is a systemic AI tool (Cursor/Claude) sprawl pattern: tasks are being executed as branches but never merged or deleted. **Immediate action required.** All repos confirmed 0 secrets, 0 TODO/FIXME, 0 .DS_Store this pass.

---

## Repo 1: coreintent

**Score: 80/100** _(was 88 — branch count doubled 30 → 61; SEO/marketing/i18n sprawl regrew)_
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run
**Last scan:** 2026-04-24

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Current — Known Issues accurate (all 14 API routes, XSS warning, no auth) |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, .vscode/, Next.js outputs, credentials |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | 0 results across all files |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items across entire codebase |
| Dependencies | ✅ PASS | Next.js 15, lean deps, no obvious CVEs |
| XSS warning | ⚠️ WARN | `dangerouslySetInnerHTML` in `components/Terminal.tsx` — ANSI rendering; verify ansi-to-html sanitises fully |
| API routes | ⚠️ WARN | All 14 routes return hardcoded demo data — correctly labelled |
| Branch hygiene | 🔴 FAIL | **61 non-main branches** — doubled from 30 (7th pass); same sprawl clusters regrew |

### Branch Inventory — coreintent (61 non-main)

> **Regression since 7th pass:** +31 new branches in ~2 days. SEO/marketing clusters that were deleted have fully regrown. Score impact: −8 points.

#### Confirmed stale — delete immediately (4)

Same 4 confirmed-stale branches from 7th pass — still not deleted after 2 passes:

| Branch | Reason |
|--------|--------|
| `build-monitor/security-audit-fix` | Audit fix on main — stale 4 passes |
| `claude/check-coreintent-builds-JTrDd` | CI review done — stale 4 passes |
| `cursor-dependency-security-upgrade-ef32` | Security upgrade on main — stale 4 passes |
| `cursor-zynrip-incident-ef32` | Superseded by `cursor-incident-zynrip-repo-mismatch-ef32` |

#### SEO sprawl cluster (10) — all new since 7th pass

> Same pattern as the 8 SEO branches deleted in 7th pass. Cursor/Claude is creating SEO branches and not cleaning up.

| Branch |
|--------|
| `seo/complete-optimization` |
| `seo/comprehensive-improvements` |
| `seo/comprehensive-seo-improvements` |
| `seo/comprehensive-seo-overhaul` |
| `seo/full-audit-improvements` |
| `seo/metadata-structured-data-fixes` |
| `seo/perfection-pass` |
| `seo/perfector-improvements` |
| `seo/perfector-pass-2026-04-23` |
| `seo/structured-data-and-meta-improvements` |

**Recommendation:** Identify which (if any) landed on main, delete all others. Consider a branch protection rule or branch naming convention to prevent re-accumulation.

#### Marketing sprawl cluster (8) — all new since 7th pass

| Branch |
|--------|
| `marketing/content-upgrade-apr26` |
| `marketing/content-upgrade-april-2026` |
| `marketing/enhance-copy-and-og-images` |
| `marketing/hero-pricing-social-refresh` |
| `marketing/refresh-content-apr-2026` |
| `marketing/sharpen-copy-apr2026` |
| `marketing/sharpen-copy-april-2026` |
| `marketing-content-upgrade` |

**Recommendation:** Same as SEO — check if any are ahead of main, merge or delete all.

#### i18n cluster (5) — all new since 7th pass

| Branch | Notes |
|--------|-------|
| `feat/i18n-custom-implementation` | 4 competing i18n approaches |
| `feat/i18n-internationalization` | |
| `feat/i18n-multilingual` | |
| `feat/i18n-zero-dep` | |
| `i18n-multilingual` | Unnested duplicate of `feat/i18n-multilingual` |

**Recommendation:** Pick one approach, merge it, delete the other 4.

#### Interactive content cluster (3) — all new since 7th pass

| Branch |
|--------|
| `feat/interactive-content-upgrade` |
| `feat/interactive-content-v1` |
| `interactive-content-v2` |

#### Security branches (2) — new since 7th pass

| Branch | Recommendation |
|--------|----------------|
| `security/remove-runtime-fingerprint` | Review and create PR — security fix |
| `security/sanitize-api-error-leakage` | Review and create PR — security fix |

**Note:** Security branches should be prioritised over SEO/marketing. Create PRs for both.

#### Feature branch duplicates (new)

| Branch | Duplicate Of | Action |
|--------|-------------|--------|
| `feature/ai-twin-widget` | `feat/ai-twin-widget` | Delete — wrong prefix, likely same work |
| `feature/api-production-grade` | `feat/api-production-grade` | Delete — wrong prefix, likely same work |
| `feat/api-route-hardening` | `feat/api-hardening-round2` / `feat/api-production-grade` | Compare — likely third variant of same effort |

#### Cursor fix branches (23) — unchanged since 7th pass

| Branch | Recommendation |
|--------|----------------|
| `cursor/cloud-starter-skill-f65e` | Review |
| `cursor/desktop-master-handover-845c` | Review |
| `cursor/dev-environment-setup-cc84` | Review — close if superseded |
| `cursor/handover-update-0fbd` | Review |
| `cursor/update-outdated-docs-cc84` | Review — close if superseded |
| `cursor/web-desktop-sync-master-d4fd` | Review |
| `cursor-incident-zynrip-repo-mismatch-ef32` | Review/close |
| `cursordemo-and-terminal-issues-6940` | Review/close |
| `cursorh1-and-schema-issues-8649` | Review/close |
| `cursorhero-stats-api-route-count-12d7` | Review |
| `cursori18n-bug-fixes-5499` | Review — may overlap with i18n cluster |
| `cursorlayout-metadata-cleanup-a68a` | Review/close |
| `cursormargin-top-style-redundancy-f24f` | Merge — CSS fix |
| `cursornotification-sound-responses-fbd1` | Review/close |
| `cursorpricing-page-issues-6f34` | Review/close |
| `cursorrate-limiter-issues-9ad9` | Merge — rate limiter fix |
| `cursorrobots-crawl-delay-audit-a98d` | Review |
| `cursortypewriter-phrase-context-1450` | Review/close |
| `cursorui-rendering-and-styles-3930` | Review/close |
| `cursorunrelated-desktop-handover-file-70ad` | Review |
| `cursorunused-exported-functions-002a` | Merge — cleanup |
| `cursorunused-helper-functions-f7ed` | Review/close |

#### Feature branches (4) — create PRs

| Branch | Recommendation |
|--------|----------------|
| `feat/ai-twin-interactive-widget` | Create PR — interactive AI twin widget |
| `feat/ai-twin-widget` | Compare with above — close whichever has less work |
| `feat/api-hardening-round2` | Compare with `feat/api-production-grade` and `feat/api-route-hardening` — pick one |
| `feat/api-production-grade` | Create PR for whichever API hardening branch is most complete |

### Outstanding Code Issues

| Issue | Severity | Status |
|-------|----------|--------|
| XSS risk in `components/Terminal.tsx` | High | **Open** — `dangerouslySetInnerHTML` for ANSI rendering |
| All 14 API routes return demo data | Medium | Open — intentional, correctly labelled |
| No auth / no database | Medium | Open — intentional for now |
| VPS scripts never deployed | Medium | Open — COR-20, overdue per CLAUDE.md |
| xterm packages unused | Low | In package.json but not imported |

---

## Repo 2: coreintentai

**Score: 93/100** _(was 94 — mild branch growth: 19 → 22 non-main; 3 new capability branches)_
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript library / Node 20 / Vitest / npm package (`@coreintent/ai`)
**Last scan:** 2026-04-24

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vscode/, all common patterns |
| package.json | ✅ PASS | `node>=20`, @anthropic-ai/sdk ^0.39, openai ^4.78, zod ^3.24, TS 5.7 |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| No hardcoded secrets | ✅ PASS | 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items |
| Tests | ✅ PASS | Vitest test suite present |
| Source structure | ✅ PASS | config/, models/, orchestrator/, capabilities/, agents/, types/, utils/ |
| Branch hygiene | ⚠️ WARN | 22 non-main branches (was 19 in 7th pass; +3 new capability branches) |

### Branch Inventory — coreintentai (22 non-main)

#### New since 7th pass (+3)

| Branch | Type | Recommendation |
|--------|------|----------------|
| `cursorreference-regex-false-positives-88d6` | Cursor fix | Review and create PR |
| `feat/correlation-analysis-cost-tracking-research-synthesis` | Feature | Create PR |
| `feat/correlation-anomaly-performance` | Feature | Create PR |

#### High priority — merge-ready

| Branch | Recommendation |
|--------|----------------|
| `feat/brain-expander-v2` | **Merge immediately** — Circuit Breaker, Correlation Engine, Anomaly Detection, Pipeline Composer, Telemetry; sitting unmerged since 7th pass |
| `feat/adaptive-scoring-correlation-strategy` | **Create PR** — Adaptive Scorer, Strategy Synthesizer, Portfolio Correlation |
| `feat/consensus-engine-regime-detection` | **Create PR** |
| `feat/quant-engine-production-hardening` | **Create PR** |
| `feat/correlation-analysis-cost-tracking-research-synthesis` | **Create PR** |
| `feat/correlation-anomaly-performance` | **Create PR** |

#### Duplicate/superseded — delete

| Branch | Reason |
|--------|--------|
| `feat/anomaly-detection-capability` | Superseded by `feat/brain-expander-v2` |
| `feat/brain-expansion` | Superseded by `feat/brain-expander-v2` |
| `feat/brain-expander-circuit-breaker-regime-detection` | Superseded by `feat/brain-expander-v2` |
| `cursorprompt-telemetry-circuit-logic-b000` | Likely superseded by telemetry in brain-expander-v2 |
| `cursorcircuit-breaker-timer-reset-c349` | Likely superseded by brain-expander-v2 circuit breaker |

#### Cursor fix branches — create PRs

| Branch | Recommendation |
|--------|----------------|
| `cursorconsensus-agreement-accuracy-cf98` | **Create PR** — trading-critical bugfix |
| `cursorjson-parsing-and-error-detection-1a11` | **Create PR** |
| `cursororchestrator-caching-and-fallback-41dd` | **Create PR** |
| `cursororchestrator-system-logic-bugs-fe79` | **Create PR** |
| `cursorscoring-and-pipeline-issues-a772` | **Create PR** |
| `cursorreference-regex-false-positives-88d6` | **Create PR** |
| `cursorsystem-logic-and-config-db89` | Compare with `cursorsystem-logic-issues-0bdb` — merge one, close other |
| `cursorsystem-logic-issues-0bdb` | Compare with above |

---

## Repo 3: Zynthio

**Score: 90/100** _(stable — unchanged since 7th pass)_
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions
**Last scan:** 2026-04-24

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy, related repos |
| CLAUDE.md | ✅ PASS | Clean — Known Issues: "None currently" |
| .gitignore | ✅ PASS | Audio/video binary exclusions, .vscode/, all standard patterns |
| package.json | ✅ PASS | Minimal and correct — no deps, vercel deploy script |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder only |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai`, key from `process.env` |
| Music pipeline docs | ✅ PASS | TRACK_MANIFEST, DISTROKID_CHECKLIST, MUSIC_MARKETING, RELEASE_CALENDAR |
| No hardcoded secrets | ✅ PASS | 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items |
| Branch hygiene | ⚠️ WARN | 7 non-main branches — music-pipeline work, unchanged since 5th pass |

### Branch Inventory — Zynthio (7 non-main, unchanged)

| Branch | Recommendation |
|--------|----------------|
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `feat/music-pipeline-distrokid-prep` | Review and create PR when ready |
| `feat/music-pipeline-docs` | **Merge** — updated docs, ready, sitting since 5th pass |
| `feature/music-pipeline-scaffold` | Compare with `feat/music-pipeline-docs` — close if superseded |
| `music-pipeline` | Stale — close when feat/* merges |
| `music-pipeline-setup` | **DELETE** — superseded by feat/ branches |
| `music/pipeline-setup` | **DELETE** — duplicate of `music-pipeline-setup` |

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Status |
|-------|-----------|--------------|---------|--------|
| README.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| .gitignore (.vscode/ present) | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| .env.example | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| LICENSE (MIT) | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No hardcoded secrets | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No .DS_Store | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Node >=20 | ✅ | ✅ | N/A | ✅ CONSISTENT |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Owner credit | ✅ | ✅ | ✅ | ✅ CONSISTENT |

### Stack Divergence (Intentional — Correct)

| Repo | Stack | Rationale |
|------|-------|-----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead |

### Dependency Alignment

| Package | coreintent | coreintentai | Zynthio |
|---------|-----------|--------------|--------|
| TypeScript | ^5.5.0 | ^5.7.0 | N/A |
| @types/node | ^20.14.0 | ^22.10.0 | N/A |
| Node engine | >=20.0.0 | >=20.0.0 | N/A (static) |
| @anthropic-ai/sdk | ❌ (via coreintentai) | ^0.39.0 | ❌ |

**Recommendation:** Align coreintent TypeScript to 5.7 and @types/node to ^22 on next dep update (low risk).

---

## Action Items (Priority Order)

### Critical — coreintent branch explosion
- [ ] **Mass-delete SEO cluster (10 branches)**: `seo/*` — check which if any are ahead of main, delete the rest
- [ ] **Mass-delete marketing cluster (8 branches)**: `marketing/*` + `marketing-content-upgrade` — same check-and-delete
- [ ] **Delete duplicate feature branches (3)**: `feature/ai-twin-widget`, `feature/api-production-grade`, `feat/api-route-hardening` (pick 1 of the 3 API hardening branches)
- [ ] **Delete 4 confirmed-stale (4th time listed)**: `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`, `cursor-zynrip-incident-ef32`
- [ ] **Create PRs for security branches**: `security/remove-runtime-fingerprint` and `security/sanitize-api-error-leakage` — security fixes should not sit as branches
- [ ] **Root-cause the sprawl**: Cursor/Claude is creating branches for every task and not cleaning up. Consider running a monthly `git branch -d` sweep or configuring branch auto-deletion on merge in GitHub settings.

### Critical — coreintentai
- [ ] **Merge `feat/brain-expander-v2`** — highest-value unmerged work in the org; has been merge-ready since 7th pass
- [ ] **Create PR for `feat/adaptive-scoring-correlation-strategy`**

### High — coreintent i18n/content
- [ ] **Pick one i18n branch and delete the other 4**: `feat/i18n-custom-implementation`, `feat/i18n-internationalization`, `feat/i18n-multilingual`, `feat/i18n-zero-dep`, `i18n-multilingual`
- [ ] **Consolidate interactive-content cluster (3 branches)** into a single PR
- [ ] **Fix XSS in `components/Terminal.tsx`** — `dangerouslySetInnerHTML` for ANSI output (open since 1st pass)

### Medium — coreintentai cleanup
- [ ] **Delete superseded branches**: `feat/anomaly-detection-capability`, `feat/brain-expansion`, `feat/brain-expander-circuit-breaker-regime-detection`
- [ ] **Create PRs for cursor fix branches**: especially `cursorconsensus-agreement-accuracy-cf98` (trading-critical)
- [ ] **Create PRs for new feature branches**: `feat/correlation-analysis-cost-tracking-research-synthesis`, `feat/correlation-anomaly-performance`

### Medium — Zynthio
- [ ] **Merge `feat/music-pipeline-docs`** — ready since 5th pass
- [ ] **Delete `music-pipeline-setup` and `music/pipeline-setup`** — duplicate stale branches

### Low / Ongoing
- [ ] **Enable branch auto-delete on merge** in GitHub repo settings for all 3 repos (prevents future sprawl)
- [ ] **Align TypeScript to 5.7** in coreintent
- [ ] **Remove unused xterm packages** from coreintent package.json
- [ ] **Deploy VPS scripts** (coreintent, COR-20 overdue)
- [ ] **Connect API routes to live data** (coreintent — all 14 currently return demo data)

---

## Change Log

### Eighth Pass — 2026-04-24 (this pass)

| Repo | File | Action |
|------|------|--------|
| coreintent | `HEALTH_REPORT.md` | Full re-scan — branch explosion alert: 30→61 non-main; 31 new branches (10 SEO, 8 marketing, 5 i18n, 3 interactive-content, 2 security, 3 feature-duplicates); score 88→80; all security checks 0 (no secrets/TODO/FIXME/.DS_Store) |

### Seventh Pass — 2026-04-22

| Repo | File | Action |
|------|------|--------|
| coreintent | `CLAUDE.md` | Fixed stale Known Issues: "All 10 API routes" → "All 14 API routes" |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — coreintent: 47→30 non-main branches; coreintentai: 16→19 non-main, tests 88→150; Zynthio: stable 90 |

### Sixth Pass — 2026-04-20

| Repo | File | Action |
|------|------|--------|
| coreintent | `CLAUDE.md` | Fixed stale `Next.js 14` → `Next.js 15` reference |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — corrected branch count (47 non-main, not 28); downgraded score 91→85 |

### Fifth Pass — 2026-04-19

| Repo | File | Action |
|------|------|--------|
| coreintent | `.gitignore` | Added `.vscode/` to editor section |
| coreintentai | `.gitignore` | Added `.vscode/` to editor section |
| Zynthio | `.gitignore` | Added `.vscode/` to editor section |
| coreintent | `HEALTH_REPORT.md` | Re-scan — updated scores, branch tables, documented audit score 96% |

### Fourth Pass — 2026-04-16

| Repo | File | Action |
|------|------|--------|
| coreintent | `HEALTH_REPORT.md` | Re-scan — updated branch counts |

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
| coreintent | All 14 `app/api/*/route.ts` | Input validation hardened |
| coreintent | `next`, `eslint-config-next` | Upgraded 14→15.5.15, cleared 5 CVEs |
| Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai` |
| Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
