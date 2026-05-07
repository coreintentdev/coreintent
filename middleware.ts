import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./lib/i18n-config";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const LOCALE_COOKIE = "NEXT_LOCALE";

function detectLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of preferred) {
      const code = lang.split("-")[0];
      if (locales.includes(code as Locale)) return code as Locale;
    }
  }

  return defaultLocale;
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
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

  if (pathname.startsWith("/api/")) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes("/opengraph-image") ||
    pathname.includes("/twitter-image") ||
    pathname.includes("/apple-icon") ||
    pathname.includes("/icon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    /\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathnameHasLocale(pathname)) {
    const res = NextResponse.next();
    const locale = pathname.split("/")[1] as Locale;
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000 });
    return res;
  }

  const locale = detectLocale(req);
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;
  const res = NextResponse.redirect(newUrl);
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000 });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
