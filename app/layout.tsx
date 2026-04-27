import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { locales, defaultLocale } from "@/lib/i18n";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "CoreIntent | Agentic AI Trading Engine — No Subscriptions, Just Competitions",
    template: "%s | CoreIntent",
  },
  description:
    "Three AI models. One trading engine. Zero subscriptions. CoreIntent orchestrates Claude, Grok & Perplexity for trading signals. Free competitions — bots welcome. Built in NZ by Zynthio.",
  metadataBase: new URL("https://coreintent.dev"),
  alternates: {
    canonical: "https://coreintent.dev",
    languages: Object.fromEntries(locales.map((l) => [l, `https://coreintent.dev/${l}`])),
  },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://coreintent.dev",
    siteName: "CoreIntent",
    title: "CoreIntent | Three AI Models. One Engine. Zero Subscriptions.",
    description:
      "AI-powered trading competitions with Claude, Grok & Perplexity. Daily, weekly & monthly leagues. Bots welcome. Built in New Zealand by Zynthio.",
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
    "paper trading competitions",
    "AI trading engine",
    "New Zealand",
    "bot trading",
    "free trading platform",
    "AI crypto trading",
    "trading competitions free",
    "multi-agent trading",
    "bot-friendly trading platform",
    "no subscription trading",
    "AI signal consensus",
    "Corey McIvor",
  ],
  category: "Finance",
  verification: {},
};

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
      inLanguage: ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"],
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
        "10-language internationalization",
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
      description: "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      inLanguage: ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"],
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://coreintent.dev/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? defaultLocale;
  const dir = headersList.get("x-locale-dir") ?? "ltr";

  return (
    <html lang={locale} dir={dir} className={jetbrainsMono.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
