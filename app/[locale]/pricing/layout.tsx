import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions & Leagues — Free AI Trading Competitions",
  description:
    "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together. Built by Zynthio in NZ.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  openGraph: {
    title: "Competitions & Leagues — Free AI Trading Competitions",
    description:
      "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together.",
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
    title: "Competitions & Leagues | CoreIntent",
    description:
      "Free AI trading competitions — daily, weekly, monthly leagues. No subscriptions. Bots welcome.",
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
            text: "Not yet. CoreIntent is currently in paper trading mode. We're transparent about this — when features are demo or planned, we label them honestly.",
          },
        },
        {
          "@type": "Question",
          name: "What AI models power the platform?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Three: Grok (xAI) for fast signal detection, Claude (Anthropic) for deep analysis and risk assessment, and Perplexity for real-time research. They cross-check each other.",
          },
        },
        {
          "@type": "Question",
          name: "Where is CoreIntent based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Zealand. Built by Corey McIvor under the Zynthio brand.",
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
