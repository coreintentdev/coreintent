import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isRTL } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const alternates: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    alternates[loc] = `https://coreintent.dev${prefix}`;
  }

  return {
    title: {
      default: t("title"),
      template: "%s | CoreIntent",
    },
    description: t("description"),
    metadataBase: new URL("https://coreintent.dev"),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? "https://coreintent.dev"
          : `https://coreintent.dev/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_NZ" : locale,
      url: "https://coreintent.dev",
      siteName: "CoreIntent",
      title: t("title"),
      description: t("description"),
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
      description: t("description"),
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
      "agentic AI",
      "CoreIntent",
      "Zynthio",
      "New Zealand",
    ],
    category: "Finance",
    other: {
      "google-site-verification": "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
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
      url: "https://zynthio.ai",
      logo: "https://coreintent.dev/opengraph-image.png",
      founder: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      areaServed: {
        "@type": "Country",
        name: "New Zealand",
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
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript. Requires a modern browser.",
      softwareVersion: "0.2.0-alpha",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        description: "Free competition-based AI trading platform",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description:
        "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
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

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRTL(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
