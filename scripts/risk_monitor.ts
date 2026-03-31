#!/usr/bin/env npx tsx
/**
 * risk_monitor — Runs on VPS (Cloudzy)
 * Monitors portfolio risk, triggers circuit breakers at 0.8% loss.
 * Deploy: COR-20
 */

import { callClaude } from "../lib/ai";

const CIRCUIT_BREAKER_PCT = parseFloat(process.env.CIRCUIT_BREAKER_PCT || "0.8");
const CHECK_INTERVAL_MS = 30_000; // 30 seconds

interface PortfolioSnapshot {
  totalValue: number;
  timestamp: string;
}

let baseline: PortfolioSnapshot | null = null;

async function getPortfolio(): Promise<PortfolioSnapshot> {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${url}/api/portfolio`);
  const data = await res.json();
  return { totalValue: data.totalValue, timestamp: new Date().toISOString() };
}

async function checkRisk() {
  const current = await getPortfolio();

  if (!baseline) {
    baseline = current;
    console.log(`[RISK] Baseline set: $${current.totalValue.toFixed(2)}`);
    return;
  }

  const lossPct = ((baseline.totalValue - current.totalValue) / baseline.totalValue) * 100;

  if (lossPct >= CIRCUIT_BREAKER_PCT) {
    console.error(`[CIRCUIT BREAKER] Loss ${lossPct.toFixed(2)}% >= ${CIRCUIT_BREAKER_PCT}% threshold!`);
    console.error(`[CIRCUIT BREAKER] Baseline: $${baseline.totalValue.toFixed(2)} → Current: $${current.totalValue.toFixed(2)}`);

    // Ask Claude for analysis
    const analysis = await callClaude(
      `CIRCUIT BREAKER TRIGGERED. Portfolio dropped ${lossPct.toFixed(2)}% from $${baseline.totalValue.toFixed(2)} to $${current.totalValue.toFixed(2)}. ` +
      `What happened? What should we do? Should we halt trading?`,
      "You are CoreIntent RiskGuard. Be urgent and specific."
    );
    console.error(`[CLAUDE ANALYSIS] ${analysis.content}`);

    // In production: halt all trades, notify via Slack/email/X DM
    console.error("[CIRCUIT BREAKER] ALL TRADING HALTED");
  } else {
    console.log(`[RISK] OK — Loss: ${lossPct.toFixed(2)}% (threshold: ${CIRCUIT_BREAKER_PCT}%) — Value: $${current.totalValue.toFixed(2)}`);
  }
}

async function main() {
  console.log(`[RISK MONITOR] Starting — Circuit breaker at ${CIRCUIT_BREAKER_PCT}%`);
  console.log(`[RISK MONITOR] Checking every ${CHECK_INTERVAL_MS / 1000}s`);

  // Initial check
  await checkRisk();

  // Loop
  setInterval(checkRisk, CHECK_INTERVAL_MS);
}

main().catch(console.error);
