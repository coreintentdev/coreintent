"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_NAMES, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const segments = pathname.split("/");
  const currentLocale: Locale = isLocale(segments[1]) ? (segments[1] as Locale) : "en";

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
    const newSegments = [...segments];
    if (isLocale(newSegments[1])) {
      newSegments[1] = locale;
    } else {
      newSegments.splice(1, 0, locale);
    }
    window.location.href = newSegments.join("/") || "/";
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        aria-expanded={open}
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
        {LOCALE_NAMES[currentLocale]}
        <span style={{ fontSize: "10px", opacity: 0.6 }}>&#9662;</span>
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
            zIndex: 1000,
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
          role="menu"
        >
          {LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              role="menuitem"
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: locale === currentLocale ? "var(--accent-green)" : "transparent",
                color: locale === currentLocale ? "#000" : "var(--text-secondary)",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: locale === currentLocale ? "bold" : "normal" }}>
                {LOCALE_NAMES[locale]}
              </span>
              <span style={{
                marginLeft: "8px",
                fontSize: "11px",
                opacity: 0.6,
                textTransform: "uppercase",
              }}>
                {locale}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
