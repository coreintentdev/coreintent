"use client";

import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_META, DEFAULT_LOCALE, isValidLocale, getHtmlLang } from "@/lib/i18n";

export default function HreflangTags() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = isValidLocale(segments[0])
    ? `/${segments.slice(1).join("/")}`
    : pathname;
  const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;

  return (
    <>
      {LOCALES.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={getHtmlLang(locale)}
          href={`https://coreintent.dev/${locale}${cleanPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`https://coreintent.dev/${DEFAULT_LOCALE}${cleanPath}`}
      />
    </>
  );
}
