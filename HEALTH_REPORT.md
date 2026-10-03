# Org Git Health Report

**Generated:** 2026-04-20 (sixth pass)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 85/100 | Active — 47 non-main branches (critical: branch sprawl accelerating) |
| coreintentai | 93/100 | Active — full AI layer, 45 tests, 16 branches (stable) |
| Zynthio | 90/100 | Live — static site, clean, 7 non-main branches |
| **Org avg** | **89/100** | Healthy core, but coreintent branch hygiene is now the #1 blocker. |

> **6th pass correction:** The 5th pass report understated coreintent's branch count (28) due to a pagination miss on the GitHub API. Actual count is 47 non-main branches. 18 new branches were added since the 5th pass with zero deletions.

---

## Repo 1: coreintent

**Score: 85/100** _(was 91 — downgraded: 47 non-main branches discovered, 18 added since last pass, 0 deleted)_
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack table, API routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Fixed this pass: Next.js 14 → 15 reference corrected |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, .vscode/, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Full placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | Search returned 0 results across all files |
| No .DS_Store files | ✅ PASS | Gitignored and absent (search confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| Dependencies | ✅ PASS | Next.js 15, lean deps, no obvious CVEs |
| XSS warning | ⚠️ WARN | `dangerouslySetInnerHTML` in `components/Terminal.tsx` — ANSI rendering; ensure `ansi-to-html` sanitises fully |
| API routes | ⚠️ WARN | 10+ routes still return hardcoded demo data — labelled correctly |
| Branch hygiene | 🔴 CRITICAL | 47 non-main branches — worst in org, accelerating: +18 since last pass, 0 deleted |

### Branch Inventory — coreintent (47 non-main)

> 5th pass missed page 2 of the GitHub branches API. Full accurate count is 47.

#### Cursor AI branches (20) — all stale, no open PRs

| Branch | Recommendation |
|--------|----------------|
| `build-monitor/security-audit-fix` | **DELETE** — audit fix on main |
| `claude/check-coreintent-builds-JTrDd` | **DELETE** — incident review done |
| `cursor-dependency-security-upgrade-ef32` | **DELETE** — on main |
| `cursor-incident-zynrip-repo-mismatch-ef32` | Review — new, zynrip mismatch fix |
| `cursor-zynrip-incident-ef32` | Review — older zynrip incident, likely superseded |
| `cursor/dev-environment-setup-cc84` | Review — AGENTS.md docs |
| `cursor/update-outdated-docs-cc84` | Review — check if superseded |
| `cursordemo-and-terminal-issues-6940` | Review/close |
| `cursorh1-and-schema-issues-8649` | Review/close |
| `cursorhero-stats-api-route-count-12d7` | Review/close |
| `cursori18n-bug-fixes-5499` | Review — may overlap with `feat/i18n-multilingual` |
| `cursorlayout-metadata-cleanup-a68a` | Review/close |
| `cursormargin-top-style-redundancy-f24f` | Review — new, CSS fix |
| `cursornotification-sound-responses-fbd1` | Review/close |
| `cursorpricing-page-issues-6f34` | Review/close |
| `cursorrate-limiter-issues-9ad9` | Review — new, rate limiter fix |
| `cursortypewriter-phrase-context-1450` | Review/close |
| `cursorui-rendering-and-styles-3930` | Review/close |
| `cursorunused-exported-functions-002a` | Review — cleanup, worth merging |
| `cursorunused-helper-functions-f7ed` | Review/close |

#### Feature branches (8) — duplicate clusters

| Branch | Recommendation |
|--------|----------------|
| `feat/ai-twin-interactive-widget` | **KEEP** — create PR |
| `feat/ai-twin-widget` | Dup of above — compare and close one |
| `feature/ai-twin-widget` | Dup of above — close this one |
| `feat/api-hardening-round2` | Compare with `feature/api-production-grade` — close older |
| `feat/api-production-grade` | New — compare with `feature/api-production-grade` |
| `feature/api-production-grade` | Review vs `feat/api-production-grade` — close one |
| `feat/i18n-multilingual` | **KEEP** — create PR |
| `feat/interactive-content-v1` | Compare with `interactive-content-v2` — close v1 |

#### Standalone branches (2)

| Branch | Recommendation |
|--------|----------------|
| `i18n-multilingual` | Base branch for i18n work — close when feat/ merges |
| `interactive-content-v2` | Create PR — evolution of v1 |

#### Marketing branches (7) — likely AI agent sprawl

| Branch | Recommendation |
|--------|----------------|
| `marketing/content-upgrade-april-2026` | New — review and create PR or close |
| `marketing/enhance-copy-and-og-images` | Old — review; close if work is on main |
| `marketing/hero-pricing-social-refresh` | Old — review; close if work is on main |
| `marketing/refresh-content-apr-2026` | Old — review; close if work is on main |
| `marketing/sharpen-copy-apr2026` | New — likely dup of `sharpen-copy-april-2026` |
| `marketing/sharpen-copy-april-2026` | New — likely dup of above, close one |
| `marketing-content-upgrade` | New — compare with marketing/* branches, consolidate |

#### Security branches (2) — worth reviewing

| Branch | Recommendation |
|--------|----------------|
| `security/remove-runtime-fingerprint` | **Review and merge** — security hardening |
| `security/sanitize-api-error-leakage` | **Review and merge** — security hardening |

#### SEO branches (8) — classic AI agent sprawl, all likely duplicates

| Branch | Recommendation |
|--------|----------------|
| `seo/complete-optimization` | Pick the best one, merge it, **delete the rest** |
| `seo/comprehensive-improvements` | Likely dup — delete |
| `seo/comprehensive-seo-improvements` | Likely dup — delete |
| `seo/comprehensive-seo-overhaul` | Likely dup — delete |
| `seo/full-audit-improvements` | Likely dup — delete |
| `seo/perfection-pass` | Likely dup — delete |
| `seo/perfector-improvements` | Likely dup — delete |
| `seo/structured-data-and-meta-improvements` | Likely dup — delete |

> **Pattern alert:** 8 SEO branches with near-identical names is the classic signature of repeated AI agent runs on the same task without cleanup. Before running another agent on SEO, check if any of these already solved the problem.

#### Confirmed safe-to-delete (3) — unchanged from 5th pass recommendation

`build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`

### Outstanding Code Issues

| Issue | Severity | Status |
|-------|----------|--------|
| XSS risk in `components/Terminal.tsx` | High | **Open** — `dangerouslySetInnerHTML` for ANSI rendering |
| All API routes return demo data | Medium | Open — intentional, correctly labelled |
| No auth / no database | Medium | Open — intentional for now |
| VPS scripts never deployed | Medium | Open — COR-20, overdue per CLAUDE.md |
| xterm packages unused | Low | In package.json but not imported |

---

## Repo 2: coreintentai

**Score: 93/100** _(unchanged)_
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
| No hardcoded secrets | ✅ PASS | Search returned 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent (search confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items |
| Tests | ✅ PASS | 45 tests (vitest) |
| Source structure | ✅ PASS | config/, models/, orchestrator/, capabilities/, agents/, types/, utils/ — matches CLAUDE.md architecture |
| Branch hygiene | ⚠️ WARN | 16 non-main branches, zero have open PRs |

### Branch Inventory — coreintentai (16 non-main, unchanged since 5th pass)

| Branch | Recommendation |
|--------|----------------|
| `cursorcircuit-breaker-timer-reset-c349` | Create PR |
| `cursorconsensus-agreement-accuracy-cf98` | Create PR — consensus bugfix, trading-critical |
| `cursorjson-parsing-and-error-detection-1a11` | Create PR |
| `cursororchestrator-caching-and-fallback-41dd` | Create PR |
| `cursororchestrator-system-logic-bugs-fe79` | Create PR |
| `cursorprompt-telemetry-circuit-logic-b000` | Create PR |
| `cursorsystem-logic-and-config-db89` | Create PR or compare with `cursorsystem-logic-issues-0bdb` |
| `cursorsystem-logic-issues-0bdb` | Compare with above — consolidate |
| `feat/anomaly-detection-capability` | Create PR — new AnomalyDetector capability |
| `feat/brain-expander-circuit-breaker-regime-detection` | Compare with `feat/brain-expansion` — consolidate |
| `feat/brain-expansion` | Compare with above — close older/smaller one |
| `feat/consensus-engine-regime-detection` | Create PR |
| `feat/quant-engine-production-hardening` | Create PR |
| `feat/resilience-and-observability` | Compare with resilience-* branches — consolidate |
| `feat/resilience-and-validation` | Compare with above — consolidate |
| `feat/resilience-layer` | Compare with above two — consolidate all into one PR |

**Duplicate clusters:**
- Brain: `feat/brain-expansion` + `feat/brain-expander-circuit-breaker-regime-detection` → pick one, close other
- System logic: `cursorsystem-logic-issues-0bdb` + `cursorsystem-logic-and-config-db89` → compare and close one
- Resilience: 3 branches → one PR

---

## Repo 3: Zynthio

**Score: 90/100** _(unchanged)_
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — architecture, deploy, related repos |
| CLAUDE.md | ✅ PASS | Clean — Known Issues section says "None currently" |
| .gitignore | ✅ PASS | Correct for static site — audio binary exclusions, .vscode/ present |
| package.json | ✅ PASS | Minimal and correct — no deps, vercel deploy script |
| .env.example | ✅ PASS | RESEND_API_KEY placeholder only |
| api/waitlist.js | ✅ PASS | CORS restricted to `https://zynthio.ai`, secret from process.env |
| Music pipeline docs | ✅ PASS | TRACK_MANIFEST.md, DISTROKID_CHECKLIST.md, MUSIC_MARKETING.md, RELEASE_CALENDAR.md |
| No hardcoded secrets | ✅ PASS | Search returned 0 results |
| No .DS_Store files | ✅ PASS | Gitignored and absent (search confirmed) |
| No TODO/FIXME | ✅ PASS | Zero items |
| Branch hygiene | ⚠️ WARN | 7 non-main branches — all music-pipeline related, unchanged since 5th pass |

### Branch Inventory — Zynthio (7 non-main, unchanged since 5th pass)

| Branch | Recommendation |
|--------|----------------|
| `cursorisrc-readiness-requirement-7f98` | Include in music-pipeline PR or close |
| `feat/music-pipeline-distrokid-prep` | Review and create PR when ready |
| `feat/music-pipeline-docs` | **Merge** — updated docs, appears ready |
| `feature/music-pipeline-scaffold` | Compare with `feat/music-pipeline-docs` — close if superseded |
| `music-pipeline` | Stale — close when feat/* work merges |
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
| Next.js version ref in CLAUDE.md | ✅ (fixed this pass) | ✅ | N/A | ✅ CONSISTENT |

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
| @anthropic-ai/sdk | ❌ (consumed via coreintentai) | ^0.39.0 | ❌ |

**Recommendation:** Align coreintent TypeScript to 5.7 on next dep update pass (low risk, minor).

---

## Action Items (Priority Order)

### Critical
- [ ] **Branch cleanup — coreintent** — 47 non-main branches is unsustainable. Immediate actions:
  1. Delete the 3 confirmed-stale branches: `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`, `cursor-dependency-security-upgrade-ef32`
  2. Review and pick ONE from each of the 8 SEO branches — merge it, delete the rest
  3. Review the 2 security branches (`security/remove-runtime-fingerprint`, `security/sanitize-api-error-leakage`) — likely worth merging
  4. Consolidate marketing branches: 7 → 1 PR or delete
  5. Consolidate ai-twin cluster: 3 branches → 1 PR
  6. Consolidate i18n cluster: `feat/i18n-multilingual` + `i18n-multilingual` + `cursori18n-bug-fixes-5499` → 1 PR

### High
- [ ] **Fix XSS in `components/Terminal.tsx`** — `dangerouslySetInnerHTML` for ANSI output; verify `ansi-to-html` sanitises fully with no raw HTML injection path
- [ ] **Set a branch hygiene rule** — Before creating any AI agent branch, check whether an existing branch already addresses the same problem. The 8 duplicate SEO branches and 3 duplicate ai-twin branches both indicate the same work being run multiple times.

### Medium — coreintentai Branches
- [ ] **Open PRs for all 16 coreintentai branches** — zero PRs for 16 branches; priority: anomaly detection, consensus engine, brain expander
- [ ] **Consolidate resilience branches** — 3 resilience-* branches → one PR
- [ ] **Consolidate brain branches** — `feat/brain-expansion` + `feat/brain-expander-circuit-breaker-regime-detection` → one PR

### Medium — Zynthio
- [ ] **Merge `feat/music-pipeline-docs`** — appears ready
- [ ] **Delete `music-pipeline-setup` and `music/pipeline-setup`** — duplicate stale branches

### Low / Ongoing
- [ ] **Align TypeScript to 5.7** in coreintent (already on 5.7 in coreintentai)
- [ ] **Remove unused xterm packages** from coreintent package.json
- [ ] **Deploy VPS scripts** (coreintent, COR-20 overdue)
- [ ] **Connect API routes to live data** (coreintent — currently demo data)

---

## Change Log

### Sixth Pass — 2026-04-20 (this pass)

| Repo | File | Action |
|------|------|--------|
| coreintent | `CLAUDE.md` | Fixed stale `Next.js 14` → `Next.js 15` reference in Architecture section |
| coreintent | `HEALTH_REPORT.md` | Full re-scan — corrected branch count (47 non-main, not 28; 5th pass missed API pagination page 2); documented 18 new branches since 5th pass; downgraded score 91→85; added SEO sprawl pattern alert; confirmed 0 secrets, 0 TODO/FIXME, 0 .DS_Store across all repos |

### Fifth Pass — 2026-04-19

| Repo | File | Action |
|------|------|--------|
| coreintent | `.gitignore` | Added `.vscode/` to editor section |
| coreintentai | `.gitignore` | Added `.vscode/` to editor section |
| Zynthio | `.gitignore` | Added `.vscode/` to editor section |
| coreintent | `HEALTH_REPORT.md` | Re-scan — updated scores, updated branch tables, documented audit score 96%, music pipeline additions to Zynthio |

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
| coreintent | All 10 `app/api/*/route.ts` | Input validation hardened |
| coreintent | `next`, `eslint-config-next` | Upgraded 14→15.5.15, cleared 5 CVEs |
| Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai` |
| Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
