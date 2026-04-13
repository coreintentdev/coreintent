# Cloud Agent Starter Skill — Run & Test CoreIntent

Use this first when you start a fresh Cloud session in this repo.

## 0) First-minute checks (session + login + repo health)

Run these immediately:

1. `pwd` (must be `/workspace`)
2. `git status -sb` (confirm branch + dirty state)
3. `gh auth status` (confirm GitHub CLI session is available for PR/CI inspection)
4. `node -v && npm -v` (confirm runtime tools)
5. `ls .env .env.example` (confirm env files exist)

If `.env` is missing:

- `cp .env.example .env`

Login reality check:

- There is currently no in-app user auth flow to complete for local testing.
- "Login" for runtime integrations is done by providing API keys in `.env`.

## 1) Fast setup and app startup

Install and launch:

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

Expected behavior:

- Next.js boots without compile errors.
- Home page renders with tabs (`Terminal`, `Dashboard`, `Agents`, `ZynRip`, `Docs`).

## 2) Feature flags / mock-mode controls you actually have

This codebase does not use a dedicated feature-flag system yet. Runtime behavior is controlled by environment keys and demo placeholders.

Use these practical toggles in `.env`:

- `ANTHROPIC_API_KEY`
- `GROK_API_KEY`
- `PERPLEXITY_API_KEY`
- `NEXT_PUBLIC_APP_URL` (for local scripts calling APIs)
- `AI_MIN_CONFIDENCE`, `CIRCUIT_BREAKER_PCT`, `GTRADE_CHAIN` (script behavior)

### Force demo/mock mode (safe default for cloud work)

Set placeholder values (or leave unset):

- `ANTHROPIC_API_KEY=sk-ant-xxx`
- `GROK_API_KEY=xai-xxx`
- `PERPLEXITY_API_KEY=pplx-xxx`

In this state, `lib/ai.ts` returns `[DEMO]` responses and `live: false` instead of real external calls.

### Verify active vs demo mode quickly

- `curl -s http://localhost:3000/api/status`
- Check `ai.claude`, `ai.grok`, `ai.perplexity` fields (`demo` vs `active`)

## 3) Codebase-area workflows (what to run and how to test)

### A) UI + pages (`app/*.tsx`, `components/*.tsx`)

When changing visual content, layout, or interaction:

1. Keep `npm run dev` running.
2. Load:
   - `/`
   - `/pricing`
   - `/stack`
   - `/privacy`
   - `/terms`
   - `/disclaimer`
3. Validate:
   - No runtime error overlay
   - Navigation/footer render
   - Tab switching on `/` still works
4. Run checks:
   - `npm run lint`
   - `npm run build`

### B) API routes (`app/api/**/route.ts`)

For API changes, use direct endpoint checks while dev server is running:

Smoke checks:

- `curl -s http://localhost:3000/api/status`
- `curl -s http://localhost:3000/api/portfolio`
- `curl -s http://localhost:3000/api/signals`
- `curl -s http://localhost:3000/api/agents`
- `curl -s http://localhost:3000/api/market`
- `curl -s http://localhost:3000/api/content`
- `curl -s http://localhost:3000/api/incidents`
- `curl -s http://localhost:3000/api/research`
- `curl -s http://localhost:3000/api/protect`
- `curl -s http://localhost:3000/api/connections`
- `curl -s http://localhost:3000/api/notes`
- `curl -s http://localhost:3000/api/autosave`

POST examples:

- `curl -s -X POST http://localhost:3000/api/content -H 'Content-Type: application/json' -d '{"type":"tweet","topic":"BTC momentum","count":2,"tone":"technical"}'`
- `curl -s -X POST http://localhost:3000/api/research -H 'Content-Type: application/json' -d '{"topic":"CoreIntent launch checklist","task":"analysis"}'`

Validate:

- JSON is returned
- expected fields are present
- demo/live labels are honest

### C) AI service layer (`lib/ai.ts`)

Goal: verify fallback path and orchestration routing.

1. Put placeholder keys in `.env` (demo mode).
2. Call route that exercises AI layer:
   - `curl -s http://localhost:3000/api/research`
3. Confirm response includes:
   - `allLive: false`
   - per-model demo/error-safe outputs
4. If using real keys, confirm fields transition to `live: true` without breaking shape.

### D) Ops scripts (`scripts/*.ts`, `scripts/*.sh`)

#### Local script dry run patterns

Run TypeScript scripts against local server:

- `NEXT_PUBLIC_APP_URL=http://localhost:3000 npx tsx scripts/risk_monitor.ts`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000 npx tsx scripts/signal_listener.ts`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000 npx tsx scripts/gtrade_listener.ts`

Use short observation windows (start, verify logs, then stop with Ctrl+C).

#### Shell script checks

- `bash ./scripts/audit.sh` (required repo-level audit)
- Optional syntax pass:
  - `bash -n ./scripts/deploy-vercel.sh`
  - `bash -n ./scripts/deploy-vps.sh`
  - `bash -n ./scripts/deploy-all.sh`
  - `bash -n ./scripts/vps-lens.sh`

## 4) Standard Cloud testing sequence before commit

Run this minimal order unless task scope is tiny/docs-only:

1. `npm run lint`
2. `npm run build`
3. `bash ./scripts/audit.sh`
4. targeted `curl` checks for touched API routes
5. manual page pass in browser for touched UI

If `build` or `audit` fails, do not push as complete.

## 5) Common Cloud pitfalls + quick fixes

- Port already in use on 3000:
  - start with `npm run dev -- --port 3001` and update curl URLs.
- API script hitting wrong host:
  - export `NEXT_PUBLIC_APP_URL=http://localhost:3000` before script run.
- Accidentally claiming real integrations:
  - verify keys + endpoint outputs first; otherwise label as demo/planned.
- Missing dependencies:
  - rerun `npm install` at repo root.

## 6) How to update this skill (keep it alive)

When you discover a better runbook step:

1. Add it under the matching area (`UI`, `API`, `AI layer`, `scripts`).
2. Include one concrete command and one expected output/validation point.
3. Prefer replacing vague advice with executable checks.
4. Keep this file minimal: only high-signal steps a new Cloud agent needs in first 10 minutes.
5. In PR description, note: "Updated cloud starter skill with new workflow: <what changed>".
