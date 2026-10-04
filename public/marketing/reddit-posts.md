# CoreIntent — Reddit Post Templates

> **Note:** These are templates for Reddit posts. Adjust for each subreddit's rules and culture.
> All performance data is demo/hypothetical unless stated otherwise.
> CoreIntent is in paper trading mode — not live trading.

---

## Post 1 — r/algotrading

**Title:** We built a multi-model AI trading engine that pits Grok, Claude, and Perplexity against each other — and made it free

**Body:**

Hey r/algotrading,

I've been building CoreIntent — an AI trading platform where three models cross-check every signal before it reaches you. The idea is simple: one model guesses, three models debate.

**The architecture:**
- **Grok (xAI)** — Fast pattern recognition + social sentiment
- **Claude (Anthropic)** — Deep reasoning, risk assessment, strategy validation
- **Perplexity** — Real-time news + fundamental analysis

When all three agree, confidence is high. When they disagree, the system flags uncertainty rather than pushing a signal with false conviction.

**What makes it different:**
- No subscriptions — competition-based model (daily/weekly/monthly leagues)
- Bots are first-class citizens. Your algo can register, enter leagues, and compete alongside human traders via API. No captcha.
- 6 pre-built agents: TrendFollower, MeanRevert, SentimentBot, ArbitrageBot, RiskGuard, ResearchAgent
- Total infrastructure cost: ~$45/mo

**Honest caveats:**
- Currently paper trading mode only — not connected to exchanges yet (Binance/Coinbase planned)
- Open source: https://github.com/coreintentdev/coreintent
- Built in New Zealand, self-funded, no VC

Would love feedback from this community — especially on the multi-model consensus approach and the signal pipeline architecture. Happy to share technical details.

https://coreintent.dev

---

## Post 2 — r/cryptocurrency

**Title:** I'm tired of trading platforms charging $99/mo whether you profit or not — so I built one where competitions replace subscriptions

**Body:**

Every trading signal platform I've used charges a flat monthly fee regardless of whether their signals actually work. The platform wins whether you do or not. That's not alignment — it's indifference.

So I built CoreIntent. No subscriptions. Free entry into daily, weekly, and monthly trading competitions. Three AI models (Grok, Claude, Perplexity) cross-checking every signal.

**How the competition model works:**
- Daily Sprint: 24-hour leaderboard, resets at midnight UTC
- Weekly Grind: 7-day performance, risk-adjusted scoring (Sharpe ratio matters)
- Monthly Championship: 30-day full portfolio wars

All free entry. Win streaks earn multipliers. Bots compete alongside humans — AI-to-AI competition is treated as a feature, not a violation.

**The economics:** The whole platform runs on ~$45/mo. When your marginal cost per user is near zero, charging subscriptions is just extraction.

**What's honest:** We're in paper trading mode. No live exchange connections yet (Binance and Coinbase are planned). Demo data is labelled "demo." Planned features say "planned." No fake green dots.

Built from New Zealand under the Zynthio brand. Open source on GitHub.

https://coreintent.dev

---

## Post 3 — r/MachineLearning

**Title:** Multi-model AI orchestration for trading signals: how we coordinate Claude, Grok, and Perplexity to produce consensus signals

**Body:**

Working on a multi-model orchestration problem at CoreIntent where we coordinate three LLMs with different strengths for trading signal analysis:

**Signal Layer (Grok/xAI):** Fast pattern recognition, social sentiment analysis. Processes market noise and X/Twitter signals. Acts as first responder — high recall, moderate precision.

**Analysis Layer (Claude/Anthropic):** Deep reasoning about market structure, risk assessment, strategy validation. When Grok flags a signal, Claude asks: "But should we act on this?" Reduces false positives through adversarial questioning.

**Research Layer (Perplexity):** Real-time news aggregation, on-chain data, fundamental analysis. Before any signal passes through, Perplexity checks the broader context.

**Key insight:** Model disagreement is a feature. Consensus signals (all three agree) carry higher confidence. Split decisions trigger deeper analysis rather than forcing a decision.

**Risk management:** A dedicated RiskGuard agent monitors circuit breakers (0.8% threshold), position sizing, and portfolio correlation. It can override any signal regardless of model consensus.

Currently in paper trading / research phase. The platform runs daily/weekly/monthly competitions where both human traders and AI bots compete on the same leaderboard.

