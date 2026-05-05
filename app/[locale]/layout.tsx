import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, getDirection, getHreflangLocale, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = messages.metadata;

  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[getHreflangLocale(loc)] =
      loc === "en"
        ? "https://coreintent.dev"
        : `https://coreintent.dev/${loc}`;
  }

  return {
    title: {
      default: t.title,
      template: "%s | CoreIntent",
    },
    description: t.description,
    metadataBase: new URL("https://coreintent.dev"),
    alternates: {
      canonical:
        locale === "en"
          ? "https://coreintent.dev"
          : `https://coreintent.dev/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: getHreflangLocale(locale as Locale),
      url: "https://coreintent.dev",
      siteName: "CoreIntent",
      title: t.title,
      description: t.description,
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
      description: t.description,
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
    ],
    category: "Finance",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    other: {
      "msapplication-TileColor": "#0a0e17",
      "color-scheme": "dark",
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
      datePublished: "2026-03-01",
      dateModified: "2026-05-05",
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
  if (!isValidLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html lang={getHreflangLocale(locale)} dir={dir} className={jetbrainsMono.variable}>
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
