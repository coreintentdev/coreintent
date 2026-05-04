import { notFound } from "next/navigation";
import { I18nProvider } from "@/lib/i18n-context";
import { locales, getMessages, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <I18nProvider locale={locale as Locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}
