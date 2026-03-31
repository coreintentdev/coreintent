import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    engine: "online",
    version: "0.1.0-alpha",
    uptime: process.uptime(),
    mode: "paper_trading",
    exchanges: {
      binance: "planned",
      coinbase: "planned",
      gtrade: "planned",
    },
    ai: {
      claude: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "sk-ant-xxx" ? "active" : "demo",
      grok: process.env.GROK_API_KEY && process.env.GROK_API_KEY !== "xai-xxx" ? "active" : "demo",
      perplexity: process.env.PERPLEXITY_API_KEY && process.env.PERPLEXITY_API_KEY !== "pplx-xxx" ? "active" : "demo",
    },
    signals: { active: 12, pending: 3 },
    circuitBreaker: { threshold: 0.008, status: "armed" },
    timestamp: new Date().toISOString(),
  });
}
