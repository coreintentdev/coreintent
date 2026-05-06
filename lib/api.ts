/**
 * Shared API utilities for CoreIntent routes.
 *
 * Provides:
 * - Standard {success, data, error} response envelope
 * - CORS headers applied to every response
 * - X-Request-ID tracing header on every response (UUID per call)
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
 * CORS + security headers applied to all API responses.
 * Set ALLOWED_ORIGIN env var to a specific domain in production
 * (e.g. "https://coreintent.dev"). Defaults to "*" for dev.
 * X-Request-ID is exposed so browser clients can read it for tracing.
 *
 * Security headers here are defense-in-depth alongside middleware.ts.
 */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin":   process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods":  "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":  "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Expose-Headers": "X-Request-ID",
  "Access-Control-Max-Age":        "86400",
  "X-Content-Type-Options":        "nosniff",
  "X-Frame-Options":               "DENY",
  "Referrer-Policy":               "strict-origin-when-cross-origin",
  "X-Robots-Tag":                  "noindex, nofollow",
};

/** Generate a unique request trace ID for each response. */
function reqId(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

/** Return a successful JSON response wrapped in the standard envelope. */
export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status, headers: { ...CORS_HEADERS, "X-Request-ID": reqId() } }
  );
}

/**
 * Like ok(), but adds X-Demo: true to signal that the payload contains
 * demo/static data rather than live exchange or AI responses.
 * Useful for monitoring dashboards and client-side feature flags.
 *
 * @example
 * return demoOk(data); // marks response as demo to any HTTP client
 */
export function demoOk<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status, headers: { ...CORS_HEADERS, "X-Request-ID": reqId(), "X-Demo": "true" } }
  );
}

/** Return an error JSON response wrapped in the standard envelope. */
export function err(message: string, status = 500): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, error: message },
    { status, headers: { ...CORS_HEADERS, "X-Request-ID": reqId() } }
  );
}

/** Handle CORS preflight OPTIONS requests (204 No Content). */
export function preflight(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, "X-Request-ID": reqId() },
  });
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

/** 400 Bad Request — validation failure shorthand. */
export function badRequest(message: string): NextResponse<ApiResponse<null>> {
  return err(message, 400);
}

/**
 * 201 Created — use when a new resource is successfully persisted.
 * More semantically precise than ok(data, 201) for POST handlers that create records.
 *
 * @example
 * return created({ note }); // POST /api/notes
 */
export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status: 201, headers: { ...CORS_HEADERS, "X-Request-ID": reqId() } }
  );
}

/**
 * 202 Accepted — use when a job is queued but not yet completed (e.g. demo/async content gen).
 * Signals to the client that the request was valid but processing is deferred.
 *
 * @example
 * return accepted({ status: "queued", estimatedTime: "2s" }); // POST /api/content (demo mode)
 */
export function accepted<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status: 202, headers: { ...CORS_HEADERS, "X-Request-ID": reqId() } }
  );
}

/** 502 Bad Gateway — AI or upstream service returned an unexpected response. */
export function gatewayError(
  message = "Upstream service returned an invalid response"
): NextResponse<ApiResponse<null>> {
  return err(message, 502);
}

/** 503 Service Unavailable — AI service or upstream dependency is temporarily down. */
export function serviceUnavailable(
  message = "Service temporarily unavailable. Please try again shortly."
): NextResponse<ApiResponse<null>> {
  return err(message, 503);
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
      headers: { ...CORS_HEADERS, "Retry-After": String(retryAfterSeconds), "X-Request-ID": reqId() },
    }
  );
}

/**
 * 204 No Content — use for DELETE or clear operations that return no body.
 *
 * @example
 * return noContent(); // DELETE /api/notes/:id
 */
export function noContent(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, "X-Request-ID": reqId() },
  });
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
    { status: 405, headers: { ...CORS_HEADERS, Allow: allowed.join(", "), "X-Request-ID": reqId() } }
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
 * Validate an optional string field from a request body.
 * Returns null when the field is absent, empty after trim, non-string, or exceeds maxLen.
 * Differs from validateString in that callers treat null as "use default" rather than "error".
 *
 * @example
 * const tag = validateOptionalString(body.tag, 50) ?? "general";
 */
export function validateOptionalString(value: unknown, maxLen: number): string | null {
  if (value === undefined || value === null) return null;
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

/**
 * Validate an array of strings from a request body.
 * Returns the filtered array (non-strings removed) when valid, or null when:
 * - value is not an array
 * - any element exceeds itemMaxLen
 * - resulting array length is outside [minLen, maxLen]
 *
 * @example
 * const tags = validateArray(body.tags, 50, 1, 10);
 * if (!tags) return badRequest("tags must be 1–10 strings, each ≤ 50 chars");
 */
export function validateArray(
  value: unknown,
  itemMaxLen: number,
  minLen = 0,
  maxLen = 100,
): string[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length < minLen || value.length > maxLen) return null;
  const strings = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= itemMaxLen);
  if (strings.length !== value.length) return null;
  return strings;
}

/**
 * Runtime type guard for the standard ApiResponse envelope.
 * Use in test fixtures or when consuming CoreIntent API responses
 * from an external context where TypeScript compile-time checks don't apply.
 *
 * @example
 * const raw = await res.json();
 * if (!isApiResponse(raw)) throw new Error("Unexpected response shape");
 */
export function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.success === "boolean" && "data" in obj;
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

/**
 * Build standard rate-limit response headers for a given window.
 * Wire these into tooManyRequests() responses once checkRateLimit is backed by KV.
 *
 * @param limit     The request budget for the window (from RATE_LIMITS).
 * @param remaining Requests still available in the current window.
 * @param resetAt   Unix timestamp (seconds) when the window resets.
 *
 * @example
 * const rlHeaders = rateLimitHeaders(RATE_LIMITS.ai.max, 7, Date.now() / 1000 + 60);
 * return NextResponse.json({ ... }, { status: 429, headers: { ...CORS_HEADERS, ...rlHeaders } });
 */
export function rateLimitHeaders(
  limit: number,
  remaining: number,
  resetAt: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit":     String(limit),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset":     String(Math.floor(resetAt)),
    "Retry-After":           String(Math.max(1, Math.ceil(resetAt - Date.now() / 1000))),
  };
}

/**
 * Rate limit check — no-op stub until Cloudflare KV or Upstash Redis is wired in.
 * Call at the start of each route handler; return tooManyRequests() if limited.
 * Wire the real implementation by replacing this function body — all call sites
 * are already in place across every route handler.
 *
 * @example
 * const limit = await checkRateLimit(req.headers.get("x-forwarded-for") ?? "anon", "ai");
 * if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
 */
export async function checkRateLimit(
  _ip: string,
  _route: keyof typeof RATE_LIMITS | "default" = "default"
): Promise<{ limited: boolean; retryAfter?: number }> {
  // TODO: wire to Cloudflare KV or Upstash Redis when persistence layer is ready.
  return { limited: false };
}
