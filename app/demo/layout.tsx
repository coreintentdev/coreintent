import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — See the AI Trading Engine in Action",
  description:
    "Watch three AI models (Claude, Grok, Perplexity) work together in real-time. Simulated trading signals, consensus scoring, and paper trading. Try it free.",
  alternates: {
    canonical: "https://coreintent.dev/demo",
  },
  openGraph: {
    title: "Interactive Demo — See the AI Trading Engine in Action",
    description:
      "Watch three AI models work together in real-time. Simulated trading data, same production architecture. Try it free.",
    url: "https://coreintent.dev/demo",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Interactive Demo — AI Trading Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Demo | CoreIntent",
    description:
      "Three AI models. Real-time signals. Paper trading. See the engine in action.",
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
        "Interactive demonstration of the CoreIntent AI trading engine with simulated data.",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://coreintent.dev/#website",
      },
      about: {
        "@type": "WebApplication",
        "@id": "https://coreintent.dev/#application",
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
