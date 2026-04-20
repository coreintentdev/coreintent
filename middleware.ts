import { NextRequest, NextResponse } from "next/server";

/**
 * Global Next.js Edge middleware — handles CORS preflight for all /api routes
 * and attaches security headers to every API response.
 *
 * For production: lock ALLOWED_ORIGIN to "https://coreintent.dev" via env var.
 */

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin":  process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age":       "86400",
};

/** Security headers applied to every /api response (not OPTIONS). */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "X-XSS-Protection":       "1; mode=block",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
};

export function middleware(req: NextRequest): NextResponse {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  const res = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
