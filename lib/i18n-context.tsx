"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./i18n-config";

type Dictionary = Record<string, unknown>;

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  dict: {},
  t: (key) => key,
});

function resolve(dict: Dictionary, key: string): string {
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const t = (key: string) => resolve(dict, key);
  return (
    <I18nContext.Provider value={{ locale, dict, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
