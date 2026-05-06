"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { SUPPORTED_LOCALES, LOCALE_NAMES, isRtl } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, t } = useI18n();
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
    segments[1] = newLocale;
    const newPath = segments.join("/");
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`;
    window.location.href = newPath;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={t("language_switcher.label")}
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
          transition: "border-color 0.2s ease",
        }}
      >
        <span style={{ fontSize: "14px" }}>&#127760;</span>
        <span>{LOCALE_NAMES[locale]}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("language_switcher.label")}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1000,
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => {
                switchLocale(l);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "8px 14px",
                background: l === locale ? "var(--accent-green)" : "transparent",
                color: l === locale ? "#000" : "var(--text-secondary)",
                border: "none",
                borderBottom: "1px solid var(--border-color)",
                fontFamily: "inherit",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: isRtl(l) ? "right" : "left",
                direction: isRtl(l) ? "rtl" : "ltr",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (l !== locale) {
                  e.currentTarget.style.background = "var(--bg-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (l !== locale) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{LOCALE_NAMES[l]}</span>
              <span style={{ fontSize: "10px", opacity: 0.5, textTransform: "uppercase" }}>{l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
