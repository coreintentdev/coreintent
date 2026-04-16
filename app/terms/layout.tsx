import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Platform Rules & Conditions",
  description:
    "CoreIntent terms of service. Platform rules, competition guidelines, and usage conditions. Built by Zynthio in New Zealand.",
  alternates: {
    canonical: "https://coreintent.dev/terms",
  },
  openGraph: {
    title: "Terms of Service — Platform Rules & Conditions",
    description:
      "CoreIntent terms of service. Competition rules, platform guidelines, and conditions of use.",
    url: "https://coreintent.dev/terms",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CoreIntent Terms of Service — Platform Rules & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | CoreIntent",
    description:
      "Platform rules, competition guidelines, and usage conditions for CoreIntent.",
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
