"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, localeFlags, defaultLocale, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function buildHref(locale: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    if (locale === defaultLocale && segments[0] === defaultLocale) {
      segments.shift();
    }
    return "/" + segments.join("/") || "/";
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          fontSize: "13px",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        <span>{localeFlags[currentLocale]}</span>
        <span>{currentLocale.toUpperCase()}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "180px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {locales.map((locale) => (
            <a
              key={locale}
              href={buildHref(locale)}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "inherit",
                color: locale === currentLocale ? "var(--accent-green)" : "var(--text-secondary)",
                background: locale === currentLocale ? "rgba(16,185,129,0.1)" : "transparent",
              }}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {locale === currentLocale && (
                <span style={{ marginLeft: "auto", fontSize: "11px" }}>✓</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
