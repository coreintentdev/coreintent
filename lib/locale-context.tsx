"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

type Messages = { [key: string]: string | Messages };

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  messages: {},
  t: (key: string) => key,
});

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let current: Messages | string = messages;
    for (const k of keys) {
      if (typeof current !== "object" || current === null) return key;
      current = current[k];
    }
    if (typeof current !== "string") return key;
    let value = current;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  }

  return (
    <LocaleContext.Provider value={{ locale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
