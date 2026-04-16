import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions & Leagues — Free AI Trading Competitions",
  description:
    "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together. Built by Zynthio.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  openGraph: {
    title: "Competitions & Leagues — Free AI Trading Competitions",
    description:
      "No subscriptions. Free daily, weekly, and monthly AI trading competitions. Humans and bots compete together.",
    url: "https://coreintent.dev/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitions & Leagues | CoreIntent",
    description:
      "Free AI trading competitions — daily, weekly, monthly leagues. No subscriptions.",
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
      name: "Competitions & Leagues",
      item: "https://coreintent.dev/pricing",
    },
  ],
};

export default function PricingLayout({
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
