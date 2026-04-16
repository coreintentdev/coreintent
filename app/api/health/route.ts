/**
 * /api/health — System health check.
 *
 * Used by uptime monitors, load balancers, Vercel deployment checks, and CI.
 * Always returns 200 {status: "ok"} when the Next.js process is alive.
 * Includes Node.js version, RSS memory usage, and which AI keys are configured,
 * so monitoring tools can detect key-rotation or memory issues without calling /api/status.
 *
 * Uptime counts seconds since the module was first imported (process lifetime).
 * memoryMB is RSS (resident set size) — total memory held by the Node process.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";
import { getAiKeyStatus, type AiKeyStatus } from "@/lib/ai";

const BOOT_TIME = Date.now();

interface HealthResponse {
  status:      "ok";
  version:     string;
  /** Seconds since this process started. */
  uptime:      number;
  timestamp:   string;
  mode:        "paper_trading" | "live";
  /** Node.js runtime version (e.g. "v20.12.0"). */
  nodeVersion: string;
  /** Process RSS memory in megabytes. */
  memoryMB:    number;
  /** Which AI API keys are configured (true) vs demo placeholder (false). */
  aiKeys:      AiKeyStatus;
}

export async function GET() {
  const mem = process.memoryUsage();
  const data: HealthResponse = {
    status:      "ok",
    version:     "0.2.0-alpha",
    uptime:      Math.floor((Date.now() - BOOT_TIME) / 1000),
    timestamp:   new Date().toISOString(),
    mode:        "paper_trading",
    nodeVersion: process.version,
    memoryMB:    Math.round(mem.rss / 1_048_576),
    aiKeys:      getAiKeyStatus(),
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
