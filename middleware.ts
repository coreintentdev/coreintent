import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
};

function getLocaleFromHeaders(req: NextRequest): string {
  const acceptLang = req.headers.get("accept-language");
  if (!acceptLang) return DEFAULT_LOCALE;

  const preferred = acceptLang
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = LOCALES.find((l) => lang === l || lang.startsWith(`${l}-`));
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    const partial = LOCALES.find((l) => l === prefix);
    if (partial) return partial;
  }
  return DEFAULT_LOCALE;
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/");
  const first = segments[1];
  if (first && LOCALES.includes(first)) return first;
  return null;
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  // API routes: CORS + security headers only
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

  // Skip static assets, Next.js internals, and metadata files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json"
  ) {
    return undefined;
  }

  const pathnameLocale = getLocaleFromPath(pathname);

  // If path already has a valid locale, set header and continue
  if (pathnameLocale) {
    const res = NextResponse.next();
    res.headers.set("x-locale", pathnameLocale);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  // No locale in path — detect and redirect
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const detectedLocale = (cookieLocale && LOCALES.includes(cookieLocale))
    ? cookieLocale
    : getLocaleFromHeaders(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, detectedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|apple-icon|icon).*)",
  ],
};
