"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type Locale, type Messages, DEFAULT_LOCALE, t as translate, formatNumber as fmtNum, formatDate as fmtDate, formatCurrency as fmtCur, formatRelativeTime as fmtRel } from "./i18n";

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatRelativeTime: (date: Date | string | number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    messages,
    t: (key, vars) => translate(messages, key, vars),
    formatNumber: (v, opts) => fmtNum(v, locale, opts),
    formatDate: (d, opts) => fmtDate(d, locale, opts),
    formatCurrency: (v, cur) => fmtCur(v, locale, cur),
    formatRelativeTime: (d) => fmtRel(d, locale),
  }), [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      messages: {} as Messages,
      t: (key: string) => key,
      formatNumber: (v: number) => String(v),
      formatDate: (d: Date | string | number) => String(d),
      formatCurrency: (v: number) => `$${v}`,
      formatRelativeTime: (d: Date | string | number) => String(d),
    };
  }
  return ctx;
}
