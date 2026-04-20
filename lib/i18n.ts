import { type Locale, locales, defaultLocale, isRtl, localeRegionMap } from "@/i18n/config";

export { type Locale, locales, defaultLocale, isRtl };

const TIMEZONE_MAP: Record<Locale, string> = {
  en: "Pacific/Auckland",
  es: "Europe/Madrid",
  mi: "Pacific/Auckland",
  zh: "Asia/Shanghai",
  ja: "Asia/Tokyo",
  pt: "America/Sao_Paulo",
  fr: "Europe/Paris",
  de: "Europe/Berlin",
  ar: "Asia/Riyadh",
  hi: "Asia/Kolkata",
};

const CURRENCY_MAP: Record<Locale, string> = {
  en: "NZD",
  es: "EUR",
  mi: "NZD",
  zh: "CNY",
  ja: "JPY",
  pt: "BRL",
  fr: "EUR",
  de: "EUR",
  ar: "SAR",
  hi: "INR",
};

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  return new Intl.NumberFormat(resolvedLocale, options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency?: string): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currency ?? CURRENCY_MAP[locale] ?? "USD",
  }).format(value);
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  return new Intl.DateTimeFormat(resolvedLocale, {
    timeZone: TIMEZONE_MAP[locale] ?? "Pacific/Auckland",
    ...options,
  }).format(date);
}

export function formatDateTime(date: Date, locale: Locale): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date, locale: Locale): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(resolvedLocale, { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHr > 0) return rtf.format(-diffHr, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}

export function formatPercent(value: number, locale: Locale, decimals = 2): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatPrice(value: number, locale: Locale, decimals?: number): string {
  const resolvedLocale = localeRegionMap[locale]?.replace("_", "-") ?? "en-NZ";
  const dec = decimals ?? (value < 1 ? 4 : value < 100 ? 2 : 0);
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(value);
}

export function getTimezone(locale: Locale): string {
  return TIMEZONE_MAP[locale] ?? "Pacific/Auckland";
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function getTerminalGreeting(locale: Locale): string {
  const greetings: Record<Locale, string> = {
    en: "Welcome to CoreIntent Commander. Type help for commands.",
    es: "Bienvenido a CoreIntent Commander. Escribe help para comandos.",
    mi: "Nau mai ki CoreIntent Commander. Patohia help mo nga tohutohu.",
    zh: "欢迎使用 CoreIntent 指挥官。输入 help 查看命令。",
    ja: "CoreIntent コマンダーへようこそ。help でコマンド一覧を表示。",
    pt: "Bem-vindo ao CoreIntent Commander. Digite help para comandos.",
    fr: "Bienvenue sur CoreIntent Commander. Tapez help pour les commandes.",
    de: "Willkommen bei CoreIntent Commander. Tippe help fur Befehle.",
    ar: "مرحباً بك في CoreIntent Commander. اكتب help لعرض الأوامر.",
    hi: "CoreIntent Commander में आपका स्वागत है। कमांड के लिए help टाइप करें।",
  };
  return greetings[locale] ?? greetings.en;
}

export function getHrefLangs(): { locale: Locale; href: string }[] {
  return locales.map((locale) => ({
    locale,
    href: locale === defaultLocale
      ? "https://coreintent.dev"
      : `https://coreintent.dev/${locale}`,
  }));
}
