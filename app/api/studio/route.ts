import { NextRequest, NextResponse } from "next/server";
import {
  callGrok, callClaude, callPerplexity, callGemini,
  callGroq, callDeepSeek, callMistral, callOpenRouter,
  compareAll, comparePrimary,
} from "@/lib/ai";

/**
 * /api/studio — 8-model AI Studio endpoint.
 *
 * POST { prompt, model, system?, compare? }
 *   model: "grok"|"claude"|"perplexity"|"gemini"|"groq"|"deepseek"|"mistral"|"openrouter"|"all"|"primary"
 *   compare: "all" → all 8 models, "primary" → top 4 only
 */

const MODEL_MAP: Record<string, (prompt: string, system?: string) => Promise<import("@/lib/ai").AIResponse>> = {
  grok: (p) => callGrok(p),
  claude: (p, s) => callClaude(p, s),
  perplexity: (p) => callPerplexity(p),
  gemini: (p, s) => callGemini(p, s),
  groq: (p) => callGroq(p),
  deepseek: (p) => callDeepSeek(p),
  mistral: (p) => callMistral(p),
  openrouter: (p) => callOpenRouter(p),
};

export async function POST(req: NextRequest) {
  const { prompt, model, system, compare } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const start = Date.now();

  // Compare modes
  if (compare === "all" || model === "all") {
    const results = await compareAll(prompt, system);
    return NextResponse.json({ mode: "compare-all", prompt, results, elapsed: Date.now() - start, timestamp: new Date().toISOString() });
  }

  if (compare === "primary" || model === "primary") {
    const results = await comparePrimary(prompt, system);
    return NextResponse.json({ mode: "compare-primary", prompt, results, elapsed: Date.now() - start, timestamp: new Date().toISOString() });
  }

  // Single model
  const caller = MODEL_MAP[model] || MODEL_MAP.grok;
  const result = await caller(prompt, system);

  return NextResponse.json({ mode: "single", prompt, result, elapsed: Date.now() - start, timestamp: new Date().toISOString() });
}
