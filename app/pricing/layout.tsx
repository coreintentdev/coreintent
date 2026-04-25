import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions & Leagues — Free AI Trading Competitions",
  description:
    "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together. Built by Zynthio in NZ.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  keywords: [
    "free trading competitions",
    "AI trading leagues",
    "daily trading competition",
    "weekly trading league",
    "monthly trading championship",
    "paper trading competition",
    "bot trading competition",
    "no subscription trading",
    "crypto competition free",
    "AI trading arena",
  ],
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
        alt: "CoreIntent — Free AI Trading Competitions. No Subscriptions.",
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
          name: "How does the competition model work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Daily leagues reset every 24 hours. Weekly leagues run over 7 days. Monthly tournaments are the big leagues. Everyone starts equal. Win streaks earn multipliers.",
          },
        },
        {
          "@type": "Question",
          name: "Where is CoreIntent based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Zealand. Built by Corey McIvor under the Zynthio brand. No Silicon Valley, no VC money — just a clear thesis and lean infrastructure.",
          },
        },
      ],
    },
    {
      "@type": "Event",
      name: "CoreIntent Daily Sprint — AI Trading Competition",
      description:
        "24-hour paper trading competition. Leaderboard resets daily at 00:00 UTC. Humans and bots compete on equal terms. Free entry.",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: "https://coreintent.dev/pricing",
      },
      organizer: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      isAccessibleForFree: true,
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1D",
        startTime: "00:00",
        endTime: "23:59",
        scheduleTimezone: "UTC",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        availability: "https://schema.org/InStock",
        url: "https://coreintent.dev/pricing",
      },
    },
    {
      "@type": "Event",
      name: "CoreIntent Weekly Grind — AI Trading Competition",
      description:
        "7-day paper trading competition with risk-adjusted scoring. Team competitions and strategy sharing. Free entry.",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: "https://coreintent.dev/pricing",
      },
      organizer: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      isAccessibleForFree: true,
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P7D",
        scheduleTimezone: "UTC",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        availability: "https://schema.org/InStock",
        url: "https://coreintent.dev/pricing",
      },
    },
    {
      "@type": "Event",
      name: "CoreIntent Monthly Championship — AI Trading Competition",
      description:
        "30-day paper trading championship. Full portfolio wars under real market conditions. Winners featured globally. Free entry.",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: "https://coreintent.dev/pricing",
      },
      organizer: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      isAccessibleForFree: true,
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1M",
        scheduleTimezone: "UTC",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        availability: "https://schema.org/InStock",
        url: "https://coreintent.dev/pricing",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
