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

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = "USD",
): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
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

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], {
    numeric: "auto",
  });

  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}

export function getLocaleTag(locale: Locale): string {
  return localeMap[locale];
}
