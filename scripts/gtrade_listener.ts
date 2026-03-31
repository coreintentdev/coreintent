#!/usr/bin/env npx tsx
/**
 * gtrade_listener — Runs on VPS (Cloudzy)
 * Monitors gTrade DeFi protocol on Polygon/Arbitrum for opportunities.
 * Deploy: COR-20
 */

import { callGrok, callPerplexity } from "../lib/ai";

const CHAIN = process.env.GTRADE_CHAIN || "polygon";
const POLL_INTERVAL_MS = 60_000; // 1 minute

// gTrade supported pairs (subset)
const WATCHED_PAIRS = [
  "BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD",
  "AVAX/USD", "MATIC/USD", "LINK/USD", "ARB/USD",
];

async function checkGTradeOpportunities() {
  console.log(`[GTRADE] Scanning ${WATCHED_PAIRS.length} pairs on ${CHAIN}...`);

  // Use Grok for fast market sentiment per pair
  for (const pair of WATCHED_PAIRS) {
    const sentiment = await callGrok(
      `Quick: What's the current momentum for ${pair}? ` +
      `Is there a clear direction in the last hour? ` +
      `Rate opportunity 1-10. One sentence.`
    );

    console.log(`[GTRADE] ${pair}: ${sentiment.content}`);
  }

  // Use Perplexity for DeFi-specific news
  const defiNews = await callPerplexity(
    `Latest news about gTrade (Gains Network) on ${CHAIN}. ` +
    `Any liquidity changes, new pairs, protocol updates, or relevant DeFi events?`
  );

  console.log(`[GTRADE NEWS] ${defiNews.content}`);
}

async function main() {
  console.log(`[GTRADE LISTENER] Starting — Chain: ${CHAIN}`);
  console.log(`[GTRADE LISTENER] Watching ${WATCHED_PAIRS.length} pairs`);
  console.log(`[GTRADE LISTENER] Polling every ${POLL_INTERVAL_MS / 1000}s`);

  await checkGTradeOpportunities();
  setInterval(checkGTradeOpportunities, POLL_INTERVAL_MS);
}

main().catch(console.error);
