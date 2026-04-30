"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, t } = useLocale();
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

  function switchLocale(newLocale: Locale) {
    setOpen(false);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    window.location.href = "/" + segments.join("/");
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("nav.language")}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: open ? "var(--bg-primary)" : "transparent",
          color: "var(--text-secondary)",
          border: "1px solid transparent",
          borderColor: open ? "var(--border-color)" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "14px" }}>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("nav.language")}
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1000,
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === locale}
              onClick={() => switchLocale(loc)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "8px 14px",
                border: "none",
                borderBottom:
                  loc !== SUPPORTED_LOCALES[SUPPORTED_LOCALES.length - 1]
                    ? "1px solid var(--border-color)"
                    : "none",
                background:
                  loc === locale ? "var(--accent-green)11" : "transparent",
                color:
                  loc === locale
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              <span>{LOCALE_NAMES[loc]}</span>
              <span
                style={{
                  fontSize: "10px",
                  opacity: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {loc}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
