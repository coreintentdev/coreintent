export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.has(locale as Locale);
}

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

export const LOCALE_TO_BCP47: Record<Locale, string> = {
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

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
