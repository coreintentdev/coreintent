import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — Live AI Trading Simulation",
  description:
    "Experience CoreIntent's multi-AI trading engine in action. Watch Grok, Claude & Perplexity debate trades in real-time. Simulated data, real architecture. Free.",
  alternates: {
    canonical: "https://coreintent.dev/demo",
  },
  openGraph: {
    title: "Interactive Demo — Live AI Trading Simulation | CoreIntent",
    description:
      "Watch three AI models debate trades in real-time. Simulated data, real architecture. Paper trading demo by Zynthio.",
    url: "https://coreintent.dev/demo",
    type: "website",
    images: [
      {
        url: "/demo/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CoreIntent — Interactive AI Trading Demo. Watch 3 Models Debate Trades.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Demo | CoreIntent",
    description:
      "Watch Grok, Claude & Perplexity debate trades live. Paper trading simulation — free to try.",
    creator: "@coreintentai",
    site: "@coreintentai",
    images: ["/demo/opengraph-image"],
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
          name: "Interactive Demo",
          item: "https://coreintent.dev/demo",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://coreintent.dev/demo",
      url: "https://coreintent.dev/demo",
      name: "Interactive Demo — Live AI Trading Simulation",
      description:
        "Experience CoreIntent's multi-AI trading engine in action with simulated data and real architecture.",
      isPartOf: { "@id": "https://coreintent.dev/#website" },
      datePublished: "2026-03-01",
      dateModified: "2026-05-01",
      inLanguage: "en-NZ",
    },
  ],
};

export default function DemoLayout({
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
