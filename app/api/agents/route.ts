/**
 * /api/agents — List all CoreIntent trading agents and their current status.
 *
 * Returns DEMO data until agents are deployed to the Cloudzy VPS (COR-20).
 * Agent names, models, and task descriptions reflect the real planned architecture.
 *
 * Query params:
 *   ?status=active      — filter by agent status (active | processing | paused | error).
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { demoOk, badRequest, preflight, serverError, checkRateLimit, tooManyRequests } from "@/lib/api";

type AgentStatus = "active" | "processing" | "paused" | "error";

interface Agent {
  name:   string;
  model:  string;
  status: AgentStatus;
  task:   string;
  /** Uptime in seconds. 0 = paused or not yet started. */
  uptime: number;
}

interface AgentsResponse {
  agents:          Agent[];
  totalActive:     number;
  totalPaused:     number;
  totalProcessing: number;
  /** demo = VPS not yet deployed; live = agents running on Cloudzy */
  mode:            "demo" | "live";
  timestamp:       string;
}

const VALID_STATUSES: readonly AgentStatus[] = ["active", "processing", "paused", "error"];

const ALL_AGENTS: readonly Agent[] = [
  { name: "TrendFollower",  model: "claude-opus-4-7",            status: "active",     task: "BTC/ETH momentum",        uptime: 3600 },
  { name: "MeanRevert",     model: "claude-sonnet-4-6",          status: "active",     task: "SOL mean reversion",      uptime: 3500 },
  { name: "SentimentBot",   model: "grok-3",                     status: "processing", task: "Social signals",          uptime: 2400 },
  { name: "ArbitrageBot",   model: "claude-haiku-4-5-20251001",  status: "paused",     task: "Cross-exchange spreads",  uptime: 0    },
  { name: "RiskGuard",      model: "claude-opus-4-7",            status: "active",     task: "Circuit breaker monitor", uptime: 3600 },
  { name: "ResearchAgent",  model: "perplexity-sonar",           status: "active",     task: "Market research",         uptime: 1800 },
];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip);
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    const statusParam = req.nextUrl.searchParams.get("status")?.toLowerCase() as AgentStatus | null;

    if (statusParam !== null && !VALID_STATUSES.includes(statusParam)) {
      return badRequest(`status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const agents: Agent[] = statusParam
      ? ALL_AGENTS.filter((a) => a.status === statusParam)
      : [...ALL_AGENTS];

    const data: AgentsResponse = {
      agents,
      totalActive:     agents.filter((a) => a.status === "active").length,
      totalPaused:     agents.filter((a) => a.status === "paused").length,
      totalProcessing: agents.filter((a) => a.status === "processing").length,
      mode:            "demo",
      timestamp:       new Date().toISOString(),
    };
    return demoOk(data);
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
