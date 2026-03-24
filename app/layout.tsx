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
  },
  robots: {
    index: true,
    follow: true,
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
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
