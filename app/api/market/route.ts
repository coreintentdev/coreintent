/**
 * /api/market — Live market data for tracked trading pairs.
 *
 * Returns DEMO data until exchange connections are live.
 * Planned live sources: Binance REST API, Coinbase Advanced API, gTrade oracle.
 * Prices are static and do NOT reflect real market conditions.
 *
 * Query params:
 *   ?symbol=BTC           — filter to a single pair (e.g. BTC/USD). Case-insensitive.
 *   ?symbol=BTC%2FUSD     — full pair match also accepted.
 *   ?symbols=BTC,ETH,SOL  — comma-separated multi-pair filter.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { demoOk, badRequest, notFound, preflight, serverError, checkRateLimit, tooManyRequests } from "@/lib/api";

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

/** Derive the Fear & Greed sentiment label from the 0–100 index value. */
function fearGreedSentiment(index: number): FearGreedSentiment {
  if (index <= 20) return "extreme_fear";
  if (index <= 40) return "fear";
  if (index <= 60) return "neutral";
  if (index <= 80) return "greed";
  return "extreme_greed";
}

const FEAR_GREED_INDEX = 58;

const ALL_PAIRS: readonly MarketPair[] = [
  { symbol: "BTC/USD",  price: 62900, change24h:  2.4, volume: 28_400_000_000, high: 63500, low: 61200 },
  { symbol: "ETH/USD",  price: 1882,  change24h:  1.8, volume: 12_100_000_000, high: 1910,  low: 1850  },
  { symbol: "SOL/USD",  price: 36.0,  change24h: -0.6, volume:  1_800_000_000, high: 37.2,  low: 35.5  },
  { symbol: "BNB/USD",  price: 305,   change24h:  0.3, volume:    850_000_000, high: 308,   low: 300   },
  { symbol: "AVAX/USD", price: 14.5,  change24h: -1.2, volume:    320_000_000, high: 15.1,  low: 14.2  },
];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = await checkRateLimit(ip);
  if (rl.limited) return tooManyRequests(rl.retryAfter ?? 60);
  try {
    const symbolParam  = req.nextUrl.searchParams.get("symbol")?.toUpperCase().trim();
    const symbolsParam = req.nextUrl.searchParams.get("symbols");

    let pairs: readonly MarketPair[];

    if (symbolsParam) {
      // ?symbols=BTC,ETH,SOL — comma-separated multi-pair filter (max 10).
      const requested = symbolsParam.split(",")
        .map((s) => s.toUpperCase().trim())
        .filter(Boolean)
        .slice(0, 10);
      if (requested.length === 0) return badRequest("symbols must be a comma-separated list of pair symbols");
      pairs = ALL_PAIRS.filter((p) =>
        requested.some((r) => p.symbol === r || p.symbol.startsWith(r + "/"))
      );
      if (pairs.length === 0) {
        const validSymbols = ALL_PAIRS.map((p) => p.symbol);
        return notFound(`No market data for symbols: ${requested.join(", ")}. Available: ${validSymbols.join(", ")}`);
      }
    } else if (symbolParam) {
      // ?symbol=BTC — single-pair filter. Accept both "BTC" and "BTC/USD" formats.
      pairs = ALL_PAIRS.filter(
        (p) => p.symbol === symbolParam || p.symbol.startsWith(symbolParam + "/")
      );
      if (pairs.length === 0) {
        const validSymbols = ALL_PAIRS.map((p) => p.symbol);
        return notFound(`No market data for symbol: ${symbolParam}. Available: ${validSymbols.join(", ")}`);
      }
    } else {
      pairs = ALL_PAIRS;
    }

    const data: MarketResponse = {
      pairs:          [...pairs],
      fearGreedIndex: FEAR_GREED_INDEX,
      sentiment:      fearGreedSentiment(FEAR_GREED_INDEX),
      mode:           "demo",
      timestamp:      new Date().toISOString(),
    };
    return demoOk(data);
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
