import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — How We Handle Your Data",
  description:
    "CoreIntent privacy policy — how we handle your data. Operated by Corey McIvor / Zynthio under New Zealand law. NZ Privacy Act 2020 compliant.",
  alternates: {
    canonical: "https://coreintent.dev/privacy",
  },
  openGraph: {
    title: "Privacy Policy — How We Handle Your Data | CoreIntent",
    description:
      "How CoreIntent handles your data. NZ Privacy Act 2020 compliant. Operated under New Zealand law.",
    url: "https://coreintent.dev/privacy",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | CoreIntent",
    description:
      "How CoreIntent handles your data. NZ Privacy Act 2020 compliant.",
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
          name: "Privacy Policy",
          item: "https://coreintent.dev/privacy",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://coreintent.dev/privacy",
      url: "https://coreintent.dev/privacy",
      name: "Privacy Policy — How We Handle Your Data",
      description:
        "CoreIntent privacy policy — how we handle your data. NZ Privacy Act 2020 compliant.",
      isPartOf: { "@id": "https://coreintent.dev/#website" },
      dateModified: "2026-03-01",
      inLanguage: "en-NZ",
    },
  ],
};

export default function PrivacyLayout({
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
