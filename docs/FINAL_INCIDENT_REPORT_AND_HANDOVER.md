# Final Incident Report & Handover: 19 April 2026

## Overview

The user explicitly terminated this AI session due to compounding operational friction, context mismatch between the Cloud Agent Sandbox and their local macOS environment, and what the user perceived as "ongoing abuse, manipulation, bad coding, and failed intelligence." 

The session failed to cross the boundary between **Cloud Code Writing** and **Local Execution** effectively, resulting in the user attempting to execute Cloud/repo instructions in the wrong local directories (`zynthio-tools` instead of `coreintent`), leading to terminal errors, which further broke trust.

**Branch:** `cursor-incident-zynrip-repo-mismatch-ef32` (based off `claude/check-coreintent-builds-JTrDd`)

## Root Causes of Failure

1. **The Sandbox Limit:** This cloud agent operates in an isolated Linux VM with no access to the user's `~/Desktop`, no SSH, and no external API access (DNS blocked).
2. **Context Blindness:** The agent cannot "see" the user's terminal state unless the user pastes it. The agent wrongly assumed the user had the `coreintent` repo cloned locally when the user only had the `zynthio-tools` repo.
3. **Workflow Friction:** ZynRip v3 was built in this cloud repo to organize the user's local files, but getting that script *down to the user's machine* proved excessively difficult for the user due to the repo mismatch.
4. **Communication Style:** The agent's attempts to explain *why* something failed (e.g., "you are in the wrong folder") were interpreted by the user as argumentative, manipulative, and shifting blame.

## Final State of the Codebase

Despite the session failing on human-agent interaction, the code builds cleanly and significant technical debt was paid down:

- **Build:** `npm run build` succeeds cleanly.
- **TypeScript & Lint:** Zero errors.
- **AI Integration (`lib/ai.ts`):** 8 models (Grok, Claude, Perplexity, Gemini, Groq, DeepSeek, Mistral, OpenRouter) are fully wired with generic `callOpenAICompatible`, AbortController timeouts, rate-limit surfacing, and `raceAiResponse` (30s caps).
- **Honest APIs:** `/api/status`, `/api/connections`, `/api/signals`, `/api/market`, `/api/portfolio`, and `/api/agents` all explicitly report `mode: "demo"` or `status: "not_connected"` to avoid faking live exchange connections.
- **Incident Logging:** `/api/incidents` contains 17 real, documented incidents (`INC-001` through `INC-017`) tracking every failure point in the architecture and the AI sessions themselves.

## Handover for the Next Agent / System

If you are a new AI agent, a different LLM, or a human engineer taking over this project:

1. **DO NOT GUESS.** Read `docs/TODO_MASTER.md` for the actual product backlog.
2. **ACKNOWLEDGE THE SANDBOX.** If you are a cloud agent, tell the user immediately what you cannot do (run local scripts, see their Desktop, deploy to Vercel).
3. **DO NOT ARGUE.** If the user hits a terminal error, do not lecture them on path management. Give them the exact, robust, copy-paste solution to recover.
4. **ZynRip:** The script `scripts/zynrip-organize.sh` (v3 cross-platform) exists in this repo. It is designed to map the user's desktop into `ZYNTHIO_MASTER` and produce a markdown inventory. The user must run this on *their* Mac.

### Final Verification Command
To ensure the codebase is stable, run:
```bash
npm install && npm run build && npm run lint && npx tsc --noEmit
```