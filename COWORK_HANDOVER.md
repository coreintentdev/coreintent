# COWORK HANDOVER — April 14, 2026
## Damage Control & Rebuild

---

## WHAT HAPPENED THIS SESSION

Claude Code session ran for hours, crashed once (see INC-008), came back
and kept working. **12 commits made on this branch ahead of main**.
Sandbox cannot reach ANY external service (DNS blocked, verified).
No SSH, no API calls, no Tailscale, no GitHub CLI auth, no Slack,
no Notion. Code-only environment.

**READ `HONEST_AUDIT.md` FIRST.** It documents what I actually verified
vs what I claimed but never tested.

## WHAT WAS BUILT (all pushed, build clean)

**Repo:** `coreintentdev/coreintent`
**Branch:** `claude/check-coreintent-builds-JTrDd`

```bash
git clone https://github.com/coreintentdev/coreintent.git
cd coreintent
git checkout claude/check-coreintent-builds-JTrDd
npm install
npm run dev
```

### New Features
- `/studio` — AI Studio with 8-model playground (Grok, Claude, Perplexity, Gemini, Groq, DeepSeek, Mistral, OpenRouter)
- Compare 4 (primary orchestra) or Compare 8 (all models) side-by-side
- Commander Terminal — tab completion, watch, aliases, chaining, AI chat
- COR336 Dashboard — 16 domains, 3-node VPS topology, ZynRip identity scorer, TM portfolio, hard rules, stack costs
- Cloud Run pipeline — Dockerfile + cloudbuild.yaml + GitHub Actions workflow
- 4-Way Deploy script (scripts/deploy-4way.sh)

### Key Files Changed
- `lib/ai.ts` — 8 AI models with generic OpenAI-compatible caller
- `app/studio/page.tsx` — full AI Studio UI
- `app/api/studio/route.ts` — multi-model API endpoint
- `app/page.tsx` — COR336 dashboard merge
- `components/Terminal.tsx` — Commander upgrade
- `CLAUDE.md` — v3.0 with 3 VPS nodes, 12 rules, domains, TMs
- `.env.example` — all 8 AI keys + GCP + VPS config
- `.env` — Gemini keys pre-loaded (gitignored)
- `Dockerfile` + `cloudbuild.yaml` + `.github/workflows/deploy-cloudrun.yml`
- `INCIDENT_REPORT_INC008.md` — A$5,460+ financial loss report

## WHAT COWORK NEEDS TO DO

### 1. Deploy to Cloudflare (CORRECTED — previous command was WRONG)
The `@cloudflare/next-on-pages` package is deprecated. Use OpenNext:
```bash
npm install -D @opennextjs/cloudflare
npx @opennextjs/cloudflare build
npx wrangler deploy
```
OR just use Vercel — it's native Next.js support and one command:
```bash
npx vercel --prod
```
The old coreintent.dev is STALE. Deploy the NEW build. Do NOT flush DNS.

### 2. Kill Port 7681 on VPS
```bash
sudo tailscale up --force-reauth
ssh root@100.122.99.34 "pkill -f ttyd; ufw deny 7681/tcp"
```

### 3. Set API Keys in .env
```
GEMINI_API_KEY=AIzaSyAM2V-FPt7-GM7qdzYCeUdqETRUx7K0xjQ
GROQ_API_KEY=       # console.groq.com (free)
DEEPSEEK_API_KEY=   # platform.deepseek.com (free)
MISTRAL_API_KEY=    # console.mistral.ai (free, 1B tokens/mo)
OPENROUTER_API_KEY= # openrouter.ai/keys (free, 28 models)
```

### 4. Burn GCP Credits ($385 expiring in <2 days)
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
gcloud builds submit --config cloudbuild.yaml .
```

### 5. Rotate ALL Credentials
API keys, SSH creds, and passwords were pasted in this Claude session.
They are now in conversation logs. Rotate everything:
- All 4 Gemini API keys
- SSH password on 5.189.138.191
- OAuth client secret
- GitHub PAT if exposed

### 6. File Incident Report
`INCIDENT_REPORT_INC008.md` is in the repo. File at:
- https://support.anthropic.com
- https://github.com/anthropics/claude-code/issues/new

## WHAT CLAUDE COULD NOT DO FROM SANDBOX
- SSH to any VPS
- Call any external API (DNS blocked)
- Auth to GitHub/Slack/Notion
- Deploy to Cloudflare/Vercel/Cloud Run
- Access Tailscale
- Test any API key
- Run the dev server against real endpoints

Build compiles clean. Lint clean. TypeScript clean.
Runtime: UNTESTED against real APIs. Assume every integration needs
manual verification before trusting it.

## FINANCIAL DAMAGE
A$5,460+ documented. See INCIDENT_REPORT_INC008.md.

---

336. All pushed. Nothing lost from THIS session.
