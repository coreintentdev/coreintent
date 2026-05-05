"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, localeFlags } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: open ? "var(--bg-secondary)" : "transparent",
          border: "1px solid var(--border-color)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
        }}
      >
        <span>{localeFlags[locale]}</span>
        <span>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "8px", opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "4px",
            minWidth: "180px",
            zIndex: 1000,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {locales.map((loc) => (
            <button
              key={loc}
              role="menuitem"
              onClick={() => handleSwitch(loc)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                background: loc === locale ? "#10b98118" : "transparent",
                color: loc === locale ? "var(--accent-green)" : "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                textAlign: "left",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (loc !== locale) e.currentTarget.style.background = "var(--bg-primary)";
              }}
              onMouseLeave={(e) => {
                if (loc !== locale) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "16px" }}>{localeFlags[loc]}</span>
              <span style={{ flex: 1 }}>{localeNames[loc]}</span>
              {loc === locale && (
                <span style={{ fontSize: "10px", color: "var(--accent-green)" }}>●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
