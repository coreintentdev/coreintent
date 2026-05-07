export const defaultLocale = "en" as const;

export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;

export type Locale = (typeof locales)[number];

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

export const localeBcp47: Record<Locale, string> = {
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

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
