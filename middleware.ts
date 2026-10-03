import { NextRequest, NextResponse } from "next/server";

/**
 * Global Next.js Edge middleware — handles CORS preflight for all /api routes.
 * Runs before any route handler on the Edge runtime.
 *
 * For production: lock ALLOWED_ORIGIN to "https://coreintent.dev" via env var.
 */
export function middleware(req: NextRequest): NextResponse | undefined {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":  process.env.ALLOWED_ORIGIN ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age":       "86400",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
