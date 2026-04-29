"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./i18n";
import { localeRegions } from "./i18n";

type TranslationContextType = {
  locale: Locale;
  t: (key: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

function resolveKey(translations: Record<string, unknown>, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

export function TranslationProvider({
  locale,
  translations,
  children,
}: {
  locale: Locale;
  translations: Record<string, unknown>;
  children: ReactNode;
}) {
  const region = localeRegions[locale];

  const ctx: TranslationContextType = {
    locale,
    t: (key: string) => resolveKey(translations, key),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(region, options).format(value),
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(region, options).format(date),
  };

  return (
    <TranslationContext.Provider value={ctx}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
