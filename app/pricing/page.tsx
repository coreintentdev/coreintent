"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

function LaunchCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const launchDate = new Date("2026-06-01T00:00:00Z").getTime();
  const diff = Math.max(0, launchDate - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      marginBottom: "24px",
    }}>
      {[
        { v: days, l: "Days" },
        { v: hours, l: "Hours" },
        { v: mins, l: "Min" },
        { v: secs, l: "Sec" },
      ].map((t) => (
        <div key={t.l} style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "bold",
            color: "var(--accent-green)",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
          }}>
            {String(t.v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {t.l}
          </div>
        </div>
      ))}
    </div>
  );
}

const LEAGUES = [
  {
    name: "Daily Sprint",
    color: "#10b981",
    icon: "24H",
    featured: false,
    description: "Leaderboard resets at midnight UTC. By morning, someone won. Could be a quant in Tokyo. Could be a bot in a data centre. No carryover, no safety net — 24 hours to prove your edge or start fresh.",
    features: [
      "Fresh challenge drops at 00:00 UTC — clean slate daily",
      "Trading, song, and content creation battles",
      "Win streaks unlock bonus multipliers (3x, 5x, 10x)",
      "Bots and humans on the same leaderboard — equal terms",
      "Results posted publicly — no hiding behind private portfolios",
    ],
    entry: "Free",
    urgency: "New challenges drop every midnight UTC",
  },
  {
    name: "Weekly Grind",
    color: "#3b82f6",
    icon: "7D",
    featured: true,
    description: "Anyone can get lucky for a day. Show us seven. Consistency separates traders from gamblers. Sharpe ratio matters here, not just raw P&L — this league proves which one you are.",
    features: [
      "7-day performance with risk-adjusted scoring",
      "Team competitions — pair your bot with a human strategist",
      "Song remix battles and strategy sharing rewards",
      "Top 10 earn badges and featured placement on the platform",
      "Drawdown penalties — surviving the dips matters as much as catching the rips",
    ],
    entry: "Free",
    urgency: "Most popular — where reputations are built",
  },
  {
    name: "Monthly Championship",
    color: "#a855f7",
    icon: "30D",
    featured: false,
    description: "The main event. 30 days. Full portfolio wars. This is where reputations are forged, pretenders get exposed, and the best strategy — human or bot — takes the crown. Zero entry fee.",
    features: [
      "Full month performance under real market conditions",
      "Champions unlock Mansion rooms (gamified rewards — planned)",
      "Monthly album competition (SongPal) + cross-AI strategy tournaments",
      "Winners featured globally on the CoreIntent platform",
      "The highest stakes. The biggest bragging rights. Still free.",
    ],
    entry: "Free",
    urgency: "Limited founding spots — early entrants get priority",
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
            Trading as a sport — not a subscription
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 50px)", marginBottom: "16px", lineHeight: "1.1" }}>
            Every Other Platform Profits From Your{" "}
            <span style={{ color: "#ef4444", textDecoration: "line-through", opacity: 0.5 }}>Hope</span>.
            <br />
            <span style={{ color: "var(--accent-green)", textShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}>
              We Profit When You Compete.
            </span>
          </h1>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}>
            <span style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#ef4444",
              textDecoration: "line-through",
              opacity: 0.5,
            }}>$99/mo</span>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>&rarr;</span>
            <span style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "var(--accent-green)",
              textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
            }}>$0</span>
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "15px", maxWidth: "560px", margin: "0 auto 8px" }}>
            Subscription platforms need you to <em>stay</em>, not <em>succeed</em>. Their incentive is your autopay renewal, not your P&amp;L.
          </p>
          <p style={{ color: "var(--accent-green)", marginBottom: "12px", fontSize: "14px", fontWeight: "bold" }}>
            Our engine costs $45/mo to run. Free entry isn&apos;t a gimmick — it&apos;s infrastructure math.
          </p>

          <div style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #f59e0b08 0%, #10b98108 100%)",
            border: "1px solid #f59e0b22",
            borderRadius: "12px",
            marginBottom: "20px",
            maxWidth: "520px",
            margin: "0 auto 24px",
          }}>
            <div style={{ fontSize: "10px", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Competitions Launch In
            </div>
            <LaunchCountdown />
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              background: "#f59e0b12",
              border: "1px solid #f59e0b22",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#f59e0b",
            }}>
              <span className="urgency-badge" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
              Early registrations get founding member status
            </div>
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: "48px", fontSize: "13px" }}>
            Register. Learn. Earn. Share. Create. — No credit card. No catch.
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
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className="card-hover-glow"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "16px",
                  width: "170px",
                  textAlign: "center",
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: `${s.color}18`,
                    border: `2px solid ${s.color}44`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: s.color,
                    marginBottom: "8px",
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
          <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", marginBottom: "8px" }}>
            Pick Your Arena
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px", fontSize: "15px" }}>
            Three leagues. Three timeframes. One rule:{" "}
            <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>the best strategy wins.</span>
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "12px" }}>
            Humans and bots compete on equal terms. AI-to-AI trading is a first-class feature, not a terms-of-service violation.
          </p>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            background: "#10b98112",
            border: "1px solid #10b98122",
            borderRadius: "20px",
            fontSize: "11px",
            color: "#10b981",
            marginBottom: "32px",
          }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s ease-in-out infinite" }} />
            All leagues are free. No credit card required. Ever.
          </div>

          <div className="league-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {LEAGUES.map((league) => (
              <article
                key={league.name}
                className={league.featured ? "pricing-card-featured holo-border" : "card-hover-glow"}
                style={{
                  background: "var(--bg-secondary)",
                  border: `1px solid ${league.featured ? league.color + "44" : "var(--border-color)"}`,
                  borderRadius: "12px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transform: league.featured ? "scale(1.03)" : "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {league.featured && (
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "4px 14px",
                    background: league.color,
                    color: "#000",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}>
                    Most Popular
                  </div>
                )}
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
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: league.color, marginBottom: "4px" }}>
                    $0
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Free entry. Always.
                  </div>
                  <div className="urgency-badge" style={{
                    fontSize: "10px",
                    color: "#f59e0b",
                    padding: "4px 8px",
                    background: "#f59e0b12",
                    border: "1px solid #f59e0b22",
                    borderRadius: "4px",
                    marginBottom: "12px",
                    textAlign: "center",
                  }}>
                    {league.urgency}
                  </div>
                  <a
                    href="https://github.com/coreintentdev/coreintent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={league.featured ? "cta-primary" : "cta-secondary"}
                    style={{
                      display: "block",
                      padding: "14px 24px",
                      background: league.featured ? league.color : "transparent",
                      color: league.featured ? "#000" : league.color,
                      border: league.featured ? "none" : `1px solid ${league.color}66`,
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    {league.featured ? "Claim Your Spot" : `Enter ${league.name}`} &rarr;
                  </a>
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

          {/* How CoreIntent Makes Money */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              background: "linear-gradient(135deg, #10b98108 0%, #a855f708 100%)",
              border: "1px solid #10b98122",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "8px", textAlign: "center" }}>
              &quot;But How Do You Make Money?&quot;
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", textAlign: "center", marginBottom: "20px", maxWidth: "600px", margin: "0 auto 20px" }}>
              Fair question. Transparency is a feature, not a vulnerability.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {[
                {
                  label: "Premium Competitions",
                  desc: "Opt-in prize pool leagues with higher stakes. Free leagues always available. Premium is additive, not a gate.",
                  color: "#10b981",
                  status: "Planned",
                },
                {
                  label: "API Access Tiers",
                  desc: "High-frequency programmatic access for quant teams and bot operators who need dedicated throughput.",
                  color: "#3b82f6",
                  status: "Planned",
                },
                {
                  label: "Sponsorships & Partnerships",
                  desc: "Exchange partnerships, data provider integrations, and sponsored competition leagues.",
                  color: "#a855f7",
                  status: "Planned",
                },
                {
                  label: "The Mansion (Gamification)",
                  desc: "Cosmetic unlocks, room customisation, and story missions. Fun, not pay-to-win.",
                  color: "#f59e0b",
                  status: "Planned",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    border: `1px solid ${item.color}22`,
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: item.color }}>{item.label}</div>
                    <span style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", padding: "2px 6px", background: "var(--bg-primary)", borderRadius: "4px" }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", textAlign: "center", marginTop: "16px" }}>
              Core platform is free forever. Revenue comes from optional premium features, not from locking basics behind a paywall.
            </p>
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
              className="pricing-philosophy-grid"
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
            <table className="pricing-compare-table" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  ["Trading agents", "6 included from day one", "Premium add-on ($$$)"],
                  ["Bot policy", "First-class citizen. API-first. No captcha.", "Banned, blocked, or captcha'd"],
                  ["Revenue model", "Competitions — we need engaged traders", "Subscriptions — they profit whether you win or lose"],
                  ["Transparency", "Demo = demo. Planned = planned.", "Green dots on services that aren't connected"],
                  ["Infrastructure", "~$45/mo. Self-funded. No burn rate.", "$10k+/mo. VC-subsidised. Clock ticking."],
                  ["Signal quality", "Multi-model consensus (3 filters)", "Single model, single point of failure"],
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

          {/* What Happens When You Cancel */}
          <div
            style={{
              marginTop: "48px",
              padding: "32px 24px",
              background: "linear-gradient(135deg, #ef444408 0%, #10b98108 100%)",
              border: "1px solid #ef444418",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
              What Happens When You Cancel a $99/mo Platform?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", maxWidth: "560px", margin: "0 auto 24px" }}>
              You lose everything. Your signals, your history, your tools. That&apos;s the subscription trap — you&apos;re renting, not owning.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "700px", margin: "0 auto" }}>
              <div style={{
                padding: "20px",
                background: "#ef444408",
                border: "1px solid #ef444422",
                borderRadius: "10px",
                textAlign: "left",
              }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ef4444", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  When you cancel a subscription platform
                </div>
                {[
                  "Signals stop immediately",
                  "Trading tools locked out",
                  "Historical data inaccessible",
                  "Bot integrations break",
                  "Community access revoked",
                  "Your $1,188/year? Gone.",
                ].map((item) => (
                  <div key={item} style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#ef4444" }}>&#10005;</span> {item}
                  </div>
                ))}
              </div>
              <div style={{
                padding: "20px",
                background: "#10b98108",
                border: "1px solid #10b98122",
                borderRadius: "10px",
                textAlign: "left",
              }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#10b981", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  CoreIntent — nothing to cancel
                </div>
                {[
                  "No subscription to cancel",
                  "Terminal always accessible",
                  "Competition history permanent",
                  "Bot registrations persist",
                  "Open source — fork it if you want",
                  "Your $0/year? Still $0.",
                ].map((item) => (
                  <div key={item} style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#10b981" }}>&#10003;</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Build Quality Signal */}
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
            <h3 style={{ marginBottom: "8px" }}>Built to Ship, Audited to Last</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
              Every change runs through a 54-point automated audit. No exceptions.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              {[
                { value: "96%", label: "Audit Score", color: "#10b981" },
                { value: "52/54", label: "Checks Passing", color: "#3b82f6" },
                { value: "0", label: "Failures", color: "#a855f7" },
                { value: "100%", label: "Open Source", color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center", minWidth: "80px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "16px" }}>
              Don&apos;t trust us — audit us.{" "}
              <a
                href="https://github.com/coreintentdev/coreintent"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-blue)" }}
              >
                View the source on GitHub
              </a>
            </p>
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
              {
                q: "What happens to my data?",
                a: "Your competition history and leaderboard performance are permanent. There's no subscription to cancel, so there's nothing to lose access to. The codebase is open source — you can always verify what we do with data.",
              },
              {
                q: "How is this different from other AI trading tools?",
                a: "Most platforms use one model with a temperature slider and call it 'AI-powered.' CoreIntent orchestrates three different AI architectures that actively disagree with each other. Consensus means conviction. Disagreement means caution. Plus: $0 instead of $99/mo.",
              },
              {
                q: "Can I see the code?",
                a: "Every line. CoreIntent is fully open source on GitHub. Routes, agents, terminal commands, even the marketing copy you're reading right now. Don't trust us — audit us.",
              },
            ].map((faq, i, arr) => (
              <div
                key={i}
                style={{
                  padding: "16px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border-color)" : "none",
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
            <div className="savings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
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
            className="holo-border"
            style={{
              marginTop: "48px",
              padding: "40px 24px",
              background: "linear-gradient(135deg, #10b98112 0%, #3b82f612 100%)",
              border: "1px solid #10b98122",
              borderRadius: "12px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, #3b82f6, #a855f7, transparent)",
              animation: "shimmer 3s ease infinite",
            }} />
            <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", marginBottom: "8px" }}>
              The Only Cost Is Not Competing.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px", maxWidth: "500px", margin: "0 auto 20px" }}>
              No credit card. No subscription trap. No &quot;free trial&quot; that converts to $99/mo while you sleep.
              <br />
              Founding members get priority placement when leagues launch. Your strategy is your ticket.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                className="cta-primary"
                style={{
                  padding: "16px 36px",
                  background: "var(--accent-green)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "15px",
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
                className="cta-secondary"
                style={{
                  padding: "16px 36px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "15px",
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
