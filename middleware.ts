import { NextRequest, NextResponse } from "next/server";
import { i18nConfig } from "./lib/i18n-config";

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18nConfig.defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = i18nConfig.locales.find((l) => lang === l || lang.startsWith(l + "-"));
    if (exact) return exact;
  }
  return i18nConfig.defaultLocale;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.json" ||
    pathname === "/favicon.ico" ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (i18nConfig.locales.includes(maybeLocale as typeof i18nConfig.locales[number])) {
    const response = NextResponse.next();
    response.headers.set("x-locale", maybeLocale);
    return response;
  }

  const locale = getPreferredLocale(request);
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ["/((?!_next|static|api|.*\\..*).*)"],
};
