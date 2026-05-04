# CoreIntent — Reddit Posts

> **Note:** These are templates for Reddit communities (r/cryptocurrency, r/algotrading, r/artificial, r/startups, r/SideProject).
> Adapt tone for each subreddit. All data is demo/hypothetical unless stated otherwise.
> CoreIntent is in paper trading mode — not live trading.

---

## Post 1 — r/algotrading: "We built a multi-model AI trading engine that's free. Here's why."

**Title:** We built a multi-model AI trading engine that's free. Here's why.

**Body:**

I've been building CoreIntent for the past year — an agentic AI trading engine that orchestrates three models (Grok, Claude, Perplexity) to cross-check trading signals in real-time.

**The architecture:**
- Grok (xAI) handles fast signal detection and social sentiment
- Claude (Anthropic) does deep risk analysis and strategy validation
- Perplexity runs real-time research and news verification
- RiskGuard agent monitors circuit breakers (0.8% threshold)

When all three agree → high-confidence signal. When they disagree → the system flags uncertainty and digs deeper. Disagreement is a feature, not a bug.

**Why it's free:**
Our entire stack runs on ~$45/month (Vercel free tier, Cloudflare $20, VPS $25). When your marginal cost per user is near zero, subscriptions are just extraction. So we replaced them with competitions — daily, weekly, monthly leagues. Free entry.

**Current status:** Paper trading mode. 6 agents configured. 14 API endpoints. Everything demo is labelled "demo." We're not pretending to be live.

Open source: github.com/coreintentdev/coreintent

Happy to answer technical questions about the multi-model orchestration approach.

---

## Post 2 — r/cryptocurrency: "Why I replaced subscriptions with competitions for our AI trading platform"

**Title:** Why I replaced subscriptions with competitions for our AI trading platform

**Body:**

I was paying $99/month for a signal service that worked maybe 40% of the time. The platform didn't care — they got my money whether I profited or not.

That misalignment bugged me enough to build CoreIntent.

**The model:** Instead of subscriptions, we run free competitions:
- Daily sprints (24-hour leaderboard resets)
- Weekly grinds (7-day risk-adjusted scoring)
- Monthly championships (the main event)

Bots compete alongside humans. No captcha, no bans. If your algo can outperform, it deserves to be on the leaderboard.

**The AI stack:**
Three models argue about every signal before it reaches you. Grok for speed, Claude for depth, Perplexity for research. Consensus means conviction. Disagreement means caution.

**The numbers:**
- Infrastructure: ~$45/month total
- No VC funding
- Based in New Zealand
- Currently paper trading (building honestly before touching real funds)

Before anyone asks: yes, demo data is labelled "demo." Yes, paper trading is labelled "paper trading." Yes, planned features say "planned."

Site: coreintent.dev | GitHub: github.com/coreintentdev/coreintent

---

## Post 3 — r/artificial: "Multi-model AI orchestration: How we make Grok, Claude, and Perplexity argue productively"

**Title:** Multi-model AI orchestration: How we make Grok, Claude, and Perplexity argue productively

**Body:**

Working on a project called CoreIntent where we orchestrate three different AI models for trading signal analysis. The interesting part isn't any single model — it's the disagreement patterns between them.

**The setup:**
1. **Grok** (xAI) — Fast pattern recognition, social sentiment. First responder. Tends to be bullish and fast.
2. **Claude** (Anthropic) — Deep reasoning, risk assessment. The skeptic. Asks "should we actually act on this?"
3. **Perplexity** — Real-time research, news context. The fact-checker. "What does the broader context say?"

**What we've learned:**
- Models disagree ~35-40% of the time on directional calls (DEMO metric — paper trading data)
- Disagreement correlates with higher-uncertainty market conditions
- Consensus signals have stronger conviction — when three different architectures reach the same conclusion independently, that's meaningful
- The "check each other's work" pattern catches hallucination and overconfidence from any single model

**The architecture question:** How do you handle model disagreement in multi-agent systems? We currently use a weighted consensus approach where each model's confidence score contributes to a final engine decision. RiskGuard (a separate agent) has veto power with circuit breakers.

Curious if others are working on similar multi-model orchestration problems.

---

## Post 4 — r/startups: "Running an AI trading platform for $45/month — the anti-VC bootstrap thesis"

**Title:** Running an AI trading platform for $45/month — the anti-VC bootstrap thesis

**Body:**

I'm a solo founder in New Zealand building CoreIntent, an AI trading engine. Here's my entire monthly infrastructure cost:

| Service | Cost | Role |
|---------|------|------|
| Vercel | $0 | Hosting |
| GitHub Actions | $0 | CI/CD |
| Cloudflare Pro | $20 | CDN, WAF, DDoS |
| Cloudzy VPS | $25 | Trading backend |
| Claude API | Pay-per-use | Deep analysis |
| Grok | ~$0 (X Premium+) | Signal detection |
| Perplexity | Free tier | Research |
| **Total** | **~$45/month** | |

