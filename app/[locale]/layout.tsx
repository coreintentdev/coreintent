import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, SUPPORTED_LOCALES, LOCALE_HTML_LANG, isRtl, loadMessages, DEFAULT_LOCALE } from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const messages = await loadMessages(localeParam);
  const title =
    typeof messages.meta === "object" && "title" in messages.meta
      ? (messages.meta as Record<string, string>).title
      : "CoreIntent";
  const description =
    typeof messages.meta === "object" && "description" in messages.meta
      ? (messages.meta as Record<string, string>).description
      : "";

  const alternates: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    alternates[LOCALE_HTML_LANG[loc]] = `https://coreintent.dev/${loc}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://coreintent.dev/${localeParam}`,
      languages: alternates,
    },
    openGraph: {
      locale: LOCALE_HTML_LANG[localeParam],
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== localeParam).map(
        (l) => LOCALE_HTML_LANG[l],
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
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const messages = await loadMessages(localeParam);
  const dir = isRtl(localeParam) ? "rtl" : "ltr";

  const { LocaleProvider } = await import("@/lib/locale-context");

  return (
    <div dir={dir} data-locale={localeParam}>
      <LocaleProvider locale={localeParam} messages={messages}>
        {children}
      </LocaleProvider>
    </div>
  );
}
