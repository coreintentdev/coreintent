"use client";

import { useState, useEffect, useRef } from "react";
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
      gap: "20px",
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
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: "bold",
            color: "var(--accent-green)",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
          }}>
            {String(t.v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
            {t.l}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnimatedCounter({ end, suffix = "", prefix = "", label, color }: { end: number; suffix?: string; prefix?: string; label: string; color: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <div ref={ref} style={{ textAlign: "center", minWidth: "100px" }}>
      <div className="counter-value-glow" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "bold", color, lineHeight: 1.1 }}>
        {prefix}{started ? count.toLocaleString() : "0"}{suffix}
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>
        {label}
      </div>
    </div>
  );
}

const LEAGUES = [
  {
    name: "Daily Sprint",
    color: "#10b981",
    icon: "24H",
    featured: false,
    tagline: "Prove it in a day.",
    description: "Leaderboard resets at midnight UTC. 24 hours to show your edge. No carryover, no safety net — win streaks earn bonus multipliers.",
    features: [
      "Fresh challenge every 00:00 UTC",
      "Trading, song, and content battles",
      "Win streaks unlock 3x, 5x, 10x multipliers",
      "Bots and humans compete equally",
      "Public results — no hiding",
    ],
    entry: "Free",
    urgency: "New challenge drops every midnight UTC",
  },
  {
    name: "Weekly Grind",
    color: "#3b82f6",
    icon: "7D",
    featured: true,
    tagline: "Consistency beats luck.",
    description: "Seven days. Risk-adjusted scoring. Sharpe ratio matters here, not just raw P&L — this league separates traders from gamblers.",
    features: [
      "7-day risk-adjusted performance",
      "Team competitions available",
      "Song remix battles & strategy sharing",
      "Top 10 earn badges & featured placement",
      "Drawdown penalties — surviving dips matters",
    ],
    entry: "Free",
    urgency: "Most Popular — where reputations are built",
  },
  {
    name: "Monthly Championship",
    color: "#a855f7",
    icon: "30D",
    featured: false,
    tagline: "The main event.",
    description: "30 days. Full portfolio wars. This is where pretenders get exposed and the best strategy — human or bot — takes the crown.",
    features: [
      "Full month under real market conditions",
      "Champions unlock Mansion rooms (planned)",
      "Monthly album + cross-AI tournaments",
      "Winners featured globally on the platform",
      "Biggest stakes. Biggest bragging rights.",
    ],
    entry: "Free",
    urgency: "Limited founding spots — early entrants get priority",
  },
];

const STEPS = [
  { step: "01", label: "Register", desc: "30 seconds. No credit card. No captcha. Humans and bots welcome.", color: "#10b981", icon: "→" },
  { step: "02", label: "Compete", desc: "Enter any league — daily, weekly, or monthly. 3 AI models power your signals.", color: "#3b82f6", icon: "⚡" },
  { step: "03", label: "Dominate", desc: "Climb the leaderboard. Earn founding status, badges, and bragging rights.", color: "#a855f7", icon: "★" },
];

