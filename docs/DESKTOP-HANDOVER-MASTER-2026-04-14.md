# DESKTOP HANDOVER — MASTER PLAN FINISH
**Date:** 2026-04-14  
**Repo:** `coreintent`  
**Branch baseline:** `main`  
**Prepared for:** Desktop continuation to complete the master plan.

---

## 1) Current State — Verified (What is achieved right now)

### Repo + Build Health
- Git branch at handover start was clean on `main` (no uncommitted changes).
- Current audit passes with **52 PASS / 0 FAIL / 2 WARN (96%)**.
- Build, TypeScript, and ESLint pass via `./scripts/audit.sh`.

### Product Surface
- Next.js 14 + TypeScript strict app is in place.
- 6 core pages exist and are wired:
  - `/`
  - `/pricing`
  - `/stack`
  - `/privacy`
  - `/terms`
  - `/disclaimer`
- `/pricing` is already rewritten to competition model (Daily/Weekly/Monthly leagues; not Free/Pro/Enterprise).

### API Surface (Now 13 routes)
- `app/api/status/route.ts`
- `app/api/portfolio/route.ts`
- `app/api/signals/route.ts`
- `app/api/agents/route.ts`
- `app/api/market/route.ts`
- `app/api/content/route.ts`
- `app/api/incidents/route.ts`
- `app/api/autosave/route.ts`
- `app/api/research/route.ts`
- `app/api/protect/route.ts`
- `app/api/connections/route.ts`
- `app/api/notes/route.ts`
- `app/api/sync/route.ts`

### Terminal + Orchestration
- Commander terminal is implemented with command system and API-backed commands.
- Web/Desktop routing policy exists via `/api/sync`:
  - capability routing
  - `zynhandball` handoff mode
  - `zynKYC` clarification mode

### Ops Scripts Present
- VPS scripts exist:
  - `scripts/risk_monitor.ts`
  - `scripts/signal_listener.ts`
  - `scripts/gtrade_listener.ts`
- Deploy scripts exist:
  - `scripts/deploy-vps.sh`
  - `scripts/deploy-vercel.sh`
  - `scripts/deploy-all.sh`
- Desktop organization + VPS lens helpers exist:
  - `scripts/zynrip-organize.sh`
  - `scripts/vps-lens.sh`

### Honesty + Risk State (Important)
- System is still **paper trading / not live trading**.
- Exchange connections are still **planned**, not active.
- Several API routes still return demo/hardcoded-style data (audit reports 6 currently flagged).
- Known warnings still open:
  1. `dangerouslySetInnerHTML` usage in terminal rendering (XSS risk surface).
  2. Dashboard contains `"active"` status strings that trigger truth-check warning.

---

## 2) Master Plan Finish — Desktop Execution Order

This is the direct execution plan to finish the master plan without context drift.

## Phase A — Truth + Safety hardening (do first)
**Goal:** remove mismatch between UI claims and real backend state; reduce security risk.

1. Replace ambiguous `"active"` domain statuses with explicit truth labels:
   - `live_site`, `parked`, `planned`, `paper`, `demo`.
2. Remove raw `dangerouslySetInnerHTML` rendering path or harden with strict sanitizer + safe renderer boundary.
3. Re-run full audit and ensure:
   - no truth-check warnings from marketing/status language
   - no avoidable XSS warning

**Done when:**
- `./scripts/audit.sh` returns no avoidable warnings tied to mislabeling or terminal injection risk.

## Phase B — Real data migration (replace demo routes incrementally)
**Goal:** transition from demo APIs to verifiable real data adapters.

Order:
1. `status`, `market`, `signals` (highest user-visible value)
2. `portfolio`, `agents`, `incidents`
3. `autosave`, `content` (if persistence layer added)

Rules:
- Keep fallback shape-compatible responses.
- Add explicit `source: "live" | "demo"` field to each API payload.
- Never claim “live” unless health checks pass.

**Done when:**
- Each migrated route has:
  - adapter layer
  - timeout + retry policy
  - safe fallback
  - route-level integration test

## Phase C — VPS productionization
**Goal:** move script files from “exists” to “deployed + supervised + observable”.

1. Configure VPS credentials/secrets and runtime env.
2. Deploy three listeners/monitors.
3. Add process supervision (`systemd` or equivalent) + restart policy.
4. Capture logs/health snapshots into a single handover location.
5. Run `scripts/vps-lens.sh` to produce machine-verified VPS state output.

**Done when:**
- risk monitor, signal listener, and gTrade listener are all running under supervision.
- restart survival tested.
- latest state report committed to docs/handover artifacts.

## Phase D — Core platform foundations (required before “real” mode)
**Goal:** close structural gaps that block reliable live workflows.

1. Add authentication (human + bot model).
2. Add persistence layer (DB + migrations + typed data access).
3. Add audit/event log for signal decisions and risk actions.
4. Add RBAC for sensitive commands and deployment actions.

**Done when:**
- login/session works
- data survives restart
- critical actions are attributable

## Phase E — Master feature tracks
**Goal:** finish planned signature components in deployable slices.

1. Competitions engine (`/api/competitions`) — daily/weekly/monthly lifecycle.
2. F18 expanded security route (`/api/security`) — beyond current `/api/protect`.
3. SongPal integration track (music workflow + challenge hooks).
4. Mansion track (room/mission shell with progressive unlocks).
5. Legal + health support routes (`/api/legal`, `/api/health`) with clear disclaimers and jurisdiction controls.

**Done when:**
- each track has vertical slice UI + API + storage + audit + tests.

## Phase F — Launch gates (must pass together)
**Goal:** prevent fake-green launch.

Required gates:
1. Build + type + lint green.
2. Audit script green with no critical warning debt.
3. End-to-end paper trading flow verified.
4. Incident recovery runbook tested.
5. Deployment + rollback tested from clean machine.

**Only then** evaluate transition from paper mode toward staged live connectivity.

---

## 3) Desktop Command Runbook (copy/paste sequence)

From repo root:

1. Baseline
   - `git checkout main`
   - `git pull origin main`
   - `npm install`
   - `./scripts/audit.sh`

2. Start local app
   - `npm run dev`

3. Truth/safety fixes first (Phase A), then verify
   - `npm run lint`
   - `npm run build`
   - `./scripts/audit.sh`

4. VPS state validation (when credentials/session are available)
   - `bash scripts/vps-lens.sh`

5. Before every push
   - `npm run build`
   - `./scripts/audit.sh`

---

## 4) Non-Negotiables for Desktop Session

- Never mark unverified integrations as connected/active.
- Keep NZ-first legal/business rule.
- Label demo data honestly in UI and API payloads.
- Do not jump to live trading mode before Phases A–F gates.
- Keep handover files updated at end of each desktop block.

---

## 5) Immediate Next 3 Tasks (start here)

1. Fix truth-check warning in `app/page.tsx` status labels.
2. Harden/replace terminal HTML rendering path in `components/Terminal.tsx`.
3. Pick one API route (`/api/status`) and migrate it to explicit live/demo adapter with tests.

If these 3 land cleanly, the master plan moves from “foundation complete” to “execution underway”.
