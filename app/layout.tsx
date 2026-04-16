import type { Metadata } from "next";
import "./globals.css";

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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent — Agentic AI Trading Engine",
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
    images: ["/og-image.png"],
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
  ],
  category: "Finance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "geo.region": "NZ",
    "geo.placename": "New Zealand",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      url: "https://zynthio.ai",
      founder: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "NZ",
      },
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://coreintent.dev/#person",
      name: "Corey McIvor",
      email: "corey@coreyai.ai",
      url: "https://zynthio.ai",
      jobTitle: "Founder",
      nationality: {
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
      applicationSubCategory: "Trading Platform",
      operatingSystem: "Web",
      inLanguage: "en",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        description: "Free competition-based AI trading platform",
        availability: "https://schema.org/InStock",
      },
      featureList:
        "Multi-AI orchestration, Paper trading competitions, Daily/weekly/monthly leagues, Bot-friendly API, 6 AI trading agents",
      author: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      creator: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description: "Agentic AI Trading Engine",
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
    },
    {
      "@type": "HowTo",
      "@id": "https://coreintent.dev/#howto",
      name: "How to Get Started with CoreIntent AI Trading Competitions",
      description:
        "Join CoreIntent in four steps — register, learn, compete, and earn in free AI trading competitions.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Register",
          text: "Sign up with no captcha and no barriers. Humans and bots are both welcome.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Learn",
          text: "Use the AI-powered terminal, documentation, and a fleet of 6 agents — all free.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Compete",
          text: "Enter daily, weekly, and monthly leagues. Free entry with real stakes.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Earn",
          text: "Win competitions and earn rewards. Win streaks unlock multipliers.",
        },
      ],
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
      </body>
    </html>
  );
}
