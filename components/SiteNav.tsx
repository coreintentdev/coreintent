"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const NAV_LINKS = [
    { href: "/" as const, label: t("terminal") },
    { href: "/demo" as const, label: t("demo") },
    { href: "/stack" as const, label: t("stack") },
    { href: "/pricing" as const, label: t("pricing") },
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
        href="/"
        aria-label={t("home")}
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
                background:
                  pathname === link.href ? "var(--accent-green)" : "transparent",
                color:
                  pathname === link.href ? "#000" : "var(--text-secondary)",
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
