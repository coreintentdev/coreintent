/**
 * /api/health — System health check.
 *
 * Used by uptime monitors, load balancers, Vercel deployment checks, and CI.
 * Always returns 200 {status: "ok"} when the Next.js process is alive.
 * Includes Node.js version and a lightweight check of which AI keys are configured,
 * so monitoring tools can detect key-rotation issues without calling /api/status.
 *
 * Uptime counts seconds since the module was first imported (process lifetime).
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";

const BOOT_TIME = Date.now();

interface AIKeyStatus {
  /** true = a real key is configured; false = demo placeholder */
  claude:     boolean;
  grok:       boolean;
  perplexity: boolean;
}

interface MemoryMetrics {
  /** V8 heap currently in use (MB). */
  heapUsedMb:  number;
  /** Total V8 heap allocated (MB). */
  heapTotalMb: number;
  /** Resident set size — total process memory including native heap (MB). */
  rssMb:       number;
}

interface HealthResponse {
  status:      "ok";
  version:     string;
  /** Seconds since this process started. */
  uptime:      number;
  timestamp:   string;
  mode:        "paper_trading" | "live";
  /** Node.js runtime version (e.g. "v20.12.0"). */
  nodeVersion: string;
  /** Which AI API keys are configured (true) vs demo placeholder (false). */
  aiKeys:      AIKeyStatus;
  /** Process memory snapshot at request time. */
  memory:      MemoryMetrics;
}

function isKeyConfigured(key: string | undefined, placeholder: string): boolean {
  return Boolean(key && key !== placeholder);
}

export async function GET() {
  const mem = process.memoryUsage();
  const toMb = (bytes: number) => Math.round(bytes / 1024 / 1024 * 10) / 10;

  const data: HealthResponse = {
    status:      "ok",
    version:     "0.2.0-alpha",
    uptime:      Math.floor((Date.now() - BOOT_TIME) / 1000),
    timestamp:   new Date().toISOString(),
    mode:        "paper_trading",
    nodeVersion: process.version,
    aiKeys: {
      claude:     isKeyConfigured(process.env.ANTHROPIC_API_KEY, "sk-ant-xxx"),
      grok:       isKeyConfigured(process.env.GROK_API_KEY, "xai-xxx"),
      perplexity: isKeyConfigured(process.env.PERPLEXITY_API_KEY, "pplx-xxx"),
    },
    memory: {
      heapUsedMb:  toMb(mem.heapUsed),
      heapTotalMb: toMb(mem.heapTotal),
      rssMb:       toMb(mem.rss),
    },
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