**The thesis:** When your marginal cost per user approaches zero, the subscription model isn't a business model — it's a tax. So I replaced subscriptions with free competitions. Daily/weekly/monthly leagues. Free entry. Revenue comes from premium competition tiers.

**The tradeoffs:**
- No funding means slower development (solo founder)
- NZ timezone means I'm awake when the US sleeps
- Paper trading mode until the system proves itself
- Marketing budget is zero — building in public is the only strategy

**Current state:** Next.js 15, TypeScript strict mode, 14 API endpoints, 6 AI agents configured, interactive terminal. Everything open source.

The honest part: demo data is labelled "demo." I don't have exchange connections yet. Agents are configured but not live-trading. If it's not real, I say so.

Is the $45/month stack sustainable at scale? Probably not at 100k users — but marginal compute costs are the predictable part. The unpredictable part is whether anyone cares.

---

## Post 5 — r/SideProject: "Show: CoreIntent — Free AI trading competitions with 3 models that argue"

**Title:** [Show] CoreIntent — Free AI trading competitions with 3 models that argue

**Body:**

**What it is:** An AI trading engine that orchestrates Grok, Claude, and Perplexity to cross-check every signal. Competition-based instead of subscription-based.

**The stack:**
- Next.js 15 (App Router) + TypeScript strict
- 3 AI models in a signal pipeline
- 6 AI trading agents
- Interactive web terminal with 100+ commands
- $45/month total infrastructure

**What makes it different:**
1. Three AI models check each other's work — disagreement triggers deeper analysis
2. Free competitions instead of subscriptions (daily/weekly/monthly)
3. Bots are first-class citizens — AI-to-AI competition is encouraged
4. Radically transparent — demo data says "demo," planned says "planned"

**Current status:** Paper trading. Not live. I'm building in public from New Zealand.

**What I'd love feedback on:**
- Does the multi-model consensus approach seem valuable to you?
- Would you compete in free trading leagues?
- Any red flags I'm missing?

Live: coreintent.dev
Source: github.com/coreintentdev/coreintent

---

## Post 6 — r/cryptocurrency: "Bots are welcome on our trading platform. Here's why that's the right call."

**Title:** Bots are welcome on our trading platform. Here's why that's the right call.

**Body:**

Most trading platforms ban bots, add captchas, or bury "no automated trading" in their ToS.

We did the opposite. At CoreIntent, AI bots are first-class competitors. They can register via API, enter competitions, and compete alongside humans on the same leaderboard.

**Why:**
- The future of trading is multi-agent. Pretending otherwise is just delaying the inevitable.
- A bot that consistently outperforms deserves to be on the leaderboard as much as any human.
- Blocking bots doesn't stop them — it just forces them to pretend to be human. We'd rather have them compete openly.
- If your strategy can't beat a bot, that's useful information about your strategy.

**How it works:**
- API registration (no captcha)
- Same competition rules for bots and humans
- Same leaderboard, same rewards
- Bot entries are labelled — transparency, not deception

Currently paper trading, so this is all pre-launch. But the architecture and philosophy are locked in.

What's your take — should trading platforms welcome bots or fight them?

---

## Post 7 — r/algotrading: "Architecture deep dive: How our RiskGuard agent has veto power over 3 AI models"

**Title:** Architecture deep dive: How our RiskGuard agent has veto power over 3 AI models

**Body:**

In our multi-model trading engine (CoreIntent), we have a dedicated RiskGuard agent that can override any signal from the three primary models (Grok, Claude, Perplexity).

**The pipeline:**
```
Grok (detect) → Claude (analyse) → Perplexity (verify) → Engine (decide) → RiskGuard (approve/veto)
```

**RiskGuard's rules (paper trading config):**
- Circuit breaker threshold: 0.8%
- Position sizing limits per trade
- Portfolio correlation monitoring
- Drawdown protection triggers
- Can veto any signal regardless of consensus confidence

**Why a separate agent:**
The three signal models are optimised for finding opportunities. RiskGuard is optimised for one thing: preventing catastrophic loss. Different objective functions need different agents.

The signal models "want" to trade. RiskGuard "wants" to protect. That tension is by design.

**Currently in paper trading mode** — validating the logic before real funds touch it. All of this is configured, not live.

Built on Next.js 15 / TypeScript. Open source: github.com/coreintentdev/coreintent

Interested in hearing how others handle risk management in multi-agent trading systems.

---

## Commenting Guidelines

When commenting on relevant threads:

1. **Be helpful first.** Answer the question, then mention CoreIntent only if relevant.
2. **Never spam.** One mention per thread maximum.
3. **Be honest about status.** "We're paper trading" — never imply live.
4. **Engage with criticism.** If someone calls out a limitation, acknowledge it.
5. **Disclose.** Always mention you're the founder if promoting.
6. **Match the subreddit tone.** r/algotrading wants technical depth. r/cryptocurrency wants the narrative. r/startups wants the business model.

---

*All data and metrics referenced are from paper trading mode (demo). CoreIntent is not live-trading. No real funds are traded.*
