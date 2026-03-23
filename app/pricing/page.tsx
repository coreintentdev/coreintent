"use client";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    color: "#10b981",
    features: [
      "Web terminal access",
      "Paper trading mode",
      "3 AI agents (basic)",
      "Market data (15m delay)",
      "Community support",
      "1 exchange connection",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    color: "#3b82f6",
    features: [
      "Everything in Free",
      "Live trading mode",
      "6 AI agents (all models)",
      "Real-time market data",
      "Priority support",
      "3 exchange connections",
      "Custom signal thresholds",
      "Advanced risk controls",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    color: "#a855f7",
    features: [
      "Everything in Pro",
      "Unlimited AI agents",
      "Unlimited exchanges",
      "Dedicated infrastructure",
      "Custom AI model tuning",
      "White-label terminal",
      "SLA & dedicated support",
      "API access (full)",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "48px 24px",
        fontFamily: "inherit",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Pricing</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "48px" }}>
          Free for everyone. Pay only when you need live trading.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                background: "var(--bg-secondary)",
                border: tier.highlighted
                  ? `2px solid ${tier.color}`
                  : "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {tier.highlighted && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: tier.color,
                    color: "#000",
                    padding: "4px 16px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  MOST POPULAR
                </span>
              )}
              <h2 style={{ color: tier.color, fontSize: "20px", marginBottom: "12px" }}>
                {tier.name}
              </h2>
              <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "4px" }}>
                {tier.price}
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "normal" }}>
                  {tier.period}
                </span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "24px 0",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                {tier.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span style={{ color: tier.color, marginRight: "8px" }}>+</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: tier.highlighted ? "none" : `1px solid ${tier.color}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: "bold",
                  fontSize: "14px",
                  background: tier.highlighted ? tier.color : "transparent",
                  color: tier.highlighted ? "#000" : tier.color,
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "32px" }}>
          All plans include access to the web terminal, documentation, and community Discord.
          <br />
          Risk warnings: Trading cryptocurrency involves significant risk. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}
