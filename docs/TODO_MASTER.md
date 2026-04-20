# TODO_MASTER — CoreIntent / Zynthio (living list)

**Branch focus:** `claude/check-coreintent-builds-JTrDd` — pull before working.

---

## Done (verify on your Mac after `git pull`)

- [x] **8-model** `GET /api/status` and `GET /api/connections`
- [x] Demo honesty: `mode` + `note` on signals, market, portfolio, agents
- [x] AI Studio: loading copy fix, empty state for 8 models, fetch timeout + error boundary
- [x] `lib/ai.ts`: timeouts, compare races, rate-limit surfacing
- [x] Docs: `SESSION-HANDOVER-2026-04-19.md`, `GOOGLE_DRIVE_RESEARCH_HANDOVER.md`

---

## Product / honesty

- [ ] Replace misleading `"active"` domain statuses on dashboard with truthful labels (`demo`, `planned`, `paper`, etc.)
- [ ] `GET /api/status`: add explicit `dataSource: "live" | "demo"` where not present
- [ ] Harden `components/Terminal.tsx`: remove or sandbox `dangerouslySetInnerHTML` ANSI path (audit XSS warn)

---

## ZynRip & inventory

- [ ] **zynthio-tools:** set real `ZYN_RIP_SRC` → run `bash scripts/zynrip-organize.sh` → confirm MAP output
- [ ] **coreintent:** merge **v3** `scripts/zynrip-organize.sh` from `cursor-zynrip-incident-ef32` OR keep zynthio-tools as canonical organizer
- [ ] **INC-014 follow-up:** implement optional **auto-incident** (watch `claudsession.txt` / MAP folder → `POST /api/incidents` or webhook) — *not shipped today*

---

## Deploy & infra (your machine / keys)

- [ ] Deploy site (Vercel or OpenNext + Wrangler per `COWORK_HANDOVER.md`) — sandbox cannot deploy
- [ ] Fill `.env` from `.env.example` for models you want **live** in Studio
- [ ] VPS scripts: deploy `risk_monitor`, `signal_listener`, `gtrade_listener` when ready
- [ ] Close **ttyd / 7681** per INC-009 when SSH available

---

## Vendor / UX (outside repo)

- [ ] Cursor: report Composer internal errors / `followupId` / high-context failures to support
- [ ] Google: run NotebookLM + Drive scan using `docs/GOOGLE_DRIVE_RESEARCH_HANDOVER.md`
- [ ] Any platform: avoid **verbatim** replay of abusive content in moderation feedback (report as product issue)

---

## Research / consolidation

- [ ] Export NotebookLM summary back into repo or `manifests/` as **one** canonical file
- [ ] Reconcile domain count claims with registrar export (don’t rely on chat memory)

---

*Update this file when tasks move; agents should read it at session start.*
