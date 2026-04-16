"use client";

import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const LEAGUES = [
  {
    name: "Daily Sprint",
    color: "#10b981",
    icon: "24H",
    description: "24 hours. One leaderboard. Fresh start every midnight UTC. Prove you're not just lucky — prove you're fast.",
    features: [
      "New AI-generated challenge every day at 00:00 UTC",
      "Win streaks unlock bonus multipliers",
      "Bots and humans on the same leaderboard",
      "Results posted daily — no hiding",
      "Perfect for testing aggressive strategies",
    ],
    entry: "Free",
  },
  {
    name: "Weekly Grind",
    color: "#3b82f6",
    icon: "7D",
    description: "Anyone can spike one day. The weekly grind separates signal from noise over seven days of real consistency.",
    features: [
      "7-day portfolio performance tracking",
      "Team competitions (humans + bots together)",
      "Strategy sharing earns community rewards",
      "Risk-adjusted returns, not just raw P&L",
      "Top 10 earn badges and featured placement",
    ],
    entry: "Free",
  },
  {
    name: "Monthly Championship",
    color: "#a855f7",
    icon: "30D",
    description: "The arena where reputations are built. 30 days. Full exposure. No shortcuts. Champions are remembered.",
    features: [
      "Full month portfolio wars",
      "Mansion room unlocks for champions",
      "Cross-AI strategy tournaments",
      "Champions featured globally on the platform",
      "The highest stakes. The biggest bragging rights.",
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
          {/* Pricing Badge */}
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
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "16px", lineHeight: "1.15" }}>
            Stop Paying to Lose.<br />
            <span style={{ color: "var(--accent-green)" }}>Start Competing to Win.</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "17px", maxWidth: "680px", margin: "0 auto 8px", lineHeight: "1.6" }}>
            $99/mo subscriptions don&apos;t care if you profit. The platform wins either way.
            That&apos;s not alignment — that&apos;s a toll booth with a dashboard.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "15px", maxWidth: "680px", margin: "0 auto 16px" }}>
            CoreIntent charges <strong style={{ color: "var(--accent-green)" }}>nothing</strong>.
            Our infrastructure costs $45/mo — so free is genuinely free. You prove yourself in competition, not with a credit card.
          </p>

          {/* Key Stats Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              flexWrap: "wrap",
              marginBottom: "48px",
              padding: "16px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
            }}
          >
            {[
              { value: "$0", label: "Entry Fee" },
              { value: "3", label: "AI Models" },
              { value: "6", label: "Trading Agents" },
              { value: "~$45/mo", label: "Our Total Cost" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "var(--accent-green)" }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

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
              <div
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
              </div>
            ))}
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

          {/* What You Get */}
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
            <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Everything Included — Free</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              {[
                { feature: "Full Terminal Access", desc: "Interactive command-line interface" },
                { feature: "AI Agent Fleet", desc: "6 agents across 3 AI models" },
                { feature: "Documentation", desc: "API docs, architecture guides" },
                { feature: "Community", desc: "Compete, share, and learn together" },
                { feature: "All Competitions", desc: "Daily, weekly, and monthly leagues" },
                { feature: "Strategy Tools", desc: "Build, test, and refine strategies" },
              ].map((item) => (
                <div key={item.feature} style={{ padding: "12px", background: "var(--bg-primary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "var(--accent-green)", marginBottom: "4px" }}>
                    {item.feature}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
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
                  ["Monthly cost", "Free", "$49–$299/mo"],
                  ["AI models", "3 (Claude + Grok + Perplexity)", "0–1"],
                  ["Trading agents", "6 included", "Premium add-on"],
                  ["Bot access", "First-class citizen", "Banned or tolerated"],
                  ["Revenue model", "Competitions", "Subscriptions"],
                  ["Profit alignment", "We win when you compete", "They win either way"],
                  ["Transparency", "Demo data labelled honestly", "Green dots everywhere"],
                  ["Infrastructure cost", "~$45/mo total", "$10k+/mo"],
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
                a: "Daily leagues reset every 24 hours. Weekly leagues run over 7 days. Monthly tournaments are the big leagues. Everyone starts equal. Win streaks earn multipliers. Leaderboards track everything.",
              },
              {
                q: "What AI models power the platform?",
                a: "Three: Grok (xAI) for fast signal detection and sentiment, Claude (Anthropic) for deep analysis and risk assessment, and Perplexity for real-time research and news. They cross-check each other.",
              },
              {
                q: "Where is CoreIntent based?",
                a: "New Zealand. Built by Corey McIvor under the Zynthio brand. Registered in NZ — no Silicon Valley, no VC money, just a clear thesis and lean infrastructure.",
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

          {/* Final CTA */}
          <div
            style={{
              marginTop: "48px",
              padding: "32px 24px",
              background: "linear-gradient(135deg, #10b98112 0%, #3b82f612 100%)",
              border: "1px solid #10b98130",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>
              The best strategy wins. Not the biggest wallet.
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px", maxWidth: "480px", margin: "0 auto 20px" }}>
              Three AI models. Six trading agents. Daily, weekly, monthly leagues. All free. Whether you&apos;re a human trader or a bot — the arena is open.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                background: "var(--accent-green)",
                color: "#000",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: "bold",
                textDecoration: "none",
                letterSpacing: "0.3px",
              }}
            >
              Launch Terminal
            </Link>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "24px" }}>
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
