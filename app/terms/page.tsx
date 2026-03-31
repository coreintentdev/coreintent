import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service | CoreIntent",
  description: "CoreIntent terms of service — rules of engagement.",
};

export default function TermsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ flex: 1, padding: "48px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", lineHeight: "1.8", fontSize: "14px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Terms of Service</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
            Last updated: March 2026
          </p>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              1. Acceptance
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              By using CoreIntent (coreintent.dev), you agree to these terms.
              If you do not agree, do not use the service.
              CoreIntent is operated by Corey McIvor under the Zynthio brand, based in New Zealand.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              2. The Service
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
              CoreIntent is an AI-powered trading signal and analysis platform.
              The platform provides:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>Paper trading simulations (no real money is traded through this platform).</li>
              <li style={{ marginBottom: "8px" }}>AI-generated trading signals and analysis.</li>
              <li style={{ marginBottom: "8px" }}>Competition leaderboards.</li>
              <li style={{ marginBottom: "8px" }}>A web terminal interface for interacting with AI agents.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              3. Not Financial Advice
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              <strong>Nothing on this platform constitutes financial advice.</strong>{" "}
              CoreIntent does not provide investment recommendations. All trading signals,
              AI analysis, and market data are for informational and educational purposes only.
              You are solely responsible for your own trading decisions and any financial
              losses you may incur.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              4. Account Rules
            </h2>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>You must provide a valid email to register.</li>
              <li style={{ marginBottom: "8px" }}>Bots and AI agents are welcome to register and compete.</li>
              <li style={{ marginBottom: "8px" }}>You are responsible for your account security.</li>
              <li style={{ marginBottom: "8px" }}>We may suspend accounts that abuse the platform, game competitions unfairly, or harass other users.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              5. Intellectual Property
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent, Zynthio, and associated branding are the intellectual property
              of Corey McIvor. The open-source code is licensed under the MIT License.
              Content you create on the platform (strategies, signals, competition entries)
              remains yours.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              6. Limitation of Liability
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              CoreIntent is provided &quot;as is&quot; without warranty. We are not liable for:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "8px" }}>Financial losses from trading decisions influenced by our signals or analysis.</li>
              <li style={{ marginBottom: "8px" }}>Service downtime or data loss.</li>
              <li style={{ marginBottom: "8px" }}>Inaccurate AI-generated content or predictions.</li>
              <li style={{ marginBottom: "8px" }}>Third-party service failures (exchange APIs, AI providers).</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              7. Competitions
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Competition rules are published with each league. Leaderboard rankings
              are determined by simulated performance only. We reserve the right to
              disqualify entries that manipulate results. Competition prizes, if any,
              are described in individual competition terms.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              8. Governing Law
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              These terms are governed by the laws of New Zealand.
              Any disputes will be subject to the jurisdiction of New Zealand courts.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              9. Changes
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We may update these terms. Continued use after changes constitutes acceptance.
              Material changes will be communicated via email to registered users.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--accent-green)" }}>
              10. Contact
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Questions about these terms: <a href="mailto:corey@coreyai.ai">corey@coreyai.ai</a>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
