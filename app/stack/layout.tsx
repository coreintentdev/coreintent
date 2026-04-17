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
  },
  twitter: {
    card: "summary_large_image",
    title: "The Stack | CoreIntent",
    description:
      "Claude + Grok + Perplexity — the multi-AI stack powering CoreIntent trading engine.",
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
        { "@type": "Thing", name: "Claude AI" },
        { "@type": "Thing", name: "Grok AI" },
        { "@type": "Thing", name: "Perplexity AI" },
        { "@type": "Thing", name: "Next.js" },
        { "@type": "Thing", name: "Cloudflare" },
        { "@type": "Thing", name: "Vercel" },
      ],
      proficiencyLevel: "Expert",
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
