import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, detectLocale } from "@/lib/i18n";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

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
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", firstSegment);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale)
      ? cookieLocale
      : detectLocale(req.headers.get("accept-language"));

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|opengraph-image|twitter-image|apple-icon|icon\\.png|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|map)).*)",
  ],
};
