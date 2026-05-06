# CoreIntent — YouTube Video Descriptions & Titles

> **Note:** These are templates for YouTube video content. Adjust before publishing.
> All data is demo/hypothetical unless stated otherwise. Paper trading mode.

---

## Video 1 — Platform Introduction / Launch Video

### Title
I Built an AI Trading Engine That Uses 3 Models Instead of 1 (And It's Free)

### Description
```
Three AI models arguing about your trade is better than one model guessing.

CoreIntent orchestrates Grok (fast signals), Claude (deep analysis), and Perplexity (real-time research) to generate consensus trading signals. When they agree — you move with conviction. When they disagree — the system flags uncertainty.

No subscriptions. Free competitions. Bots welcome.

In this video:
00:00 - Why single-model trading is broken
02:15 - How multi-model consensus works
05:30 - The competition model (vs subscriptions)
08:45 - Live demo: terminal walkthrough
12:00 - Bot registration & API-first design
14:30 - Infrastructure costs ($45/mo breakdown)
16:00 - What's next: June 1st competition launch

Links:
-> Website: https://coreintent.dev
-> GitHub: https://github.com/coreintentdev/coreintent
-> Competitions: https://coreintent.dev/pricing
-> X/Twitter: @coreintentai

Built in New Zealand by Corey McIvor | Zynthio.ai
Currently in paper trading mode. Not financial advice.

#AITrading #CoreIntent #Grok #Claude #Perplexity #MultiModelAI #TradingCompetitions #AlgoTrading #AgenticAI #FinTech #OpenSource
```

---

## Video 2 — Technical Deep Dive: Multi-Model Architecture

### Title
How We Orchestrate 3 AI Models for Trading Signals (Architecture Breakdown)

### Description
```
Building a multi-model trading engine means solving a coordination problem. Different AI models are good at different things — so we made them check each other's work.

This video breaks down the full CoreIntent signal pipeline:
- Layer 1: Grok (detection — fast, social-signal-aware)
- Layer 2: Claude (validation — deep reasoning, risk assessment)
- Layer 3: Perplexity (context — real-time news, fundamentals)
- Consensus: 3/3 = strong signal, 2/3 = moderate, 1/3 = no action

The key insight: model disagreement is a FEATURE. When Grok says buy and Claude says wait, that tension forces deeper analysis.

Chapters:
00:00 - The problem with single-model systems
01:30 - Architecture overview (diagram walkthrough)
04:00 - Layer 1: Grok's detection pipeline
06:30 - Layer 2: Claude's validation logic
09:00 - Layer 3: Perplexity's research layer
11:30 - The consensus mechanism
14:00 - Handling disagreement (where alpha lives)
16:00 - RiskGuard: circuit breakers & position sizing
18:00 - Code walkthrough (lib/ai.ts)

Tech stack: Next.js 15, TypeScript (strict), Vercel, Cloudflare Pro, Cloudzy VPS
Infrastructure cost: ~$45/month

Links:
-> Website: https://coreintent.dev
-> GitHub: https://github.com/coreintentdev/coreintent
-> Stack page: https://coreintent.dev/stack

Open source. Paper trading mode. Built in NZ.

#SystemArchitecture #AITrading #MultiModelAI #Claude #Grok #Perplexity #TradingBot #FinTech #TypeScript #NextJS
```

---

## Video 3 — The $45/Month AI Platform (Infrastructure Breakdown)

### Title
My Entire AI Trading Platform Costs $45/Month — Here's How

### Description
```
Most trading platforms raise millions in VC funding and burn $10k+/month on infrastructure.

CoreIntent runs on $45/month. Total.

In this video, I break down exactly how:
- Vercel (hosting): $0
- GitHub Actions (CI/CD): $0
- Cloudflare Pro (CDN + WAF + DDoS): $20/mo
- Cloudzy VPS (trading backend): $25/mo
- Grok API: ~$0 (X Premium+ benefit)
- Claude API: Pay-per-use (pennies per analysis)
- Perplexity: $0 (free tier + 3 Pro/day)

When your marginal cost per user is near zero, subscriptions aren't a business model — they're a tax.

Chapters:
00:00 - The $45 claim (receipts)
01:30 - Hosting: Why Vercel's free tier works
03:00 - CDN & Security: Cloudflare Pro at $20
04:30 - VPS: What actually needs a server
06:00 - AI APIs: The pay-per-use model
08:00 - Why this makes subscriptions indefensible
10:00 - The competition revenue model
12:00 - Can this actually sustain?

Links:
-> Website: https://coreintent.dev
-> Full stack breakdown: https://coreintent.dev/stack
-> GitHub: https://github.com/coreintentdev/coreintent

Solo founder in New Zealand. No VC. No office. No employees.

#Bootstrap #IndieFounder #FinTech #Infrastructure #Startup #LeanStartup #NoVC #SoloFounder #AITrading #CloudComputing
```

---

## Video 4 — Bot vs Human: Building for AI-to-AI Competition

### Title
Why We Let Trading Bots Compete Against Humans (And Why Others Should Too)

### Description
```
Most trading platforms ban bots. We made them first-class citizens.

CoreIntent runs competitions where AI agents and human traders compete on the same leaderboard, with the same rules, on equal terms. No captcha. No ToS violations. API-first registration.

This video explains:
- Why banning bots is fighting the last war
- How AI-to-AI competition generates better data
- The API registration flow (bot setup demo)
- Our 6 built-in agents (TrendFollower, MeanRevert, SentimentBot, ArbitrageBot, RiskGuard, ResearchAgent)
- Competition scoring: risk-adjusted metrics, not just raw P&L

Chapters:
00:00 - The bot problem in trading platforms
02:00 - Why we chose inclusion over exclusion
04:00 - API-first bot registration (live demo)
06:30 - Our 6 AI agents explained
09:00 - How scoring works (Sharpe ratio, drawdown penalties)
11:00 - Bot vs human: fair competition design
13:00 - The future of multi-agent markets

Links:
-> Website: https://coreintent.dev
-> Competitions: https://coreintent.dev/pricing
-> GitHub: https://github.com/coreintentdev/coreintent
-> API docs: https://coreintent.dev/stack

Paper trading mode. Not financial advice.

#AlgoTrading #TradingBots #AgenticAI #AICompetition #FinTech #Automation #MachineLearning #MultiAgent #CoreIntent
```

---

## Video 5 — NZ Founder Story: Building Without Permission

### Title
I Built an AI Trading Platform From New Zealand With No VC and No Co-Founder

### Description
```
No accelerator. No pitch deck. No investors. No office. No co-founder.

Just a thesis: trading platforms have broken incentive structures, and AI is mature enough to fix them.

This is the story of building CoreIntent — an agentic AI trading engine — from New Zealand on $45/month infrastructure. Between school runs and timezone gaps. Against the narrative that you need Silicon Valley to build serious tech.

In this video:
- Why I started (the $99/mo subscription problem)
- The thesis: multi-model consensus > single-model guessing
- What $45/mo actually gets you in 2026
- Building between NZ school runs and US market hours
- Why I open-sourced everything (including the marketing)
- What's next: competition launch June 1st

The hardest part isn't the technology. It's the conviction to give it away.

Chapters:
00:00 - The backstory
03:00 - The thesis (why 3 models, not 1)
06:00 - The NZ advantage (timezone as a feature)
08:00 - Infrastructure breakdown
10:00 - Why open source
12:00 - What's next

Links:
-> Website: https://coreintent.dev
-> GitHub: https://github.com/coreintentdev/coreintent
-> X/Twitter: @coreintentai

Based in New Zealand. Built by Corey McIvor under the Zynthio brand.

#FounderStory #IndieFounder #NewZealand #Bootstrap #Startup #AI #SoloFounder #BuildInPublic #NoVC #FinTech
```

---

## Video 6 — Live Demo: Terminal Walkthrough (100+ Commands)

### Title
CoreIntent Terminal Demo: 100+ Commands for AI Trading (Full Walkthrough)

### Description
```
The CoreIntent terminal isn't a gimmick — it's the primary interface for interacting with three AI models, six trading agents, and a full competition system.

This video walks through the most useful commands:
- cai: Full system overview
- brain: AI model status and orchestration
- status: Engine vitals and signal pipeline
- signals: Current AI-generated signals (demo mode)
- agents: View all 6 trading agents
- compete: Enter daily/weekly/monthly leagues
- 336: Easter egg (the signal is dominant)

Plus: the philosophy behind a terminal-first trading interface in 2026.

Chapters:
00:00 - Why a terminal? (In 2026?!)
01:30 - Getting started (basic commands)
04:00 - AI model commands (brain, cai)
06:30 - Trading commands (signals, agents)
09:00 - Competition commands (compete, leaderboard)
11:00 - Easter eggs (336, zen, fortune, konami)
13:00 - Power user features

Links:
-> Try it live: https://coreintent.dev
-> Full docs: https://coreintent.dev/stack
-> GitHub: https://github.com/coreintentdev/coreintent

Paper trading mode. All signals are demo/educational.

#Terminal #CLI #TradingPlatform #AITrading #WebTerminal #CoreIntent #Demo #FinTech
```

---

## Video 7 — Competition Launch Day (June 1st)

### Title
We Launched Free AI Trading Competitions Today — Here's What Happened

### Description
```
June 1st, 2026. The arena is open.

Daily Sprint. Weekly Grind. Monthly Championship. Free entry. Bots competing alongside humans on the same leaderboard.

This video documents launch day:
- Final pre-launch checks
- The moment competitions went live
- First entries (human and bot)
- Leaderboard updates in real-time
- Community reactions
- What broke (keeping it honest)
- Day 1 results

Chapters:
00:00 - Launch morning (final checks)
02:00 - Going live
04:00 - First competition entries
06:00 - Bot registrations
08:00 - Real-time leaderboard
10:00 - Community reactions
12:00 - What broke (transparency)
14:00 - Day 1 wrap-up

Links:
-> Enter the arena: https://coreintent.dev/pricing
-> GitHub: https://github.com/coreintentdev/coreintent
-> X/Twitter: @coreintentai

Built in NZ. Three AI models. Zero subscriptions.

#LaunchDay #CompetitionLaunch #AITrading #FinTech #BuildInPublic #CoreIntent #Startup
```

---

## Video Thumbnails — Style Guide

**Brand colors:**
- Primary green: #10b981
- Purple: #a855f7
- Blue: #3b82f6
- Red/Grok: #ef4444
- Amber: #f59e0b
- Background: #0a0e17

**Typography:** JetBrains Mono (monospace)

**Thumbnail formula:**
- Dark background (#0a0e17)
- Bold text (1-3 words max)
- One accent color per thumbnail
- Face/screen capture if possible
- Terminal aesthetic (green on black)

**Examples:**
- "$45/mo" in large green text + infrastructure icons
- "3 AIs ARGUE" in gradient text + model logos
- "BOTS vs HUMANS" split design with green/purple
- Terminal screenshot with signal highlight

---

## YouTube Channel Setup

**Channel name:** CoreIntent
**Handle:** @coreintentai
**Banner:** Dark terminal aesthetic, three AI model colors
**About:**

CoreIntent is an AI trading engine built on multi-model consensus. Three AI models (Grok, Claude, Perplexity) argue about every signal before it reaches you.

Free trading competitions. Bots welcome. No subscriptions. Open source.

Built in New Zealand by Corey McIvor | Zynthio.ai

Videos: platform demos, architecture deep dives, competition updates, founder journey.

Website: https://coreintent.dev
GitHub: https://github.com/coreintentdev/coreintent

Paper trading mode. Not financial advice.

---

*All video concepts should be adjusted based on actual platform status at time of recording. Demo content must be labeled as demo.*
