/**
 * Shared API utilities for CoreIntent routes.
 *
 * Provides:
 * - Standard {success, data, error} response envelope
 * - CORS headers applied to every response
 * - ok() / err() / preflight() response helpers
 * - notFound() / tooManyRequests() / methodNotAllowed() for common HTTP codes
 * - Rate limit config structure (wire to Cloudflare KV / Upstash when ready)
 */

import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Response envelope
// ---------------------------------------------------------------------------

/** Standard response shape for every CoreIntent API route. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------

/**
 * CORS headers applied to all API responses.
 * Set ALLOWED_ORIGIN env var to a specific domain in production
 * (e.g. "https://coreintent.dev"). Defaults to "*" for dev.
 */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

/** Return a successful JSON response wrapped in the standard envelope. */
export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status, headers: CORS_HEADERS });
}

/** Return an error JSON response wrapped in the standard envelope. */
export function err(message: string, status = 500): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: message },
    { status, headers: CORS_HEADERS }
  );
}

/** Handle CORS preflight OPTIONS requests (204 No Content). */
export function preflight(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * 404 Not Found — resource does not exist.
 * Use when a route receives a valid request for a resource that cannot be located.
 */
export function notFound(message = "Not found"): NextResponse<ApiResponse<null>> {
  return err(message, 404);
}

/**
 * 429 Too Many Requests — caller has exceeded the rate limit.
 * Optionally include a Retry-After header (seconds) so clients can back off.
 *
 * @param retryAfterSeconds  How long the caller should wait before retrying.
 */
export function tooManyRequests(
  retryAfterSeconds = 60
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: "Rate limit exceeded. Please slow down." },
    {
      status: 429,
      headers: {
        ...CORS_HEADERS,
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

/**
 * 405 Method Not Allowed — the HTTP method is not supported on this route.
 * Next.js handles this automatically for unexported methods, but this helper
 * lets routes return a consistent envelope when they want explicit control.
 */
export function methodNotAllowed(
  allowed: string[] = ["GET", "POST", "OPTIONS"]
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: `Method not allowed. Allowed: ${allowed.join(", ")}` },
    {
      status: 405,
      headers: {
        ...CORS_HEADERS,
        Allow: allowed.join(", "),
      },
    }
  );
}

/**
 * 401 Unauthorized — caller is not authenticated.
 * Use when the request requires a valid API key or auth token that was not provided.
 */
export function unauthorized(message = "Unauthorized"): NextResponse<ApiResponse<null>> {
  return err(message, 401);
}

/**
 * 403 Forbidden — caller is authenticated but not permitted.
 * Use when a valid token lacks the required scope or permission for this resource.
 */
export function forbidden(message = "Forbidden"): NextResponse<ApiResponse<null>> {
  return err(message, 403);
}

/**
 * 500 Internal Server Error — unexpected failure.
 * Logs the underlying error server-side; always returns a safe generic message to the client.
 *
 * @param detail  Optional error detail for server-side logging only — never sent to the client.
 */
export function serverError(detail?: unknown): NextResponse<ApiResponse<null>> {
  if (detail !== undefined) {
    console.error("[CoreIntent API] Internal error:", detail);
  }
  return err("Internal server error. Please try again.", 500);
}

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate and trim a string value from a request body.
 * Returns the trimmed string when valid, or null when absent, non-string, empty,
 * or exceeding maxLen. Callers decide whether null means a 400 error or a default.
 *
 * Avoids silent truncation — the full value is either accepted or rejected.
 *
 * @example
 * const text = validateString(body.text, 2000);
 * if (!text) return err("text is required and must be ≤ 2000 characters", 400);
 */
export function validateString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}

// ---------------------------------------------------------------------------
// Rate limiting — structure ready, implementation pending KV store
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  /** Sliding window in milliseconds. */
  windowMs: number;
  /** Max requests per window per IP. */
  max: number;
}

/**
 * Per-route rate limit budgets.
 * TODO: implement checkRateLimit(ip, route) once Cloudflare KV or Upstash Redis is wired in.
 *       When triggered, call tooManyRequests() from lib/api.ts.
 * AI routes are deliberately tight — each call costs real money.
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  default:  { windowMs: 60_000, max: 60 },
  ai:       { windowMs: 60_000, max: 10 },
  protect:  { windowMs: 60_000, max: 5  },
  research: { windowMs: 60_000, max: 5  },
  content:  { windowMs: 60_000, max: 20 },
  notes:    { windowMs: 60_000, max: 30 },
  autosave: { windowMs: 60_000, max: 60 },
};
