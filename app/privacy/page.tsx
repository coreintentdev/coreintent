import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, padding: "48px 24px" }} aria-label="Privacy Policy">
        <article style={{ maxWidth: "720px", margin: "0 auto", lineHeight: "1.8", fontSize: "14px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Privacy Policy</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
            Last updated: March 2026
          </p>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              1. Who We Are
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent is operated by Corey McIvor under the Zynthio brand.
              Contact: corey@coreyai.ai. We are based in New Zealand.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              2. What We Collect
            </h2>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>Account data:</strong> Email address and display name when you register.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Usage data:</strong> Pages visited, features used, terminal commands entered.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Trading data:</strong> Paper trading positions, signals acted on, portfolio snapshots.
                All trading is simulated — no real funds are handled through this platform.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Technical data:</strong> IP address, browser type, device info via standard web logs.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              3. How We Use Your Data
            </h2>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>To operate the platform and provide AI-powered trading signals.</li>
              <li style={{ marginBottom: "8px" }}>To run competitions and leaderboards.</li>
              <li style={{ marginBottom: "8px" }}>To improve our AI models and service quality.</li>
              <li style={{ marginBottom: "8px" }}>To communicate updates, if you opt in.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              4. Third-Party Services
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
              We use the following third-party services which may process your data:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>Vercel</strong> — Hosting and edge functions.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Cloudflare</strong> — CDN, DDoS protection, DNS.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Anthropic (Claude API)</strong> — AI analysis of trading signals.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>xAI (Grok API)</strong> — Real-time signal detection.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Perplexity API</strong> — Market research and news analysis.
              </li>
            </ul>
            <p style={{ color: "var(--text-secondary)" }}>
              We do not sell your data to anyone. Ever.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              5. Cookies &amp; Local Storage
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We use essential cookies and browser local storage for session management,
              terminal command history, and UI preferences. We do not use tracking cookies
              or third-party advertising pixels.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              6. Your Rights
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
              Under the New Zealand Privacy Act 2020, Australian Privacy Act 1988,
              GDPR, and CCPA, you have the right to:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>Access your personal data.</li>
              <li style={{ marginBottom: "8px" }}>Request correction or deletion of your data.</li>
              <li style={{ marginBottom: "8px" }}>Export your data in a portable format.</li>
              <li style={{ marginBottom: "8px" }}>Withdraw consent at any time.</li>
              <li style={{ marginBottom: "8px" }}>Lodge a complaint with relevant authorities (NZPC, OAIC, ICO).</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              7. Data Retention
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We retain your data for as long as your account is active.
              If you request deletion, we will remove your data within 30 days.
              Aggregated, anonymised data may be retained for analytics.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              8. Security
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We use industry-standard security measures including HTTPS encryption,
              Cloudflare WAF protection, and environment-variable-based secret management.
              API keys are never exposed to the client.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              9. Contact
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              For privacy-related questions: <a href="mailto:corey@coreyai.ai">corey@coreyai.ai</a>
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
