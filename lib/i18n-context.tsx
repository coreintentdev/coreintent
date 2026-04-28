"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./i18n";
import { defaultLocale, localeBcp47, formatNumber as fmtNum, formatCurrency as fmtCur, formatDate as fmtDate } from "./i18n";

type TranslateFunction = (key: string, params?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  t: TranslateFunction;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key) => key,
  formatNumber: (v) => String(v),
  formatCurrency: (v) => `$${v}`,
  formatDate: (d) => d.toLocaleDateString(),
});

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Record<string, string>;
  children: React.ReactNode;
}) {
  const t: TranslateFunction = (key, params) => {
    let msg = messages[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        msg = msg.replace(`{${k}}`, String(v));
      }
    }
    return msg;
  };

  const value: I18nContextValue = {
    locale,
    t,
    formatNumber: (v, opts) => fmtNum(v, locale, opts),
    formatCurrency: (v, cur) => fmtCur(v, locale, cur),
    formatDate: (d, opts) => fmtDate(d, locale, opts),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useTranslation() {
  const { t } = useContext(I18nContext);
  return t;
}

export function useLocale() {
  const { locale } = useContext(I18nContext);
  return locale;
}

export function useLocaleFormat() {
  const { locale } = useContext(I18nContext);
  const bcp47 = localeBcp47[locale];
  return {
    number: (v: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(bcp47, opts).format(v),
    currency: (v: number, cur = "NZD") => new Intl.NumberFormat(bcp47, { style: "currency", currency: cur }).format(v),
    date: (d: Date, opts?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(bcp47, opts).format(d),
    percent: (v: number) => new Intl.NumberFormat(bcp47, { style: "percent", maximumFractionDigits: 2 }).format(v),
  };
}
