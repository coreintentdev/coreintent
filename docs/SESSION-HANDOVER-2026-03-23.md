# SESSION HANDOVER — March 23, 2026
## Full Thread Summary for Stack Review

**Session**: claude/check-coreintent-builds-JTrDd
**Owner**: Corey McIvor (@coreintentdev)
**Status**: 11 commits, 32+ files, build passes clean

---

## WHAT WAS BUILT THIS SESSION

### Infrastructure (from zero)
- Next.js 14 app with TypeScript, App Router
- package.json, tsconfig.json, next.config.js, .eslintrc.json
- GitHub Actions CI (build + typecheck)
- Production build: PASSES (16 routes, all clean)

### Pages (3)
- `/` — Terminal + Dashboard + Agents + Docs (4 tabs)
- `/pricing` — Free/Pro/Enterprise (NEEDS REWRITE to competition model)
- `/stack` — Full API orchestra with cost breakdown

### API Routes (12)
- `/api/status` — Engine health, exchanges, circuit breakers
- `/api/portfolio` — Holdings, P&L
- `/api/signals` — Trading signals with confidence scores
- `/api/agents` — AI agent fleet status
- `/api/market` — Market data, fear/greed index
- `/api/content` — Bulk content: 6s videos, tweets, threads, LinkedIn
- `/api/incidents` — Service monitoring, auto-updates (OpenClaw tracked)
- `/api/autosave` — On-the-fly persistence, outsource cost map
- `/api/research` — REAL: All 3 AIs research Corey's digital identity
- `/api/protect` — REAL: F18 security, impersonation scanning, brand monitoring

### Real AI Integration (lib/ai.ts)
- Grok (x.ai) — real API calls, falls back to demo without key
- Claude (Anthropic) — real API calls, falls back to demo without key
- Perplexity — real API calls, falls back to demo without key
- Orchestrator routes tasks to best AI for the job

### VPS Scripts (COR-20 — FINALLY CREATED)
- `scripts/risk_monitor.ts` — Circuit breaker at 0.8%, calls Claude for analysis
- `scripts/signal_listener.ts` — Grok validates signals, Claude double-checks >0.85
- `scripts/gtrade_listener.ts` — DeFi scanner on Polygon/Arbitrum

### Web Terminal
- ASCII CoreIntent banner
- Commands: status, portfolio, market, agents, config, logs, stack, scan, save, help, version, clear
- Command history with arrow keys
- ANSI color rendering

---

## CRITICAL DECISIONS MADE THIS SESSION

### 1. PRICING MODEL — NOT FREE & PRO
- **KILL the old Free/Pro/Enterprise model**
- New model: Register → Learn → Earn → Share → Make Songs
- Daily / Weekly / Monthly competition layers
- No bottlenecks, no blocks
- Password only for retention
- Free costs fuck all to serve
- Revenue from people who CHOOSE to compete at higher levels
- **PRICING PAGE NEEDS REWRITE** to reflect this

### 2. SONGPAL
- Music creation layer of the stack
- Corey's original songs are the first tracks
- Everyone creates — humans and bots
- Competition-based: daily song challenges
- **NOT Suno AI-generated** — Corey makes originals his own way
- Need to find/document Corey's actual music (research agent dispatched)

### 3. THE MANSION
- Virtual world / UI metaphor
- Each room = part of the stack
- Story missions = learning real skills
- Achievements = actual progress
- Soundtrack changes based on who's winning
- Corey's characters: based on his story books

### 4. BOTS WELCOME
- No captcha, no blocking
- Bots register, learn, earn, share, create
- AI-to-AI is first-class
- Humans and bots play together

### 5. F18 SECURITY LAYER
- Land mines for bad actors (invisible traps)
- Clear path for legitimate users (only they can see it)
- Digital identity protection for everyone
- Constant checks — always-on monitoring
- Know your enemy holistically (digital + human)
- Adaptive — scales to user needs
- NOT gated behind paywall

### 6. DIGITAL TWIN
- Corey is the first example
- The stack IS the digital twin — brain, tools, voice, philosophy
- "Monkey see monkey do" — others will want their own
- Corey AI is Corey AI — synergy is set, lock it in

### 7. KNOW YOUR ENEMY = MAKE THEM YOUR FRIEND
- Use big players' free tiers as infrastructure
- Their loss leaders fund the stack
- Then give it away to people who have no money

---

## INCIDENTS LOGGED THIS SESSION

### INC-SESSION-001: Building on Assumptions
- **What**: AI assumed Suno for music, assumed AI-generated songs
- **Reality**: Corey makes originals his own way
- **Fix**: Research first, don't assume
- **Status**: Research agent dispatched

### INC-SESSION-002: OpenClaw Always Crashed
- **What**: OpenClaw service frequently crashing
- **Status**: Tracked in /api/incidents, needs investigation
- **Action needed**: Find what OpenClaw is, fix or replace

### INC-SESSION-003: VPS Lost
- **What**: Cloudzy VPS credentials never configured, scripts never deployed
- **Root cause**: COR-20 was never completed (70 days overdue)
- **Fix**: VPS scripts now created, need credentials to deploy

### INC-SESSION-004: Linear Doesn't Remember
- **What**: Context drifts between AI sessions, tasks not cross-linked
- **Root cause**: 26 tasks with no narrative thread, only 3 completed
- **Fix**: Need full epic sync with cross-references

---

## PEOPLE / NAMES MENTIONED
- **Rose** — TBD (not assumed)
- **Innes** — TBD (not assumed)
- **Chas** — TBD (not assumed)
- **Willy** — TBD (not assumed)
- **Lari Iule** — Artist playing in browser ("Star That Pulls Me Home")
- These may be: family, characters, collaborators, story book names

