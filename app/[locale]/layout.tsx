import { notFound } from "next/navigation";
import { LOCALES, type Locale, isValidLocale, loadMessages, getDir, getHtmlLang, getAlternateLinks } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";
import type { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const messages = await loadMessages(locale);
  const title = typeof messages.meta === "object" && "title" in messages.meta
    ? (messages.meta as Record<string, string>).title
    : undefined;
  const description = typeof messages.meta === "object" && "description" in messages.meta
    ? (messages.meta as Record<string, string>).description
    : undefined;

  const alternates = getAlternateLinks("/");
  const languages: Record<string, string> = {};
  for (const alt of alternates) {
    languages[alt.locale] = alt.href;
  }

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: `https://coreintent.dev/${locale}`,
      languages,
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
  if (!isValidLocale(locale)) notFound();

  const validLocale = locale as Locale;
  const messages = await loadMessages(validLocale);
  const dir = getDir(validLocale);
  const htmlLang = getHtmlLang(validLocale);

  return (
    <div data-locale={validLocale} data-dir={dir} lang={htmlLang} dir={dir}>
      <I18nProvider locale={validLocale} messages={messages}>
        {children}
      </I18nProvider>
    </div>
  );
}
