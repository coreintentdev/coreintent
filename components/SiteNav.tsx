"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { extractLocaleFromPath } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n-context";

export default function SiteNav() {
  const pathname = usePathname();
  const locale = extractLocaleFromPath(pathname);
  const { t } = useI18n();

  const NAV_LINKS = [
    { href: `/${locale}`, label: t("nav.terminal") },
    { href: `/${locale}/demo`, label: t("nav.demo") },
    { href: `/${locale}/stack`, label: t("nav.stack") },
    { href: `/${locale}/pricing`, label: t("nav.pricing") },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-secondary)",
      }}
    >
      <Link
        href={`/${locale}`}
        aria-label="CoreIntent — Home"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "var(--accent-green)",
          }}
        >
          CoreIntent
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          v0.2.0-alpha | Zynthio.ai
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <nav style={{ display: "flex", gap: "4px" }} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
                textDecoration: "none",
                background: isActive(link.href) ? "var(--accent-green)" : "transparent",
                color: isActive(link.href) ? "#000" : "var(--text-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
