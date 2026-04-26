import type { Locale } from "@/i18n/config";

const localeMap: Record<Locale, string> = {
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

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeMap[locale], options).format(value);
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Pacific/Auckland",
    ...options,
  }).format(d);
}

export function getLocaleTag(locale: Locale): string {
  return localeMap[locale];
}
