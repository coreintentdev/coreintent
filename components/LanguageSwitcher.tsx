"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n-config";
import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher() {
  const { locale: currentLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function getLocalePath(targetLocale: Locale): string {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }
    return segments.join("/") || "/";
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>&#127760;</span>
        {localeNames[currentLocale].substring(0, 3).toUpperCase()}
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Available languages"
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
            <a
              key={loc}
              href={getLocalePath(loc)}
              role="option"
              aria-selected={loc === currentLocale}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "8px 12px",
                fontSize: "12px",
                fontFamily: "inherit",
                color:
                  loc === currentLocale
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: "4px",
                background:
                  loc === currentLocale
                    ? "rgba(16, 185, 129, 0.1)"
                    : "transparent",
              }}
            >
              <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                {loc.toUpperCase()}
              </span>
              {localeNames[loc]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
