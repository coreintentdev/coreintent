"use client";

import { createContext, useContext, useCallback } from "react";
import type { Locale } from "./i18n";

type Messages = { [key: string]: string | Messages };

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Messages, path: string): string | undefined {
  const keys = path.split(".");
  let current: Messages | string = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(messages, key);
      if (!value) return key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return value;
    },
    [messages],
  );

  return (
    <I18nContext.Provider value={{ locale, messages, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      messages: {},
      t: (key: string) => key,
    };
  }
  return ctx;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  return ctx?.locale ?? "en";
}
