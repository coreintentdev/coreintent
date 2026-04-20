"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function SiteFooter() {
  const t = useTranslations("footer");

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
          <p>{t("tagline")}</p>
          <p style={{ marginTop: "4px" }}>{t("builtBy")}</p>
        </div>

        <nav
          style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
          aria-label="Footer navigation"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              {t("product")}
            </span>
            <Link
              href="/"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Terminal
            </Link>
            <Link
              href="/stack"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Stack
            </Link>
            <Link
              href="/pricing"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {t("product") === "Producto" ? "Precios" : "Pricing"}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              {t("legal")}
            </span>
            <Link
              href="/privacy"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {t("terms")}
            </Link>
            <Link
              href="/disclaimer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {t("disclaimer")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              {t("connect")}
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
              {t("contact")}
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
        <small>
          {t("copyright", { year: new Date().getFullYear().toString() })}
        </small>
        <small>{t("riskDisclaimer")}</small>
      </div>
    </footer>
  );
}
