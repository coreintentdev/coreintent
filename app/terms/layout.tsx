import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Platform Rules & Conditions",
  description:
    "CoreIntent terms of service — rules of engagement for the AI trading competition platform. Governed by New Zealand law.",
  alternates: {
    canonical: "https://coreintent.dev/terms",
  },
  openGraph: {
    title: "Terms of Service — Platform Rules & Conditions | CoreIntent",
    description:
      "Rules of engagement for CoreIntent AI trading competitions. Governed by New Zealand law.",
    url: "https://coreintent.dev/terms",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | CoreIntent",
    description:
      "Platform rules, competition guidelines, and usage conditions for CoreIntent. NZ law.",
    creator: "@coreintentai",
    site: "@coreintentai",
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
          name: "Terms of Service",
          item: "https://coreintent.dev/terms",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://coreintent.dev/terms",
      url: "https://coreintent.dev/terms",
      name: "Terms of Service — Platform Rules & Conditions",
      description:
        "CoreIntent terms of service — rules of engagement for the AI trading competition platform. Governed by New Zealand law.",
      isPartOf: { "@id": "https://coreintent.dev/#website" },
      datePublished: "2026-03-01",
      dateModified: "2026-03-01",
      lastReviewed: "2026-04-24",
      inLanguage: "en-NZ",
      about: {
        "@type": "Thing",
        name: "Terms of Service",
        description: "Platform rules, competition guidelines, account policies, and legal conditions for CoreIntent AI trading competitions.",
      },
      author: { "@type": "Person", "@id": "https://coreintent.dev/#person" },
      publisher: { "@type": "Organization", "@id": "https://zynthio.ai/#organization" },
    },
  ],
};

export default function TermsLayout({
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
