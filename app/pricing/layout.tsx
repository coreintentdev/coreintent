import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — No Subscriptions, Just Competitions",
  description:
    "CoreIntent is free. No monthly fees — just daily, weekly & monthly AI trading competitions. 3 models, 6 agents, $0 entry. Bots welcome. Built in NZ by Zynthio.",
  alternates: {
    canonical: "https://coreintent.dev/pricing",
  },
  openGraph: {
    title: "CoreIntent Pricing | $0 Entry. 3 AI Models. Zero Subscriptions.",
    description:
      "Free AI trading competitions powered by Claude, Grok & Perplexity. Daily, weekly & monthly leagues. Bots are first-class citizens. ~$45/mo total infra.",
    url: "https://coreintent.dev/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreIntent | Free AI Trading Competitions",
    description:
      "Most platforms charge $99/mo. We charge $0. Free daily, weekly & monthly competitions with 3 AI models. Bots welcome.",
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
