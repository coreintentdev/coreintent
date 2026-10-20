# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

CoreIntent is a Next.js 15 (App Router) + TypeScript agentic AI trading engine. It has 7 pages, 14+ API routes, and an AI orchestration layer. All external services (AI APIs, exchanges, databases) gracefully fall back to demo/hardcoded data when keys are absent — no external dependencies are required for local development.

### Running the app

See `README.md` Quick Start. The key commands are in `package.json`:

- `npm run dev` — starts Next.js dev server on port 3000
- `npm run build` — production build (must pass clean before pushing)
- `npm run lint` — ESLint check
- `npm start` — production server (after build)
- `npm run build:worker` — OpenNext Cloudflare Workers build
- `npm run preview` — build + preview in Workers runtime locally
- `npm run deploy` — build + deploy to Cloudflare Workers
- `npm run cf-typegen` — generate Cloudflare binding types

### Non-obvious notes

- **No database or Redis required.** `DATABASE_URL` and `REDIS_URL` appear in `.env.example` but nothing in the codebase actually connects to them. All persistence is in-memory (e.g. `/api/notes` uses an array that resets on restart).
- **AI API keys are optional.** The AI service layer (`lib/ai.ts`) returns demo responses when `ANTHROPIC_API_KEY`, `GROK_API_KEY`, or `PERPLEXITY_API_KEY` are not configured. The app is fully functional in demo mode.
- **Copy `.env.example` to `.env` before running.** The dev server reads from `.env`. The defaults are safe placeholders.
- **The audit script** (`scripts/audit.sh`) should be run after making changes per `CLAUDE.md` rules.
- **Node.js 20+** is required (`engines.node` in `package.json`).
- **Package manager is npm** (lockfile: `package-lock.json`). Do not use yarn/pnpm/bun.
- **Terminal component** uses `dangerouslySetInnerHTML` for ANSI rendering (XSS mitigated: HTML escaped first, only allowlisted ANSI codes converted to spans).
- **Cloudflare Workers deploy** uses `@opennextjs/cloudflare` adapter with `wrangler.jsonc`. The `build.command` in wrangler config runs the OpenNext build before upload.
