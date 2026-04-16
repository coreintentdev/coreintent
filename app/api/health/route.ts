/**
 * /api/health — System health check.
 *
 * Used by uptime monitors, load balancers, Vercel deployment checks, and CI.
 * Always returns 200 {status: "ok"} when the Next.js process is alive.
 * Uptime counts seconds since the module was first imported (process lifetime).
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";

const BOOT_TIME = Date.now();

interface HealthResponse {
  status: "ok";
  version: string;
  uptime: number;
  timestamp: string;
  mode: "paper_trading" | "live";
}

export async function GET() {
  const data: HealthResponse = {
    status: "ok",
    version: "0.2.0-alpha",
    uptime: Math.floor((Date.now() - BOOT_TIME) / 1000),
    timestamp: new Date().toISOString(),
    mode: "paper_trading",
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
