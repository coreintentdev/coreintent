import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  isValidLocale,
  locales,
  getTranslations,
  getHreflangLinks,
  type Locale,
} from "@/lib/i18n";
import { TranslationProvider } from "@/lib/i18n-client";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const links = getHreflangLinks(`/${locale}`);
  return {
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages: Object.fromEntries(
        links.map((l) => [l.locale, l.href]),
      ),
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
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const translations = await getTranslations(locale);

  return (
    <TranslationProvider
      locale={locale}
      translations={translations as Record<string, unknown>}
    >
      {children}
    </TranslationProvider>
  );
}
