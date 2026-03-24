"use client";

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const LEAGUES = [
  {
    name: "Daily",
    color: "#10b981",
    icon: "24H",
    description: "Quick-fire challenges. New every day.",
    features: [
      "Daily trading competitions",
      "Daily song challenges (SongPal)",
      "Daily content creation battles",
      "Leaderboard resets at midnight UTC",
      "Win streaks = bonus multipliers",
    ],
    entry: "Free",
  },
  {
    name: "Weekly",
    color: "#3b82f6",
    icon: "7D",
    description: "Prove consistency over a full week.",
    features: [
      "Week-long portfolio challenges",
      "Team competitions (humans + bots)",
      "Weekly song remix battles",
      "Strategy sharing rewards",
      "Top 10 earn badges + prizes",
    ],
    entry: "Free",
  },
  {
    name: "Monthly",
    color: "#a855f7",
    icon: "30D",
    description: "The big leagues. Serious competitors.",
    features: [
      "Full month portfolio wars",
      "Mansion room unlocks",
      "Monthly album competition (SongPal)",
      "Cross-AI strategy tournaments",
      "Champions get featured globally",
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
          <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
            No Subscriptions. Competitions.
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
            Free costs us fuck all — so we give it away.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "48px", fontSize: "14px" }}>
            Register. Learn. Earn. Share. Create. — No coding needed.
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
          <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Competition Leagues</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
            Everyone starts free. Revenue comes from people who choose to compete at higher levels.
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
                <h2 style={{ color: league.color, fontSize: "20px", marginBottom: "8px" }}>
                  {league.name}
                </h2>
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
