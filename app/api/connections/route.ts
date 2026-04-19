import { NextResponse } from "next/server";
import { getAiKeyStatus } from "@/lib/ai";

/**
 * /api/connections — Honest connection status for all services.
 * No green dots unless verified. Demo = demo. Planned = planned.
 */
export async function GET() {
  const keys = getAiKeyStatus();
  const keyed = (k: boolean) => (k ? "keyed" : "demo");

  const ai = {
    grok: {
      status: keyed(keys.grok),
      model: "grok-3",
      role: "Signal detection, fast, near-free via X Premium+",
    },
    claude: {
      status: keyed(keys.claude),
      model: "claude-sonnet-4-6",
      role: "Deep analysis, risk assessment, orchestration",
    },
    perplexity: {
      status: keyed(keys.perplexity),
      model: "sonar-pro",
      role: "Research, fact-checking, live web",
    },
    gemini: {
      status: keyed(keys.gemini),
      model: "gemini-2.0-flash",
      role: "Code gen, scanning, grounding (primary orchestra)",
    },
    groq: {
      status: keyed(keys.groq),
      model: "llama-3.3-70b-versatile",
      role: "Fast inference (extended fleet)",
    },
    deepseek: {
      status: keyed(keys.deepseek),
      model: "deepseek-chat",
      role: "Cost-efficient quality (extended fleet)",
    },
    mistral: {
      status: keyed(keys.mistral),
      model: "mistral-large-latest",
      role: "EU option, generous free tier (extended fleet)",
    },
    openrouter: {
      status: keyed(keys.openrouter),
      model: "meta-llama/llama-3.3-70b-instruct:free",
      role: "400+ models via one key (extended fleet)",
    },
  };

  const exchanges = {
    binance: { status: "planned" as const, pairs: "500+", type: "CEX" as const },
    coinbase: { status: "planned" as const, pairs: "200+", type: "CEX" as const },
    gtrade: { status: "planned" as const, pairs: "50+", type: "DeFi" as const },
  };

  const infrastructure = {
    vps: { status: "live", host: "Cloudzy", ip: "100.122.99.34", role: "Trading engine backend" },
    cloudflare: { status: "active", plan: "Pro", role: "CDN, WAF, DDoS, DNS" },
    github: { status: "active", repos: 5, role: "CI/CD, source control" },
    linear: { status: "active", tasks: 26, completed: 3, role: "Project management" },
    notion: { status: "active", role: "Documentation" },
  };

  const tools = {
    theRipper: { status: "ready" as const, role: "Data extraction engine" },
    macTheZipper: { status: "ready" as const, role: "Compression & packaging" },
    pdfPlumber: { status: "ready" as const, role: "Document parsing" },
    aiTransfer: { status: "ready" as const, role: "Cross-model context pipeline" },
    songpal: { status: "planned" as const, role: "Music layer (Corey originals)" },
    f18: { status: "ready" as const, role: "Digital identity protection" },
  };

  const aiValues = Object.values(ai);
  const exchangeValues = Object.values(exchanges);
  const infraValues = Object.values(infrastructure);
  const toolValues = Object.values(tools);

  const summary = {
    total: aiValues.length + exchangeValues.length + infraValues.length + toolValues.length,
    live: infraValues.filter((s) => s.status === "live" || s.status === "active").length,
    demo: aiValues.filter((s) => s.status === "demo").length,
    planned:
      exchangeValues.filter((s) => s.status === "planned").length +
      toolValues.filter((s) => s.status === "planned").length,
    ready: toolValues.filter((s) => s.status === "ready").length,
  };

  return NextResponse.json({
    ai,
    exchanges,
    infrastructure,
    tools,
    summary,
  });
}
