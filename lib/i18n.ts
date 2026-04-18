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

export function toOpenGraphLocale(locale: string): string {
  return bcp47(locale).replace(/-/g, "_");
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
