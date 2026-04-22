import { i18nConfig, isValidLocale, getDirection } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n-config";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <I18nProvider locale={locale as Locale} dict={dict} dir={dir}>
      {children}
    </I18nProvider>
  );
}
