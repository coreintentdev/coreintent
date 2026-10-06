# CoreIntent — Copilot Instructions

## Owner

Corey McIvor (@coreintentdev / @coreintentai) — corey@coreyai.ai
Based in New Zealand. Never register anything in Australia.

## What this repo is

- Agentic AI trading engine in **paper trading mode**.
- Competition-based platform (daily/weekly/monthly leagues, not subscriptions).
- Multi-AI orchestration layer: Grok (fast signals), Claude (deep analysis), Perplexity (research).
- Parent brand: [Zynthio.ai](https://zynthio.ai).

## What this repo is NOT

- Not live trading.
- Not connected to exchanges.
- API routes return demo data until keys are configured.
- Agents are code-ready, not running.

## Read before writing

1. `CLAUDE.md` — session rules and project context.
2. `ops/guard/README.md` — multi-perspective reasoning engine and safety policy.
3. `ops/guard/PERSPECTIVE_ENGINE.md` — how layers 1–7 fit together.
4. Relevant `app/api/*` route before changing it.

## Hard rules

- **NEVER** say something is connected or active unless you verified it.
- **NEVER** fabricate family data.
- **NEVER** register anything in Australia.
- **NEVER** commit secrets or API keys.
- Label demo/fake data honestly; do not hide behind green dots.
- Build must pass clean before pushing.
- Run `./scripts/audit.sh` after changes that touch routes, scripts, or policy.
- Destructive operations require explicit operator disposition; default is blocked.

## Architecture

- Next.js 15 App Router + TypeScript strict mode.
- 7 pages under `app/`: `/`, `/demo`, `/pricing`, `/stack`, `/privacy`, `/terms`, `/disclaimer`.
- 14 API routes under `app/api/`.
- AI service layer: `lib/ai.ts` (Grok, Claude, Perplexity with graceful fallback).
- Scripts: `scripts/audit.sh`, `scripts/deploy-vps.sh`, `scripts/vps-lens.sh`.
- Guard layer: `ops/guard/` — multi-perspective reasoning, consequence scoring, perspective mesh.

## Guard layer quick reference

| Script | Use |
|--------|-----|
| `ops/guard/perspective-engine.sh` | Run a task through Layers 1–4 |
| `ops/guard/consequence.sh` | Record outcomes and score role weights |
| `ops/guard/mesh.sh` | Compare multiple models on the same task |
| `ops/guard/jev-validator.sh` | Validate a JEV JSON against `jev-schema.yaml` |

## Evidence before execution

For any operational action, produce or require:

1. A command that can be run to verify state.
2. A log, checksum, or HTTP/SSH check proving the result.
3. A JEV output (`judgment`, `evidence`, `verdict`) when the guard layer is invoked.

## Domain & deploy context

- VDS (zynthio-vds-7372): mesh `100.64.0.2`, public `5.189.143.170`.
- Fallback: vmi3205024 (`161.97.89.49`).
- Ops center: `http://100.64.0.2:8424`.
- Fleet manual skill: `zynthio-fleet-ops`.
- Key pool: `/root/zynthio/keys/keyring.py` — never hardcode keys.

## When asked to build something

1. Check `ops/guard/` for the reasoning pattern.
2. Prefer extending `roles.yaml` over editing shell code.
3. Keep secrets in env vars; never commit them.
4. Add/update tests or audit checks where applicable.
5. Update this file if a new invariant is introduced.

## Commit style

- Focus on "why", not "what".
- Example: `feat(guard): add consequence scoring and mesh comparison`.
- Do not commit if build or audit fails.
