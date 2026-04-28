import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const DEFAULT_LOCALE = "en";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function getPreferredLocale(req: NextRequest): string {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;

  const acceptLang = req.headers.get("Accept-Language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of preferred) {
      if (LOCALES.includes(lang)) return lang;
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
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
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return undefined;
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (LOCALES.includes(maybeLocale)) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  const locale = getPreferredLocale(req);
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(newUrl);
  res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
