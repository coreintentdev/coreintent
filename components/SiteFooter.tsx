"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

export default function SiteFooter() {
  const { locale, t } = useLocale();

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
          <p>{t("footer.tagline")}</p>
          <p style={{ marginTop: "4px" }}>
            {t("footer.builtBy")}
          </p>
        </div>

        <nav
          style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
          aria-label="Footer navigation"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              {t("footer.product")}
            </span>
            <Link href={`/${locale}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.terminal")}
            </Link>
            <Link href={`/${locale}/demo`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.demo")}
            </Link>
            <Link href={`/${locale}/stack`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.stack")}
            </Link>
            <Link href={`/${locale}/pricing`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.competitions")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              {t("footer.legal")}
            </span>
            <Link href={`/${locale}/privacy`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.privacy")}
            </Link>
            <Link href={`/${locale}/terms`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.terms")}
            </Link>
            <Link href={`/${locale}/disclaimer`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              {t("footer.disclaimer")}
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              {t("footer.connect")}
            </span>
            <a
              href="https://github.com/coreintentdev"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="CoreIntent on GitHub"
            >
              {t("footer.github")}
            </a>
            <a
              href="https://x.com/coreintentai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="CoreIntent on X (Twitter)"
            >
              {t("footer.twitter")}
            </a>
            <a
              href="mailto:corey@coreyai.ai"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              aria-label="Email CoreIntent"
            >
              {t("footer.contact")}
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
        <small>{t("footer.copyright", { year: String(new Date().getFullYear()) })}</small>
        <small>{t("footer.riskWarning")}</small>
      </div>
    </footer>
  );
}
