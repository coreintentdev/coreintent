export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const rtlLocales: readonly Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
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

export const localeFlags: Record<Locale, string> = {
  en: "🇳🇿",
  es: "🇪🇸",
  mi: "🇳🇿",
  zh: "🇨🇳",
  ja: "🇯🇵",
  pt: "🇧🇷",
  fr: "🇫🇷",
  de: "🇩🇪",
  ar: "🇸🇦",
  hi: "🇮🇳",
};

export const localeBcp47: Record<Locale, string> = {
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

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

type Messages = Record<string, string>;

const messageCache = new Map<Locale, Messages>();

export async function getMessages(locale: Locale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  try {
    const mod = await import(`@/messages/${locale}.json`);
    const messages: Messages = mod.default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    return {};
  }
}

export function createTranslator(messages: Messages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    let msg = messages[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        msg = msg.replace(`{${k}}`, String(v));
      }
    }
    return msg;
  };
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeBcp47[locale], options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "NZD"): string {
  return new Intl.NumberFormat(localeBcp47[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(localeBcp47[locale], options ?? {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(localeBcp47[locale], { numeric: "auto" });

  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}

export function extractLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : defaultLocale;
}

export function stripLocaleFromPath(pathname: string): string {
  const segment = pathname.split("/")[1];
  if (isLocale(segment)) {
    return pathname.replace(`/${segment}`, "") || "/";
  }
  return pathname;
}
