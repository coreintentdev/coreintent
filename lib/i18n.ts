import type { ReactNode } from "react";

export const SUPPORTED_LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: readonly Locale[] = ["ar"] as const;

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  mi: "Te Reo Māori",
  zh: "中文",
  ja: "日本語",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  hi: "हिन्दी",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en-NZ",
  es: "es",
  mi: "mi",
  zh: "zh-Hans",
  ja: "ja",
  pt: "pt-BR",
  fr: "fr",
  de: "de",
  ar: "ar",
  hi: "hi",
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

type NestedMessages = { [key: string]: string | NestedMessages };

const messageCache = new Map<Locale, NestedMessages>();

export async function loadMessages(locale: Locale): Promise<NestedMessages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      return loadMessages(DEFAULT_LOCALE);
    }
    return {};
  }
}

function getNestedValue(obj: NestedMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedMessages | string = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[key];
    if (current === undefined) return undefined;
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: NestedMessages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    let value = getNestedValue(messages, key);
    if (value === undefined) return key;

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  };
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_HTML_LANG[locale], options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(LOCALE_HTML_LANG[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  };
  return new Intl.DateTimeFormat(LOCALE_HTML_LANG[locale], defaults).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(LOCALE_HTML_LANG[locale], { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(-diffHr, "hour");
  return rtf.format(-diffDay, "day");
}

export function parseLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qStr] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = SUPPORTED_LOCALES.find((l) => lang === l || lang.startsWith(`${l}-`));
    if (exact) return exact;

    const prefix = lang.split("-")[0];
    const partial = SUPPORTED_LOCALES.find((l) => l === prefix);
    if (partial) return partial;
  }

  return DEFAULT_LOCALE;
}
