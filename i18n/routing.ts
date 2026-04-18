import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const SUPPORTED_LOCALES = [
  "en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_NAMES: Record<Locale, string> = {
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

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
