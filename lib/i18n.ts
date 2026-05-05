export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
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

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export function getHreflangLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
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
  return map[locale];
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getHreflangLocale(locale), options).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(getHreflangLocale(locale), options).format(date);
}

export function formatCurrency(value: number, locale: Locale, currency = "NZD"): string {
  return new Intl.NumberFormat(getHreflangLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}
