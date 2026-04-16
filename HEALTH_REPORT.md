# Org Git Health Report

**Generated:** 2026-04-16 (second pass — same day)
**Scope:** coreintentdev org — 3 repos
**Owner:** Corey McIvor / Zynthio.ai / NZ
**Scanner:** Claude Code (claude-sonnet-4-6)

---

## Summary

| Repo | Score | Status |
|------|-------|--------|
| coreintent | 90/100 | Active — Next.js 15, 0 vulns, 96% audit |
| coreintentai | 93/100 | Active — full AI layer live, 45 tests |
| Zynthio | 84/100 | Live — all quick wins applied |
| **Org avg** | **89/100** | Healthy. Active development. |

---

## Repo 1: coreintent

**Score: 90/100**
**URL:** https://github.com/coreintentdev/coreintent
**Tech:** Next.js 15 / TypeScript / Node 20 / Vercel + Cloud Run

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Comprehensive — stack, routes, philosophy, quick start |
| CLAUDE.md | ✅ PASS | Excellent — architecture, rules, known issues, VPS context |
| .gitignore | ✅ PASS | Comprehensive — .DS_Store, .vercel, editor files, Next.js outputs |
| package.json | ✅ PASS | Next.js 15.5.15, React 18.3, TS 5.5, lean deps, `node>=20` |
| Dockerfile | ✅ PASS | Multi-stage node:20-alpine for Cloud Run |
| .env.example | ✅ PASS | Comprehensive placeholder config — no real secrets |
| No hardcoded secrets | ✅ PASS | All values are placeholders (sk-ant-xxx, xai-xxx, etc.) |
| No TODO/FIXME | ✅ PASS | Zero items across entire codebase |
| npm audit | ✅ PASS | 0 vulnerabilities — Next.js 14→15 upgrade cleared all CVEs |
| API route hardening | ✅ PASS | Input validation on all 10 routes (max lengths, type checks) |
| Build quality | ✅ PASS | 52/54 PASS (96%), lint clean, TSC clean |
| Branch hygiene | ⚠️ WARN | 13 non-main branches — see table below |

### Branches (13 non-main)

| Branch | Last Commit | PR | Recommendation |
|--------|------------|-----|----------------|
| `seo/comprehensive-improvements` | Apr 16 | #7 draft | Review + merge |
| `seo/structured-data-and-meta-improvements` | Apr 16 | None | Duplicate SEO branch — close |
| `marketing/enhance-copy-and-og-images` | Apr 16 | None | Review — merged to main? Check overlap |
| `cursorlayout-metadata-cleanup-a68a` | Apr 16 | None | Review and merge or close |
| `cursornotification-sound-responses-fbd1` | Apr 16 | #10 | Check bugbot feedback addressed |
| `cursorh1-and-schema-issues-8649` | Apr 16 | None | Review — merge or close |
| `cursor-dependency-security-upgrade-ef32` | Apr 15 | #6 draft | **MERGED TO MAIN** — close this branch |
| `claude/check-coreintent-builds-JTrDd` | Apr 14 | None | Incident review branch — delete |
| `feat/i18n-multilingual` | Apr 14 | None | Feature — review or close |
| `feat/ai-twin-interactive-widget` | Apr 16 | None | Active feature — leave open |
| `cursor/update-outdated-docs-cc84` | Apr 13 | #2 draft | Large feature — review architecture first |
| `cursor/dev-environment-setup-cc84` | Apr 13 | #1 draft | AGENTS.md docs — merge or close |
| `build-monitor/security-audit-fix` | Apr 16 | None | Build monitor pass — delete after verifying |

### Known Code Issues (from CLAUDE.md — still open)

- **XSS risk** — `components/Terminal.tsx` uses `dangerouslySetInnerHTML` for ANSI rendering. Replace with a proper ANSI parser library (e.g. `ansi-to-html`).
- **Unused packages** — `xterm` packages in `package.json` declared but not used. Remove to reduce install footprint.
- **All 10 API routes return hardcoded demo data** — no live backend connections yet. Label clearly in UI.
- **No auth / no database** — intentional for now, required before any real user data is stored.
- **VPS scripts never deployed** — COR-20, overdue per CLAUDE.md.

