# Org Git Health Report

**Generated:** 2026-04-22 (seventh pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Delta | Status |
|------|-------|-------|--------|
| coreintent | 88/100 | ▲ +3 | Active — 30 non-main branches (down from 47; branch cleanup in progress) |
| coreintentai | 94/100 | ▲ +1 | Active — 19 non-main branches; tests grew 88 → 150; 5 major new capabilities |
| Zynthio | 90/100 | — | Live — 7 non-main branches (unchanged); music pipeline docs refreshed |
| **Org avg** | **91/100** | ▲ +2 | Healthiest state to date. Branch cleanup momentum must continue. |

> **7th pass highlights:** coreintent deleted 24 stale branches (all SEO/marketing/security sprawl clusters from 6th pass) while adding 6 new cursor branches — net –17. coreintentai added Circuit Breaker, Correlation Engine, Anomaly Detection, Pipeline Composer, Telemetry, Adaptive Scoring, and Strategy Synthesizer capabilities; tests nearly doubled. CLAUDE.md Known Issues stale count (10 → 14 routes) fixed this pass.

---

## Repo 1: coreintent

**Score: 88/100** _(was 85 — branch cleanup improved: 47 → 30 non-main)_
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run
**Last commit:** 2026-04-22 (today)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Fixed this pass: Known Issues "All 10" → "All 14" API routes |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, .vscode/, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | Search returned 0 results across all files |
| No .DS_Store files | ✅ PASS | Gitignored and absent (confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| Dependencies | ✅ PASS | Next.js 15, lean deps, no obvious CVEs; audit score 96% (52/54) |
| XSS warning | ⚠️ WARN | `dangerouslySetInnerHTML` in `components/Terminal.tsx` — ANSI rendering; ensure `ansi-to-html` sanitises fully |
| API routes | ⚠️ WARN | All 14 routes return hardcoded demo data — correctly labelled |
| Branch hygiene | ⚠️ WARN | 30 non-main branches — improved from 47 (6th pass), but still elevated |

### Branch Inventory — coreintent (30 non-main)

> **Progress since 6th pass:** 24 branches deleted (all 8 SEO, all 7 marketing, both security, 3 feat duplicates, cursori18n). 6 new cursor branches added. Net: –17.

#### Confirmed safe-to-delete (4) — stale, no open PRs, work already on main

| Branch | Reason |
|--------|--------|
| `build-monitor/security-audit-fix` | Audit fix landed on main — confirmed stale 3 passes |
| `claude/check-coreintent-builds-JTrDd` | CI incident review done — stale 3 passes |
| `cursor-dependency-security-upgrade-ef32` | Security upgrade on main — stale 3 passes |
| `cursor-zynrip-incident-ef32` | Superseded by `cursor-incident-zynrip-repo-mismatch-ef32` |

#### Cursor fix branches (22) — review or close

| Branch | Age | Recommendation |
|--------|-----|----------------|
| `cursor/cloud-starter-skill-f65e` | New | Review — cloud starter skill |
| `cursor/desktop-master-handover-845c` | New | Review — desktop handover |
| `cursor/dev-environment-setup-cc84` | Old | Review — AGENTS.md docs; close if on main |
| `cursor/handover-update-0fbd` | New | Review — handover doc update |
| `cursor/update-outdated-docs-cc84` | Old | Review — check if superseded |
| `cursor/web-desktop-sync-master-d4fd` | New | Review — web/desktop sync |
| `cursor-incident-zynrip-repo-mismatch-ef32` | Old | Review/close — zynrip incident |
| `cursordemo-and-terminal-issues-6940` | Old | Review/close |
| `cursorh1-and-schema-issues-8649` | Old | Review/close |
| `cursorhero-stats-api-route-count-12d7` | New | Review — route count fix (may now be on main) |
| `cursorlayout-metadata-cleanup-a68a` | Old | Review/close |
| `cursormargin-top-style-redundancy-f24f` | Old | Review — CSS fix, worth merging |
| `cursornotification-sound-responses-fbd1` | Old | Review/close |
| `cursorpricing-page-issues-6f34` | Old | Review/close |
| `cursorrate-limiter-issues-9ad9` | Old | Review — rate limiter fix, worth merging |
| `cursorrobots-crawl-delay-audit-a98d` | New | Review — robots/crawl delay |
| `cursortypewriter-phrase-context-1450` | Old | Review/close |
| `cursorui-rendering-and-styles-3930` | Old | Review/close |
| `cursorunrelated-desktop-handover-file-70ad` | New | Review — likely cleanup |
| `cursorunused-exported-functions-002a` | Old | Review — cleanup, worth merging |
| `cursorunused-helper-functions-f7ed` | Old | Review/close |

#### Feature branches (4) — create PRs

| Branch | Recommendation |
|--------|----------------|
| `feat/ai-twin-interactive-widget` | **Create PR** — interactive AI twin widget |
| `feat/ai-twin-widget` | Compare with above — close whichever has less work |
| `feat/api-hardening-round2` | Compare with `feat/api-production-grade` — close older/smaller |
| `feat/api-production-grade` | Compare with above — **create PR** for whichever is more complete |

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

**Score: 94/100** _(was 93 — test count nearly doubled; major new capabilities; slight branch growth)_
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript library / Node 20 / Vitest / npm package (`@coreintent/ai`)
**Last commit:** 2026-04-19 (3 days ago)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vscode/, all common patterns |
| package.json | ✅ PASS | `node>=20`, @anthropic-ai/sdk ^0.39, openai ^4.78, zod ^3.24, TS 5.7 |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| No hardcoded secrets | ✅ PASS | Search returned 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent (confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items |
| Tests | ✅ PASS | 88 tests on main; 150 on `feat/brain-expander-v2` (ready to merge) |
| Source structure | ✅ PASS | config/, models/, orchestrator/, capabilities/, agents/, types/, utils/ |
| Branch hygiene | ⚠️ WARN | 19 non-main branches (was 16 in 6th pass; +3 new capability branches) |

### New Capabilities Since 6th Pass

| Capability | Branch | Tests | Status |
|------------|--------|-------|--------|
| Circuit Breaker | `feat/brain-expander-v2` | 150 total | Merge-ready |
| Correlation Engine | `feat/brain-expander-v2` | 150 total | Merge-ready |
| Anomaly Detection | `feat/brain-expander-v2` | 150 total | Merge-ready |
| Pipeline Composer | `feat/brain-expander-v2` | 150 total | Merge-ready |
| Telemetry System | `feat/brain-expander-v2` | 150 total | Merge-ready |
| Adaptive Model Scorer | `feat/adaptive-scoring-correlation-strategy` | 137 | Review |
| Strategy Synthesizer | `feat/adaptive-scoring-correlation-strategy` | 137 | Review |

### Branch Inventory — coreintentai (19 non-main)

> +3 new branches since 6th pass: `cursorscoring-and-pipeline-issues-a772`, `feat/adaptive-scoring-correlation-strategy`, `feat/brain-expander-v2`

#### High priority — merge-ready

| Branch | Recommendation |
|--------|----------------|
| `feat/brain-expander-v2` | **Merge immediately** — Circuit Breaker, Correlation Engine, Anomaly Detection, Pipeline Composer, Telemetry; 150 tests passing; Bugbot review addressed |
| `feat/adaptive-scoring-correlation-strategy` | **Create PR** — Adaptive Scorer, Strategy Synthesizer, Portfolio Correlation; 137 tests |
| `feat/consensus-engine-regime-detection` | **Create PR** — regime detection; closely related to brain-expander work |
| `feat/quant-engine-production-hardening` | **Create PR** |
| `feat/anomaly-detection-capability` | **Superseded by brain-expander-v2** — close this |

#### Duplicate clusters — consolidate

| Branches | Action |
|----------|--------|
| `feat/resilience-and-observability`, `feat/resilience-and-validation`, `feat/resilience-layer` | Compare — pick one, close others; resilience likely covered in brain-expander-v2 |
| `feat/brain-expansion`, `feat/brain-expander-circuit-breaker-regime-detection` | Both superseded by `feat/brain-expander-v2` — **delete both** |
| `cursorsystem-logic-and-config-db89`, `cursorsystem-logic-issues-0bdb` | Compare — one is likely a superset |

#### Cursor fix branches (8) — review

| Branch | Recommendation |
|--------|----------------|
| `cursorcircuit-breaker-timer-reset-c349` | Likely superseded by brain-expander-v2 circuit breaker — verify and close |
| `cursorconsensus-agreement-accuracy-cf98` | Create PR — consensus bugfix, trading-critical |
| `cursorjson-parsing-and-error-detection-1a11` | Create PR |
| `cursororchestrator-caching-and-fallback-41dd` | Create PR |
| `cursororchestrator-system-logic-bugs-fe79` | Create PR |
| `cursorprompt-telemetry-circuit-logic-b000` | Likely superseded by telemetry in brain-expander-v2 — verify and close |
| `cursorscoring-and-pipeline-issues-a772` | New — related to adaptive scorer; create PR |
| `cursorsystem-logic-and-config-db89` | Compare with `cursorsystem-logic-issues-0bdb` |

---

## Repo 3: Zynthio

**Score: 90/100** _(unchanged)_
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions
**Last commit:** 2026-04-22 (today — pipeline docs date bump)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy, related repos |
| CLAUDE.md | ✅ PASS | Clean — Known Issues section says "None currently" |
| .gitignore | ✅ PASS | Audio binary exclusions, video exclusions, .vscode/ |
| package.json | ✅ PASS | Minimal and correct — no deps, vercel deploy script |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder only |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai`, secret from `process.env` |
| Music pipeline docs | ✅ PASS | TRACK_MANIFEST, DISTROKID_CHECKLIST, MUSIC_MARKETING, RELEASE_CALENDAR |
| video/README.md | ✅ PASS | Spotify Canvas, Shorts, MV specs — added 6th pass |
| No hardcoded secrets | ✅ PASS | Search returned 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent (confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items |
| Branch hygiene | ⚠️ WARN | 7 non-main branches — music-pipeline work, unchanged since 5th pass |

### Branch Inventory — Zynthio (7 non-main, unchanged since 5th pass)

| Branch | Recommendation |
|--------|----------------|
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `feat/music-pipeline-distrokid-prep` | Review and create PR when ready |
| `feat/music-pipeline-docs` | **Merge** — updated docs, appears ready |
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
| Node >=20 | ✅ | ✅ | N/A (static) | ✅ CONSISTENT |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ CONSISTENT |
| Owner credit | ✅ | ✅ | ✅ | ✅ CONSISTENT |

### Stack Divergence (Intentional — Correct)

| Repo | Stack | Rationale |
|------|-------|----------|
| coreintent | Next.js 15 + TypeScript | Full-stack web app with App Router |
| coreintentai | TypeScript library + Vitest | Headless AI layer, published as npm package |
| Zynthio | Static HTML + Vercel Functions | Minimal landing page — no framework overhead needed |

### Dependency Alignment

| Package | coreintent | coreintentai | Zynthio |
|---------|-----------|--------------|--------|
| TypeScript | ^5.5.0 | ^5.7.0 | N/A |
| @types/node | ^20.14.0 | ^22.10.0 | N/A |
| Node engine | >=20.0.0 | >=20.0.0 | N/A (static) |
| @anthropic-ai/sdk | ❌ (via coreintentai) | ^0.39.0 | ❌ |

**Recommendation:** Align coreintent TypeScript to 5.7 on next dep update (low risk, minor).

---

## Action Items (Priority Order)

### Critical — coreintentai
- [ ] **Merge `feat/brain-expander-v2`** — 150 tests passing, Bugbot review addressed, 5 new production capabilities. This is the highest-value unmerged work in the org.
- [ ] **Create PR for `feat/adaptive-scoring-correlation-strategy`** — 137 tests, Adaptive Scorer + Strategy Synthesizer + Portfolio Correlation. Transformative capability.

### High — coreintent branches
- [ ] **Delete 4 confirmed-stale branches**: `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`, `cursor-zynrip-incident-ef32`
- [ ] **Create PRs for `feat/ai-twin-interactive-widget` and `feat/api-production-grade`** — both have been sitting unreviewed through multiple passes
- [ ] **Fix XSS in `components/Terminal.tsx`** — `dangerouslySetInnerHTML` for ANSI output; verify `ansi-to-html` sanitises fully

### Medium — coreintentai cleanup
- [ ] **Delete `feat/brain-expansion` and `feat/brain-expander-circuit-breaker-regime-detection`** — both superseded by `feat/brain-expander-v2`
- [ ] **Close `feat/anomaly-detection-capability`** — superseded by brain-expander-v2
- [ ] **Consolidate 3 resilience branches** into one PR — check if covered by brain-expander-v2 first
- [ ] **Create PRs for remaining cursor fix branches** in coreintentai — especially `cursorconsensus-agreement-accuracy-cf98` (trading-critical)

### Medium — Zynthio
- [ ] **Merge `feat/music-pipeline-docs`** — appears ready, sitting since 5th pass
- [ ] **Delete `music-pipeline-setup` and `music/pipeline-setup`** — duplicate stale branches

### Low / Ongoing
- [ ] **Align TypeScript to 5.7** in coreintent (already on 5.7 in coreintentai)
- [ ] **Remove unused xterm packages** from coreintent package.json
- [ ] **Deploy VPS scripts** (coreintent, COR-20 overdue)
- [ ] **Connect API routes to live data** (coreintent — currently all 14 return demo data)

---

## Change Log

### Seventh Pass — 2026-04-22 (this pass)

| Repo | File | Action |
|------|------|--------|
| coreintent | `CLAUDE.md` | Fixed stale Known Issues: "All 10 API routes" → "All 14 API routes" |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — coreintent: 47→30 non-main branches (+3 coreintent scores 88); coreintentai: 16→19 non-main, tests 88→150, 7 new capabilities (scores 94); Zynthio: stable 90; confirmed 0 secrets/TODO/FIXME/.DS_Store across all repos |

### Sixth Pass — 2026-04-20

| Repo | File | Action |
|------|------|--------|
| coreintent | `CLAUDE.md` | Fixed stale `Next.js 14` → `Next.js 15` reference in Architecture section |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — corrected branch count (47 non-main, not 28; 5th pass missed API pagination page 2); documented 18 new branches since 5th pass; downgraded score 91→85; added SEO sprawl pattern alert |

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
