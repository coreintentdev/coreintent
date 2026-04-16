import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Stack — AI Services, Infrastructure & Architecture",
  description:
    "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration, Cloudflare, Vercel, and VPS infrastructure. Built by Zynthio.",
  alternates: {
    canonical: "https://coreintent.dev/stack",
  },
  openGraph: {
    title: "The Stack — AI Services, Infrastructure & Architecture",
    description:
      "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration with Cloudflare, Vercel, and VPS infrastructure.",
    url: "https://coreintent.dev/stack",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CoreIntent Technology Stack — Claude, Grok & Perplexity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Stack | CoreIntent",
    description:
      "Claude + Grok + Perplexity — the multi-AI stack powering CoreIntent trading engine.",
    creator: "@coreintentai",
    site: "@coreintentai",
    images: ["/opengraph-image"],
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
          name: "The Stack",
          item: "https://coreintent.dev/stack",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What AI models does CoreIntent use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CoreIntent orchestrates three AI models: Grok (xAI) for fast signal detection and sentiment analysis, Claude (Anthropic) for deep analysis and risk assessment, and Perplexity for real-time research and news aggregation.",
          },
        },
        {
          "@type": "Question",
          name: "How much does the CoreIntent infrastructure cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The total infrastructure costs approximately $45-116/month including X Premium+ ($16), Perplexity Max ($20), Cloudflare Pro ($20), Vercel hosting (free-$20), Cloudzy VPS ($5-10), and Claude API (pay-per-use ~$5-30).",
          },
        },
        {
          "@type": "Question",
          name: "What exchanges does CoreIntent support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Exchange integrations with Binance (500+ pairs), Coinbase (200+ pairs), and gTrade (50+ DeFi pairs on Polygon/Arbitrum) are planned but not yet connected. CoreIntent currently operates in paper trading mode.",
          },
        },
      ],
    },
  ],
};

export default function StackLayout({
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
