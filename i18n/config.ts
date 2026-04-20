export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

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

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeRegionMap: Record<Locale, string> = {
  en: "en_NZ",
  es: "es_ES",
  mi: "mi_NZ",
  zh: "zh_CN",
  ja: "ja_JP",
  pt: "pt_BR",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_SA",
  hi: "hi_IN",
};
