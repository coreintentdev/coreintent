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
    siteName: "CoreIntent",
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: "/stack/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CoreIntent — The Stack: Claude, Grok & Perplexity AI Architecture",
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
    images: ["/stack/opengraph-image"],
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
      headline: "The Stack — AI Services, Infrastructure & Architecture",
      description:
        "Full technology stack powering CoreIntent: Claude, Grok, Perplexity AI orchestration, Cloudflare, Vercel, and VPS infrastructure.",
      url: "https://coreintent.dev/stack",
      datePublished: "2026-03-01",
      dateModified: "2026-05-05",
      author: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      mainEntityOfPage: "https://coreintent.dev/stack",
      about: [
        {
          "@type": "SoftwareApplication",
          name: "Grok",
          applicationCategory: "AI Signal Detection",
          operatingSystem: "Web",
          creator: { "@type": "Organization", name: "xAI" },
        },
        {
          "@type": "SoftwareApplication",
          name: "Claude",
          applicationCategory: "AI Deep Analysis",
          operatingSystem: "Web",
          creator: { "@type": "Organization", name: "Anthropic" },
        },
        {
          "@type": "SoftwareApplication",
          name: "Perplexity",
          applicationCategory: "AI Research",
          operatingSystem: "Web",
          creator: { "@type": "Organization", name: "Perplexity AI" },
        },
      ],
      proficiencyLevel: "Expert",
      inLanguage: "en-NZ",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
