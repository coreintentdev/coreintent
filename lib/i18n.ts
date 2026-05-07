import { type Locale, defaultLocale, isValidLocale } from "./i18n-config";

type NestedMessages = { [key: string]: string | NestedMessages };

const messageCache = new Map<Locale, NestedMessages>();

export async function getMessages(locale: Locale): Promise<NestedMessages> {
  if (messageCache.has(locale)) {
    return messageCache.get(locale)!;
  }

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
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
      for (const [param, replacement] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${param}\\}`, "g"), String(replacement));
      }
    }

    return value;
  };
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, "hour");
  return rtf.format(-diffDay, "day");
}

export function detectLocaleFromHeaders(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = lang.split("-")[0];
    if (isValidLocale(exact)) return exact;
  }

  return defaultLocale;
}
