import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "CoreIntent trading and AI disclaimers — paper trading only, not financial advice. Risk warnings for cryptocurrency trading.",
  alternates: {
    canonical: "https://coreintent.dev/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | CoreIntent",
    description: "Trading risk warnings and AI disclaimers. Paper trading mode only.",
    url: "https://coreintent.dev/disclaimer",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CoreIntent Disclaimer" }],
  },
  twitter: {
    card: "summary",
    title: "Disclaimer | CoreIntent",
    description: "Trading risk warnings and AI disclaimers. Paper trading mode only.",
  },
};

export default function DisclaimerPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main aria-label="Disclaimer" style={{ flex: 1, padding: "48px 24px" }}>
        <article style={{ maxWidth: "720px", margin: "0 auto", lineHeight: "1.8", fontSize: "14px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Disclaimer</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
            Last updated: March 2026
          </p>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-red)" }}>
              Trading Risk Warning
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
              <strong>Cryptocurrency trading involves substantial risk of loss and is not suitable
              for every person.</strong> The high degree of leverage that is often obtainable in
              cryptocurrency trading can work against you as well as for you. You should carefully
              consider whether trading is suitable for you in light of your financial situation.
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              Past performance is not indicative of future results. You could lose some or all
              of your investment. Do not invest money you cannot afford to lose.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-red)" }}>
              Not Financial Advice
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent is a technology platform that provides AI-generated trading signals
              and analysis for educational and informational purposes. Nothing on this platform
              should be construed as financial advice, investment advice, trading advice, or
              any other type of advice. CoreIntent is not a licensed financial adviser,
              broker, or dealer.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-yellow)" }}>
              Paper Trading Only
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent currently operates in paper trading mode only. No real funds
              are traded, held, or managed through this platform. Any portfolio values,
              profit/loss figures, or trading results shown are simulated.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-yellow)" }}>
              AI Limitations
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              The AI models powering CoreIntent (Claude, Grok, Perplexity) can produce
              inaccurate, incomplete, or misleading results. AI-generated trading signals
              should never be the sole basis for any trading decision. These models have
              no special ability to predict market movements. Always do your own research.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-yellow)" }}>
              Third-Party Services
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent integrates with third-party APIs and services. We are not responsible
              for the availability, accuracy, or reliability of these services. Exchange data,
              market prices, and news feeds come from external sources and may be delayed,
              inaccurate, or unavailable.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              Alpha Software
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent is in alpha (v0.1.0-alpha). Features may break, change, or be
              removed without notice. Data may be lost. This is early-stage software
              under active development.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              Regulatory Status
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent is not registered with any financial regulatory authority.
              We do not hold any financial services licences. If you are located in
              a jurisdiction where cryptocurrency trading or AI trading tools are
              restricted or prohibited, do not use this service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              Contact
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Questions: <a href="mailto:corey@coreyai.ai">corey@coreyai.ai</a>
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
