# Session handover — 19 April 2026 (full)

## Repo and branch

- **Remote:** `github.com/coreintentdev/coreintent`
- **Branch:** `claude/check-coreintent-builds-JTrDd` (tracking `origin`)
- **Latest commit on this branch:** `606457a` — *Honest demo APIs, 8-model status/connections, Studio timeouts and UI fixes*

```bash
git fetch origin
git checkout claude/check-coreintent-builds-JTrDd
git pull origin claude/check-coreintent-builds-JTrDd
npm install
npm run build && npm run lint && npx tsc --noEmit
```

## What this session delivered (code on branch)

1. **`lib/ai.ts`**
   - `getAiKeyStatus()` for all **8** orchestra keys (Grok, Claude, Perplexity, Gemini, Groq, DeepSeek, Mistral, OpenRouter).
   - `fetchWithTimeout` on OpenAI-compatible calls, Claude, and Gemini.
   - `raceAiResponse()` — 30s wall-clock cap per model in `compareAll` / `comparePrimary` so one slow model does not block the whole compare indefinitely.
   - Rate-limit responses tagged with `[RATE LIMIT]` when HTTP 429.

2. **`app/api/status/route.ts`**
   - Reports **8** models as `active` (real key) vs `demo` (missing/placeholder).

3. **`app/api/connections/route.ts`**
   - Same **8** models with `keyed` / `demo`, roles, and **computed** `summary` (not hard-coded totals).

4. **Honest demo markers**
   - `app/api/signals/route.ts`, `market/route.ts`, `agents/route.ts`: `mode: "demo"` + `note` (hardcoded / not live exchange).
   - `app/api/portfolio/route.ts`: `mode: "demo"` + `note` + `paperTradingLabel: "paper_trading"` for product clarity.

5. **`app/studio/page.tsx`**
   - Fixed loading copy: Compare 8 vs Compare 4 (removed broken nested `model === "all"` ternary).
   - Empty state describes all 8 models and both compare modes.
   - Client `fetch` uses `AbortController` with **120s** timeout; cleanup in `finally`.
   - `StudioErrorBoundary` wraps the page.

6. **`next-env.d.ts`**
   - Next.js 15 TypeScript reference update (build-generated pattern).

## What a cloud agent cannot do

- See your Mac Desktop, `zynthio-tools`, or registrar exports.
- SSH to your VPS or call external APIs from some sandboxes (environment-dependent).
- Fix Cursor Desktop Composer bugs (`followupId not found`, etc.) — client-side; track with Cursor support / your incident log if you keep one in-repo.

## ZynRip — two different places (do not confuse)

| Location | Script behavior |
|----------|-----------------|
| **`~/Desktop/zynthio-tools`** | Your run failed with: set **`ZYN_RIP_SRC`** to the folder of the **raw rip** (e.g. `~/Desktop/zynthio-tools/rips/2026-...`), then `bash scripts/zynrip-organize.sh`. |
| **`coreintent`** (`scripts/zynrip-organize.sh` on **this** branch) | Older **v1**-style organizer (hardcoded paths / Desktop layout). A cross-platform **v3** variant was developed on branch `cursor-zynrip-incident-ef32`; merge or copy that script if you want flags like `--desktop` / `--apply --yes` in **this** repo. |

**Rule:** Run inventory (ZynRip or MAP) **on the machine where files live**, then paste map snippets into the next agent turn.

## Verification (your Mac)

```bash
npm run build
npm run lint
npx tsc --noEmit
```

Optional: `./scripts/audit.sh` if present and executable.

## Known warnings (audit / product honesty)

- Some pages still use `status: "active"` for domains where “live site” may not be accurate — see audit truth check.
- `components/Terminal.tsx` still uses `dangerouslySetInnerHTML` for ANSI — XSS class warning until hardened.

## Related docs in repo

- `COWORK_HANDOVER.md` — April 14, 2026 Cowork / deploy / keys context (**read for deploy commands and caveats**; rotate any keys that were ever pasted in chat).
- `docs/SESSION-HANDOVER-2026-03-23.md` — older session thread.
- `HONEST_AUDIT.md` / incident docs — if present on branch, read before claiming “connected” or “live.”

## Next actions (suggested)

1. Pull this branch on your Mac and run verification commands above.
2. Set **`ZYN_RIP_SRC`** (or merge v3 ZynRip from `cursor-zynrip-incident-ef32`) so organize + MAP runs cleanly.
3. Deploy from your machine (Vercel / OpenNext+Wrangler / other) — not from sandbox.
4. Fill `.env` from `.env.example` for any model you want **live** in Studio; without keys, responses stay demo/fallback.

---

**336.** Branch `claude/check-coreintent-builds-JTrDd` includes commit `606457a` and is pushed to `origin`.
