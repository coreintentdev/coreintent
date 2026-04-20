/**
 * /api/market — Live market data for tracked trading pairs.
 *
 * Returns DEMO data until exchange connections are live.
 * Planned live sources: Binance REST API, Coinbase Advanced API, gTrade oracle.
 * Prices are static and do NOT reflect real market conditions.
 *
 * Query params:
 *   ?symbol=BTC/USD  — filter to a specific symbol (case-insensitive, URL-encoded)
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, err, preflight, serverError } from "@/lib/api";

interface MarketPair {
  symbol:    string;
  price:     number;
  change24h: number;
  volume:    number;
  high:      number;
  low:       number;
}

type FearGreedSentiment = "extreme_fear" | "fear" | "neutral" | "greed" | "extreme_greed";

interface MarketResponse {
  pairs:          MarketPair[];
  fearGreedIndex: number;
  sentiment:      FearGreedSentiment;
  /** demo = no exchange connection; live = real exchange data */
  mode:           "demo" | "live";
  timestamp:      string;
}

const ALL_PAIRS: MarketPair[] = [
  { symbol: "BTC/USD",  price: 62900, change24h:  2.4, volume: 28_400_000_000, high: 63500, low: 61200 },
  { symbol: "ETH/USD",  price: 1882,  change24h:  1.8, volume: 12_100_000_000, high: 1910,  low: 1850  },
  { symbol: "SOL/USD",  price: 36.0,  change24h: -0.6, volume:  1_800_000_000, high: 37.2,  low: 35.5  },
  { symbol: "BNB/USD",  price: 305,   change24h:  0.3, volume:    850_000_000, high: 308,   low: 300   },
  { symbol: "AVAX/USD", price: 14.5,  change24h: -1.2, volume:    320_000_000, high: 15.1,  low: 14.2  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolFilter = searchParams.get("symbol")?.toUpperCase() ?? null;

    if (symbolFilter !== null) {
      const knownSymbols = ALL_PAIRS.map((p) => p.symbol.toUpperCase());
      if (!knownSymbols.includes(symbolFilter)) {
        return err(`Unknown symbol "${symbolFilter}". Available: ${ALL_PAIRS.map((p) => p.symbol).join(", ")}`, 400);
      }
    }

    const pairs = symbolFilter ? ALL_PAIRS.filter((p) => p.symbol.toUpperCase() === symbolFilter) : ALL_PAIRS;

    const data: MarketResponse = {
      pairs,
      fearGreedIndex: 58,
      sentiment:      "neutral",
      mode:           "demo",
      timestamp:      new Date().toISOString(),
    };
    return ok(data);
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
