"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n-context";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
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

  function switchLocale(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    const newPath = segments.join("/");
    document.cookie = `locale=${target};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
    window.location.href = newPath;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${localeNames[locale]}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "14px" }}>{getFlagEmoji(locale)}</span>
        <span>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            padding: "4px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            listStyle: "none",
            zIndex: 100,
            minWidth: "160px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  switchLocale(l);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  background:
                    l === locale ? "var(--accent-green)" : "transparent",
                  color: l === locale ? "#000" : "var(--text-secondary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "16px" }}>{getFlagEmoji(l)}</span>
                <span>{localeNames[l]}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    opacity: 0.6,
                  }}
                >
                  {l.toUpperCase()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getFlagEmoji(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
    mi: "🇳🇿",
    zh: "🇨🇳",
    ja: "🇯🇵",
    pt: "🇧🇷",
    fr: "🇫🇷",
    de: "🇩🇪",
    ar: "🇸🇦",
    hi: "🇮🇳",
  };
  return flags[locale];
}
