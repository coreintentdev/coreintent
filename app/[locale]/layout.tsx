import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isValidLocale, isRtl, locales, LOCALE_TO_BCP47 } from "@/lib/i18n";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const bcp47 = LOCALE_TO_BCP47[locale];
  const base = "https://coreintent.dev";

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    const href = loc === "en" ? base : `${base}/${loc}`;
    alternates[LOCALE_TO_BCP47[loc]] = href;
  }

  return {
    title: {
      default: t("title"),
      template: "%s | CoreIntent",
    },
    description: t("description"),
    metadataBase: new URL(base),
    alternates: {
      canonical: locale === "en" ? base : `${base}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: bcp47.replace("-", "_"),
      url: locale === "en" ? base : `${base}/${locale}`,
      siteName: "CoreIntent",
      title: t("ogTitle"),
      description: t("ogDescription"),
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
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
      "AI trading",
      "trading signals",
      "paper trading",
      "trading competitions",
      "Claude",
      "Grok",
      "Perplexity",
      "crypto",
      "cryptocurrency",
      "agentic AI",
      "multi-model AI",
      "algorithmic trading",
      "AI agents",
      "CoreIntent",
      "Zynthio",
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
      worksFor: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Cryptocurrency Trading",
        "Multi-Model AI Orchestration",
        "Software Engineering",
      ],
      nationality: {
        "@type": "Country",
        name: "New Zealand",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      alternateName: "Zynthio.ai",
      url: "https://zynthio.ai",
      description:
        "Parent brand behind CoreIntent — building agentic AI trading tools with multi-model orchestration. Based in New Zealand.",
      logo: {
        "@type": "ImageObject",
        url: "https://coreintent.dev/opengraph-image.png",
        width: 1200,
        height: 630,
      },
      founder: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      foundingDate: "2026",
      foundingLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "NZ",
        },
      },
      areaServed: {
        "@type": "Country",
        name: "New Zealand",
      },
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "corey@coreyai.ai",
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://coreintent.dev/#application",
      name: "CoreIntent",
      url: "https://coreintent.dev",
      description:
        "AI-powered trading signals, paper competitions, and multi-model analysis engine using Claude, Grok, and Perplexity.",
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Trading Platform",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript. Requires a modern browser.",
      softwareVersion: "0.2.0-alpha",
      inLanguage: "en-NZ",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        description: "Free competition-based AI trading platform",
        availability: "https://schema.org/InStock",
      },
      author: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      creator: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      featureList: [
        "Multi-AI orchestration (Claude, Grok, Perplexity)",
        "Paper trading competitions",
        "Daily, weekly, monthly leagues",
        "Interactive web terminal",
        "AI agent fleet",
        "Bot-friendly competitions",
      ],
      screenshot: {
        "@type": "ImageObject",
        url: "https://coreintent.dev/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description:
        "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      inLanguage: "en-NZ",
      datePublished: "2026-03-01",
      dateModified: "2026-05-01",
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: "Main Navigation",
      hasPart: [
        {
          "@type": "WebPage",
          name: "Terminal",
          url: "https://coreintent.dev",
        },
        {
          "@type": "WebPage",
          name: "Demo",
          url: "https://coreintent.dev/demo",
        },
        {
          "@type": "WebPage",
          name: "Stack",
          url: "https://coreintent.dev/stack",
        },
        {
          "@type": "WebPage",
          name: "Competitions",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://coreintent.dev/privacy",
        },
        {
          "@type": "WebPage",
          name: "Terms of Service",
          url: "https://coreintent.dev/terms",
        },
        {
          "@type": "WebPage",
          name: "Disclaimer",
          url: "https://coreintent.dev/disclaimer",
        },
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

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const bcp47 = LOCALE_TO_BCP47[locale];

  return (
    <html lang={bcp47} dir={dir} className={jetbrainsMono.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
