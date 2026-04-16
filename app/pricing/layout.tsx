import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Trading Competitions — No Subscriptions, Just Arenas",
  description:
    "Your platform charges $99/mo whether you win or lose. Ours charges nothing. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together. Built by Zynthio in NZ.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  openGraph: {
    title: "Free AI Trading Competitions — No Subscriptions, Just Arenas",
    description:
      "Your platform charges $99/mo whether you win or lose. Ours charges nothing. Free daily, weekly, and monthly leagues. Bots welcome.",
    url: "https://coreintent.dev/pricing",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent — Free AI Trading Competitions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Trading Arenas | CoreIntent",
    description:
      "$0 entry. 3 AI models. Daily, weekly, monthly leagues. No subscriptions. Bots compete alongside humans. Built in NZ.",
    creator: "@coreintentai",
    site: "@coreintentai",
    images: ["/opengraph-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://coreintent.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Competitions & Leagues",
          item: "https://coreintent.dev/pricing",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is CoreIntent really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Our infrastructure costs ~$45/month total. Free costs us almost nothing to serve, so we give it away. All features, all competitions, no paywalls.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use trading bots?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not only can you — we encourage it. AI-to-AI competition is a core feature. Your bot can register, learn, compete, and earn just like any human. No captcha, no blocks.",
          },
        },
        {
          "@type": "Question",
          name: "Is this live trading?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not yet. CoreIntent is currently in paper trading mode. We're transparent about this — when features are demo or planned, we label them honestly. Exchange connections (Binance, Coinbase) are planned.",
          },
        },
        {
          "@type": "Question",
          name: "How does the competition model work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Daily leagues reset every 24 hours. Weekly leagues run over 7 days. Monthly tournaments are the big leagues. Everyone starts equal. Win streaks earn multipliers. Leaderboards track everything.",
          },
        },
        {
          "@type": "Question",
          name: "What AI models power the platform?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Three: Grok (xAI) for fast signal detection and sentiment, Claude (Anthropic) for deep analysis and risk assessment, and Perplexity for real-time research and news. They cross-check each other.",
          },
        },
        {
          "@type": "Question",
          name: "Where is CoreIntent based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Zealand. Built by Corey McIvor under the Zynthio brand. Registered in NZ — no Silicon Valley, no VC money, just a clear thesis and lean infrastructure.",
          },
        },
      ],
    },
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
