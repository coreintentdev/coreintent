export const defaultLocale = "en" as const;

export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;

export type Locale = (typeof locales)[number];

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

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeRegionMap: Record<Locale, string> = {
  en: "en-NZ",
  es: "es-419",
  mi: "mi-NZ",
  zh: "zh-CN",
  ja: "ja-JP",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  hi: "hi-IN",
};
