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
      "@type": "TechArticle",
      headline: "CoreIntent Technology Stack — AI Services, Infrastructure & Architecture",
      description:
        "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration, Cloudflare, Vercel, and VPS infrastructure.",
      url: "https://coreintent.dev/stack",
      author: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      about: [
        { "@type": "Thing", name: "Claude AI", description: "Deep analysis & risk assessment" },
        { "@type": "Thing", name: "Grok AI", description: "Fast signal detection & sentiment" },
        { "@type": "Thing", name: "Perplexity AI", description: "Real-time research & news" },
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
