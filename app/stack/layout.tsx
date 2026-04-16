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
        url: "/opengraph-image.png",
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
          name: "The Stack",
          item: "https://coreintent.dev/stack",
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "CoreIntent AI Technology Stack",
      description:
        "The multi-AI orchestration stack powering CoreIntent trading engine, built by Zynthio in New Zealand.",
      numberOfItems: 3,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: "Grok",
            applicationCategory: "AI Signal Detection",
            operatingSystem: "Web API",
            description:
              "Fast signal detection and sentiment analysis via xAI. Real-time X/Twitter sentiment scoring and market mood analysis.",
            author: { "@type": "Organization", name: "xAI" },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareApplication",
            name: "Claude",
            applicationCategory: "AI Deep Analysis",
            operatingSystem: "Web API",
            description:
              "Deep analysis, risk assessment, strategy generation, and agent orchestration via Anthropic.",
            author: { "@type": "Organization", name: "Anthropic" },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "SoftwareApplication",
            name: "Perplexity",
            applicationCategory: "AI Research",
            operatingSystem: "Web API",
            description:
              "Real-time market research, news aggregation, and cross-source verification with 9 platform connectors.",
            author: { "@type": "Organization", name: "Perplexity AI" },
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
