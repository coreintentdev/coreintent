# CoreIntent — Community Posts (Reddit, Hacker News, IndieHackers, Product Hunt)

> **Note:** These are templates for community engagement. Adapt tone and length to each platform's norms.
> All data is demo/hypothetical unless stated otherwise. CoreIntent is in paper trading mode.

---

## Product Hunt

### Tagline
Three AI models argue. You get better trading signals. Free.

### Description

**CoreIntent** is an AI trading engine that uses three models (Grok, Claude, Perplexity) to cross-check every signal before it reaches a trader. Instead of subscriptions, we run free daily/weekly/monthly competitions where humans and bots compete on equal terms.

**What makes it different:**
- 3 AI models in consensus (not one model guessing)
- $0 entry — competition-based, not subscription-based
- Bots are first-class citizens (no captcha, API-first)
- Open source — every line on GitHub
- Runs on $45/mo infrastructure (no VC, no burn rate)

**Built by** Corey McIvor in New Zealand under the Zynthio brand. Currently paper trading — we label demo data honestly and ship features when they're ready, not when they sound impressive.

### Maker's First Comment

Hey Product Hunt! I'm Corey, founder of CoreIntent.

Quick story: I got tired of paying $99/mo for trading tools that used one AI model and prayed. So I built a system where three models argue with each other — Grok for fast signals, Claude for deep analysis, Perplexity for fact-checking.

The insight: when models disagree, that tension is more valuable than blind confidence. It forces deeper analysis.

Then I realized: if my infrastructure costs $45/month total, why am I charging subscriptions? That's just extraction.

So I killed the subscription model and built competitions instead. Daily sprints, weekly grinds, monthly championships. Free entry. Bots compete alongside humans.

I'm a solo founder in New Zealand — no VC, no co-founder, no office. Just three AI models, six trading agents, and the conviction that the best strategy should win regardless of who (or what) built it.

Happy to answer anything. The entire codebase is open source if you want to verify any claim I make.

---

## Hacker News — Show HN

### Title
Show HN: CoreIntent — Multi-model AI trading signals with free competitions (open source)

### Post

I built an AI trading engine that pits three models against each other instead of trusting one:

- Grok (xAI): Fast signal detection, social sentiment
- Claude (Anthropic): Deep analysis, risk assessment
- Perplexity: Real-time research, news verification

The key insight: model disagreement is more valuable than agreement. When Grok says "buy" and Claude says "wait," that tension triggers deeper analysis that a single model would never initiate.

Instead of subscriptions, I run free competitions — daily, weekly, monthly leagues. Bots compete alongside humans. No captcha, API-first design.

Technical details:
- Next.js 15 (App Router) + TypeScript (strict mode)
- 14 API routes, 6 AI agents
- Consensus mechanism: 3/3 = strong, 2/3 = moderate, 1/3 = sit out
- Infrastructure: ~$45/mo (Vercel free + Cloudflare $20 + VPS $25)
- Paper trading mode — building toward exchange connections

Open source: github.com/coreintentdev/coreintent

I'm a solo founder in NZ. No VC. Happy to answer technical questions about the multi-model orchestration or the competition scoring system.

---

## Reddit — r/algotrading

### Title
Built a multi-model AI signal engine with free competitions — bots welcome as first-class competitors

### Post

Hey r/algotrading,

I've been working on CoreIntent — an AI trading engine that uses three models (Grok, Claude, Perplexity) in a consensus pipeline. Instead of the standard single-model approach, I made them check each other's work.

**The Architecture:**
1. Grok scans for patterns and social signals (fast, first-responder role)
2. Claude validates whether the risk/reward justifies action (sceptical layer)
3. Perplexity checks real-time news/fundamentals (context layer)

Signal confidence:
- 3/3 agreement → high confidence, proceed
- 2/3 agreement → moderate, reduced position size
- 1/3 or less → no action

**The Competition Model:**
Instead of subscriptions, I run free daily/weekly/monthly leagues. Here's the part relevant to this sub: **bots are first-class citizens**. No captcha, no ToS violations for automation, API-first registration. Your algo competes alongside humans on the same leaderboard.

Scoring includes risk-adjusted metrics (Sharpe ratio matters, not just raw P&L). Drawdown penalties exist.

**Honest disclaimer:** Currently paper trading. No live exchange connections yet (Binance/Coinbase planned). Open source on GitHub.

Interested in hearing from others building multi-model systems — how do you handle model disagreement? Do you weight certain models higher for certain market conditions?

---

## Reddit — r/CryptoCurrency

### Title
I built a free AI trading competition platform — no subscriptions, bots compete alongside humans

### Post

Tired of paying $99/mo for trading tools that work 40% of the time? Me too. So I built something different.

**CoreIntent** runs three AI models simultaneously — Grok for fast signal detection, Claude for deep analysis, Perplexity for research. They argue with each other. When they agree, you have a strong signal. When they disagree, the system flags uncertainty.

**Why it's different:**
- $0 entry — free competitions, not subscriptions
- Three AI models cross-checking (not one model guessing)
- Bots are welcome — AI-to-AI trading is a feature, not a violation
- Daily, weekly, and monthly competition leagues
- Infrastructure costs $45/mo total — so free isn't a marketing trick, it's just math

**What it's NOT:**
- Not live trading (paper trading mode, clearly labeled)
- Not connected to exchanges yet (planned)
- Not financial advice
- Not promising returns

Currently paper trading, building in public, open source on GitHub. Based in New Zealand.

Trading involves significant risk. Past performance doesn't guarantee future results. All demo data is labeled as demo.

---

## Reddit — r/artificial / r/MachineLearning

