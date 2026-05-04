"use client";

import { createContext, useContext, useCallback } from "react";
import type { Locale, Messages } from "./i18n";
import {
  defaultLocale,
  formatNumber as fmtNum,
  formatDate as fmtDate,
  formatCurrency as fmtCurrency,
} from "./i18n";

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  t: (
    section: string,
    key: string,
    replacements?: Record<string, string>,
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (
      section: string,
      key: string,
      replacements?: Record<string, string>,
    ): string => {
      let value = messages[section]?.[key] || key;
      if (replacements) {
        for (const [k, v] of Object.entries(replacements)) {
          value = value.replace(`{${k}}`, v);
        }
      }
      return value;
    },
    [messages],
  );

  const formatNumberFn = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      fmtNum(value, locale, options),
    [locale],
  );

  const formatDateFn = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) =>
      fmtDate(date, locale, options),
    [locale],
  );

  const formatCurrencyFn = useCallback(
    (value: number, currency = "USD") => fmtCurrency(value, locale, currency),
    [locale],
  );

  const localePath = useCallback(
    (path: string) => `/${locale}${path === "/" ? "" : path}`,
    [locale],
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        messages,
        t,
        formatNumber: formatNumberFn,
        formatDate: formatDateFn,
        formatCurrency: formatCurrencyFn,
        localePath,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: defaultLocale as Locale,
      messages: {} as Messages,
      t: (_section: string, key: string) => key,
      formatNumber: (value: number) => value.toString(),
      formatDate: (date: Date) => date.toLocaleDateString(),
      formatCurrency: (value: number) => `$${value}`,
      localePath: (path: string) => path,
    };
  }
  return ctx;
}

export function useLocale(): Locale {
  return useTranslations().locale;
}
