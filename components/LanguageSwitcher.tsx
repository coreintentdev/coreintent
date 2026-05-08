"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale, isValidLocale } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n-client";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    if (segments.length > 1 && isValidLocale(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.push(segments.join("/") || "/");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        aria-expanded={open}
        style={{
          padding: "6px 12px",
          background: "transparent",
          border: "1px solid var(--border-color)",
          borderRadius: "6px",
          color: "var(--text-secondary)",
          fontSize: "12px",
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>{locale.toUpperCase()}</span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
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
            minWidth: "170px",
            maxHeight: "320px",
            overflowY: "auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
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
                gap: "10px",
                width: "100%",
                padding: "8px 14px",
                background: l === locale ? "var(--accent-green)" : "transparent",
                color: l === locale ? "#000" : "var(--text-secondary)",
                border: "none",
                fontFamily: "inherit",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>{localeNames[l]}</span>
              <span
                style={{
                  marginLeft: "auto",
                  opacity: 0.5,
                  fontSize: "10px",
                }}
              >
                {l.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
