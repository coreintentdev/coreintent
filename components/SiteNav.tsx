"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales, LOCALE_NAMES, type Locale } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

const NAV_LINKS = [
  { href: "/" as const, key: "terminal" as const },
  { href: "/demo" as const, key: "demo" as const },
  { href: "/stack" as const, key: "stack" as const },
  { href: "/pricing" as const, key: "pricing" as const },
];

export default function SiteNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;

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
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}

function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("label")}
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {LOCALE_NAMES[currentLocale]}
        <span style={{ fontSize: "8px", marginLeft: "2px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 1000,
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
          role="listbox"
          aria-label={t("label")}
        >
          {locales.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === currentLocale}
              onClick={() => {
                router.replace(pathname, { locale: loc });
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                background: loc === currentLocale ? "var(--accent-green)" : "transparent",
                color: loc === currentLocale ? "#000" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              {LOCALE_NAMES[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
