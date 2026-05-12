"use client";

import { createContext, useContext, useMemo } from "react";
import { Locale, defaultLocale, isRtl, localeRegionMap } from "@/lib/i18n-config";

type Messages = Record<string, string | Record<string, string | Record<string, string>>>;

function getNestedValue(obj: Messages, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRtl: boolean;
  region: string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const region = localeRegionMap[locale];
    return {
      locale,
      messages,
      t(key: string, params?: Record<string, string | number>): string {
        let val = getNestedValue(messages, key);
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
          }
        }
        return val;
      },
      isRtl: isRtl(locale),
      region,
      formatNumber(value: number, options?: Intl.NumberFormatOptions) {
        return new Intl.NumberFormat(region, options).format(value);
      },
      formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
        return new Intl.DateTimeFormat(region, options).format(date);
      },
      formatCurrency(value: number, currency = "USD") {
        return new Intl.NumberFormat(region, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
      },
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: defaultLocale,
      messages: {},
      t: (key: string) => key,
      isRtl: false,
      region: "en-NZ",
      formatNumber: (v: number) => String(v),
      formatDate: (d: Date) => d.toLocaleDateString(),
      formatCurrency: (v: number) => `$${v}`,
    };
  }
  return ctx;
}

export function useTranslations() {
  return useI18n().t;
}
