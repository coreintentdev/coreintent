"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteNav() {
  const pathname = usePathname();
  const { t, locale } = useLocale();

  const segments = pathname.split("/");
  const localePrefix = isLocale(segments[1]) ? `/${segments[1]}` : "";
  const pathWithoutLocale = isLocale(segments[1])
    ? "/" + segments.slice(2).join("/")
    : pathname;

  const NAV_LINKS = [
    { href: `${localePrefix}`, label: t("nav.terminal") },
    { href: `${localePrefix}/demo`, label: t("nav.demo") },
    { href: `${localePrefix}/stack`, label: t("nav.stack") },
    { href: `${localePrefix}/pricing`, label: t("nav.pricing") },
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
        href={`${localePrefix}`}
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
          {NAV_LINKS.map((link) => {
            const isActive = pathWithoutLocale === link.href.replace(localePrefix, "") ||
              (link.href === localePrefix && (pathWithoutLocale === "/" || pathWithoutLocale === ""));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  textDecoration: "none",
                  background: isActive ? "var(--accent-green)" : "transparent",
                  color: isActive ? "#000" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
