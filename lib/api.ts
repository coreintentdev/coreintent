/**
 * Shared API utilities for CoreIntent routes.
 *
 * Provides:
 * - Standard {success, data, error} response envelope
 * - CORS headers applied to every response
 * - ok() / err() / preflight() / serverError() response helpers
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
  "Access-Control-Allow-Origin":  process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age":       "86400",
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
 * 500 Internal Server Error — logs detail server-side, returns a safe generic message.
 * Never exposes the underlying error to the client.
 */
export function serverError(detail?: unknown): NextResponse<ApiResponse<null>> {
  if (detail !== undefined) {
    console.error("[CoreIntent API] Internal error:", detail);
  }
  return err("Internal server error. Please try again.", 500);
}

/** 400 Bad Request — invalid or missing input from the caller. */
export function badRequest(message: string): NextResponse<ApiResponse<null>> {
  return err(message, 400);
}

/** 404 Not Found. */
export function notFound(message = "Not found"): NextResponse<ApiResponse<null>> {
  return err(message, 404);
}

/** 401 Unauthorized. */
export function unauthorized(message = "Unauthorized"): NextResponse<ApiResponse<null>> {
  return err(message, 401);
}

/** 403 Forbidden. */
export function forbidden(message = "Forbidden"): NextResponse<ApiResponse<null>> {
  return err(message, 403);
}

/**
 * 429 Too Many Requests.
 * @param retryAfterSeconds How long the caller should wait before retrying.
 */
export function tooManyRequests(retryAfterSeconds = 60): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: "Rate limit exceeded. Please slow down." },
    {
      status: 429,
      headers: { ...CORS_HEADERS, "Retry-After": String(retryAfterSeconds) },
    }
  );
}

/**
 * 405 Method Not Allowed.
 * Next.js handles unexported methods automatically, but this provides a consistent envelope.
 */
export function methodNotAllowed(
  allowed: string[] = ["GET", "POST", "OPTIONS"]
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: `Method not allowed. Allowed: ${allowed.join(", ")}` },
    { status: 405, headers: { ...CORS_HEADERS, Allow: allowed.join(", ") } }
  );
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

/**
 * Validate and trim a string from a request body.
 * Returns the trimmed string when valid, or null when absent / non-string /
 * empty / exceeding maxLen. Callers decide whether null means a 400 error.
 */
export function validateString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}

/**
 * Validate a numeric field from a request body.
 * Returns the number when valid, or null when absent / non-finite / out of range.
 *
 * @example
 * const confidence = validateNumber(body.confidence, 0, 1);
 * if (confidence === null) return err("confidence must be 0–1", 400);
 */
export function validateNumber(
  value: unknown,
  min: number,
  max: number,
): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

/**
 * Validate a boolean from a request body.
 * Returns the boolean when valid, or null when absent / non-boolean.
 *
 * @example
 * const flag = validateBoolean(body.contextComplete) ?? true;
 */
export function validateBoolean(value: unknown): boolean | null {
  if (typeof value !== "boolean") return null;
  return value;
}

/**
 * Validate a positive integer from a request body (e.g. count fields).
 * Returns the integer when valid, or null when absent / non-integer / out of range.
 *
 * @example
 * const count = validatePositiveInt(body.count, 100);
 * if (count === null) return err("count must be an integer between 1 and 100", 400);
 */
export function validatePositiveInt(value: unknown, max: number): number | null {
  const n = validateNumber(value, 1, max);
  if (n === null || !Number.isInteger(n)) return null;
  return n;
}

/**
 * Validate that a string value is one of the allowed enum options.
 * Returns the typed value when valid, or null when missing / unrecognised.
 * Preserves the TypeScript enum type so the caller avoids casts.
 *
 * @example
 * const tone = validateEnum(body.tone, VALID_TONES) ?? "technical";
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | null {
  if (typeof value !== "string") return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
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
