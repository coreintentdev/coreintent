"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, isLocale, extractLocaleFromPath, stripLocaleFromPath, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currentLocale = extractLocaleFromPath(pathname);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(locale: Locale) {
    const stripped = stripLocaleFromPath(pathname);
    const newPath = `/${locale}${stripped === "/" ? "" : stripped}`;
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`;
    window.location.href = newPath;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select language"
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: open ? "var(--bg-primary)" : "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>
          {currentLocale}
        </span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
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
            overflow: "hidden",
            zIndex: 100,
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => {
                switchLocale(locale);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 14px",
                border: "none",
                borderBottom: "1px solid var(--border-color)",
                background: locale === currentLocale ? "var(--accent-green)" + "18" : "transparent",
                color: locale === currentLocale ? "var(--accent-green)" : "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", opacity: 0.6, width: "20px" }}>
                {locale}
              </span>
              <span>{localeNames[locale]}</span>
              {locale === currentLocale && (
                <span style={{ marginLeft: "auto", color: "var(--accent-green)", fontSize: "11px" }}>
                  *
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
