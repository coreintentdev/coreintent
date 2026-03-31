import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    pairs: [
      { symbol: "BTC/USD", price: 62900, change24h: 2.4, volume: 28_400_000_000, high: 63500, low: 61200 },
      { symbol: "ETH/USD", price: 1882, change24h: 1.8, volume: 12_100_000_000, high: 1910, low: 1850 },
      { symbol: "SOL/USD", price: 36.0, change24h: -0.6, volume: 1_800_000_000, high: 37.2, low: 35.5 },
      { symbol: "BNB/USD", price: 305, change24h: 0.3, volume: 850_000_000, high: 308, low: 300 },
      { symbol: "AVAX/USD", price: 14.5, change24h: -1.2, volume: 320_000_000, high: 15.1, low: 14.2 },
    ],
    fearGreedIndex: 58,
    sentiment: "neutral",
    timestamp: new Date().toISOString(),
  });
}
