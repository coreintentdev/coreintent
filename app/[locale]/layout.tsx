import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, defaultLocale, isLocale, getDirection, localeBcp47, getMessages, type Locale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getMessages(locale);

  const title = messages["meta.title"] || "CoreIntent | Agentic AI Trading Engine";
  const description = messages["meta.description"] || "Three AI models. One trading engine. Zero subscriptions.";

  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[localeBcp47[l]] = `https://coreintent.dev/${l}`;
  }

  return {
    title: {
      default: title,
      template: "%s | CoreIntent",
    },
    description,
    metadataBase: new URL("https://coreintent.dev"),
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeBcp47[locale],
      url: `https://coreintent.dev/${locale}`,
      siteName: "CoreIntent",
      title: messages["meta.title"] || title,
      description: messages["meta.description"] || description,
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
      description:
        "3 AI models working together. Free trading competitions. Bots welcome. No subscriptions. Built by @coreintentai in NZ.",
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
      "Claude", "Grok", "Perplexity", "crypto", "agentic AI", "CoreIntent", "Zynthio",
    ],
    category: "Finance",
    other: {
      "theme-color": "#10b981",
      "color-scheme": "dark",
      "msapplication-TileColor": "#0a0e17",
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
      alternateName: "Zynthio.ai",
      url: "https://zynthio.ai",
      description: "Parent brand behind CoreIntent — building agentic AI trading tools with multi-model orchestration. Based in New Zealand.",
      logo: { "@type": "ImageObject", url: "https://coreintent.dev/opengraph-image.png", width: 1200, height: 630 },
      founder: { "@type": "Person", "@id": "https://coreintent.dev/#person" },
      foundingDate: "2026",
      foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "NZ" } },
      areaServed: { "@type": "Country", name: "New Zealand" },
      sameAs: ["https://github.com/coreintentdev", "https://x.com/coreintentai"],
      contactPoint: {
        "@type": "ContactPoint",
        email: "corey@coreyai.ai",
        contactType: "customer support",
        availableLanguage: ["English", "Spanish", "Maori"],
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://coreintent.dev/#application",
      name: "CoreIntent",
      url: "https://coreintent.dev",
      description: "AI-powered trading signals, paper competitions, and multi-model analysis engine using Claude, Grok, and Perplexity.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      softwareVersion: "0.2.0-alpha",
      inLanguage: ["en-NZ", "es", "mi-NZ", "zh-Hans", "ja", "pt-BR", "fr", "de", "ar", "hi"],
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NZD", availability: "https://schema.org/InStock" },
      author: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
      featureList: [
        "Multi-AI orchestration (Claude, Grok, Perplexity)",
        "Paper trading competitions",
        "Multilingual interface (10 languages)",
        "Bot-friendly competitions",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description: "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      inLanguage: ["en-NZ", "es", "mi-NZ", "zh-Hans", "ja", "pt-BR", "fr", "de", "ar", "hi"],
      datePublished: "2026-03-01",
      dateModified: "2026-04-28",
      publisher: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
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
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dir = getDirection(locale);
  const messages = await getMessages(locale);

  return (
    <div dir={dir} lang={localeBcp47[locale]} data-locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
    </div>
  );
}
