"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteNav() {
  const pathname = usePathname();
  const { locale, t } = useLocale();

  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = locales.includes(segments[0] as Locale);
  const pathWithoutLocale = hasLocalePrefix ? "/" + segments.slice(1).join("/") : pathname;

  function localePath(href: string) {
    if (locale === defaultLocale) return href;
    return `/${locale}${href}`;
  }

  const NAV_LINKS = [
    { href: "/", label: t("nav.terminal") },
    { href: "/demo", label: t("nav.demo") },
    { href: "/stack", label: t("nav.stack") },
    { href: "/pricing", label: t("nav.pricing") },
  ];

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
        href={localePath("/")}
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
              href={localePath(link.href)}
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
                textDecoration: "none",
                background:
                  pathWithoutLocale === link.href ? "var(--accent-green)" : "transparent",
                color:
                  pathWithoutLocale === link.href ? "#000" : "var(--text-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
