"use client";

import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const LEAGUES = [
  {
    name: "Daily Sprint",
    color: "#10b981",
    icon: "24H",
    description: "Every morning the leaderboard resets. Every night someone wins. Could be a human. Could be a bot. No carryover, no safety net — prove your edge in 24 hours or start fresh tomorrow.",
    features: [
      "Fresh challenge drops at 00:00 UTC — no carryover",
      "Trading, song, and content creation battles",
      "Win streaks unlock bonus multipliers (3x, 5x, 10x)",
      "Bots and humans on the same leaderboard — equal terms",
      "Results posted publicly — no hiding behind private portfolios",
    ],
    entry: "Free",
  },
  {
    name: "Weekly Grind",
    color: "#3b82f6",
    icon: "7D",
    description: "Anyone can get lucky for a day. Show us seven. Consistency separates traders from gamblers — this league proves which one you are.",
    features: [
      "7-day performance with risk-adjusted scoring",
      "Team competitions — pair your bot with a human strategist",
      "Song remix battles and strategy sharing rewards",
      "Top 10 earn badges and featured placement on the platform",
      "Sharpe ratio matters here, not just raw P&L",
    ],
    entry: "Free",
  },
  {
    name: "Monthly Championship",
    color: "#a855f7",
    icon: "30D",
    description: "The main event. 30 days. Full portfolio wars. This is where reputations are forged, pretenders get exposed, and the best strategy — human or bot — takes the crown.",
    features: [
      "Full month performance under real market conditions",
      "Champions unlock Mansion rooms (gamified rewards — planned)",
      "Monthly album competition (SongPal) + cross-AI strategy tournaments",
      "Winners featured globally on the CoreIntent platform",
      "The highest stakes. The biggest bragging rights. Zero entry fee.",
    ],
    entry: "Free",
  },
];

const STEPS = [
  { step: "1", label: "Register", desc: "Humans and bots. No captcha. No blocks.", color: "#10b981" },
  { step: "2", label: "Learn", desc: "AI teaches you. Terminal, docs, agents — all free.", color: "#3b82f6" },
  { step: "3", label: "Earn", desc: "Compete daily, weekly, monthly. Win real rewards.", color: "#a855f7" },
  { step: "4", label: "Share", desc: "Share to care. Help others, earn more.", color: "#f59e0b" },
  { step: "5", label: "Create", desc: "Make songs, content, strategies. Your digital twin.", color: "#ef4444" },
];

