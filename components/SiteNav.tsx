"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n-context";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteNav() {
  const pathname = usePathname();
  const { t, localePath } = useTranslations();

  const navLinks = [
    { href: localePath("/"), label: t("nav", "terminal") },
    { href: localePath("/demo"), label: t("nav", "demo") },
    { href: localePath("/stack"), label: t("nav", "stack") },
    { href: localePath("/pricing"), label: t("nav", "pricing") },
  ];

  function isActive(href: string) {
    if (href.endsWith("/") || href.split("/").length === 2) {
      return pathname === href || pathname === href + "/";
    }
    return pathname.startsWith(href);
  }

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
        aria-label={t("nav", "home")}
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
        <nav
          style={{ display: "flex", gap: "4px" }}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "inherit",
                textDecoration: "none",
                background: isActive(link.href)
                  ? "var(--accent-green)"
                  : "transparent",
                color: isActive(link.href)
                  ? "#000"
                  : "var(--text-secondary)",
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
