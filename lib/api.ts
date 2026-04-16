/**
 * Shared API utilities for CoreIntent routes.
 *
 * Provides:
 * - Standard {success, data, error} response envelope
 * - CORS headers applied to every response
 * - ok() / err() / preflight() response helpers
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
 * AI routes are deliberately tight — each call costs real money.
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  default:  { windowMs: 60_000, max: 60 },
  ai:       { windowMs: 60_000, max: 10 },
  protect:  { windowMs: 60_000, max: 5 },
  research: { windowMs: 60_000, max: 5 },
  content:  { windowMs: 60_000, max: 20 },
  notes:    { windowMs: 60_000, max: 30 },
  autosave: { windowMs: 60_000, max: 60 },
};