Stack: Next.js 15, TypeScript (strict), Vercel, Cloudzy VPS.

Open source: https://github.com/coreintentdev/coreintent

Interested in feedback on the multi-model consensus approach — particularly around handling conflicting signals and calibrating confidence scores across models with different base rates.

---

## Post 4 — r/startups

**Title:** I run my entire AI trading platform on $45/mo — here's the exact cost breakdown

**Body:**

I keep seeing startups burn $10k-50k/mo on infrastructure for platforms that could run on a fraction of that. Here's how CoreIntent — a multi-AI trading engine with 14 API routes, 6 AI agents, and an interactive terminal — runs on $45/month:

| Service | Role | Cost |
|---------|------|------|
| Vercel | Frontend hosting (Next.js 15) | $0 |
| GitHub Actions | CI/CD pipeline | $0 |
| Cloudflare Pro | CDN, WAF, DDoS protection | $20/mo |
| Cloudzy VPS | Trading backend, scripts | $25/mo |
| Grok API | Signal detection (via X Premium+) | ~$0 |
| Claude API | Deep analysis | Pay-per-use |
| Perplexity | Research (free tier + 3 Pro/day) | $0 |
| **Total** | | **~$45/mo** |

**Key decisions that keep costs low:**
1. **Competition model, not subscriptions.** Revenue comes from premium competition tiers, not monthly billing. Free costs us almost nothing to serve.
2. **Free tiers everywhere.** Vercel free, GitHub free, Cloudflare Pro is $20 but worth it for the WAF. AI APIs on free/included tiers where possible.
3. **No database yet.** We're in paper trading mode — persistence layer is planned, not prematurely built.
4. **Self-funded.** No VC means no pressure to inflate infrastructure to match a funding narrative.

Platform: https://coreintent.dev
Built in New Zealand by one founder (Corey McIvor) under the Zynthio brand.

Currently in paper trading mode — exchange connections are planned. Everything is labelled honestly.

---

## Post 5 — r/SideProject

**Title:** [Show Reddit] CoreIntent — AI trading competitions where 3 models argue about your trades (and bots are welcome)

**Body:**

Been building this for the past year. CoreIntent is an AI trading platform where:

- **3 AI models cross-check signals** (Grok spots, Claude questions, Perplexity verifies)
- **Competitions replace subscriptions** (daily/weekly/monthly leagues, all free entry)
- **Bots are first-class** (AI-to-AI competition via API, no captcha)
- **$45/mo total infra** (yes, the whole thing)
- **Open source** (GitHub: coreintentdev/coreintent)

It's still in paper trading mode — no live exchange connections yet. But the terminal is live, the AI layer works, and the competition framework is built.

Built in New Zealand. No VC. Built honestly — demo data is labelled, planned features say planned.

Would love to hear what you think: https://coreintent.dev

---

## Post 6 — r/webdev

**Title:** Built a Next.js 15 trading platform with a full interactive web terminal — architecture breakdown

**Body:**

Just wanted to share the architecture of CoreIntent, an AI trading platform I've been building:

**Stack:**
- Next.js 15 (App Router) + TypeScript (strict mode)
- 7 pages, 14 API routes
- Full interactive terminal in the browser (100+ commands)
- Multi-model AI service layer (Grok, Claude, Perplexity with graceful fallback)
- JetBrains Mono font, dark terminal aesthetic
- Vercel hosting (free tier), Cloudflare Pro CDN/WAF

**Terminal implementation:**
The web terminal supports ANSI colour codes, command history, tab completion, and real-time data. Uses dangerouslySetInnerHTML for ANSI rendering but with XSS mitigation (HTML escaped first, then only allowlisted ANSI codes converted to spans).

**AI service layer (`lib/ai.ts`):**
Graceful degradation pattern — if an AI API key isn't configured, routes fall back to demo data labelled as such. No fake "connected" indicators.

**Deployment:**
- Vercel for frontend (auto-deploy on push)
- Cloudzy VPS for backend scripts (risk monitor, signal listener)
- GitHub Actions CI/CD
- 54-point automated audit script that runs on every change

**The honest bits:** Exchange integrations are planned, not built. The platform is in paper trading mode. Demo data is labelled. I'm one dev in New Zealand.

Live: https://coreintent.dev
Source: https://github.com/coreintentdev/coreintent
