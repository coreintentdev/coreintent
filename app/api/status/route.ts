/**
 * /api/status — System health and component status overview.
 *
 * Reports real AI key status (active vs demo) derived from env vars.
 * Exchange connections are all "planned" — no live connections exist yet.
 * Uptime is process.uptime() — time since the Node process started.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";

type AIStatus = "active" | "demo";
type ExchangeStatus = "planned" | "connected";

interface StatusResponse {
  engine: "online" | "offline";
  version: string;
  /** Process uptime in seconds. */
  uptime: number;
  mode: "paper_trading" | "live";
  exchanges: Record<string, ExchangeStatus>;
  ai: Record<string, AIStatus>;
  signals: { active: number; pending: number };
  circuitBreaker: { threshold: number; status: "armed" | "triggered" };
  timestamp: string;
}

function aiStatus(key: string | undefined, placeholder: string): AIStatus {
  return key && key !== placeholder ? "active" : "demo";
}

export async function GET() {
  const data: StatusResponse = {
    engine: "online",
    version: "0.2.0-alpha",
    uptime: process.uptime(),
    mode: "paper_trading",
    exchanges: {
      binance:  "planned",
      coinbase: "planned",
      gtrade:   "planned",
    },
    ai: {
      claude:     aiStatus(process.env.ANTHROPIC_API_KEY, "sk-ant-xxx"),
      grok:       aiStatus(process.env.GROK_API_KEY, "xai-xxx"),
      perplexity: aiStatus(process.env.PERPLEXITY_API_KEY, "pplx-xxx"),
    },
    signals: { active: 12, pending: 3 },
    circuitBreaker: { threshold: 0.008, status: "armed" },
    timestamp: new Date().toISOString(),
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
