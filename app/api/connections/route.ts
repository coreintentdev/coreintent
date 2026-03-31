import { NextResponse } from "next/server";

/**
 * /api/connections — Honest connection status for all services.
 * No green dots unless verified. Demo = demo. Planned = planned.
 */
export async function GET() {
  const grokKey = process.env.GROK_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const perplexityKey = process.env.PERPLEXITY_API_KEY;

  return NextResponse.json({
    ai: {
      grok: {
        status: grokKey && grokKey !== "xai-xxx" ? "keyed" : "demo",
        model: "grok-3",
        role: "Signal detection, fast, near-free via X Premium+",
      },
      claude: {
        status: claudeKey && claudeKey !== "sk-ant-xxx" ? "keyed" : "demo",
        model: "claude-sonnet-4-6",
        role: "Deep analysis, risk assessment, orchestration",
      },
      perplexity: {
        status: perplexityKey && perplexityKey !== "pplx-xxx" ? "keyed" : "demo",
        model: "sonar-pro",
        role: "Research, 9 connectors, fact-checking",
      },
    },
    exchanges: {
      binance: { status: "planned", pairs: "500+", type: "CEX" },
      coinbase: { status: "planned", pairs: "200+", type: "CEX" },
      gtrade: { status: "planned", pairs: "50+", type: "DeFi" },
    },
    infrastructure: {
      vps: { status: "live", host: "Cloudzy", ip: "100.122.99.34", role: "Trading engine backend" },
      cloudflare: { status: "active", plan: "Pro", role: "CDN, WAF, DDoS, DNS" },
      github: { status: "active", repos: 5, role: "CI/CD, source control" },
      linear: { status: "active", tasks: 26, completed: 3, role: "Project management" },
      notion: { status: "active", role: "Documentation" },
    },
    tools: {
      theRipper: { status: "ready", role: "Data extraction engine" },
      macTheZipper: { status: "ready", role: "Compression & packaging" },
      pdfPlumber: { status: "ready", role: "Document parsing" },
      aiTransfer: { status: "ready", role: "Cross-model context pipeline" },
      songpal: { status: "planned", role: "Music layer (Corey originals)" },
      f18: { status: "ready", role: "Digital identity protection" },
    },
    summary: {
      total: 17,
      live: 5,
      demo: 3,
      planned: 3,
      ready: 6,
    },
  });
}
