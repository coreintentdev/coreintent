export const SUPPORTED_LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
  mi: "Te Reo Maori",
  zh: "中文",
  ja: "日本語",
  pt: "Portugues",
  fr: "Francais",
  de: "Deutsch",
  ar: "العربية",
  hi: "हिन्दी",
};

export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  es: "es",
  mi: "mi",
  zh: "zh",
  ja: "ja",
  pt: "pt",
  fr: "fr",
  de: "de",
  ar: "ar",
  hi: "hi",
};

type Messages = Record<string, string>;

const messageCache = new Map<Locale, Messages>();

export async function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;
  try {
    const mod = await import(`@/messages/${locale}.json`);
    const messages: Messages = mod.default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      return loadMessages(DEFAULT_LOCALE);
    }
    return {};
  }
}

export function t(messages: Messages, key: string, params?: Record<string, string | number>): string {
  let value = messages[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isValidLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of preferred) {
    if (isValidLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function formatNumber(value: number, locale: Locale): string {
  const bcp47 = locale === "mi" ? "en-NZ" : locale;
  return new Intl.NumberFormat(bcp47).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  const bcp47 = locale === "mi" ? "en-NZ" : locale;
  return new Intl.NumberFormat(bcp47, { style: "currency", currency }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const bcp47 = locale === "mi" ? "en-NZ" : locale;
  return new Intl.DateTimeFormat(bcp47, options ?? { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const bcp47 = locale === "mi" ? "en-NZ" : locale;
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(bcp47, { numeric: "auto" });
  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}
