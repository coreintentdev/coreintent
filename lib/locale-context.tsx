"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type Locale, DEFAULT_LOCALE, isRtl, LOCALE_HTML_LANG } from "./i18n";
import enMessages from "@/messages/en.json";

type Messages = Record<string, string | Record<string, string>>;

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  htmlLang: string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatPercent: (value: number) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveKey(messages: Messages, key: string): string {
  const parts = key.split(".");
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(() => {
    const htmlLang = LOCALE_HTML_LANG[locale] || locale;
    return {
      locale,
      messages,
      dir: isRtl(locale) ? "rtl" : "ltr",
      htmlLang,
      t(key: string, params?: Record<string, string | number>) {
        let result = resolveKey(messages, key);
        if (params) {
          result = result.replace(/\{(\w+)\}/g, (_, k) =>
            params[k] !== undefined ? String(params[k]) : `{${k}}`,
          );
        }
        return result;
      },
      formatNumber(value: number, options?: Intl.NumberFormatOptions) {
        return new Intl.NumberFormat(htmlLang, options).format(value);
      },
      formatCurrency(value: number, currency = "USD") {
        return new Intl.NumberFormat(htmlLang, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
      },
      formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
        return new Intl.DateTimeFormat(htmlLang, {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Pacific/Auckland",
          ...options,
        }).format(date);
      },
      formatPercent(value: number) {
        return new Intl.NumberFormat(htmlLang, {
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        }).format(value / 100);
      },
    };
  }, [locale, messages]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx) return ctx;

  const htmlLang = "en-NZ";
  const msgs = enMessages as Messages;
  return {
    locale: DEFAULT_LOCALE,
    messages: msgs,
    dir: "ltr",
    htmlLang,
    t(key: string, params?: Record<string, string | number>) {
      let result = resolveKey(msgs, key);
      if (params) {
        result = result.replace(/\{(\w+)\}/g, (_, k) =>
          params[k] !== undefined ? String(params[k]) : `{${k}}`,
        );
      }
      return result;
    },
    formatNumber: (v, opts) => new Intl.NumberFormat(htmlLang, opts).format(v),
    formatCurrency: (v, c = "USD") =>
      new Intl.NumberFormat(htmlLang, {
        style: "currency",
        currency: c,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(v),
    formatDate: (d, opts) =>
      new Intl.DateTimeFormat(htmlLang, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Pacific/Auckland",
        ...opts,
      }).format(d),
    formatPercent: (v) =>
      new Intl.NumberFormat(htmlLang, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }).format(v / 100),
  };
}
