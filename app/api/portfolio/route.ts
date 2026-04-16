/**
 * /api/portfolio — Paper trading portfolio holdings.
 *
 * Returns DEMO holdings until exchange connections are live.
 * Prices are static demo values — not pulled from any exchange.
 * Mode is always "paper_trading" until live exchange keys are configured.
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { ok, preflight } from "@/lib/api";

interface Holding {
  asset: string;
  balance: number;
  price: number;
  change24h: number;
  /** Calculated: balance × price */
  value: number;
}

interface PortfolioResponse {
  holdings: Holding[];
  totalValue: number;
  currency: "USD";
  mode: "paper_trading";
  timestamp: string;
}

const RAW_HOLDINGS = [
  { asset: "BTC",  balance: 0.4521, price: 62900, change24h:  2.4 },
  { asset: "ETH",  balance: 5.23,   price: 1882,  change24h:  1.8 },
  { asset: "SOL",  balance: 120.0,  price: 36.0,  change24h: -0.6 },
  { asset: "USDC", balance: 7406.4, price: 1.0,   change24h:  0.0 },
];

export async function GET() {
  const holdings: Holding[] = RAW_HOLDINGS.map((h) => ({ ...h, value: h.balance * h.price }));
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  const data: PortfolioResponse = {
    holdings,
    totalValue,
    currency: "USD",
    mode: "paper_trading",
    timestamp: new Date().toISOString(),
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
