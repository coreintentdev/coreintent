/**
 * /api/status — System health and AI key presence (8 models).
 *
 * "active" = real API key configured (not placeholder). "demo" = missing or demo key.
 * Exchange connections are planned only — no live CEX/DeFi in this build.
 */
import { NextResponse } from "next/server";
import { getAiKeyStatus } from "@/lib/ai";

export async function GET() {
  const keys = getAiKeyStatus();
  const aiActive = (k: boolean) => (k ? "active" : "demo");

  return NextResponse.json({
    engine: "online",
    version: "0.1.0-alpha",
    uptime: process.uptime(),
    mode: "paper_trading",
    exchanges: {
      binance: "planned",
      coinbase: "planned",
      gtrade: "planned",
    },
    ai: {
      grok: aiActive(keys.grok),
      claude: aiActive(keys.claude),
      perplexity: aiActive(keys.perplexity),
      gemini: aiActive(keys.gemini),
      groq: aiActive(keys.groq),
      deepseek: aiActive(keys.deepseek),
      mistral: aiActive(keys.mistral),
      openrouter: aiActive(keys.openrouter),
    },
    signals: { active: 12, pending: 3 },
    circuitBreaker: { threshold: 0.008, status: "armed" },
    timestamp: new Date().toISOString(),
  });
}
