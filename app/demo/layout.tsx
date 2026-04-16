import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — Experience the AI Trading Engine",
  description:
    "Try CoreIntent live. Watch three AI models (Grok, Claude, Perplexity) generate signals in real-time. Simulated data, real architecture. Paper trade risk-free.",
  alternates: {
    canonical: "https://coreintent.dev/demo",
  },
  openGraph: {
    title: "Interactive Demo — Experience the AI Trading Engine | CoreIntent",
    description:
      "Watch three AI models generate trading signals in real-time. Paper trade risk-free with simulated data.",
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
      "Three AI models. Real-time signals. Paper trading. Try the CoreIntent engine live.",
    creator: "@coreintentai",
    site: "@coreintentai",
    images: ["/opengraph-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
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
