"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n-config";
import { useLocale } from "@/lib/locale-context";

export default function LanguageSwitcher() {
  const { locale: currentLocale, t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";
    window.location.href = newPath;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={t("nav.language")}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: open ? "var(--bg-primary)" : "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>
          {currentLocale.toUpperCase()}
        </span>
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              role="option"
              aria-selected={locale === currentLocale}
              onClick={() => {
                switchLocale(locale);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 12px",
                background:
                  locale === currentLocale
                    ? "var(--accent-green)"
                    : "transparent",
                color:
                  locale === currentLocale ? "#000" : "var(--text-secondary)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: "bold", minWidth: "24px" }}>
                {locale.toUpperCase()}
              </span>
              <span>{localeNames[locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
