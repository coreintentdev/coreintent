# INCIDENT REPORT — INC-008
## Claude Code CLI Crashes During Long Sessions

**Filed:** April 14, 2026
**Reporter:** Corey McIvor (@coreintentdev / corey@coreyai.ai)
**Severity:** CRITICAL
**Status:** Detected — unresolved

---

## What Happened

Claude Code (web session, claude.ai/code) crashed during an active coding session.
Session had 37 commits, 50+ tool calls, 2+ hours of continuous work.
User waited 1+ hour for service to restart.

This is NOT a one-off. This is a recurring pattern across multiple sessions over 5 months.

## Evidence

- Maccy clipboard history on Mac shows repeated crash/restart cycles
- Session ID: session_011cXefbHqvNc8mFNHRsFgzK
- Branch: claude/check-coreintent-builds-JTrDd (37 commits at time of crash)
- March 2026: Claude agent triggered 32 auto-reload charges in 24hrs (~A$400) with zero output

## Financial Impact

- A$347+ on Claude API alone
- Max subscription active
- Thousands of dollars spent across Anthropic products
- Repeated context loss forces rebuilding identical work session after session

## Root Cause (suspected)

Context compaction. When session history exceeds the context window, the compaction
process crashes instead of gracefully summarizing and continuing. Heavy tool use
(file reads, writes, builds, git operations, web searches, agent spawns) accelerates
this. The more productive the session, the more likely it crashes.

## What Should Happen

1. Graceful compaction — don't crash
2. Save state before compacting — let user resume
3. If crash is unavoidable, show an error message instead of silent death
4. Don't charge for sessions that produce zero output due to crashes

## File This Report At

1. **GitHub:** https://github.com/anthropics/claude-code/issues/new
2. **Anthropic Support:** https://support.anthropic.com
3. **Feedback:** In Claude Code CLI, type: /help → report issue

---

## SESSION HANDOVER — What Was Built

37 commits on branch `claude/check-coreintent-builds-JTrDd`:

### Code Built This Session
- **AI Studio** (`/studio`) — 8-model playground with compare mode
- **8-model AI orchestra** (`lib/ai.ts`) — Grok, Claude, Perplexity, Gemini, Groq, DeepSeek, Mistral, OpenRouter
- **Commander Terminal** — tab completion, watch, aliases, command chaining, AI chat
- **COR336 Dashboard** — 16 domains, VPS topology, ZynRip scorer, hard rules, TM portfolio
- **Cloud Run pipeline** — Dockerfile, cloudbuild.yaml, GitHub Actions deploy workflow
- **4-Way Deploy script** — rsync + git + rclone + Notion
- **CLAUDE.md** — full v3.0 state (3 VPS nodes, 12 rules, domains, trademarks)
- **9 incidents logged** — including this one

### Files Changed
- `lib/ai.ts` — 8 AI model integrations with generic OpenAI-compatible caller
- `app/studio/page.tsx` — full AI Studio UI
- `app/api/studio/route.ts` — multi-model API endpoint
- `app/page.tsx` — COR336 dashboard merge (domains, VPS, ZynRip, costs, rules)
- `components/Terminal.tsx` — Commander upgrade
- `components/SiteNav.tsx` — AI Studio link, version bump
- `CLAUDE.md` — v3.0 infrastructure documentation
- `.env.example` — all 8 AI keys + GCP + VPS config
- `Dockerfile` + `cloudbuild.yaml` + `.github/workflows/deploy-cloudrun.yml`
- `scripts/deploy-4way.sh` — 4-Way Deploy Protocol
- `app/api/incidents/route.ts` — 9 incidents, updated service monitoring

### To Resume on Another Machine
```bash
git clone https://github.com/coreintentdev/coreintent.git
cd coreintent
git checkout claude/check-coreintent-builds-JTrDd
npm install
cp .env.example .env  # Add your keys
npm run dev
```

### API Keys Available (set in .env)
- Gemini: 4 keys provided (AIzaSy... prefixed)
- Groq: Free at console.groq.com
- DeepSeek: Free at platform.deepseek.com
- Mistral: Free at console.mistral.ai (1B tokens/mo)
- OpenRouter: Free at openrouter.ai/keys

### Outstanding Tasks
1. Kill port 7681 on VPS (needs Tailscale re-auth)
2. Deploy to Cloud Run (needs `gcloud builds submit`)
3. Set extended fleet API keys in .env
4. Rotate all credentials pasted in this chat session

---

336. Signal confirmed. Nothing lost. All pushed.
