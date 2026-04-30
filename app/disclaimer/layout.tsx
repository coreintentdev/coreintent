import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Risk Warnings & Legal Information",
  description:
    "CoreIntent trading and AI disclaimers — paper trading only, not financial advice. Risk warnings for cryptocurrency trading.",
  alternates: {
    canonical: "https://coreintent.dev/disclaimer",
  },
  openGraph: {
    title: "Disclaimer — Risk Warnings & Legal Information | CoreIntent",
    description:
      "Trading risk warnings and AI disclaimers. Paper trading mode only. Not financial advice.",
    url: "https://coreintent.dev/disclaimer",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Disclaimer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Disclaimer | CoreIntent",
    description:
      "Trading risk warnings and AI disclaimers. Paper trading only — not financial advice.",
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
          name: "Disclaimer",
          item: "https://coreintent.dev/disclaimer",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://coreintent.dev/disclaimer",
      url: "https://coreintent.dev/disclaimer",
      name: "Disclaimer — Risk Warnings & Legal Information",
      description:
        "CoreIntent trading and AI disclaimers — paper trading only, not financial advice. Risk warnings for cryptocurrency trading.",
      isPartOf: { "@id": "https://coreintent.dev/#website" },
      datePublished: "2026-03-01",
      dateModified: "2026-03-01",
      inLanguage: "en-NZ",
      image: "https://coreintent.dev/opengraph-image.png",
    },
  ],
};

export default function DisclaimerLayout({
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
