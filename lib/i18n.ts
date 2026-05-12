import { Locale, defaultLocale, locales, localeRegionMap } from "./i18n-config";

type Messages = Record<string, string | Record<string, string | Record<string, string>>>;

const messageCache = new Map<Locale, Messages>();

export async function getMessages(locale: Locale): Promise<Messages> {
  if (messageCache.has(locale)) return messageCache.get(locale)!;
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    return {};
  }
}

export function getNestedValue(obj: Messages, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function createTranslator(messages: Messages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    let value = getNestedValue(messages, key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  };
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeRegionMap[locale], options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(localeRegionMap[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(localeRegionMap[locale], options).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(localeRegionMap[locale], { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(-diffHr, "hour");
  return rtf.format(-diffDay, "day");
}

export function parseLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  if (segment && (locales as readonly string[]).includes(segment)) {
    return segment as Locale;
  }
  return defaultLocale;
}

export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = locales.find((l) => lang === l || lang === localeRegionMap[l].toLowerCase());
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    const match = locales.find((l) => l === prefix);
    if (match) return match;
  }
  return defaultLocale;
}
