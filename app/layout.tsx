import type { Metadata } from "next";
import "./globals.css";
import AITwin from "@/components/AITwin";

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
  ],
  category: "Finance",
  other: {
    "google-site-verification": "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
  },
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
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
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
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description: "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
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
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <AITwin />
      </body>
    </html>
  );
}
