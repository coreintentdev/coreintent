"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n-context";
import { isValidLocale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteNav() {
  const pathname = usePathname();
  const { t, locale } = useTranslation();

  const segments = pathname.split("/").filter(Boolean);
  const currentPath = isValidLocale(segments[0])
    ? `/${segments.slice(1).join("/") || ""}`
    : pathname;

  const prefix = `/${locale}`;

  const NAV_LINKS = [
    { href: `${prefix}`, label: t("nav.terminal"), match: "/" },
    { href: `${prefix}/demo`, label: t("nav.demo"), match: "/demo" },
    { href: `${prefix}/stack`, label: t("nav.stack"), match: "/stack" },
    { href: `${prefix}/pricing`, label: t("nav.pricing"), match: "/pricing" },
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
        href={prefix}
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
            const isActive =
              currentPath === link.match ||
              (link.match === "/" && currentPath === "");
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
