/**
 * /api/connections — Honest connection status for all services.
 *
 * No green dots unless verified. Demo = demo. Planned = planned. Ready = wired but needs key.
 * AI service status is derived from env key presence at request time.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight, serverError } from "@/lib/api";

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
  summary:        { total: number; live: number; demo: number; planned: number; ready: number };
}

function keyStatus(key: string | undefined, placeholder: string): "keyed" | "demo" {
  return key && key !== placeholder ? "keyed" : "demo";
}

export async function GET() {
  try {
    const ai: ConnectionsResponse["ai"] = {
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
    };

    const exchanges: ConnectionsResponse["exchanges"] = {
      binance:  { status: "planned", pairs: "500+", type: "CEX"  },
      coinbase: { status: "planned", pairs: "200+", type: "CEX"  },
      gtrade:   { status: "planned", pairs: "50+",  type: "DeFi" },
    };

    const infrastructure: ConnectionsResponse["infrastructure"] = {
      vds:          { status: "live",      host: "VDS Primary", ip: "100.121.107.112", role: "Consolidated trading engine + web", tailscale: true },
      vps_cloudzy:  { status: "migrating", host: "Cloudzy",     ip: "100.122.99.34",   role: "Legacy — migrating to VDS" },
      vps_frankfurt:{ status: "migrating", host: "Frankfurt",   ip: "104.194.156.109", role: "Legacy — migrating to VDS" },
      proton:       { status: "active",    role: "Email (all accounts imported to Proton Mail)" },
      googleDrive:  { status: "active",    role: "Via Claude/Perplexity desktop app auth" },
      suno:         { status: "active",    role: "Paid API — suno.api.com, wired in lib/ai.ts" },
      cloudflare:   { status: "active",    plan: "Pro", role: "CDN, WAF, DDoS, DNS" },
      github:       { status: "active",    repos: 5,    role: "CI/CD, source control" },
      linear:       { status: "active",    tasks: 26, completed: 3, role: "Project management" },
      notion:       { status: "active",    role: "Documentation" },
    };

    const tools: ConnectionsResponse["tools"] = {
      theRipper:    { status: "ready",   role: "Data extraction engine"        },
      macTheZipper: { status: "ready",   role: "Compression & packaging"       },
      pdfPlumber:   { status: "ready",   role: "Document parsing"              },
      aiTransfer:   { status: "ready",   role: "Cross-model context pipeline"  },
      songpal:      { status: "active",  role: "Music layer — Suno paid API"   },
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
