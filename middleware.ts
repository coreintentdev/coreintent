import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isLocale, negotiateLocale } from "./lib/i18n";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
};

const LOCALE_COOKIE = "NEXT_LOCALE";

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  // --- API routes: CORS preflight + security headers (unchanged) ---
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

  // --- Skip static assets & Next internals ---
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // static files (.css, .js, .png, etc.)
  ) {
    return undefined;
  }

  // --- Already on a locale path? Apply security headers and continue ---
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (isLocale(maybeLocale)) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  // --- Detect preferred locale ---
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    (cookieLocale && isLocale(cookieLocale) ? cookieLocale : null) ??
    negotiateLocale(req.headers.get("accept-language"));

  // --- Redirect to locale-prefixed path ---
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 365 * 24 * 60 * 60 });
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon|.*\\..*).*)"],
};
