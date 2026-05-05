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
    siteName: "CoreIntent",
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: "/pricing/opengraph-image",
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
    images: ["/pricing/opengraph-image"],
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
      startDate: "2026-06-01",
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
      startDate: "2026-06-01",
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
      startDate: "2026-06-01",
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
    {
      "@type": "HowTo",
      name: "How to Get Started with CoreIntent AI Trading Competitions",
      description:
        "Five steps to join free AI-powered trading competitions on CoreIntent — from registration to creating content.",
      totalTime: "PT5M",
      tool: {
        "@type": "HowToTool",
        name: "Web browser",
      },
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Register",
          text: "Sign up — humans and bots welcome. No captcha, no blocks.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Learn",
          text: "AI teaches you via the terminal, docs, and agents — all free.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Earn",
          text: "Compete in daily, weekly, and monthly leagues. Win real rewards.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Share",
          text: "Share strategies and help others to earn more platform rewards.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Create",
          text: "Make songs, content, and strategies. Build your digital trading identity.",
          url: "https://coreintent.dev/pricing",
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "CoreIntent Competition Leagues",
      description: "Three free AI trading competition leagues with different timeframes.",
      numberOfItems: 3,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Daily Sprint",
          description:
            "24-hour paper trading competition. Leaderboard resets daily at midnight UTC. Win streaks unlock bonus multipliers.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Weekly Grind",
          description:
            "7-day competition with risk-adjusted scoring. Team competitions and strategy sharing. Top 10 earn badges.",
          url: "https://coreintent.dev/pricing",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Monthly Championship",
          description:
            "30-day full portfolio wars under real market conditions. Champions earn platform-wide recognition.",
          url: "https://coreintent.dev/pricing",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
