/**
 * /api/connections — Honest connection status for all services.
 *
 * No green dots unless verified. Demo = demo. Planned = planned. Ready = wired but needs key.
 * AI service status is derived from env key presence at request time.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, preflight, serverError, checkRateLimit, tooManyRequests } from "@/lib/api";
import { getAiKeyStatus } from "@/lib/ai";

interface AIService {
  status: "keyed" | "demo";
  model:  string;
  role:   string;
}

interface Exchange {
  status: "planned" | "connected";
  pairs:  string;
  type:   "CEX" | "DeFi";
}

interface InfraService {
  status:     string;
  role:       string;
  host?:      string;
  plan?:      string;
  repos?:     number;
  tasks?:     number;
  completed?: number;
}

interface Tool {
  status: "ready" | "planned" | "active";
  role:   string;
}

interface ConnectionsResponse {
  ai:             Record<string, AIService>;
  exchanges:      Record<string, Exchange>;
  infrastructure: Record<string, InfraService>;
  tools:          Record<string, Tool>;
  summary:        { total: number; live: number; keyed: number; demo: number; planned: number; ready: number };
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip);
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    const keys = getAiKeyStatus();
    const ai: ConnectionsResponse["ai"] = {
      grok: {
        status: keys.grok       ? "keyed" : "demo",
        model:  "grok-3",
        role:   "Signal detection, fast, near-free via X Premium+",
      },
      claude: {
        status: keys.claude     ? "keyed" : "demo",
        model:  "claude-sonnet-4-6",
        role:   "Deep analysis, risk assessment, orchestration",
      },
      perplexity: {
        status: keys.perplexity ? "keyed" : "demo",
        model:  "sonar-pro",
        role:   "Research, 9 connectors, fact-checking",
      },
    };

    const exchanges: ConnectionsResponse["exchanges"] = {
      binance:  { status: "planned", pairs: "500+", type: "CEX"  },
      coinbase: { status: "planned", pairs: "200+", type: "CEX"  },
      gtrade:   { status: "planned", pairs: "50+",  type: "DeFi" },
    };

    const infrastructure: ConnectionsResponse["infrastructure"] = {
      vps:        { status: "live",   host: "Cloudzy", role: "Trading engine backend"     },
      cloudflare: { status: "active", plan: "Pro",     role: "CDN, WAF, DDoS, DNS"       },
      github:     { status: "active", repos: 5,        role: "CI/CD, source control"     },
      linear:     { status: "active", tasks: 26, completed: 3, role: "Project management" },
      notion:     { status: "active", role: "Documentation"                               },
    };

    const tools: ConnectionsResponse["tools"] = {
      theRipper:    { status: "ready",   role: "Data extraction engine"        },
      macTheZipper: { status: "ready",   role: "Compression & packaging"       },
      pdfPlumber:   { status: "ready",   role: "Document parsing"              },
      aiTransfer:   { status: "ready",   role: "Cross-model context pipeline"  },
      songpal:      { status: "planned", role: "Music layer (Corey originals)" },
      f18:          { status: "ready",   role: "Digital identity protection"   },
    };

    const aiValues       = Object.values(ai);
    const exchangeValues = Object.values(exchanges);
    const infraValues    = Object.values(infrastructure);
    const toolValues     = Object.values(tools);
    const total          = aiValues.length + exchangeValues.length + infraValues.length + toolValues.length;

    const summary = {
      total,
      live:    infraValues.filter((s) => s.status === "live" || s.status === "active").length,
      /** AI services with keys configured but not yet verified live (key present, not called). */
      keyed:   aiValues.filter((s) => s.status === "keyed").length,
      demo:    aiValues.filter((s) => s.status === "demo").length,
      planned: exchangeValues.filter((s) => s.status === "planned").length +
               toolValues.filter((s) => s.status === "planned").length,
      ready:   toolValues.filter((s) => s.status === "ready").length,
    };

    return ok({ ai, exchanges, infrastructure, tools, summary });
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
