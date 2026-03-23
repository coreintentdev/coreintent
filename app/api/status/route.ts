import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    engine: "online",
    version: "0.1.0-alpha",
    uptime: process.uptime(),
    mode: "paper_trading",
    exchanges: {
      binance: "connected",
      coinbase: "connected",
      gtrade: "pending",
    },
    ai: {
      claude: "active",
      grok: "active",
      perplexity: "active",
    },
    signals: { active: 12, pending: 3 },
    circuitBreaker: { threshold: 0.008, status: "armed" },
    timestamp: new Date().toISOString(),
  });
}
