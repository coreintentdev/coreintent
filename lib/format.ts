import { type Locale, localeHtmlLang } from "./i18n-config";

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeHtmlLang[locale], options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(localeHtmlLang[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeHtmlLang[locale], {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Intl.DateTimeFormat(localeHtmlLang[locale], defaults).format(date);
}

export function formatDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeHtmlLang[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(localeHtmlLang[locale], { numeric: "auto" });

  if (diffDays > 0) return rtf.format(-diffDays, "day");
  if (diffHours > 0) return rtf.format(-diffHours, "hour");
  if (diffMinutes > 0) return rtf.format(-diffMinutes, "minute");
  return rtf.format(-diffSeconds, "second");
}

export function formatCompactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeHtmlLang[locale], {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
