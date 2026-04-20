"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");
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

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("selectLanguage")}
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "inherit",
          background: "transparent",
          border: "1px solid var(--border-color)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>{getFlag(locale)}</span>
        <span>{localeNames[locale]}</span>
        <span style={{ fontSize: "10px" }}>{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("selectLanguage")}
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
            minWidth: "180px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => switchLocale(l)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 12px",
                background: l === locale ? "#10b98122" : "transparent",
                border: "none",
                borderRadius: "6px",
                color:
                  l === locale
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "16px" }}>{getFlag(l)}</span>
              <span>{localeNames[l]}</span>
              {l === locale && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--accent-green)",
                    fontSize: "10px",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "\uD83C\uDDF3\uD83C\uDDFF",
    es: "\uD83C\uDDEA\uD83C\uDDF8",
    mi: "\uD83C\uDDF3\uD83C\uDDFF",
    zh: "\uD83C\uDDE8\uD83C\uDDF3",
    ja: "\uD83C\uDDEF\uD83C\uDDF5",
    pt: "\uD83C\uDDE7\uD83C\uDDF7",
    fr: "\uD83C\uDDEB\uD83C\uDDF7",
    de: "\uD83C\uDDE9\uD83C\uDDEA",
    ar: "\uD83C\uDDF8\uD83C\uDDE6",
    hi: "\uD83C\uDDEE\uD83C\uDDF3",
  };
  return flags[locale] ?? "\uD83C\uDF10";
}
