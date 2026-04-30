export const SUPPORTED_LOCALES = [
  "en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

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
  zh: "zh",
  ja: "ja",
  pt: "pt",
  fr: "fr",
  de: "de",
  ar: "ar",
  hi: "hi",
};

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function detectLocaleFromHeaders(acceptLanguage: string | null): Locale {
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

type Messages = Record<string, string | Record<string, string>>;

const messageCache = new Map<Locale, Messages>();

export async function loadMessages(locale: Locale): Promise<Messages> {
  if (messageCache.has(locale)) return messageCache.get(locale)!;
  try {
    const msgs = (await import(`@/messages/${locale}.json`)).default;
    messageCache.set(locale, msgs);
    return msgs;
  } catch {
    if (locale !== DEFAULT_LOCALE) return loadMessages(DEFAULT_LOCALE);
    return {};
  }
}

export function t(
  messages: Messages,
  key: string,
  params?: Record<string, string | number>,
): string {
  const parts = key.split(".");
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_HTML_LANG[locale], options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = "USD",
): string {
  return new Intl.NumberFormat(LOCALE_HTML_LANG[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE_HTML_LANG[locale], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Pacific/Auckland",
    ...options,
  }).format(date);
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_HTML_LANG[locale], {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
