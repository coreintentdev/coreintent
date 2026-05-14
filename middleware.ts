import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale, detectLocaleFromHeader } from "@/lib/i18n";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options":    "nosniff",
  "X-Frame-Options":           "DENY",
  "Referrer-Policy":           "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return applySecurityHeaders(new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":  process.env.ALLOWED_ORIGIN ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age":       "86400",
      },
    }));
  }

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    /\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|css|js|json)$/i.test(pathname)
  ) {
    const res = NextResponse.next();
    if (pathname.startsWith("/api/")) return applySecurityHeaders(res);
    return res;
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    const res = NextResponse.next();
    res.headers.set("x-locale", maybeLocale);
    if (pathname.startsWith("/api/")) return applySecurityHeaders(res);
    return res;
  }

  const locale = detectLocaleFromHeader(req.headers.get("accept-language"));
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(newUrl);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
