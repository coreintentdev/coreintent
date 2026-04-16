import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Three AI Models. $45/mo. The Full Stack.",
  description:
    "Claude for deep analysis. Grok for fast signals. Perplexity for research. Cloudflare, Vercel, VPS — the entire AI trading infrastructure for ~$45/mo. Built by Zynthio in NZ.",
  alternates: {
    canonical: "https://coreintent.dev/stack",
  },
  openGraph: {
    title: "Three AI Models. $45/mo. The Full Stack. | CoreIntent",
    description:
      "Claude + Grok + Perplexity AI orchestration. Cloudflare, Vercel, VPS. An AI trading engine for ~$45/mo. No VC. No inflated cloud bills.",
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
    title: "$45/mo Stack: Claude + Grok + Perplexity | CoreIntent",
    description:
      "Three AI models. Six trading agents. $45/mo total infrastructure. The leanest AI trading stack on the internet.",
    creator: "@coreintentai",
    site: "@coreintentai",
    images: ["/opengraph-image.png"],
  },
};

const breadcrumbJsonLd = {
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
      name: "The Stack",
      item: "https://coreintent.dev/stack",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