---

## Repo 2: coreintentai

**Score: 93/100**
**URL:** https://github.com/coreintentdev/coreintentai
**Tech:** TypeScript / Node 20 / Vitest / npm package (`@coreintent/ai`)

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ PASS | Excellent — ASCII architecture diagram, usage examples, multi-model table |
| CLAUDE.md | ✅ PASS | Detailed — intent routing, fallback chains, commands, patterns |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | `engines: node>=20`, anthropic-ai/sdk, openai, zod, vitest |
| .env.example | ✅ PASS | Clear placeholders for all 3 model providers |
| CAPABILITIES.md | ✅ PASS | Full capabilities manifest present |
| No hardcoded secrets | ✅ PASS | All placeholder values |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Tests | ✅ PASS | 45 tests in main; branches extend coverage further |
| Branch hygiene | ⚠️ WARN | 6 non-main branches |

### Branches (6 non-main)

| Branch | Last Commit | PR | Recommendation |
|--------|------------|-----|----------------|
| `cursorconsensus-agreement-accuracy-cf98` | Apr 16 | None | **Create PR** — consensus bugfix, no PR yet |
| `cursororchestrator-caching-and-fallback-41dd` | Apr 16 | None | Review — create PR or merge |
| `cursorprompt-telemetry-circuit-logic-b000` | Apr 16 | None | Review — create PR or merge |
| `feat/anomaly-detection-capability` | Apr 16 | #1 draft | Ready to merge — review PR #1 |
| `feat/brain-expansion` | Apr 16 | None | Review scope — create PR |
| `feat/resilience-layer` | Apr 16 | None | Review scope — create PR |

### Notes

This is the most structurally clean repo in the org. Fully typed, tested, and documented. Six active feature/fix branches all committed today — this repo is moving fast. Primary gap: no PRs exist for most branches. Recommend opening PRs to maintain visibility.

---

## Repo 3: Zynthio

