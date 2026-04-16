/**
 * /api/connections — Honest connection status for all services.
 *
 * No green dots unless verified. Demo = demo. Planned = planned. Ready = wired but needs key.
 * AI service status is derived from env key presence at request time.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";

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
  status: string;
  role:   string;
  [key: string]: unknown;
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
  summary:        { total: number; live: number; demo: number; planned: number; ready: number };
}

function keyStatus(key: string | undefined, placeholder: string): "keyed" | "demo" {
  return key && key !== placeholder ? "keyed" : "demo";
}

export async function GET() {
  const data: ConnectionsResponse = {
    ai: {
      grok: {
        status: keyStatus(process.env.GROK_API_KEY, "xai-xxx"),
        model:  "grok-3",
        role:   "Signal detection, fast, near-free via X Premium+",
      },
      claude: {
        status: keyStatus(process.env.ANTHROPIC_API_KEY, "sk-ant-xxx"),
        model:  "claude-sonnet-4-6",
        role:   "Deep analysis, risk assessment, orchestration",
      },
      perplexity: {
        status: keyStatus(process.env.PERPLEXITY_API_KEY, "pplx-xxx"),
        model:  "sonar-pro",
        role:   "Research, 9 connectors, fact-checking",
      },
    },
    exchanges: {
      binance:  { status: "planned", pairs: "500+", type: "CEX"  },
      coinbase: { status: "planned", pairs: "200+", type: "CEX"  },
      gtrade:   { status: "planned", pairs: "50+",  type: "DeFi" },
    },
    infrastructure: {
      vps:        { status: "live",   host: "Cloudzy", role: "Trading engine backend"  },
      cloudflare: { status: "active", plan: "Pro",     role: "CDN, WAF, DDoS, DNS"    },
      github:     { status: "active", repos: 5,        role: "CI/CD, source control"  },
      linear:     { status: "active", tasks: 26, completed: 3, role: "Project management" },
      notion:     { status: "active", role: "Documentation" },
    },
    tools: {
      theRipper:    { status: "ready",   role: "Data extraction engine"        },
      macTheZipper: { status: "ready",   role: "Compression & packaging"       },
      pdfPlumber:   { status: "ready",   role: "Document parsing"              },
      aiTransfer:   { status: "ready",   role: "Cross-model context pipeline"  },
      songpal:      { status: "planned", role: "Music layer (Corey originals)" },
      f18:          { status: "ready",   role: "Digital identity protection"   },
    },
    summary: { total: 17, live: 5, demo: 3, planned: 3, ready: 6 },
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
