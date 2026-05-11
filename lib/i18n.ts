export const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_META: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "🇳🇿" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  mi: { name: "Māori", nativeName: "Te Reo Māori", flag: "🇳🇿" },
  zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
};

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export type Messages = Record<string, string | Record<string, string>>;

const messageCache = new Map<Locale, Messages>();

export async function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default as Messages;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      return loadMessages(DEFAULT_LOCALE);
    }
    return {};
  }
}

export function t(messages: Messages, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split(".");
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;

  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeToIntl(locale), options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "USD"): string {
  return new Intl.NumberFormat(localeToIntl(locale), { style: "currency", currency }).format(value);
}

export function formatDate(date: Date | string | number, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(localeToIntl(locale), options).format(d);
}

export function formatRelativeTime(date: Date | string | number, locale: Locale): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(localeToIntl(locale), { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  return rtf.format(diffDay, "day");
}

function localeToIntl(locale: Locale): string {
  const map: Partial<Record<Locale, string>> = {
    en: "en-NZ",
    mi: "mi-NZ",
    zh: "zh-CN",
  };
  return map[locale] ?? locale;
}

export function getHtmlLang(locale: Locale): string {
  return localeToIntl(locale);
}

export function getAlternateLinks(path: string): { locale: Locale; href: string }[] {
  return LOCALES.map((locale) => ({
    locale,
    href: `https://coreintent.dev/${locale}${path === "/" ? "" : path}`,
  }));
}