**Score: 84/100** (was 78/100 before this scan's fixes)
**URL:** https://github.com/coreintentdev/Zynthio
**Live:** https://zynthio.ai
**Tech:** Static HTML + Vercel Serverless Functions

### Checks

| Check | Result | Notes |
|-------|--------|-------|
| README.md | ✅ FIXED | Cross-reference for coreintentai was wrong ("coreintent.dev marketing site") — corrected to "AI intelligence layer" this scan |
| CLAUDE.md | ✅ PASS | Good — env vars, architecture, known issues |
| .gitignore | ✅ PASS | Comprehensive |
| package.json | ✅ PASS | Description + deploy script (fixed prior scan) |
| .env.example | ✅ FIXED | Added this scan — RESEND_API_KEY placeholder |
| No hardcoded secrets | ✅ PASS | RESEND_API_KEY from `process.env` — confirmed |
| No TODO/FIXME | ✅ PASS | Zero items found |
| Expired launch date | ✅ FIXED | "JAN 17" removed from index.html and waitlist email (prior scan) |
| CORS | ✅ FIXED | Restricted from `*` wildcard to `https://zynthio.ai` (prior scan) |
| Branch hygiene | ⚠️ WARN | 4 non-main branches |

### Branches (4 non-main)

| Branch | Last Commit | PR | Recommendation |
|--------|------------|-----|----------------|
| `feat/music-pipeline-docs` | Apr 16 | #2 draft | Merge — updated docs, clean |
| `cursorisrc-readiness-requirement-7f98` | Apr 16 | None | Addresses PR #2 feedback — include in that PR or close |
| `feature/music-pipeline-scaffold` | Apr 16 | None | Check if superseded by `feat/music-pipeline-docs` |
| `music-pipeline-setup` | Apr 16 | #1 draft | Close — superseded by PR #2 |

---

## Cross-Repo Consistency

| Check | coreintent | coreintentai | Zynthio | Consistent? |
|-------|-----------|--------------|---------|-------------|
| README.md | ✅ | ✅ | ✅ | ✅ YES |
| CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| .gitignore | ✅ | ✅ | ✅ | ✅ YES |
| .env.example | ✅ | ✅ | ✅ Fixed | ✅ YES |
| No secrets in code | ✅ | ✅ | ✅ | ✅ YES |
| No TODO/FIXME | ✅ | ✅ | ✅ | ✅ YES |
| License (MIT) | ✅ | ✅ | ✅ | ✅ YES |
| Node >=20 | ✅ | ✅ | N/A (no Node app) | ✅ YES |
| NZ-first in CLAUDE.md | ✅ | ✅ | ✅ | ✅ YES |
| Cross-repo links correct | ✅ | ✅ | ✅ Fixed | ✅ YES |
| Active today (Apr 16) | ✅ | ✅ | ✅ | ✅ YES |

### Observations

- **Stack divergence is intentional and correct.** coreintent = Next.js engine; coreintentai = TypeScript AI library; Zynthio = static landing. Each is right-sized for its role.
- **All repos clean of secrets.** Zero API keys, tokens, or credentials found in any codebase across all three repos.
- **All repos clean of TODO/FIXME.** Zero items across all 3 repos.
- **Org is live and actively moving.** All 3 repos had commits on Apr 16 (today). coreintentai was the heaviest day — full AI layer built and committed.
- **Cross-repo documentation is now consistent.** After the README fix to Zynthio, all three repos correctly describe each other.

---

## Action Items (Priority Order)

### High
- [ ] **Create PRs for coreintentai branches** — `cursorconsensus-agreement-accuracy-cf98`, `cursororchestrator-caching-and-fallback-41dd`, `cursorprompt-telemetry-circuit-logic-b000`, `feat/brain-expansion`, `feat/resilience-layer` all have no PR. The consensus bugfix in particular (prevents inflated confidence when only one model responds) is trading-critical.
- [ ] **Merge PR #1** (coreintentai) — AnomalyDetector capability. Review and merge.
- [ ] **Fix XSS in Terminal.tsx** (coreintent) — replace `dangerouslySetInnerHTML` with a proper ANSI renderer.

### Medium
- [ ] **Remove unused xterm packages** (coreintent) — declared in package.json but never used.
- [ ] **Prune stale branches** (coreintent) — `cursor-dependency-security-upgrade-ef32` (already merged to main), `build-monitor/security-audit-fix`, `claude/check-coreintent-builds-JTrDd`.
- [ ] **Merge PR #2 / close PR #1** (Zynthio) — Music pipeline docs. PR #1 superseded, PR #2 is clean.
- [ ] **Review and merge or close** (coreintent): `seo/comprehensive-improvements` (#7), `cursor/dev-environment-setup-cc84` (#1).
- [ ] **Review i18n feature branch** (coreintent) — `feat/i18n-multilingual` has no PR, unclear status.

### Low / Ongoing
- [ ] **Deploy VPS scripts** (coreintent) — COR-20, overdue per CLAUDE.md.
- [ ] **Connect API routes to live data** (coreintent) — all 10 routes still return hardcoded demo data.
- [ ] **Add auth + persistence layer** (coreintent) — required before any real user data.

---

## Files Changed This Scan

| Repo | File | Action |
|------|------|--------|
| Zynthio | `README.md` | Fixed coreintentai cross-reference (was "coreintent.dev marketing site", now "AI intelligence layer") |
| Zynthio | `.env.example` | Added — RESEND_API_KEY placeholder |
| coreintent | `HEALTH_REPORT.md` | Updated (this file) |

## Files Changed Prior Scan (confirmed applied)

| Repo | File | Action |
|------|------|--------|
| coreintent | `package.json` | Added `engines: { node: >=20.0.0 }` |
| coreintent | All 10 `app/api/*/route.ts` | Input validation hardened |
| coreintent | `lib/ai.ts`, `lib/api.ts` | Production-grade prompt and utility hardening |
| coreintent | `next`, `eslint-config-next` | Upgraded 14→15.5.15, cleared 5 CVEs, 0 npm audit vulns |
| Zynthio | `public/index.html` | Removed expired "OPEN SOURCE LAUNCH: JAN 17" |
| Zynthio | `api/waitlist.js` | Restricted CORS to `https://zynthio.ai`; removed expired date from email |
| Zynthio | `package.json` | Added description + deploy script |

---

*Report generated by Claude Code org health scanner. Owner: Corey McIvor / Zynthio.ai / NZ.*
