"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale } from "./i18n";
import { DEFAULT_LOCALE, isValidLocale, SUPPORTED_LOCALES } from "./i18n";

type Messages = Record<string, string>;

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  messages: {},
  setLocale: () => {},
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslation() {
  const { t, locale, messages } = useContext(LocaleContext);
  return { t, locale, messages };
}

function translateFn(messages: Messages, key: string, params?: Record<string, string | number>): string {
  let value = messages[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem("coreintent-locale");
  if (stored && isValidLocale(stored)) return stored;
  const browserLang = navigator.language?.split("-")[0]?.toLowerCase();
  if (browserLang && isValidLocale(browserLang)) return browserLang;
  return DEFAULT_LOCALE;
}

export function LocaleProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialMessages?: Messages;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages>(initialMessages ?? {});

  useEffect(() => {
    if (!initialLocale) {
      const detected = getStoredLocale();
      if (detected !== locale) {
        setLocaleState(detected);
      }
    }
  }, [initialLocale, locale]);

  useEffect(() => {
    if (Object.keys(messages).length === 0 || !initialMessages) {
      import(`@/messages/${locale}.json`)
        .then((mod) => setMessages(mod.default))
        .catch(() => {
          if (locale !== DEFAULT_LOCALE) {
            import(`@/messages/${DEFAULT_LOCALE}.json`)
              .then((mod) => setMessages(mod.default))
              .catch(() => {});
          }
        });
    }
  }, [locale, messages, initialMessages]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    setLocaleState(newLocale);
    localStorage.setItem("coreintent-locale", newLocale);
    document.documentElement.lang = newLocale === "mi" ? "mi" : newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translateFn(messages, key, params),
    [messages],
  );

  return (
    <LocaleContext.Provider value={{ locale, messages, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
