"use client";

import { LocaleProvider } from "@/lib/locale-context";
import type { Locale } from "@/lib/i18n";

type Messages = { [key: string]: string | Messages };

export default function LocaleLayoutClient({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale} messages={messages}>
      {children}
    </LocaleProvider>
  );
}
