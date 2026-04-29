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

export const localeRegions: Record<Locale, string> = {
  en: "en-NZ",
  es: "es-ES",
  mi: "mi-NZ",
  zh: "zh-CN",
  ja: "ja-JP",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  hi: "hi-IN",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(
        (base[key] as Record<string, unknown>) || {},
        override[key] as Record<string, unknown>,
      );
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

async function loadLocaleMessages(
  locale: Locale,
): Promise<Record<string, unknown>> {
  switch (locale) {
    case "es":
      return (await import("@/messages/es.json")).default;
    case "mi":
      return (await import("@/messages/mi.json")).default;
    case "zh":
      return (await import("@/messages/zh.json")).default;
    case "ja":
      return (await import("@/messages/ja.json")).default;
    case "pt":
      return (await import("@/messages/pt.json")).default;
    case "fr":
      return (await import("@/messages/fr.json")).default;
    case "de":
      return (await import("@/messages/de.json")).default;
    case "ar":
      return (await import("@/messages/ar.json")).default;
    case "hi":
      return (await import("@/messages/hi.json")).default;
    default:
      return {};
  }
}

export async function getTranslations(
  locale: Locale,
): Promise<Record<string, unknown>> {
  const en = (await import("@/messages/en.json")).default;
  if (locale === "en") return en;
  const localeMessages = await loadLocaleMessages(locale);
  return deepMerge(en, localeMessages);
}

export function t(translations: Record<string, unknown>, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeRegions[locale], options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = "USD",
): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(localeRegions[locale], options).format(date);
}

export function formatPercent(value: number, locale: Locale): string {
  return formatNumber(value / 100, locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of preferred) {
    if (isValidLocale(lang)) return lang;
    const base = lang.split("-")[0];
    if (isValidLocale(base)) return base;
  }
  return defaultLocale;
}

export function getHreflangLinks(pathname: string): { locale: Locale; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const pathWithoutLocale =
    first && isValidLocale(first)
      ? "/" + segments.slice(1).join("/")
      : pathname;
  return locales.map((locale) => ({
    locale,
    href: `https://coreintent.dev/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
  }));
}
