# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

CoreIntent is a Next.js 14 (App Router) + TypeScript agentic AI trading engine. It has 6 pages, 12 API routes, and an AI orchestration layer. All external services (AI APIs, exchanges, databases) gracefully fall back to demo/hardcoded data when keys are absent — no external dependencies are required for local development.

### Running the app

See `README.md` Quick Start. The key commands are in `package.json`:

- `npm run dev` — starts Next.js dev server on port 3000
- `npm run build` — production build (must pass clean before pushing)
- `npm run lint` — ESLint check
- `npm start` — production server (after build)

### Non-obvious notes

- **No database or Redis required.** `DATABASE_URL` and `REDIS_URL` appear in `.env.example` but nothing in the codebase actually connects to them. All persistence is in-memory (e.g. `/api/notes` uses an array that resets on restart).
- **AI API keys are optional.** The AI service layer (`lib/ai.ts`) returns demo responses when `ANTHROPIC_API_KEY`, `GROK_API_KEY`, or `PERPLEXITY_API_KEY` are not configured. The app is fully functional in demo mode.
- **Copy `.env.example` to `.env` before running.** The dev server reads from `.env`. The defaults are safe placeholders.
- **All 12 API routes return hardcoded/demo data** unless real API keys are provided. This is by design per `CLAUDE.md`.
- **The audit script** (`scripts/audit.sh`) should be run after making changes per `CLAUDE.md` rules.
- **Node.js 18.17+** is required (Next.js 14 minimum). The project targets `@types/node ^20.14.0`.
- **Package manager is npm** (lockfile: `package-lock.json`). Do not use yarn/pnpm/bun.
- **Terminal component** uses `dangerouslySetInnerHTML` for ANSI rendering — known XSS concern noted in `CLAUDE.md`.
