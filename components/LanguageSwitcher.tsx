"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_META, DEFAULT_LOCALE, type Locale, isValidLocale } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { locale: currentLocale } = useTranslation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getLocalePath = (targetLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }
    return `/${segments.join("/")}`;
  };

  const meta = LOCALE_META[currentLocale] ?? LOCALE_META[DEFAULT_LOCALE];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "13px",
          fontFamily: "inherit",
          background: open ? "var(--accent-green)" : "transparent",
          color: open ? "#000" : "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "15px" }}>{meta.flag}</span>
        <span>{meta.nativeName}</span>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>&#9662;</span>
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "4px",
            minWidth: "180px",
            zIndex: 100,
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {LOCALES.map((loc) => {
            const m = LOCALE_META[loc];
            const isActive = loc === currentLocale;
            return (
              <a
                key={loc}
                href={getLocalePath(loc)}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  textDecoration: "none",
                  background: isActive ? "var(--accent-green)" : "transparent",
                  color: isActive ? "#000" : "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "16px" }}>{m.flag}</span>
                <span style={{ flex: 1 }}>{m.nativeName}</span>
                <span style={{ fontSize: "11px", color: isActive ? "#000" : "var(--text-secondary)" }}>
                  {m.name}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
