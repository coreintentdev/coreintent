import { i18nConfig, type Locale } from "./i18n-config";

export type Dictionary = Record<string, string | Record<string, string | Record<string, string>>>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  es: () => import("@/messages/es.json").then((m) => m.default),
  mi: () => import("@/messages/mi.json").then((m) => m.default),
  zh: () => import("@/messages/zh.json").then((m) => m.default),
  ja: () => import("@/messages/ja.json").then((m) => m.default),
  pt: () => import("@/messages/pt.json").then((m) => m.default),
  fr: () => import("@/messages/fr.json").then((m) => m.default),
  de: () => import("@/messages/de.json").then((m) => m.default),
  ar: () => import("@/messages/ar.json").then((m) => m.default),
  hi: () => import("@/messages/hi.json").then((m) => m.default),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  const loader = dictionaries[locale] || dictionaries[i18nConfig.defaultLocale];
  return loader();
}

export function t(dict: Dictionary, key: string): string {
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
}

const localeToDateLocale: Record<string, string> = {
  en: "en-NZ",
  es: "es-ES",
  mi: "mi-NZ",
  zh: "zh-CN",
  ja: "ja-JP",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  hi: "hi-IN",
};

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const dateLocale = localeToDateLocale[locale] || locale;
  return new Intl.DateTimeFormat(dateLocale, options ?? {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const dateLocale = localeToDateLocale[locale] || locale;
  return new Intl.NumberFormat(dateLocale, options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  const dateLocale = localeToDateLocale[locale] || locale;
  return new Intl.NumberFormat(dateLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale): string {
  const dateLocale = localeToDateLocale[locale] || locale;
  return new Intl.NumberFormat(dateLocale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
