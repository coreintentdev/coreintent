import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, getDirection, getHtmlLang, getMessages, createTranslator } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import LocaleLayoutClient from "@/components/LocaleLayoutClient";
import "../globals.css";

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

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const base = "https://coreintent.dev";

  const alternates: Record<string, string> = {};
  for (const loc of LOCALES) {
    alternates[getHtmlLang(loc)] = `${base}/${loc}`;
  }

  return {
    title: {
      default: t("meta.title"),
      template: t("meta.titleTemplate"),
    },
    description: t("meta.description"),
    metadataBase: new URL(base),
    alternates: {
      canonical: `${base}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: getHtmlLang(locale).replace("-", "_"),
      url: `${base}/${locale}`,
      siteName: "CoreIntent",
      title: t("meta.title"),
      description: t("meta.description"),
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "CoreIntent — Agentic AI Trading Engine powered by Claude, Grok & Perplexity",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CoreIntent | AI Trading Competitions",
      description: t("meta.description"),
      creator: "@coreintentai",
      site: "@coreintentai",
      images: ["/opengraph-image.png"],
    },
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
    keywords: [
      "AI trading", "trading signals", "paper trading", "trading competitions",
      "Claude", "Grok", "Perplexity", "crypto", "cryptocurrency", "agentic AI",
      "multi-model AI", "algorithmic trading", "AI agents", "CoreIntent", "Zynthio",
    ],
    category: "Finance",
    formatDetection: { email: false, address: false, telephone: false },
    other: {
      "msapplication-TileColor": "#0a0e17",
      "color-scheme": "dark",
      "geo.region": "NZ",
      "geo.placename": "New Zealand",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://coreintent.dev/#person",
      name: "Corey McIvor",
      email: "corey@coreyai.ai",
      url: "https://zynthio.ai",
      jobTitle: "Founder & Developer",
      worksFor: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
      sameAs: ["https://github.com/coreintentdev", "https://x.com/coreintentai"],
      nationality: { "@type": "Country", name: "New Zealand" },
    },
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      url: "https://zynthio.ai",
      founder: { "@type": "Person", "@id": "https://coreintent.dev/#person" },
      foundingDate: "2026",
      foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "NZ" } },
    },
    {
      "@type": "WebApplication",
      "@id": "https://coreintent.dev/#application",
      name: "CoreIntent",
      url: "https://coreintent.dev",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NZD" },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      inLanguage: ["en-NZ", "es", "mi-NZ", "zh-Hans", "ja", "pt-BR", "fr", "de", "ar", "hi"],
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dir = getDirection(locale);
  const htmlLang = getHtmlLang(locale);
  const messages = await getMessages(locale);

  return (
    <html lang={htmlLang} dir={dir} className={jetbrainsMono.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <LocaleLayoutClient locale={locale} messages={messages}>
          {children}
        </LocaleLayoutClient>
      </body>
    </html>
  );
}
