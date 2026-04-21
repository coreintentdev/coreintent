import { type Locale, defaultLocale } from "./i18n-config";

type Dictionary = Record<string, unknown>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  es: () => import("@/messages/es.json").then((m) => m.default),
  mi: () => import("@/messages/mi.json").then((m) => m.default),
  zh: () => import("@/messages/en.json").then((m) => m.default),
  ja: () => import("@/messages/en.json").then((m) => m.default),
  pt: () => import("@/messages/en.json").then((m) => m.default),
  fr: () => import("@/messages/en.json").then((m) => m.default),
  de: () => import("@/messages/en.json").then((m) => m.default),
  ar: () => import("@/messages/en.json").then((m) => m.default),
  hi: () => import("@/messages/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  return loader();
}

export function t(dict: Dictionary, key: string): string {
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const { locales } = require("./i18n-config");
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";");
      const q = qPart ? parseFloat(qPart.replace("q=", "")) : 1;
      return { lang: lang.trim().toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = locales.find((l: string) => l === lang);
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    const partial = locales.find((l: string) => l === prefix);
    if (partial) return partial;
  }

  return defaultLocale;
}
