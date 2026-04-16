import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — How We Handle Your Data",
  description:
    "CoreIntent privacy policy. How we collect, use, and protect your data. Built by Zynthio in New Zealand.",
  alternates: {
    canonical: "https://coreintent.dev/privacy",
  },
  openGraph: {
    title: "Privacy Policy — How We Handle Your Data",
    description:
      "CoreIntent privacy policy. How we collect, use, and protect your data. Built by Zynthio in New Zealand.",
    url: "https://coreintent.dev/privacy",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Privacy Policy — How We Handle Your Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | CoreIntent",
    description:
      "How CoreIntent handles your data. Privacy-first, NZ-based.",
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
      name: "Privacy Policy",
      item: "https://coreintent.dev/privacy",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