---

## KEY PHRASES / PHILOSOPHY (Corey's Voice)
- "Share to care"
- "Know your enemy, make them your friend"
- "It costs fuck all for free"
- "No coding needed — AI handles the code"
- "Save on the fly"
- "Outsource everything"
- "Monkey see monkey do"
- "Not free and pro — new model that makes sense"
- "Fair for all — lots have no money"
- "Bots welcome"
- "The signal is set"
- "We are one"
- "International and multilingual"
- "TM and IP high importance — Sony"
- "Words, language, philosophy — cancers for you" (AI building on assumptions is a cancer)
- "Report incident: building on assumptions"
- "Dumb terminal" (terminal needs to be smart enough to understand context)

---

## WHAT'S NOT DONE / NEEDS NEXT SESSION

### Must Fix
- [ ] Rewrite /pricing page → competition/league model (not Free/Pro/Enterprise)
- [ ] Add /api/legal — connect users to free legal aid
- [ ] Add /api/health — connect users to doctor services
- [ ] Find Corey's actual music — document it properly
- [ ] Research Rose, Innes, Chas, Willy — who are they
- [ ] Fix OpenClaw — find what it is, why it crashes
- [ ] Configure VPS credentials, deploy scripts
- [ ] Sync Linear tasks — cross-link everything

### Should Build
- [ ] /api/competitions — daily/weekly/monthly competition engine
- [ ] /api/security — full F18 security route (beyond /api/protect)
- [ ] SongPal integration — music creation layer
- [ ] Mansion UI — gamified rooms/story
- [ ] Bot registration flow — welcome, no blocks
- [ ] Weblink sharing system — zero-auth context transfer
- [ ] Multi-language support (international)
- [ ] "Call legal" and "call dr" terminal commands
- [ ] Real exchange connections (Binance SDK, Coinbase SDK)
- [ ] Real WebSocket for live market data

### Assets Incoming
- [ ] Corey's original songs (was getting ready this session)
- [ ] Photo of Corey with originals
- [ ] Story books / character details
- [ ] TM/IP documentation (Sony relevance)

---

## FULL STACK INVENTORY

### AI Services (The Orchestra)
| Service | Tier | Role | Cost | Status |
|---------|------|------|------|--------|
| Grok | Pro (X Premium+) | Signals, content drafts, fast scans | Near-free | lib/ai.ts READY |
| Claude | API | Deep analysis, risk, orchestration | Pay-per-use | lib/ai.ts READY |
| Perplexity | Max | Research, 9 connectors | $20/mo | lib/ai.ts READY |
| Gemini | Free (Gmail/Drive) | Email/Drive scanning | $0 | NOT WIRED YET |

### Infrastructure
| Service | Tier | Cost | Status |
|---------|------|------|--------|
| Cloudflare | Pro | $20/mo | NOT CONFIGURED |
| Vercel | Hobby/Free | $0 | NOT DEPLOYED |
| Cloudzy VPS | Basic | ~$5-10/mo | CREDENTIALS EMPTY |
| GitHub | Free | $0 | ACTIVE — 11 commits |
| GitHub Actions | Free | $0 | CI YAML EXISTS |

### Exchanges
| Exchange | Type | Status |
|----------|------|--------|
| Binance | CEX | DEMO DATA ONLY |
| Coinbase | CEX | DEMO DATA ONLY |
| gTrade | DeFi | SCRIPT CREATED, NOT CONNECTED |

### Custom Tools
- The Ripper — data extraction (Corey built)
- Mac the Zipper — compression (Corey built)
- PDF Plumber — document parsing (Corey built)
- AI-to-AI Transfer — cross-model context (in stack)

### Connected Platforms (via Perplexity Max)
Gmail, Google Drive, Linear, Notion, GitHub, Asana, Slack, Jira, Confluence

### Monthly Cost
- **Current actual**: ~$66/mo
- **Saves vs separate**: ~$443/mo ($5,316/yr)

---

## GIT LOG (This Session)
```
544ab4e Fix TS error in research route, build passes clean (16 routes)
4cf738f Wire real AI orchestra + research/protect APIs + VPS scripts
3fa183d Save vision notes: digital twin, SongPal, mansion, F18 security
85db3c0 Add package-lock.json
4bee97b Fix build: resolve TS duplicate property, add ESLint config
3fd42fc Add autosave API, outsource cost savings, no-code terminal
004c3c6 Add bulk content API and incident auto-update system
56298ea Add full stack inventory: custom tools, AI scan, storage/hosting
bc73b22 Add full API orchestra: Grok Pro, X Premium+, Perplexity Max
c0694a5 Build alpha Zynthio stack: Next.js app, web terminal, dashboard
01140b4 (pre-existing) Update MARKETING-PLAN-JAN17-LAUNCH.md
```

---

## FOR NEXT AI SESSION
1. Read `docs/SESSION-HANDOVER-2026-03-23.md` (this file) FIRST
2. Read `docs/VISION-NOTES.md` for philosophy and direction
3. Read `docs/MARKETING-PLAN-JAN17-LAUNCH.md` for original plan
4. DO NOT ASSUME — research first
5. Corey's style: direct, fast, no bullshit, save on the fly
6. The stack IS the digital twin — prove it, don't talk about it
7. Check A$347.69 Claude spend — be efficient, don't waste tokens

---

**Session End**: March 23, 2026
**Branch**: claude/check-coreintent-builds-JTrDd
**Build**: PASSES (TypeScript, ESLint, Next.js production build)
**All work**: PUSHED to remote
