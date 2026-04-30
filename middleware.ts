import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = [
  "en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi",
];
const DEFAULT_LOCALE = "en";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
};

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie && SUPPORTED_LOCALES.includes(cookie)) return cookie;

  const accept = req.headers.get("accept-language");
  if (accept) {
    const preferred = accept
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    for (const { lang } of preferred) {
      if (SUPPORTED_LOCALES.includes(lang)) return lang;
    }
  }
  return DEFAULT_LOCALE;
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

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
    const res = NextResponse.next();
    res.cookies.set("locale", firstSegment, { path: "/", maxAge: 31536000, sameSite: "lax" });
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  const res = NextResponse.next();
  const locale = detectLocale(req);
  res.cookies.set("locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
