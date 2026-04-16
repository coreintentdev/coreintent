import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Stack — AI Services, Infrastructure & Architecture",
  description:
    "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration, Cloudflare, Vercel, and VPS infrastructure. Built by Zynthio in New Zealand.",
  alternates: {
    canonical: "https://coreintent.dev/stack",
  },
  openGraph: {
    title: "The Stack — AI Services, Infrastructure & Architecture",
    description:
      "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration with Cloudflare, Vercel, and VPS infrastructure.",
    url: "https://coreintent.dev/stack",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CoreIntent Technology Stack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Stack | CoreIntent",
    description:
      "Claude + Grok + Perplexity — the multi-AI stack powering CoreIntent trading engine.",
  },
};

const stackJsonLd = {
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
      headline: "CoreIntent Technology Stack",
      description:
        "Full API orchestra powering CoreIntent / Zynthio — Claude, Grok, Perplexity AI orchestration with Cloudflare, Vercel, and VPS infrastructure.",
      author: { "@id": "https://coreintent.dev/#person" },
      publisher: { "@id": "https://zynthio.ai/#organization" },
      mainEntityOfPage: "https://coreintent.dev/stack",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stackJsonLd) }}
      />
      {children}
    </>
  );
}
