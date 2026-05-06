import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { LOCALE_HTML_LANG, isRtl, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coreintent.dev"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale") ?? "en";
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const lang = LOCALE_HTML_LANG[locale];
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className={jetbrainsMono.variable}>
      <body>{children}</body>
    </html>
  );
}
