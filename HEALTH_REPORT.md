# Org Git Health Report

**Generated:** 2026-04-29 (ninth pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Delta | Status |
|------|-------|-------|--------|
| coreintent | 87/100 | ▲ +7 | **Recovered** — branch sprawl resolved: 61 → 30 non-main; SEO/marketing/i18n clusters cleaned since 8th pass |
| coreintentai | 89/100 | ▼ −4 | Active — 22 → 27 non-main; 5 new feat/* branches; brain-expander-v2 still unmerged (5th pass) |
| Zynthio | 91/100 | ▲ +1 | Live — 7 non-main (stable); engines field added; music pipeline docs maintained |
| **Org avg** | **89/100** | **▲ +1** | Steady improvement; no secrets, no TODO/FIXME, no .DS\_Store across all repos |

> **9th pass highlights:** coreintent recovered from its 8th-pass branch explosion (61 → 30 non-main) — the SEO (10), marketing (8), i18n (5), interactive-content (3), and feature-duplicate (3) clusters have been cleared. New interactive terminal features landed (decrypt/orbit/glitch/slots commands + live candlestick chart). coreintentai added 3 major capabilities (anomaly detection, multi-model consensus, momentum scoring — 198 tests). Zynthio gained engines consistency fix this pass. Critical blocker: **feat/brain-expander-v2 in coreintentai remains unmerged for the 5th consecutive pass** — highest-value undeployed work in the org.

---

## Repo 1: coreintent

**Score: 87/100** _(was 80 — branch sprawl resolved: 61 → 30 non-main; +7)_
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run
**Last commit:** 2026-04-28 (interactive terminal: decrypt/orbit/glitch/slots + live candlestick chart)
**Last scan:** 2026-04-29

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Updated this pass — branch note refreshed to 2026-04-29; 4 confirmed-stale branches named |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, .vscode/, Next.js outputs, credentials |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, node>=20 |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| AUDIT_REPORT.md | ✅ PASS | 96% score (52/54), 0 FAIL, 2 WARN — as of 2026-04-28 |
| No hardcoded secrets | ✅ PASS | 0 results across all files |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items across entire codebase |
| Dependencies | ✅ PASS | Next.js 15, lean deps, no obvious CVEs |
| XSS warning | ⚠️ WARN | `dangerouslySetInnerHTML` in `components/Terminal.tsx` — ANSI rendering; HTML-escaped first, allowlisted ANSI only; still open since pass 1 |
| API routes (14) | ⚠️ WARN | All 14 routes return demo data — intentional and correctly labelled |
| Branch hygiene | ⚠️ WARN | 30 non-main branches — improved from 61 (8th pass) but 4 confirmed-stale persist for 5th pass |

### Branch Inventory — coreintent (30 non-main)

**Score impact:** Branch count halved since 8th pass. SEO (10), marketing (8), i18n (5), interactive-content (3), security (2), and feature-duplicate (3) clusters are gone. Remaining 30 are all cursor/* fix branches plus 4 confirmed-stale.

#### Confirmed stale — delete immediately (4) ⚠️ 5th consecutive pass

These 4 branches have appeared in every health scan since the 5th pass with no action taken.

| Branch | Status | Age |
|--------|--------|-----|
| `build-monitor/security-audit-fix` | Audit fix is on main | Stale 5 passes |
| `claude/check-coreintent-builds-JTrDd` | CI review done | Stale 5 passes |
| `cursor-dependency-security-upgrade-ef32` | Security upgrade on main | Stale 5 passes |
| `cursor-zynrip-incident-ef32` | Superseded by `cursor-incident-zynrip-repo-mismatch-ef32` | Stale 5 passes |

#### New cursor fix branches since 8th pass (9 new)

| Branch | Recommendation |
|--------|----------------|
| `cursoraitwin-component-bugs-16c8` | Review and create PR |
| `cursorcode-quality-and-audit-report-9199` | Review and create PR |
| `cursorcode-quality-issues-90f5` | Review — may overlap with above |
| `cursorcounter-timer-and-arrows-d9e5` | Review and create PR |
| `cursorinternationalization-and-css-bugs-2321` | Review — may overlap with `cursori18n-bug-fixes-5499` |
| `cursorinternationalization-and-formatting-af88` | Review — may overlap with above |
| `cursorlanding-page-data-consistency-1c0d` | Review and create PR |
| `cursornewsletter-unsubscribe-placeholder-f150` | Review and create PR |
| `cursorpwa-installability-icons-ac25` | Review and create PR |

#### Persistent cursor fix branches (17, unchanged since 7th or 8th pass)

| Branch | Recommendation |
|--------|----------------|
| `cursor/cloud-starter-skill-f65e` | Review/close |
| `cursor/desktop-master-handover-845c` | Review/close |
| `cursor/dev-environment-setup-cc84` | Review/close |
| `cursor/handover-update-0fbd` | Review/close |
| `cursor/update-outdated-docs-cc84` | Review/close |
| `cursor/web-desktop-sync-master-d4fd` | Review/close |
| `cursor-incident-zynrip-repo-mismatch-ef32` | Review/close |
| `cursordemo-and-terminal-issues-6940` | Review/close |
| `cursorh1-and-schema-issues-8649` | Review/close |
| `cursorhero-stats-api-route-count-12d7` | Review |
| `cursori18n-bug-fixes-5499` | Review |
| `cursorlayout-metadata-cleanup-a68a` | Review/close |
| `cursormargin-top-style-redundancy-f24f` | Merge — CSS fix |
| `cursornotification-sound-responses-fbd1` | Review/close |
| `cursorpricing-page-issues-6f34` | Review/close |
| `cursorrate-limiter-issues-9ad9` | Merge — rate limiter fix |
| `cursorrobots-crawl-delay-audit-a98d` | Review |

### Outstanding Code Issues

| Issue | Severity | Status |
|-------|----------|--------|
| XSS risk in `components/Terminal.tsx` | High | **Open** — `dangerouslySetInnerHTML` for ANSI; mitigated but not resolved; open since pass 1 |
| 14 API routes return demo data | Medium | Open — intentional, correctly labelled |
| No auth / no database | Medium | Open — intentional for now |
| VPS scripts never deployed | Medium | Open — COR-20, overdue |

---

## Repo 2: coreintentai

**Score: 89/100** _(was 93 — 22 → 27 non-main; brain-expander-v2 still unmerged for 5th pass; −4)_
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript library / Node 20 / Vitest / npm package (`@coreintent/ai`)
**Last commit:** 2026-04-26 (anomaly detection, multi-model consensus, momentum scoring — 198 tests total)
**Last scan:** 2026-04-29

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vscode/, all common patterns |
| package.json | ✅ PASS | node>=20, @anthropic-ai/sdk ^0.39, openai ^4.78, zod ^3.24, TS 5.7 |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| Tests | ✅ PASS | 198 tests passing (Vitest); grew from 88 → 140 → 198 over last 3 passes |
| No hardcoded secrets | ✅ PASS | 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items |
| Source structure | ✅ PASS | config/, models/, orchestrator/, capabilities/, agents/, types/, utils/ all present |
| Branch hygiene | ⚠️ WARN | 27 non-main branches (was 22 — +5 new feat/* branches this pass) |

### Branch Inventory — coreintentai (27 non-main)

#### 🚨 CRITICAL: feat/brain-expander-v2 (unmerged for 5th consecutive pass)

This branch contains Circuit Breaker, Correlation Engine, Anomaly Detection, Pipeline Composer, and Telemetry. It is the highest-value undeployed work in the org and has sat unmerged since the 5th pass. **Merge or explain why it remains a branch.**

#### New feat/* branches since 8th pass (5 new)

| Branch | Recommendation |
|--------|----------------|
| `feat/intelligence-pipeline-and-enhancements` | Create PR |
| `feat/resilience-and-observability` | Create PR |
| `feat/resilience-and-validation` | Create PR |
| `feat/resilience-layer` | Create PR — may overlap with resilience-and-validation |
| `feat/volatility-portfolio-agents` | Create PR |

#### High priority — merge-ready feat/* (from previous passes)

| Branch | Recommendation |
|--------|----------------|
| `feat/brain-expander-v2` | **🚨 MERGE IMMEDIATELY** — 5th pass unmerged |
| `feat/adaptive-scoring-correlation-strategy` | Create PR |
| `feat/consensus-engine-regime-detection` | Create PR |
| `feat/correlation-analysis-cost-tracking-research-synthesis` | Create PR |
| `feat/correlation-anomaly-performance` | Create PR |
| `feat/quant-engine-production-hardening` | Create PR |

#### Superseded — delete

| Branch | Superseded By |
|--------|---------------|
| `feat/anomaly-detection-capability` | `feat/brain-expander-v2` |
| `feat/brain-expansion` | `feat/brain-expander-v2` |
| `feat/brain-expander-circuit-breaker-regime-detection` | `feat/brain-expander-v2` |
| `cursorprompt-telemetry-circuit-logic-b000` | Telemetry in `feat/brain-expander-v2` |
| `cursorcircuit-breaker-timer-reset-c349` | Circuit breaker in `feat/brain-expander-v2` |

#### Cursor fix branches — create PRs

| Branch | Priority |
|--------|----------|
| `cursorconsensus-agreement-accuracy-cf98` | **High** — trading-critical bugfix |
| `cursorjson-parsing-and-error-detection-1a11` | High |
| `cursororchestrator-caching-and-fallback-41dd` | High |
| `cursororchestrator-system-logic-bugs-fe79` | High |
| `cursorscoring-and-pipeline-issues-a772` | High |
| `cursorcorrelation-agreement-and-metrics-7137` | Medium |
| `cursorreference-regex-false-positives-88d6` | Medium |
| `cursorsystem-logic-and-config-db89` | Compare with `cursorsystem-logic-issues-0bdb` — merge one, close other |
| `cursorsystem-logic-issues-0bdb` | Compare with above |
| `cursorunused-pipeline-provider-field-f971` | Low — cleanup |

---

## Repo 3: Zynthio

**Score: 91/100** _(was 90 — engines field added this pass; +1)_
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions
**Last commit:** 2026-04-29 (engines field added) / 2026-04-24 (music pipeline docs: Canvas/Clips checklist, SoundCloud)
**Last scan:** 2026-04-29

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy, related repos |
| CLAUDE.md | ✅ PASS | Clean — Known Issues: "None currently" |
| .gitignore | ✅ PASS | Audio/video binary exclusions, .vscode/, all standard patterns |
| package.json | ✅ PASS | **Fixed this pass** — engines: node>=20 added; consistent with org |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder only |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai`, key from `process.env` |
| Music pipeline docs | ✅ PASS | TRACK_MANIFEST, DISTROKID_CHECKLIST, MUSIC_MARKETING, RELEASE_CALENDAR — updated 2026-04-24 |
| No hardcoded secrets | ✅ PASS | 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent |
| No TODO/FIXME | ✅ PASS | 0 items |
| Branch hygiene | ⚠️ WARN | 7 non-main branches — music-pipeline work, stable/unchanged since 5th pass |

### Branch Inventory — Zynthio (7 non-main, unchanged)

| Branch | Recommendation |
|--------|----------------|
| `feat/music-pipeline-docs` | **Merge** — ready since 5th pass (6th consecutive pass unmerged) |
| `feat/music-pipeline-distrokid-prep` | Review and create PR when ready |
| `feature/music-pipeline-scaffold` | Compare with `feat/music-pipeline-docs` — close if superseded |
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `music-pipeline` | **DELETE** — superseded by feat/* branches |
| `music-pipeline-setup` | **DELETE** — superseded by feat/* branches |
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
| engines: node >=20 | ✅ | ✅ | ✅ **Fixed** | ✅ CONSISTENT |
| No hardcoded secrets | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No .DS_Store | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Owner credit | ✅ | ✅ | ✅ | ✅ CONSISTENT |

### Stack Divergence (Intentional — Correct)

| Repo | Stack | Rationale |
|------|-------|----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead |

### Dependency Alignment

| Package | coreintent | coreintentai | Zynthio |
|---------|-----------|--------------|--------|
| TypeScript | ^5.5.0 | ^5.7.0 | N/A |
| @types/node | ^20.14.0 | ^22.10.0 | N/A |
| Node engine | >=20.0.0 | >=20.0.0 | >=20.0.0 ✅ |
| @anthropic-ai/sdk | ❌ (via coreintentai) | ^0.39.0 | ❌ |

**Recommendation:** Align coreintent TypeScript to ^5.7.0 and @types/node to ^22 on next dep update (low risk, non-breaking).

---

## Action Items (Priority Order)

### 🚨 Critical

- [ ] **Merge `feat/brain-expander-v2`** (coreintentai) — highest-value undeployed work in the org; Circuit Breaker, Correlation Engine, Anomaly Detection; unmerged for 5 consecutive passes
- [ ] **Delete 4 confirmed-stale coreintent branches** (5th time listed): `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`, `cursor-zynrip-incident-ef32`
- [ ] **Fix XSS in `components/Terminal.tsx`** — `dangerouslySetInnerHTML` for ANSI output; open since pass 1; mitigated but not resolved

### 🔴 High

- [ ] **Create PRs for coreintentai cursor bugfixes**: `cursorconsensus-agreement-accuracy-cf98` (trading-critical), `cursorjson-parsing-and-error-detection-1a11`, `cursororchestrator-caching-and-fallback-41dd`, `cursororchestrator-system-logic-bugs-fe79`
- [ ] **Create PRs for coreintentai feat branches**: `feat/intelligence-pipeline-and-enhancements`, `feat/resilience-and-observability`, `feat/resilience-and-validation`, `feat/resilience-layer`, `feat/volatility-portfolio-agents`
- [ ] **Delete superseded coreintentai branches**: `feat/anomaly-detection-capability`, `feat/brain-expansion`, `feat/brain-expander-circuit-breaker-regime-detection`, `cursorprompt-telemetry-circuit-logic-b000`, `cursorcircuit-breaker-timer-reset-c349`
- [ ] **Merge `feat/music-pipeline-docs`** (Zynthio) — ready since 5th pass, 6th consecutive pass unmerged

### 🟡 Medium

- [ ] **Review and create PRs for new coreintent cursor branches** (9 new this pass): `cursoraitwin-component-bugs-16c8`, `cursorcode-quality-and-audit-report-9199`, `cursorcounter-timer-and-arrows-d9e5`, `cursorlanding-page-data-consistency-1c0d`, etc.
- [ ] **Delete Zynthio stale branches**: `music-pipeline`, `music-pipeline-setup`, `music/pipeline-setup` — superseded by feat/* branches
- [ ] **Enable branch auto-delete on merge** in GitHub settings for all 3 repos (prevents future sprawl)
- [ ] **Deploy VPS scripts** (coreintent — COR-20 overdue)

### 🔵 Low / Ongoing

- [ ] **Align coreintent TypeScript to ^5.7.0** (matches coreintentai; low-risk)
- [ ] **Align coreintent @types/node to ^22** (matches coreintentai)
- [ ] **Connect API routes to live data** (coreintent — all 14 currently return demo data; intentional)
- [ ] **Add user auth + database** (coreintent — intentional gap)

---

## Change Log

### Ninth Pass — 2026-04-29 (this pass)

| Repo | File | Action |
|------|------|--------|
| Zynthio | `package.json` | Added `engines: { node: >=20.0.0 }` — align with org standard |
| coreintent | `CLAUDE.md` | Branch note updated to 2026-04-29; 4 confirmed-stale branches named explicitly |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — coreintent: 80→87 (branch sprawl resolved 61→30); coreintentai: 93→89 (22→27 non-main, brain-expander-v2 still unmerged 5th pass); Zynthio: 90→91 (engines fix); org avg 88→89 |

### Eighth Pass — 2026-04-24

| Repo | File | Action |
|------|------|--------|
| coreintent | `HEALTH_REPORT.md` | Full re-scan — branch explosion alert: 30→61 non-main; 31 new branches (10 SEO, 8 marketing, 5 i18n, 3 interactive-content, 2 security, 3 feature-duplicates); score 88→80 |

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
