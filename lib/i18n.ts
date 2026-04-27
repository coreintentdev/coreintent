export const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"];

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

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

type NestedMessages = { [key: string]: string | NestedMessages };

const messageCache = new Map<Locale, NestedMessages>();

export async function getMessages(locale: Locale): Promise<NestedMessages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    return {};
  }
}

function resolve(obj: NestedMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedMessages | string = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: NestedMessages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    let value = resolve(messages, key);
    if (!value) return key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  };
}

const localeToDateOptions: Record<Locale, Intl.DateTimeFormatOptions & { locale: string }> = {
  en: { locale: "en-NZ", timeZone: "Pacific/Auckland" },
  es: { locale: "es-ES", timeZone: "Europe/Madrid" },
  mi: { locale: "en-NZ", timeZone: "Pacific/Auckland" },
  zh: { locale: "zh-CN", timeZone: "Asia/Shanghai" },
  ja: { locale: "ja-JP", timeZone: "Asia/Tokyo" },
  pt: { locale: "pt-BR", timeZone: "America/Sao_Paulo" },
  fr: { locale: "fr-FR", timeZone: "Europe/Paris" },
  de: { locale: "de-DE", timeZone: "Europe/Berlin" },
  ar: { locale: "ar-SA", timeZone: "Asia/Riyadh" },
  hi: { locale: "hi-IN", timeZone: "Asia/Kolkata" },
};

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const base = localeToDateOptions[locale];
  return new Intl.DateTimeFormat(base.locale, {
    timeZone: base.timeZone,
    ...options,
  }).format(date);
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const base = localeToDateOptions[locale];
  return new Intl.NumberFormat(base.locale, options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

export function getTerminalGreeting(locale: Locale): string {
  const greetings: Record<Locale, string> = {
    en: "Welcome to CoreIntent Commander",
    es: "Bienvenido a CoreIntent Commander",
    mi: "Nau mai ki CoreIntent Commander",
    zh: "欢迎来到 CoreIntent 指挥官",
    ja: "CoreIntent コマンダーへようこそ",
    pt: "Bem-vindo ao CoreIntent Commander",
    fr: "Bienvenue sur CoreIntent Commander",
    de: "Willkommen bei CoreIntent Commander",
    ar: "مرحبا بك في CoreIntent Commander",
    hi: "CoreIntent कमांडर में आपका स्वागत है",
  };
  return greetings[locale] ?? greetings.en;
}
