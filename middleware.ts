import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale, detectLocale } from "./lib/i18n";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  // API routes: CORS preflight + security headers
  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
          ...SECURITY_HEADERS,
        },
      });
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // Skip locale routing for static/metadata files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/icon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|eot|css|js|map)$/.test(
      pathname,
    )
  ) {
    return undefined;
  }

  const segments = pathname.split("/");
  const firstSegment = segments[1];

  // Path already has a valid locale — pass through with x-locale header
  if (firstSegment && isValidLocale(firstSegment)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", firstSegment);
    return applySecurityHeaders(
      NextResponse.next({ request: { headers: requestHeaders } }),
    );
  }

  // No locale in URL — detect from cookie > Accept-Language > default
  const cookieLocale = req.cookies.get("locale")?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale)
      ? cookieLocale
      : detectLocale(req.headers.get("accept-language"));

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
