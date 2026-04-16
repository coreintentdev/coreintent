import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CoreIntent | Agentic AI Trading Engine",
    template: "%s | CoreIntent",
  },
  description:
    "AI-powered trading signals, paper competitions, and multi-model analysis. Built by Corey McIvor / Zynthio.",
  metadataBase: new URL("https://coreintent.dev"),
  alternates: {
    canonical: "https://coreintent.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://coreintent.dev",
    siteName: "CoreIntent",
    title: "CoreIntent | Agentic AI Trading Engine",
    description:
      "AI-powered trading signals, paper competitions, and multi-model analysis. Claude + Grok + Perplexity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreIntent | Agentic AI Trading Engine",
    description:
      "AI-powered trading signals and paper competitions. Built by @coreintentai.",
    creator: "@coreintentai",
    site: "@coreintentai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Corey McIvor", url: "https://zynthio.ai" }],
  creator: "Corey McIvor",
  publisher: "Zynthio",
  keywords: [
    "AI trading",
    "trading signals",
    "paper trading",
    "Claude",
    "Grok",
    "Perplexity",
    "crypto",
    "cryptocurrency",
    "agentic AI",
    "CoreIntent",
    "Zynthio",
    "trading competitions",
    "paper trading competitions",
    "AI trading engine",
    "New Zealand",
    "multi-model AI",
  ],
  category: "Finance",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      url: "https://zynthio.ai",
      founder: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
        name: "Corey McIvor",
        email: "corey@coreyai.ai",
        url: "https://zynthio.ai",
        jobTitle: "Founder",
      },
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://coreintent.dev/#application",
      name: "CoreIntent",
      url: "https://coreintent.dev",
      description:
        "AI-powered trading signals, paper competitions, and multi-model analysis engine using Claude, Grok, and Perplexity.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        description: "Free competition-based AI trading platform",
      },
      author: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      creator: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description: "Agentic AI Trading Engine",
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
