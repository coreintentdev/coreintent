"use client";

import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale, isValidLocale } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n-client";

export default function LanguageSwitcher() {
  const { locale, t } = useTranslation();
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
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments[0] && isValidLocale(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    window.location.href = "/" + segments.join("/");
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language.switch")}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          fontSize: "12px",
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "11px" }}>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("language.switch")}
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => {
                switchLocale(l);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                border: "none",
                background: l === locale ? "var(--accent-green)" : "transparent",
                color: l === locale ? "#000" : "var(--text-secondary)",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
