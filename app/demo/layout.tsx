import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — Experience the AI Trading Engine",
  description:
    "Try the CoreIntent AI trading engine. Live price feeds, multi-model AI consensus, and signal analysis — all simulated. No signup required.",
  alternates: {
    canonical: "https://coreintent.dev/demo",
  },
  openGraph: {
    title: "Interactive Demo — Experience the AI Trading Engine",
    description:
      "Try CoreIntent live. Simulated price feeds, AI model consensus from Claude, Grok & Perplexity, and real-time signal analysis. No signup required.",
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
    title: "Try CoreIntent — Interactive AI Trading Demo",
    description:
      "Simulated trading engine with 3 AI models. See how Claude, Grok & Perplexity work together. No signup.",
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
        "Experience the CoreIntent AI trading engine with simulated data. Live price feeds, multi-model AI consensus, and signal analysis.",
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
