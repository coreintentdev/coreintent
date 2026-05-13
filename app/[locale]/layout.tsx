import { notFound } from "next/navigation";
import { isValidLocale, SUPPORTED_LOCALES, LOCALE_HREFLANG, isRTL, loadMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const messages = await loadMessages(locale);
  const title = messages["site.title"] || "CoreIntent";
  const description = messages["site.description"] || "";

  const languages: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languages[LOCALE_HREFLANG[loc]] = `https://coreintent.dev/${loc}`;
  }
  languages["x-default"] = "https://coreintent.dev/en";

  return {
    title,
    description,
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages,
    },
    openGraph: {
      locale: locale === "en" ? "en_NZ" : locale,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div dir={isRTL(locale as Locale) ? "rtl" : "ltr"} lang={locale}>
      {children}
    </div>
  );
}
