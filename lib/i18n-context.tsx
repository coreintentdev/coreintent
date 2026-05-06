"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./i18n";
import { DEFAULT_LOCALE, createTranslator, formatNumber as fmtNum, formatCurrency as fmtCur, formatDate as fmtDate, formatRelativeTime as fmtRel, isRtl, getDirection } from "./i18n";

type NestedMessages = { [key: string]: string | NestedMessages };

interface I18nContextValue {
  locale: Locale;
  messages: NestedMessages;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: Date) => string;
  isRtl: boolean;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: NestedMessages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const t = createTranslator(messages);
    return {
      locale,
      messages,
      t,
      formatNumber: (v, opts) => fmtNum(v, locale, opts),
      formatCurrency: (v, cur) => fmtCur(v, locale, cur),
      formatDate: (d, opts) => fmtDate(d, locale, opts),
      formatRelativeTime: (d) => fmtRel(d, locale),
      isRtl: isRtl(locale),
      dir: getDirection(locale),
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

export function useTranslation() {
  return useI18n();
}
