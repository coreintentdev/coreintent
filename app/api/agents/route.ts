import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mode: "demo",
    note: "Hardcoded agent list — agents are not running against live infrastructure in this build.",
    agents: [
      { name: "TrendFollower", model: "claude-opus-4-6", status: "active", task: "BTC/ETH momentum", uptime: 3600 },
      { name: "MeanRevert", model: "claude-sonnet-4-6", status: "active", task: "SOL mean reversion", uptime: 3500 },
      { name: "SentimentBot", model: "grok-2", status: "processing", task: "Social signals", uptime: 2400 },
      { name: "ArbitrageBot", model: "claude-haiku-4-5", status: "paused", task: "Cross-exchange spreads", uptime: 0 },
      { name: "RiskGuard", model: "claude-opus-4-6", status: "active", task: "Circuit breaker monitor", uptime: 3600 },
      { name: "ResearchAgent", model: "perplexity-sonar", status: "active", task: "Market research", uptime: 1800 },
    ],
    totalActive: 4,
    totalPaused: 1,
    totalProcessing: 1,
  });
}
