import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    signals: [
      { id: 1, pair: "BTC/USD", direction: "long", confidence: 0.87, source: "TrendFollower", timestamp: new Date().toISOString() },
      { id: 2, pair: "ETH/USD", direction: "long", confidence: 0.79, source: "MeanRevert", timestamp: new Date().toISOString() },
      { id: 3, pair: "SOL/USD", direction: "short", confidence: 0.62, source: "SentimentBot", timestamp: new Date().toISOString() },
    ],
    minConfidence: 0.75,
    totalActive: 12,
    totalPending: 3,
  });
}
