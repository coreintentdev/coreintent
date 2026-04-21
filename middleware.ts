import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return LOCALES.includes(maybeLocale) ? maybeLocale : null;
}

function negotiateLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";");
      const q = qPart ? parseFloat(qPart.replace("q=", "")) : 1;
      return { lang: lang.trim().toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    if (LOCALES.includes(lang)) return lang;
    const prefix = lang.split("-")[0];
    if (LOCALES.includes(prefix)) return prefix;
  }

  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image")
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);

  if (pathLocale) {
    const response = NextResponse.next();
    response.headers.set("x-locale", pathLocale);
    response.cookies.set(LOCALE_COOKIE, pathLocale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
    return response;
  }

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && LOCALES.includes(cookieLocale)
      ? cookieLocale
      : negotiateLocale(req.headers.get("accept-language"));

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|press/|marketing/).*)"],
};
