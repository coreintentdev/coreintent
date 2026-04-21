import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coreintent.dev"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Corey McIvor", url: "https://zynthio.ai" }],
  creator: "Corey McIvor",
  publisher: "Zynthio",
  category: "Finance",
};

const RTL_LOCALES = ["ar"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  const langMap: Record<string, string> = {
    en: "en-NZ",
    es: "es",
    mi: "mi-NZ",
    zh: "zh",
    ja: "ja",
    pt: "pt",
    fr: "fr",
    de: "de",
    ar: "ar",
    hi: "hi",
  };

  return (
    <html lang={langMap[locale] || "en-NZ"} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
