import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Risk Warnings & Legal Information",
  description:
    "CoreIntent risk disclaimer. Paper trading mode. Not financial advice. Trading cryptocurrency involves significant risk.",
  alternates: {
    canonical: "https://coreintent.dev/disclaimer",
  },
  openGraph: {
    title: "Disclaimer — Risk Warnings & Legal Information",
    description:
      "CoreIntent risk disclaimer. Paper trading mode. Not financial advice. Trading involves significant risk.",
    url: "https://coreintent.dev/disclaimer",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Disclaimer | CoreIntent",
    description:
      "Risk warnings and legal information for the CoreIntent trading platform.",
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
      name: "Disclaimer",
      item: "https://coreintent.dev/disclaimer",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