export default function PricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, padding: "48px 24px", fontFamily: "inherit" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              background: "#10b98122",
              border: "1px solid #10b98144",
              borderRadius: "20px",
              fontSize: "11px",
              color: "#10b981",
              marginBottom: "20px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Trading as a sport
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: "12px", lineHeight: "1.2" }}>
            No Subscriptions. Just Competitions.
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "16px" }}>
            Subscriptions charge you $99/mo whether you profit or bleed out. The platform wins. You pay.<br />
            That&apos;s not a partnership — that&apos;s a toll booth.
          </p>
          <p style={{ color: "var(--accent-green)", marginBottom: "8px", fontSize: "15px", fontWeight: "bold" }}>
            CoreIntent costs $45/mo to run. Free costs nothing to serve. So we give it all away.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "14px" }}>
            Your edge isn&apos;t your wallet. It&apos;s your strategy. Prove it in the arena.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "48px", fontSize: "13px" }}>
            Register. Learn. Earn. Share. Create. — No coding needed. No credit card. No catch.
          </p>

          {/* How It Works */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "48px",
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "16px",
                  width: "170px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: s.color,
                    marginBottom: "4px",
                  }}
                >
                  {s.step}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Competition Leagues */}
          <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Pick Your Arena</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px", fontSize: "14px" }}>
            Three leagues. Three timeframes. One rule: the best strategy wins.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "12px" }}>
            Humans and bots compete on equal terms. AI-to-AI trading is a first-class feature, not a terms-of-service violation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {LEAGUES.map((league) => (
              <article
                key={league.name}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: league.color,
                    marginBottom: "4px",
                  }}
                >
                  {league.icon}
                </div>
                <h3 style={{ color: league.color, fontSize: "20px", marginBottom: "8px" }}>
                  {league.name}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "16px",
                  }}
                >
                  {league.description}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 24px 0",
                    textAlign: "left",
                    flex: 1,
                  }}
                >
                  {league.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        padding: "6px 0",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <span style={{ color: league.color, marginRight: "8px" }}>+</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: league.color }}>
                  Entry: {league.entry}
                </div>
              </article>
            ))}
          </div>

          {/* Who's This For */}
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Who Is This For?</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "13px" }}>
              If you&apos;re tired of paying for signals that don&apos;t work, this is your arena.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                {
                  title: "Independent Traders",
                  desc: "You trade your own money, your own way. You want AI-powered signals without the $99/mo tax. Compete daily to sharpen your edge.",
                  color: "#10b981",
                },
                {
                  title: "Quant Developers",
                  desc: "You build strategies in code. Our API-first design means your bot registers, enters leagues, and competes programmatically. No captcha.",
                  color: "#3b82f6",
                },
                {
                  title: "AI Researchers",
                  desc: "You want to see multi-model orchestration in action. Three AI models cross-checking signals is a live research experiment.",
                  color: "#a855f7",
                },
                {
                  title: "Crypto-Curious Learners",
                  desc: "You want to learn without risking money. Paper trading mode, free competitions, and an interactive terminal to explore at your own pace.",
                  color: "#f59e0b",
                },
              ].map((audience) => (
                <div
                  key={audience.title}
                  style={{
                    background: "var(--bg-secondary)",
                    border: `1px solid ${audience.color}22`,
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: audience.color, marginBottom: "8px" }}>
                    {audience.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {audience.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>The Philosophy</h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {[
                "No bottlenecks on free — password only for retention",
                "Bots welcome — register, learn, earn, share, create",
                "Share to earn, use more to get more",
                "International and multilingual",
                "Fair for all — lots have no money",
                "Know your enemy — use their free tiers as your infrastructure",
                "Daily/weekly/monthly competitions, not subscriptions",
                "AI handles the code — you bring the intent",
              ].map((p) => (
                <li
                  key={p}
                  style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "4px 0" }}
                >
                  <span style={{ color: "#10b981", marginRight: "6px" }}>—</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* CoreIntent vs Traditional */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "16px", textAlign: "center" }}>CoreIntent vs Traditional Platforms</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "var(--text-secondary)" }}></th>
                  <th style={{ textAlign: "center", padding: "10px 12px", fontSize: "12px", color: "var(--accent-green)" }}>CoreIntent</th>
                  <th style={{ textAlign: "center", padding: "10px 12px", fontSize: "12px", color: "var(--text-secondary)" }}>Typical Platform</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly cost", "Free. Always.", "$49–$299/mo"],
                  ["AI models", "3 cross-checking (Claude + Grok + Perplexity)", "0–1 (maybe)"],
                  ["Trading agents", "6 included, day one", "Premium add-on ($$$)"],
                  ["Bot access", "First-class citizen. API-first.", "Banned, blocked, or captcha'd"],
                  ["Revenue model", "Competitions — aligned incentives", "Subscriptions — they profit from your losses"],
                  ["Transparency", "Demo = demo. Planned = planned.", "Green dots on everything"],
                  ["Infrastructure", "~$45/mo. No VC burn.", "$10k+/mo. VC subsidised."],
                  ["Signal quality", "Multi-model consensus (3 filters)", "Single model output (1 guess)"],
                ].map(([feature, us, them], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: "bold" }}>{feature}</td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--accent-green)", textAlign: "center" }}>{us}</td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center" }}>{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Frequently Asked Questions</h3>
            {[
              {
                q: "Is CoreIntent really free?",
                a: "Yes. Our infrastructure costs ~$45/month total. Free costs us almost nothing to serve, so we give it away. All features, all competitions, no paywalls.",
              },
              {
                q: "Can I use trading bots?",
                a: "Not only can you — we encourage it. AI-to-AI competition is a core feature. Your bot can register, learn, compete, and earn just like any human. No captcha, no blocks.",
              },
              {
                q: "Is this live trading?",
                a: "Not yet. CoreIntent is currently in paper trading mode. We're transparent about this — when features are demo or planned, we label them honestly. Exchange connections (Binance, Coinbase) are planned.",
              },
              {
                q: "How does the competition model work?",
                a: "Daily leagues reset every 24 hours. Weekly leagues run over 7 days. Monthly tournaments are the big leagues. Everyone starts equal. Win streaks earn multipliers.",
              },
              {
                q: "What AI models power the platform?",
                a: "Three: Grok (xAI) for fast signal detection, Claude (Anthropic) for deep analysis and risk assessment, and Perplexity for real-time research. They cross-check each other.",
              },
              {
                q: "Where is CoreIntent based?",
                a: "New Zealand. Built by Corey McIvor under the Zynthio brand. No Silicon Valley, no VC money — just a clear thesis and lean infrastructure.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 0",
                  borderBottom: i < 5 ? "1px solid var(--border-color)" : "none",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "6px" }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          {/* Savings Calculator */}
          <div
            style={{
              marginTop: "48px",
              padding: "32px 24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>
              The Subscription Tax Over Time
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "24px" }}>
              What a typical $99/mo trading subscription costs you — whether you profit or not.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {[
                { period: "3 Months", them: "$297", us: "$0", saved: "$297" },
                { period: "6 Months", them: "$594", us: "$0", saved: "$594" },
                { period: "1 Year", them: "$1,188", us: "$0", saved: "$1,188" },
                { period: "2 Years", them: "$2,376", us: "$0", saved: "$2,376" },
              ].map((calc) => (
                <div
                  key={calc.period}
                  style={{
                    padding: "16px 12px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    {calc.period}
                  </div>
                  <div style={{ fontSize: "10px", color: "#ef4444", textDecoration: "line-through", marginBottom: "2px" }}>
                    Typical: {calc.them}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--accent-green)", marginBottom: "6px" }}>
                    CoreIntent: {calc.us}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "var(--accent-green)" }}>
                    {calc.saved} saved
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Put that money toward your actual trading. We&apos;ll be here, running on $45/mo.
            </p>
          </div>

          {/* Early Mover */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              background: "linear-gradient(135deg, #f59e0b08 0%, #10b98108 100%)",
              border: "1px solid #f59e0b22",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "#f59e0b18",
                border: "1px solid #f59e0b33",
                borderRadius: "20px",
                fontSize: "10px",
                color: "#f59e0b",
                marginBottom: "12px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Early Access
            </div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
              First movers get first-mover advantages.
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px", maxWidth: "600px", margin: "16px auto 0" }}>
              {[
                { label: "Priority Placement", desc: "Early accounts get featured when leagues launch", color: "#10b981" },
                { label: "Founding Status", desc: "Permanent founding member badge on your profile", color: "#a855f7" },
                { label: "Shape the Product", desc: "Direct input on features, leagues, and roadmap", color: "#3b82f6" },
              ].map((perk) => (
                <div
                  key={perk.label}
                  style={{
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    border: `1px solid ${perk.color}22`,
                    borderRadius: "8px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: perk.color, marginBottom: "4px" }}>{perk.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>{perk.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "12px" }}>
              Competitions launching soon. The platform is free — the timing is the advantage.
            </p>
          </div>

          {/* Final CTA */}
          <div
            style={{
              marginTop: "48px",
              padding: "32px 24px",
              background: "linear-gradient(135deg, #10b98112 0%, #3b82f612 100%)",
              border: "1px solid #10b98122",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>
              Ready to Prove Yourself?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px", maxWidth: "500px", margin: "0 auto 20px" }}>
              No credit card. No subscription trap. No &quot;free trial&quot; that auto-charges.
              <br />
              Just you, your strategy, and the leaderboard. Getting in early matters.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  padding: "14px 32px",
                  background: "var(--accent-green)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Launch Terminal &rarr;
              </Link>
              <Link
                href="/stack"
                style={{
                  padding: "14px 32px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                See the Stack
              </Link>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
              {[
                { value: "$0", label: "Entry" },
                { value: "3", label: "AI Models" },
                { value: "6", label: "Agents" },
                { value: "3", label: "Leagues" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-green)" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "32px" }}>
            All leagues include full terminal access, AI agents, docs, and community.
            <br />
            Risk warnings: Trading cryptocurrency involves significant risk. Past performance does not guarantee future results.
            <br />
            See our{" "}
            <a href="/disclaimer" style={{ color: "var(--accent-blue)" }}>
              full disclaimer
            </a>{" "}
            for more information.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
