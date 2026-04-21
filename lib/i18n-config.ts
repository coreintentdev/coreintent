export const defaultLocale = "en" as const;

export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
  mi: "Te Reo Maori",
  zh: "Chinese",
  ja: "Japanese",
  pt: "Portugues",
  fr: "Francais",
  de: "Deutsch",
  ar: "Arabic",
  hi: "Hindi",
};

export const localeNativeNames: Record<Locale, string> = {
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

export const localeHtmlLang: Record<Locale, string> = {
  en: "en-NZ",
  es: "es",
  mi: "mi-NZ",
  zh: "zh",
  ja: "ja",
  pt: "pt",
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
