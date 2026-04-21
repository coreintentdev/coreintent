"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNativeNames, isRtl, type Locale } from "@/lib/i18n-config";
import { useTranslation } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { locale: currentLocale } = useTranslation();
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
          border: "1px solid var(--border-color)",
          background: "transparent",
          color: "var(--text-secondary)",
          fontFamily: "inherit",
          fontSize: "12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>
          {currentLocale === "ar" ? "\u{1F30D}" : "\u{1F310}"}
        </span>
        {localeNativeNames[currentLocale]}
        <span style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Available languages"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: isRtl(currentLocale) ? "auto" : 0,
            left: isRtl(currentLocale) ? 0 : "auto",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            minWidth: "180px",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                fontSize: "13px",
                textDecoration: "none",
                color:
                  loc === currentLocale
                    ? "var(--accent-green)"
                    : "var(--text-primary)",
                background:
                  loc === currentLocale
                    ? "#10b98112"
                    : "transparent",
                borderBottom: "1px solid var(--border-color)",
                direction: isRtl(loc) ? "rtl" : "ltr",
              }}
            >
              <span>{localeNativeNames[loc]}</span>
              {loc === currentLocale && (
                <span style={{ color: "var(--accent-green)", fontSize: "12px" }}>
                  &#10003;
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
