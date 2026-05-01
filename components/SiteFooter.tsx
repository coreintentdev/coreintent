"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function SiteFooter() {
  const t = useTranslations();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        background: "var(--bg-secondary)",
        padding: "24px",
        fontSize: "12px",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: "bold",
              color: "var(--accent-green)",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            CoreIntent
          </div>
          <p>Agentic AI Trading Engine</p>
          <p style={{ marginTop: "4px" }}>
            {t("footer.builtBy")} | Zynthio.ai
          </p>
        </div>

        <nav
          style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
          aria-label="Footer navigation"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Product
            </span>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("nav.terminal")}
            </Link>
            <Link href="/demo" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("nav.demo")}
            </Link>
            <Link href="/stack" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("nav.stack")}
            </Link>
            <Link href="/pricing" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("nav.pricing")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Legal
            </span>
            <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.terms")}
            </Link>
            <Link href="/disclaimer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.disclaimer")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Connect
            </span>
            <a
              href="https://github.com/coreintentdev"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="CoreIntent on GitHub"
            >
              GitHub
            </a>
            <a
              href="https://x.com/coreintentai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="CoreIntent on X (Twitter)"
            >
              X / Twitter
            </a>
            <a
              href="mailto:corey@coreyai.ai"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="Email CoreIntent"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "16px auto 0",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <small>&copy; {new Date().getFullYear()} Corey McIvor. All rights reserved.</small>
        <small>
          Trading cryptocurrency involves significant risk. Past performance does
          not guarantee future results. Paper trading mode.
        </small>
      </div>
    </footer>
  );
}
