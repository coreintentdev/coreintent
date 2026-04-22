export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"],
  localeNames: {
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
  } as Record<string, string>,
  rtlLocales: ["ar"],
} as const;

export type Locale = (typeof i18nConfig)["locales"][number];

export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale);
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return i18nConfig.rtlLocales.includes(locale as never) ? "rtl" : "ltr";
}
