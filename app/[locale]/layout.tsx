import { type Locale, locales, localeNames, isRtl, localeRegionMap } from "@/lib/i18n-config";
import { getMessages } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nProvider";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);
  const t = (key: string): string => {
    const keys = key.split(".");
    let current: unknown = messages;
    for (const k of keys) {
      if (current == null || typeof current !== "object") return key;
      current = (current as Record<string, unknown>)[k];
    }
    return typeof current === "string" ? current : key;
  };

  const region = localeRegionMap[locale as Locale] ?? "en-NZ";
  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[localeRegionMap[loc]] = `https://coreintent.dev/${loc}`;
  }

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: region.replace("-", "_"),
      url: `https://coreintent.dev/${locale}`,
      siteName: "CoreIntent",
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.twitterTitle"),
      description: t("meta.twitterDescription"),
      creator: "@coreintentai",
      site: "@coreintentai",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const messages = await getMessages(typedLocale);

  return (
    <I18nProvider locale={typedLocale} messages={messages}>
      <div dir={isRtl(typedLocale) ? "rtl" : "ltr"} lang={localeRegionMap[typedLocale]}>
        {children}
      </div>
    </I18nProvider>
  );
}
