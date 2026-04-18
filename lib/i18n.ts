import { RTL_LOCALES } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

const LOCALE_BCP47: Record<string, string> = {
  en: "en-NZ",
  es: "es-419",
  mi: "mi-NZ",
  zh: "zh-CN",
  ja: "ja-JP",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  hi: "hi-IN",
};

const LOCALE_TIMEZONE: Record<string, string> = {
  en: "Pacific/Auckland",
  mi: "Pacific/Auckland",
  es: "America/Mexico_City",
  zh: "Asia/Shanghai",
  ja: "Asia/Tokyo",
  pt: "America/Sao_Paulo",
  fr: "Europe/Paris",
  de: "Europe/Berlin",
  ar: "Asia/Riyadh",
  hi: "Asia/Kolkata",
};

function bcp47(locale: string): string {
  return LOCALE_BCP47[locale] || "en-NZ";
}

export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: LOCALE_TIMEZONE[locale] || "Pacific/Auckland",
  };
  return new Intl.DateTimeFormat(bcp47(locale), { ...defaults, ...options }).format(date);
}

export function formatTime(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: LOCALE_TIMEZONE[locale] || "Pacific/Auckland",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat(bcp47(locale), { ...defaults, ...options }).format(date);
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(bcp47(locale), options).format(value);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency = "USD",
): string {
  return new Intl.NumberFormat(bcp47(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(
  value: number,
  locale: string,
  decimals = 1,
): string {
  return new Intl.NumberFormat(bcp47(locale), {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatRelativeTime(
  seconds: number,
  locale: string,
): string {
  const rtf = new Intl.RelativeTimeFormat(bcp47(locale), { numeric: "auto" });
  if (Math.abs(seconds) < 60) return rtf.format(Math.round(seconds), "second");
  if (Math.abs(seconds) < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (Math.abs(seconds) < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86400), "day");
}
