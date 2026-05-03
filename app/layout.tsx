import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coreintent.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = "https://coreintent.dev";
  const hreflangs = [
    { code: "en", bcp47: "en-NZ" },
    { code: "es", bcp47: "es" },
    { code: "mi", bcp47: "mi-NZ" },
    { code: "zh", bcp47: "zh-Hans" },
    { code: "ja", bcp47: "ja" },
    { code: "pt", bcp47: "pt-BR" },
    { code: "fr", bcp47: "fr" },
    { code: "de", bcp47: "de" },
    { code: "ar", bcp47: "ar" },
    { code: "hi", bcp47: "hi" },
  ];

  return (
    <html lang="en-NZ" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        {hreflangs.map(({ code, bcp47 }) => (
          <link key={code} rel="alternate" hrefLang={bcp47} href={`${base}/${code}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={base} />
      </head>
      <body>{children}</body>
    </html>
  );
}
