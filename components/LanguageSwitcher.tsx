"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${localeNames[locale]}`}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "14px" }}>{localeFlag(locale)}</span>
        <span>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 100,
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "inherit",
                background: loc === locale ? "#10b98122" : "transparent",
                color:
                  loc === locale
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "14px" }}>{localeFlag(loc)}</span>
              <span>{localeNames[loc]}</span>
              {loc === locale && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "10px",
                    color: "var(--accent-green)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function localeFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇳🇿",
    es: "🇪🇸",
    mi: "🇳🇿",
    zh: "🇨🇳",
    ja: "🇯🇵",
    pt: "🇧🇷",
    fr: "🇫🇷",
    de: "🇩🇪",
    ar: "🇸🇦",
    hi: "🇮🇳",
  };
  return flags[locale];
}
