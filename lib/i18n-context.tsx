"use client";

import { createContext, useContext, useCallback } from "react";
import type { Dictionary } from "./i18n";
import type { Locale } from "./i18n-config";

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  dir,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  const translate = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      let current: unknown = dict;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return key;
        }
      }
      return typeof current === "string" ? current : key;
    },
    [dict]
  );

  return (
    <I18nContext.Provider value={{ locale, dict, t: translate, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return ctx;
}
