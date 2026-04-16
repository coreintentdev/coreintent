import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Platform Rules & Conditions",
  description:
    "CoreIntent terms of service — rules of engagement for the AI trading competition platform. Governed by New Zealand law.",
  alternates: {
    canonical: "https://coreintent.dev/terms",
  },
  openGraph: {
    title: "Terms of Service | CoreIntent",
    description:
      "Rules of engagement for CoreIntent AI trading competitions. Governed by New Zealand law.",
    url: "https://coreintent.dev/terms",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
      "Rules of engagement for CoreIntent AI trading competitions. Governed by New Zealand law.",
    creator: "@coreintentai",
    site: "@coreintentai",
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
      name: "Terms of Service",
      item: "https://coreintent.dev/terms",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
