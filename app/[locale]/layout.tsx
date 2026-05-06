import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  isLocale,
  LOCALE_HTML_LANG,
  getDirection,
  loadMessages,
} from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";
import { LocaleHtmlAttributes } from "./locale-html-attributes";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = await loadMessages(locale);

  const meta = messages.meta as { title?: string; description?: string } | undefined;
  const title = meta?.title ?? "CoreIntent | Agentic AI Trading Engine";
  const description = meta?.description ?? "Three AI models. One trading engine. Zero subscriptions.";

  const alternates: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) {
    alternates[LOCALE_HTML_LANG[l]] = `https://coreintent.dev/${l}`;
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
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: LOCALE_HTML_LANG[locale],
      url: `https://coreintent.dev/${locale}`,
      siteName: "CoreIntent",
      title,
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
      "Claude", "Grok", "Perplexity", "crypto", "agentic AI", "CoreIntent",
      "Zynthio", "New Zealand", "bot trading", "free trading platform",
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
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      softwareVersion: "0.2.0-alpha",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NZD" },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
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
  const messages = await loadMessages(locale);
  const lang = LOCALE_HTML_LANG[locale];
  const dir = getDirection(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <LocaleHtmlAttributes lang={lang} dir={dir} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {children}
    </I18nProvider>
  );
}
