import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const DEFAULT_LOCALE = "en";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options":    "nosniff",
  "X-Frame-Options":           "DENY",
  "Referrer-Policy":           "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

function negotiateLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const exact = LOCALES.find((l) => lang === l);
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    const match = LOCALES.find((l) => l === prefix);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

function getPathnameLocale(pathname: string): string | null {
  const segment = pathname.split("/")[1];
  return LOCALES.includes(segment) ? segment : null;
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
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

  if (pathname.startsWith("/api/")) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return undefined;
  }

  const pathnameLocale = getPathnameLocale(pathname);

  if (!pathnameLocale) {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    const locale =
      (cookieLocale && LOCALES.includes(cookieLocale) ? cookieLocale : null) ||
      negotiateLocale(req.headers.get("accept-language"));

    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.cookies.set("NEXT_LOCALE", pathnameLocale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
