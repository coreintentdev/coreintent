"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./i18n-config";
import { defaultLocale } from "./i18n-config";

type NestedMessages = { [key: string]: string | NestedMessages };

interface LocaleContextValue {
  locale: Locale;
  messages: NestedMessages;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  messages: {},
  t: (key) => key,
});

function getNestedValue(obj: NestedMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedMessages | string = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[key];
    if (current === undefined) return undefined;
  }
  return typeof current === "string" ? current : undefined;
}

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: NestedMessages;
  children: React.ReactNode;
}) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(messages, key);
    if (value === undefined) return key;
    if (params) {
      for (const [param, replacement] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${param}\\}`, "g"), String(replacement));
      }
    }
    return value;
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
