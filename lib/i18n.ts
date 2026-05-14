export const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: readonly Locale[] = ["ar"];

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

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isRTL(locale: Locale): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}

type NestedMessages = { [key: string]: string | NestedMessages };

const messageCache = new Map<Locale, NestedMessages>();

export async function getMessages(locale: Locale): Promise<NestedMessages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      return getMessages(DEFAULT_LOCALE);
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
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}

export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options ?? {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHr > 0) return rtf.format(-diffHr, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}

export function getHtmlLang(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: "en-NZ",
    es: "es",
    mi: "mi-NZ",
    zh: "zh-Hans",
    ja: "ja",
    pt: "pt-BR",
    fr: "fr",
    de: "de",
    ar: "ar",
    hi: "hi",
  };
  return map[locale];
}

export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const parsed = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of parsed) {
    const base = lang.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
