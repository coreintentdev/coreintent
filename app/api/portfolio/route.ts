import { NextResponse } from "next/server";

export async function GET() {
  // Demo portfolio data — replace with live exchange queries
  const holdings = [
    { asset: "BTC", balance: 0.4521, price: 62900, change24h: 2.4 },
    { asset: "ETH", balance: 5.23, price: 1882, change24h: 1.8 },
    { asset: "SOL", balance: 120.0, price: 36.0, change24h: -0.6 },
    { asset: "USDC", balance: 7406.4, price: 1.0, change24h: 0.0 },
  ];

  const enriched = holdings.map((h) => ({
    ...h,
    value: h.balance * h.price,
  }));

  const totalValue = enriched.reduce((s, h) => s + h.value, 0);

  return NextResponse.json({
    holdings: enriched,
    totalValue,
    currency: "USD",
    mode: "paper_trading",
    timestamp: new Date().toISOString(),
  });
}
