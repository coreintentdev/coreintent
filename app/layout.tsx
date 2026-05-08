import type { Viewport } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono } from "next/font/google";
import { isValidLocale, isRtl, type Locale } from "@/lib/i18n";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e17" },
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale") || "en";
  const locale: Locale = isValidLocale(localeHeader) ? localeHeader : "en";
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const langTag = locale === "en" ? "en-NZ" : locale;

  return (
    <html lang={langTag} dir={dir} className={jetbrainsMono.variable}>
      <body>{children}</body>
    </html>
  );
}
