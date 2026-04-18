"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { SUPPORTED_LOCALES, LOCALE_NAMES } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
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
        aria-label="Switch language"
        aria-expanded={open}
        style={{
          padding: "4px 10px",
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
        {locale.toUpperCase()}
        <span style={{ fontSize: "8px" }}>{open ? "\u25B2" : "\u25BC"}</span>
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
            zIndex: 100,
            minWidth: "140px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              style={{
                display: "block",
                width: "100%",
                padding: "6px 10px",
                border: "none",
                borderRadius: "4px",
                background:
                  loc === locale ? "var(--accent-green)" : "transparent",
                color: loc === locale ? "#000" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: "bold", marginRight: "6px" }}>
                {loc.toUpperCase()}
              </span>
              {LOCALE_NAMES[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
