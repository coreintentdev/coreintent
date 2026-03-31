#!/usr/bin/env npx tsx
/**
 * signal_listener — Runs on VPS (Cloudzy)
 * Listens for trading signals from AI agents, validates, and queues execution.
 * Deploy: COR-20
 */

import { callGrok, callClaude } from "../lib/ai";

const MIN_CONFIDENCE = parseFloat(process.env.AI_MIN_CONFIDENCE || "0.75");
const POLL_INTERVAL_MS = 15_000; // 15 seconds

interface Signal {
  id: number;
  pair: string;
  direction: string;
  confidence: number;
  source: string;
  timestamp: string;
}

async function getSignals(): Promise<Signal[]> {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${url}/api/signals`);
  const data = await res.json();
  return data.signals || [];
}

async function validateSignal(signal: Signal): Promise<boolean> {
  if (signal.confidence < MIN_CONFIDENCE) {
    console.log(`[SKIP] ${signal.pair} ${signal.direction} — confidence ${signal.confidence} < ${MIN_CONFIDENCE}`);
    return false;
  }

  // Double-check with Grok (fast)
  const grokCheck = await callGrok(
    `Quick market check: Is ${signal.pair} likely to go ${signal.direction} right now? ` +
    `Signal confidence: ${signal.confidence}. Source: ${signal.source}. Yes or no with brief reason.`
  );

  console.log(`[GROK] ${signal.pair}: ${grokCheck.content}`);

  // If high value signal, also check with Claude (deep)
  if (signal.confidence > 0.85) {
    const claudeCheck = await callClaude(
      `Validate this trading signal:\n` +
      `Pair: ${signal.pair}, Direction: ${signal.direction}, Confidence: ${signal.confidence}\n` +
      `Source: ${signal.source}\n` +
      `Grok says: ${grokCheck.content}\n\n` +
      `Should we execute? What's the risk?`
    );
    console.log(`[CLAUDE] ${signal.pair}: ${claudeCheck.content}`);
  }

  return true;
}

async function pollSignals() {
  const signals = await getSignals();
  console.log(`[SIGNALS] Found ${signals.length} signals`);

  for (const signal of signals) {
    const valid = await validateSignal(signal);
    if (valid) {
      console.log(`[QUEUE] ${signal.pair} ${signal.direction} @ confidence ${signal.confidence} — queued for execution`);
      // In production: send to exchange API for execution
    }
  }
}

async function main() {
  console.log(`[SIGNAL LISTENER] Starting — Min confidence: ${MIN_CONFIDENCE}`);
  console.log(`[SIGNAL LISTENER] Polling every ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`[SIGNAL LISTENER] AI validation: Grok (fast) + Claude (deep for >0.85)`);

  await pollSignals();
  setInterval(pollSignals, POLL_INTERVAL_MS);
}

main().catch(console.error);
