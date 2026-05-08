export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: readonly Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

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

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q] = lang.trim().split(";q=");
      return { code: code.split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of preferred) {
    if (isValidLocale(code)) return code;
  }
  return defaultLocale;
}

type NestedMessages = { [key: string]: string | NestedMessages };

function deepMerge(base: NestedMessages, overlay: NestedMessages): NestedMessages {
  const result: NestedMessages = { ...base };
  for (const key of Object.keys(overlay)) {
    if (
      typeof overlay[key] === "object" &&
      overlay[key] !== null &&
      typeof base[key] === "object" &&
      base[key] !== null
    ) {
      result[key] = deepMerge(base[key] as NestedMessages, overlay[key] as NestedMessages);
    } else {
      result[key] = overlay[key];
    }
  }
  return result;
}

const messageLoaders: Record<Locale, () => Promise<NestedMessages>> = {
  en: () => import("../messages/en.json").then((m) => m.default),
  es: () => import("../messages/es.json").then((m) => m.default),
  mi: () => import("../messages/mi.json").then((m) => m.default),
  zh: () => import("../messages/zh.json").then((m) => m.default),
  ja: () => import("../messages/ja.json").then((m) => m.default),
  pt: () => import("../messages/pt.json").then((m) => m.default),
  fr: () => import("../messages/fr.json").then((m) => m.default),
  de: () => import("../messages/de.json").then((m) => m.default),
  ar: () => import("../messages/ar.json").then((m) => m.default),
  hi: () => import("../messages/hi.json").then((m) => m.default),
};

const cache: Partial<Record<Locale, NestedMessages>> = {};

export async function getMessages(locale: Locale): Promise<NestedMessages> {
  if (cache[locale]) return cache[locale]!;

  const enMessages =
    locale === "en"
      ? await messageLoaders.en()
      : (cache.en ?? (await messageLoaders.en()));
  if (!cache.en) cache.en = enMessages;

  if (locale === "en") {
    return enMessages;
  }

  try {
    const localeMessages = await messageLoaders[locale]();
    const merged = deepMerge(enMessages, localeMessages);
    cache[locale] = merged;
    return merged;
  } catch {
    cache[locale] = enMessages;
    return enMessages;
  }
}

function getNestedValue(obj: NestedMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedMessages | string = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: NestedMessages) {
  return function t(
    key: string,
    params?: Record<string, string | number>,
  ): string {
    let value = getNestedValue(messages, key);
    if (!value) return key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  };
}

const intlLocaleMap: Record<Locale, string> = {
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

export function getIntlLocale(locale: Locale): string {
  return intlLocaleMap[locale];
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(intlLocaleMap[locale], options).format(value);
}

export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(intlLocaleMap[locale], options).format(date);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = "USD",
): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

export function formatPercent(value: number, locale: Locale): string {
  return formatNumber(value / 100, locale, {
    style: "percent",
    minimumFractionDigits: 2,
  });
}
