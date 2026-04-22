"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n-context";
import { i18nConfig } from "@/lib/i18n-config";

export default function LanguageSwitcher() {
  const { locale, t } = useTranslation();
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

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    window.location.href = segments.join("/");
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
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>
          {locale === "ar" ? "ع" : locale.toUpperCase()}
        </span>
        <span style={{ fontSize: "10px" }}>
          {open ? "▲" : "▼"}
        </span>
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
          {i18nConfig.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setOpen(false);
                if (loc !== locale) switchLocale(loc);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                border: "none",
                borderBottom: "1px solid var(--border-color)",
                background: loc === locale ? "var(--accent-green)11" : "transparent",
                color: loc === locale ? "var(--accent-green)" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              <span>{i18nConfig.localeNames[loc]}</span>
              {loc === locale && (
                <span style={{ fontSize: "10px", color: "var(--accent-green)" }}>
                  ●
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