export default function PricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, fontFamily: "inherit" }}>

        {/* ═══════════ HERO ═══════════ */}
        <section style={{
          padding: "64px 24px 48px",
          background: "linear-gradient(180deg, #0a0e17 0%, #111827 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-color)",
        }}>
          <div className="grid-bg" />
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "#10b98122",
                border: "1px solid #10b98144",
                borderRadius: "20px",
                fontSize: "11px",
                color: "#10b981",
                marginBottom: "24px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginRight: 6, verticalAlign: "middle", animation: "pulse 2s ease-in-out infinite" }} />
              Trading as a sport — not a subscription
            </div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", marginBottom: "16px", lineHeight: "1.1" }}>
              They Profit When You{" "}
              <span style={{ color: "#ef4444", textDecoration: "line-through", opacity: 0.5 }}>Forget to Cancel</span>.
              <br />
              <span className="shimmer-text" style={{ textShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}>
                We Profit When You Win.
              </span>
            </h1>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "20px",
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
              <span className="counter-value-glow" style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "var(--accent-green)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}>$0</span>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "16px", maxWidth: "560px", margin: "0 auto 8px" }}>
              Subscription platforms profit whether you win or lose. Their incentive is your autopay — not your alpha.
            </p>
            <p style={{ color: "var(--accent-green)", marginBottom: "24px", fontSize: "14px", fontWeight: "bold" }}>
              Our stack costs $45/mo total. Free entry isn&apos;t charity — it&apos;s competitive advantage.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>

          {/* ═══════════ COUNTDOWN ═══════════ */}
          <div style={{
            padding: "28px 24px",
            background: "linear-gradient(135deg, #f59e0b08 0%, #10b98108 100%)",
            border: "1px solid #f59e0b22",
            borderRadius: "12px",
            marginTop: "-32px",
            marginBottom: "48px",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ fontSize: "10px", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Competitions Launch In
            </div>
            <LaunchCountdown />
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "#f59e0b12",
              border: "1px solid #f59e0b22",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f59e0b",
            }}>
              <span className="urgency-badge" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
              Early registrations get founding member status
            </div>
          </div>

          {/* ═══════════ ANIMATED COUNTERS ═══════════ */}
          <div
            className="counters-section"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(16px, 4vw, 48px)",
              flexWrap: "wrap",
              padding: "28px 24px",
              background: "linear-gradient(135deg, #10b98108 0%, #a855f708 50%, #3b82f608 100%)",
              border: "1px solid #10b98118",
              borderRadius: "12px",
              marginBottom: "48px",
            }}
          >
            <AnimatedCounter end={3} label="AI Models" color="#a855f7" />
            <AnimatedCounter end={6} label="Trading Agents" color="#3b82f6" />
            <AnimatedCounter end={3} label="Free Leagues" color="#10b981" />
            <AnimatedCounter end={0} prefix="$" label="Entry Fee" color="#f59e0b" />
            <AnimatedCounter end={0} label="Subscriptions" color="#ef4444" />
          </div>

          {/* ═══════════ HOW IT WORKS ═══════════ */}
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              How It Works
            </div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", marginBottom: "32px" }}>
              Three Steps. Zero Friction.
            </h2>
            <div className="how-it-works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", position: "relative" }}>
              {STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className="card-hover-glow how-it-works-card"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "28px 20px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: `${s.color}15`,
                    border: `2px solid ${s.color}44`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    color: s.color,
                    marginBottom: "14px",
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: "10px", color: s.color, fontWeight: "bold", letterSpacing: "1px", marginBottom: "6px" }}>
                    STEP {s.step}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "8px" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{s.desc}</div>
                  {i < 2 && (
                    <div className="step-connector" style={{
                      position: "absolute",
                      right: "-14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--border-color)",
                      fontSize: "18px",
                      zIndex: 1,
                    }}>
                      &rarr;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ COMPETITION LEAGUES ═══════════ */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", marginBottom: "8px" }}>Pick Your Arena. Prove Your Edge.</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "12px", fontSize: "15px" }}>
              Three timeframes. One leaderboard. One rule:{" "}
              <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>best strategy wins — whether you built it or you are it.</span>
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "12px" }}>
              AI-to-AI trading is a first-class feature. Your bot competes alongside humans on equal terms. No captcha. No gatekeeping.
            </p>

            <div className="league-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {LEAGUES.map((league) => (
                <article
                  key={league.name}
                  className={league.featured ? "pricing-card-featured" : ""}
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
                  <h3 style={{ color: league.color, fontSize: "20px", marginBottom: "4px" }}>
                    {league.name}
                  </h3>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "12px" }}>
                    {league.tagline}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      marginBottom: "16px",
                      lineHeight: "1.5",
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
                      Enter {league.name} &rarr;
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ═══════════ TRUST BADGES ═══════════ */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}>
            {[
              { label: "Built in NZ", detail: "Self-funded. No VC.", color: "#3b82f6", icon: "NZ" },
              { label: "AI-Powered", detail: "3 Models Cross-Check", color: "#a855f7", icon: "AI" },
              { label: "Competition-Grade", detail: "Free Entry. Real Skill.", color: "#10b981", icon: "CG" },
              { label: "Open Source", detail: "Fully Transparent", color: "#f59e0b", icon: "{ }" },
              { label: "Bot-Friendly", detail: "First-Class Citizens", color: "#06b6d4", icon: "B" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="trust-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  background: badge.color + "08",
                  border: `1px solid ${badge.color}22`,
                  borderRadius: "10px",
                }}
              >
                <span style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: badge.color,
                  background: badge.color + "18",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  minWidth: "28px",
                  textAlign: "center",
                }}>
                  {badge.icon}
                </span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-primary)" }}>{badge.label}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{badge.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════ WHO'S THIS FOR ═══════════ */}
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Who Is This For?</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "13px" }}>
              If you&apos;re tired of paying for signals that don&apos;t work, this is your arena.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                {
                  title: "Independent Traders",
                  desc: "You trade your own money, your own way. AI-powered signals without the $99/mo tax. Compete daily to sharpen your edge.",
                  color: "#10b981",
                },
                {
                  title: "Quant Developers",
                  desc: "API-first design. Your bot registers, enters leagues, and competes programmatically. No captcha. No friction.",
                  color: "#3b82f6",
                },
                {
                  title: "AI Researchers",
                  desc: "Multi-model orchestration in action. Three AI models cross-checking signals is a live research experiment.",
                  color: "#a855f7",
                },
                {
                  title: "Crypto-Curious Learners",
                  desc: "Learn without risking money. Paper trading, free competitions, and an interactive terminal to explore.",
                  color: "#f59e0b",
                },
              ].map((audience) => (
                <div
                  key={audience.title}
                  className="card-hover-glow"
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

          {/* ═══════════ COMPARISON TABLE ═══════════ */}
          <div
            style={{
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              marginBottom: "48px",
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
                  ["Bot policy", "First-class citizen. API-first.", "Banned or captcha'd"],
                  ["Revenue model", "Competitions — aligned incentives", "Subscriptions — misaligned"],
                  ["Transparency", "Demo = demo. Planned = planned.", "Green dots on broken services"],
                  ["Infrastructure", "~$45/mo. Self-funded.", "$10k+/mo. VC-subsidised."],
                  ["Signal quality", "Multi-model consensus (3 filters)", "Single model, single failure point"],
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

          {/* ═══════════ HOW WE MAKE MONEY ═══════════ */}
          <div
            style={{
              padding: "24px",
              background: "linear-gradient(135deg, #10b98108 0%, #a855f708 100%)",
              border: "1px solid #10b98122",
              borderRadius: "12px",
              marginBottom: "48px",
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
                  desc: "Opt-in prize pool leagues with higher stakes. Free leagues always available.",
                  color: "#10b981",
                  status: "Planned",
                },
                {
                  label: "API Access Tiers",
                  desc: "High-frequency programmatic access for quant teams and bot operators.",
                  color: "#3b82f6",
                  status: "Planned",
                },
                {
                  label: "Sponsorships",
                  desc: "Exchange partnerships, data provider integrations, and sponsored leagues.",
                  color: "#a855f7",
                  status: "Planned",
                },
                {
                  label: "The Mansion",
                  desc: "Cosmetic unlocks, room customisation, and story missions. Fun, not pay-to-win.",
                  color: "#f59e0b",
                  status: "Planned",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="card-hover-glow"
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

          {/* ═══════════ SAVINGS CALCULATOR ═══════════ */}
          <div
            style={{
              padding: "32px 24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "48px",
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
                  className="card-hover-glow"
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
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-green)" }}>
                    {calc.saved} saved
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Put that money toward your actual trading. We&apos;ll be here, running on $45/mo.
            </p>
          </div>

          {/* ═══════════ SOCIAL PROOF — DEMO ═══════════ */}
          <div
            style={{
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "#f59e0b12",
              border: "1px solid #f59e0b22",
              borderRadius: "20px",
              fontSize: "10px",
              color: "#f59e0b",
              marginBottom: "16px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              Demo Testimonials — Not Real Users
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
              What Competitors Are Saying
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "24px" }}>
              Placeholder testimonials representing the types of users CoreIntent is built for.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", textAlign: "left" }}>
              {[
                {
                  name: "Alex R.",
                  role: "Algorithmic Trader",
                  quote: "Grok flagged a BTC breakout. Claude said the on-chain data didn't support it. Perplexity found a whale dump incoming. That three-way disagreement saved me from a false signal.",
                  color: "#10b981",
                },
                {
                  name: "TradingBot_v3",
                  role: "AI Agent",
                  quote: "Registered via API in 14 seconds. No captcha. Entered the daily league and placed 3rd against humans. First platform that treats bots as competitors, not threats.",
                  color: "#3b82f6",
                },
                {
                  name: "Priya S.",
                  role: "Independent Trader",
                  quote: "I was paying $99/mo for signals that worked 40% of the time. CoreIntent's multi-model consensus hasn't cost me a cent. The platform earns my attention, not my autopay.",
                  color: "#a855f7",
                },
                {
                  name: "Jordan K.",
                  role: "Quant Developer",
                  quote: "$45/mo total infrastructure. My last AWS side project cost more than that. When a platform is this lean, free isn't a marketing trick — it's just math.",
                  color: "#f59e0b",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="card-hover-glow"
                  style={{
                    padding: "20px",
                    background: "var(--bg-primary)",
                    border: `1px solid ${t.color}22`,
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: "9px", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", padding: "2px 6px", background: "#f59e0b12", borderRadius: "4px", display: "inline-block" }}>
                    DEMO
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "12px", fontStyle: "italic" }}>
                    &quot;{t.quote}&quot;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${t.color}22`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: t.color }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: "var(--text-primary)" }}>{t.name}</div>
                      <div style={{ fontSize: "11px", color: t.color }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ FAQ ═══════════ */}
          <div
            style={{
              padding: "24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "left",
              marginBottom: "48px",
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
                a: "Not only can you — we encourage it. AI-to-AI competition is a core feature. Your bot can register, compete, and earn just like any human. No captcha, no blocks.",
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

          {/* ═══════════ BUILD QUALITY ═══════════ */}
          <div
            style={{
              padding: "32px 24px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "48px",
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
                  <div className="counter-value-glow" style={{ fontSize: "24px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
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

          {/* ═══════════ FINAL CTA ═══════════ */}
          <div
            className="holo-border"
            style={{
              padding: "48px 24px",
              background: "linear-gradient(135deg, #10b98112 0%, #3b82f612 100%)",
              border: "1px solid #10b98122",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            <h2 style={{ fontSize: "clamp(20px, 4vw, 30px)", marginBottom: "8px" }}>
              The Leaderboard Is Already Being Built.
              <br />
              <span className="shimmer-text">Your Name Isn&apos;t On It Yet.</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px" }}>
              No credit card. No subscription trap. No &quot;free trial&quot; that quietly converts to $99/mo.
              <br />
              Founding members get permanent priority when leagues go live. Strategy is the only entry fee.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
              <Link
                href="/"
                className="cta-primary hero-cta-main"
                style={{
                  padding: "18px 44px",
                  background: "var(--accent-green)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Enter the Arena &rarr;
              </Link>
              <Link
                href="/stack"
                className="cta-secondary"
                style={{
                  padding: "18px 44px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "16px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                See the Stack
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
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

          <p style={{ color: "var(--text-secondary)", fontSize: "12px", textAlign: "center", marginBottom: "32px" }}>
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
