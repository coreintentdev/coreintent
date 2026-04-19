import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — Live AI Trading Engine Simulation",
  description:
    "Experience CoreIntent in action — live price feeds, AI model consensus, signal generation, and paper trading. Simulated data, real architecture. Built by Zynthio in NZ.",
  alternates: {
    canonical: "https://coreintent.dev/demo",
  },
  openGraph: {
    title: "Interactive Demo — Live AI Trading Engine Simulation",
    description:
      "Watch three AI models work in real-time. Simulated price feeds, signal generation, and paper trading. Same architecture as production.",
    url: "https://coreintent.dev/demo",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Interactive Demo — AI Trading Engine Simulation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Demo | CoreIntent",
    description:
      "Three AI models. Live simulation. Paper trading. Experience the CoreIntent engine in real-time.",
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
          name: "Interactive Demo",
          item: "https://coreintent.dev/demo",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://coreintent.dev/demo",
      name: "CoreIntent Interactive Demo",
      description:
        "Live simulation of the CoreIntent AI trading engine with price feeds, model consensus, and paper trading.",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://coreintent.dev/#website",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