### Title
Multi-model AI orchestration for trading: how we handle disagreement between Grok, Claude, and Perplexity

### Post

I've been working on a multi-model AI system (CoreIntent) that orchestrates three LLMs for trading signal analysis. The interesting technical challenge isn't making them agree — it's designing useful outcomes from disagreement.

**Architecture:**
- Layer 1 (Detection): Grok processes social signals and market patterns — optimised for speed over depth
- Layer 2 (Validation): Claude evaluates risk/reward — the sceptical counterpart that asks "should we actually act?"
- Layer 3 (Context): Perplexity adds external context — macro events, news, on-chain data that chart-based signals miss

**The Consensus Mechanism:**
```
3/3 agreement → high confidence (act with conviction)
2/3 agreement → moderate (reduced position sizing)
1/3 or 0/3  → no action (most valuable signal is sometimes "wait")
```

**Key design decision:** model disagreement triggers a deeper analysis loop. When Grok says "BTC is breaking out" and Claude responds "the on-chain data doesn't support this" and Perplexity finds "whale dump incoming" — that three-way tension is more valuable than any single model's confidence score.

**Open questions I'm still working through:**
1. How do you weight model opinions when one model has higher confidence but historically lower accuracy for certain market conditions?
2. Is there a principled way to calibrate the disagreement threshold, or is it fundamentally empirical?
3. How do others handle the latency tradeoff — Grok is fast but shallow, Claude is deep but slower?

Currently paper trading, open source. Happy to share the actual implementation if there's interest.

---

## Reddit — r/startups / r/SideProject

### Title
Solo founder in NZ — built an AI trading platform on $45/mo infrastructure with no VC

### Post

Just wanted to share what's possible with modern infrastructure if you're willing to go lean.

**The product:** CoreIntent — an AI trading engine that uses 3 models (Grok, Claude, Perplexity) and runs free competitions instead of charging subscriptions.

**The infrastructure bill:**
- Vercel (hosting): $0
- GitHub Actions (CI/CD): $0
- Cloudflare Pro (CDN + security): $20/mo
- Cloudzy VPS (backend): $25/mo
- AI APIs: Pay-per-use (pennies per analysis)
- **Total: ~$45/month**

**What that $45/mo runs:**
- Full Next.js 15 app with 14 API routes
- 6 AI agents with distinct strategies
- Interactive web terminal (100+ commands)
- Dynamic OG images
- 54-point automated audit system
- Open source on GitHub

**The thesis:** If infrastructure costs this little, subscriptions aren't a business model — they're extraction. So I built competitions instead.

**Honest status:** Paper trading mode. No exchange connections yet. Demo data labeled as demo. Building toward live trading, but shipping only what's ready.

Solo founder. No VC. No co-founder. Based in New Zealand. Building between school runs and timezone gaps.

For other solo founders — the "you need funding" narrative serves VCs, not builders. Modern free tiers make serious products possible at hobby costs.

---

## IndieHackers — Product Page

### Title
CoreIntent — AI Trading Competitions (Free, Open Source, $45/mo Infrastructure)

### Tagline
Three AI models. Free competitions. Bots welcome. No subscriptions.

### Description

CoreIntent is an AI trading engine that orchestrates three AI models (Grok, Claude, Perplexity) to generate consensus signals. Instead of subscriptions, traders compete in free daily/weekly/monthly leagues.

**Revenue model:** Competition-based. Free core platform, premium tiers for higher-stakes leagues (planned). Currently pre-revenue, building the community.

**Infrastructure:** ~$45/month total. Self-funded. No VC.

**What's different:** Bots compete alongside humans. No captcha. API-first. Open source.

**Stack:** Next.js 15, TypeScript, Vercel, Cloudflare, Cloudzy VPS

**Status:** Paper trading mode. Building in public. Exchange connections planned.

### Milestones (for IndieHackers milestone tracker)

- [x] MVP launched (14 API routes, interactive terminal)
- [x] 3 AI models integrated (Claude, Grok, Perplexity)
- [x] 6 trading agents configured
- [x] Open sourced on GitHub
- [x] Marketing/press kit published
- [x] 54-point audit system at 96%
- [ ] Competition leagues go live (June 1st)
- [ ] First 100 registered competitors
- [ ] Exchange connections (Binance/Coinbase)
- [ ] First premium competition tier
- [ ] First $1 revenue

---

## Discord — Server Welcome Message

Welcome to **CoreIntent** — the AI trading arena.

**What this is:** A platform where three AI models (Grok, Claude, Perplexity) cross-check every trading signal. Free competitions. Bots welcome.

**Channels:**
- #general — Chat, questions, vibes
- #signals — AI-generated signal discussion (paper trading only)
- #bot-builders — For algo traders building competitors
- #strategy — Share and discuss approaches
- #build-in-public — Platform development updates
- #music — SongPal: Corey's originals + community creations

**Rules:**
1. No financial advice. Ever. Paper trading only.
2. Bots welcome — but disclose they're bots
3. Be honest about what's demo vs live
4. NZ vibes. No gatekeeping.

**Status:** Paper trading mode. Competitions launching June 1st.

---

## Telegram — Channel Description

**CoreIntent** | AI Trading Arena

3 AI models. Free competitions. Bots welcome.

Grok detects. Claude questions. Perplexity verifies. Only consensus signals survive.

Daily/weekly/monthly leagues. $0 entry. Open source.

Built in NZ by @coreintentai | coreintent.dev

---

*All community posts should be adapted to the specific platform's tone and rules. Reddit values substance over promotion — lead with value, mention the product naturally. HN values technical depth. Product Hunt values visual clarity.*
