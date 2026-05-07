import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, type Locale, localeBcp47, getDirection } from "@/lib/i18n-config";
import { getMessages } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";

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
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);
  const meta = messages.meta as Record<string, string> | undefined;
  const title = meta?.title ?? "CoreIntent | Agentic AI Trading Engine";
  const description = meta?.description ?? "Three AI models. One trading engine. Zero subscriptions.";
  const bcp47 = localeBcp47[locale as Locale] ?? "en-NZ";

  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[localeBcp47[loc]] = `https://coreintent.dev/${loc}`;
  }

  return {
    title: {
      default: title,
      template: "%s | CoreIntent",
    },
    description,
    metadataBase: new URL("https://coreintent.dev"),
    alternates: {
      canonical: `https://coreintent.dev/${locale === "en" ? "" : locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: bcp47,
      url: `https://coreintent.dev/${locale === "en" ? "" : locale}`,
      siteName: "CoreIntent",
      title: title,
      description,
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
      description,
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
      "New Zealand", "bot trading", "free trading platform",
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
      knowsAbout: ["Artificial Intelligence", "Cryptocurrency Trading", "Multi-Model AI Orchestration", "Software Engineering"],
      nationality: { "@type": "Country", name: "New Zealand" },
    },
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      alternateName: "Zynthio.ai",
      url: "https://zynthio.ai",
      description: "Parent brand behind CoreIntent — building agentic AI trading tools with multi-model orchestration. Based in New Zealand.",
      logo: { "@type": "ImageObject", url: "https://coreintent.dev/opengraph-image.png", width: 1200, height: 630 },
      founder: { "@type": "Person", "@id": "https://coreintent.dev/#person" },
      foundingDate: "2026",
      foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "NZ" } },
      areaServed: { "@type": "Country", name: "New Zealand" },
      sameAs: ["https://github.com/coreintentdev", "https://x.com/coreintentai"],
      contactPoint: { "@type": "ContactPoint", email: "corey@coreyai.ai", contactType: "customer support", availableLanguage: "English" },
    },
    {
      "@type": "WebApplication",
      "@id": "https://coreintent.dev/#application",
      name: "CoreIntent",
      url: "https://coreintent.dev",
      description: "AI-powered trading signals, paper competitions, and multi-model analysis engine using Claude, Grok, and Perplexity.",
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Trading Platform",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript. Requires a modern browser.",
      softwareVersion: "0.2.0-alpha",
      inLanguage: ["en-NZ", "es", "mi"],
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NZD", description: "Free competition-based AI trading platform", availability: "https://schema.org/InStock" },
      author: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
      creator: { "@type": "Person", "@id": "https://coreintent.dev/#person" },
      featureList: [
        "Multi-AI orchestration (Claude, Grok, Perplexity)",
        "Paper trading competitions",
        "Daily, weekly, monthly leagues",
        "Interactive web terminal",
        "AI agent fleet",
        "Bot-friendly competitions",
        "Multilingual support (10 languages)",
      ],
      screenshot: { "@type": "ImageObject", url: "https://coreintent.dev/opengraph-image.png", width: 1200, height: 630 },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description: "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      inLanguage: ["en-NZ", "es", "mi", "zh-Hans", "ja", "pt-BR", "fr", "de", "ar", "hi"],
      datePublished: "2026-03-01",
      dateModified: "2026-05-07",
      publisher: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
    },
    {
      "@type": "SiteNavigationElement",
      name: "Main Navigation",
      hasPart: [
        { "@type": "WebPage", name: "Terminal", url: "https://coreintent.dev" },
        { "@type": "WebPage", name: "Demo", url: "https://coreintent.dev/demo" },
        { "@type": "WebPage", name: "Stack", url: "https://coreintent.dev/stack" },
        { "@type": "WebPage", name: "Competitions", url: "https://coreintent.dev/pricing" },
        { "@type": "WebPage", name: "Privacy Policy", url: "https://coreintent.dev/privacy" },
        { "@type": "WebPage", name: "Terms of Service", url: "https://coreintent.dev/terms" },
        { "@type": "WebPage", name: "Disclaimer", url: "https://coreintent.dev/disclaimer" },
      ],
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
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dir = getDirection(typedLocale);
  const bcp47 = localeBcp47[typedLocale];
  const messages = await getMessages(typedLocale);

  return (
    <html lang={bcp47} dir={dir} className={jetbrainsMono.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <LocaleProvider locale={typedLocale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
