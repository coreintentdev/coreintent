import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const DEFAULT_LOCALE = "en";
const RTL_LOCALES = ["ar"];

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
};

function getLocaleFromAcceptLanguage(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;
  const languages = header.split(",").map((part) => {
    const [lang, q] = part.trim().split(";q=");
    return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
  });
  languages.sort((a, b) => b.q - a.q);
  for (const { lang } of languages) {
    if (LOCALES.includes(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin":  process.env.ALLOWED_ORIGIN ?? "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age":       "86400",
          ...SECURITY_HEADERS,
        },
      });
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.includes(".") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const pathnameHasLocale = LOCALES.includes(firstSegment);

  let locale: string;
  if (pathnameHasLocale) {
    locale = firstSegment;
  } else {
    locale = req.cookies.get("locale")?.value
      ?? getLocaleFromAcceptLanguage(req.headers.get("accept-language"));
  }

  if (!pathnameHasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", locale);
    requestHeaders.set("x-locale-dir", RTL_LOCALES.includes(locale) ? "rtl" : "ltr");
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-locale-dir", RTL_LOCALES.includes(locale) ? "rtl" : "ltr");
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.cookies.set("locale", locale, { path: "/", maxAge: 365 * 24 * 60 * 60, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
