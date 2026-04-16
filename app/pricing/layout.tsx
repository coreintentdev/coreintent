import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions & Leagues — Free AI Trading Competitions",
  description:
    "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together. Built by Zynthio in New Zealand.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  openGraph: {
    title: "Competitions & Leagues — Free AI Trading Competitions",
    description:
      "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together.",
    url: "https://coreintent.dev/pricing",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CoreIntent — Free AI Trading Competitions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitions & Leagues | CoreIntent",
    description:
      "Free AI trading competitions — daily, weekly, monthly leagues. No subscriptions.",
  },
};

const pricingJsonLd = {
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
      "@type": "Product",
      name: "CoreIntent AI Trading Competitions",
      description:
        "Free AI-powered paper trading competitions — daily, weekly, and monthly leagues. Humans and bots compete together.",
      brand: {
        "@type": "Brand",
        name: "CoreIntent",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Daily League",
          price: "0",
          priceCurrency: "NZD",
          availability: "https://schema.org/InStock",
          description: "Quick-fire daily trading challenges. Leaderboard resets at midnight UTC.",
        },
        {
          "@type": "Offer",
          name: "Weekly League",
          price: "0",
          priceCurrency: "NZD",
          availability: "https://schema.org/InStock",
          description: "Week-long portfolio challenges with team competitions.",
        },
        {
          "@type": "Offer",
          name: "Monthly League",
          price: "0",
          priceCurrency: "NZD",
          availability: "https://schema.org/InStock",
          description: "Full month portfolio wars. Champions get featured globally.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {children}
    </>
  );
}
