/**
 * /api/health — System health check.
 *
 * Used by uptime monitors, load balancers, Vercel deployment checks, and CI.
 * Always returns 200 {status: "ok"} when the Next.js process is alive.
 * Includes RSS memory usage and which AI keys are configured,
 * so monitoring tools can detect key-rotation or memory issues without calling /api/status.
 *
 * Uptime counts seconds since the module was first imported (process lifetime).
 * memoryMB is RSS (resident set size) — total memory held by the Node process.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, preflight, checkRateLimit, tooManyRequests } from "@/lib/api";
import { getAiKeyStatus, type AiKeyStatus } from "@/lib/ai";
import { APP_VERSION, PLATFORM_MODE } from "@/lib/constants";

const BOOT_TIME = Date.now();

interface HealthResponse {
  status:    "ok";
  version:   string;
  /** Seconds since this process started. */
  uptime:    number;
  timestamp: string;
  mode:      "paper_trading" | "live";
  /** Process RSS memory in megabytes. */
  memoryMB:  number;
  /** Which AI API keys are configured (true) vs demo placeholder (false). */
  aiKeys:    AiKeyStatus;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip);
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  const mem = process.memoryUsage();
  const data: HealthResponse = {
    status:    "ok",
    version:   APP_VERSION,
    uptime:    Math.floor((Date.now() - BOOT_TIME) / 1000),
    timestamp: new Date().toISOString(),
    mode:      PLATFORM_MODE,
    memoryMB:  Math.round(mem.rss / 1_048_576),
    aiKeys:    getAiKeyStatus(),
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
