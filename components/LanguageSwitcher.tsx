"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { SUPPORTED_LOCALES, LOCALE_NAMES, isRTL } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: open ? "var(--accent-green)" : "transparent",
          color: open ? "#000" : "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {LOCALE_NAMES[locale]}
        <span style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Available languages"
          style={{
            position: "absolute",
            top: "100%",
            right: isRTL(locale) ? "auto" : 0,
            left: isRTL(locale) ? 0 : "auto",
            marginTop: "4px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            minWidth: "160px",
            zIndex: 100,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {SUPPORTED_LOCALES.map((loc: Locale) => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === locale}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                textAlign: isRTL(loc) ? "right" : "left",
                background: loc === locale ? "rgba(16, 185, 129, 0.15)" : "transparent",
                color: loc === locale ? "var(--accent-green)" : "var(--text-secondary)",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "inherit",
                direction: isRTL(loc) ? "rtl" : "ltr",
              }}
            >
              <span style={{ fontWeight: loc === locale ? "bold" : "normal" }}>
                {LOCALE_NAMES[loc]}
              </span>
              <span style={{ marginLeft: isRTL(loc) ? 0 : 8, marginRight: isRTL(loc) ? 8 : 0, fontSize: "10px", color: "var(--text-secondary)" }}>
                {loc.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
