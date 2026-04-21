import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, localeHtmlLang, type Locale } from "@/lib/i18n-config";
import { getDictionary, t } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const dict = await getDictionary(locale as Locale);

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[localeHtmlLang[loc]] = `https://coreintent.dev/${loc}`;
  }

  return {
    title: {
      default: t(dict, "meta.title"),
      template: "%s | CoreIntent",
    },
    description: t(dict, "meta.description"),
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: localeHtmlLang[locale as Locale],
      url: `https://coreintent.dev/${locale}`,
      siteName: "CoreIntent",
      title: t(dict, "meta.title"),
      description: t(dict, "meta.description"),
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "CoreIntent — Agentic AI Trading Engine powered by Claude, Grok & Perplexity",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CoreIntent | AI Trading Competitions",
      description: t(dict, "meta.description"),
      creator: "@coreintentai",
      site: "@coreintentai",
      images: ["/opengraph-image.png"],
    },
    keywords: [
      "AI trading",
      "trading signals",
      "paper trading",
      "trading competitions",
      "Claude",
      "Grok",
      "Perplexity",
      "crypto",
      "cryptocurrency",
      "agentic AI",
      "multi-model AI",
      "algorithmic trading",
      "AI agents",
      "CoreIntent",
      "Zynthio",
    ],
    other: {
      "google-site-verification": "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://coreintent.dev/#person",
      name: "Corey McIvor",
      email: "corey@coreyai.ai",
      url: "https://zynthio.ai",
      jobTitle: "Founder & Developer",
      worksFor: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      sameAs: [
        "https://github.com/coreintentdev",
        "https://x.com/coreintentai",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Cryptocurrency Trading",
        "Multi-Model AI Orchestration",
        "Software Engineering",
      ],
      nationality: {
        "@type": "Country",
        name: "New Zealand",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://zynthio.ai/#organization",
      name: "Zynthio",
      url: "https://zynthio.ai",
      logo: "https://coreintent.dev/opengraph-image.png",
      founder: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      areaServed: {
        "@type": "Country",
        name: "New Zealand",
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
      browserRequirements: "Requires JavaScript. Requires a modern browser.",
      softwareVersion: "0.2.0-alpha",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NZD",
        description: "Free competition-based AI trading platform",
        availability: "https://schema.org/InStock",
      },
      author: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      creator: {
        "@type": "Person",
        "@id": "https://coreintent.dev/#person",
      },
      featureList: [
        "Multi-AI orchestration (Claude, Grok, Perplexity)",
        "Paper trading competitions",
        "Daily, weekly, monthly leagues",
        "Interactive web terminal",
        "AI agent fleet",
        "Bot-friendly competitions",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://coreintent.dev/#website",
      url: "https://coreintent.dev",
      name: "CoreIntent",
      description:
        "Agentic AI Trading Engine — No Subscriptions, Just Competitions",
      publisher: {
        "@type": "Organization",
        "@id": "https://zynthio.ai/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://coreintent.dev/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  const hreflangLinks = locales.map((loc) => ({
    locale: localeHtmlLang[loc],
    href: `https://coreintent.dev/${loc}`,
  }));

  return (
    <I18nProvider locale={locale as Locale} dict={dict}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {hreflangLinks.map((link) => (
        <link
          key={link.locale}
          rel="alternate"
          hrefLang={link.locale}
          href={link.href}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://coreintent.dev/en"
      />
      {children}
    </I18nProvider>
  );
}
