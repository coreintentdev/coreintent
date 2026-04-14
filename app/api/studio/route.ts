import { NextRequest, NextResponse } from "next/server";
import { callGrok, callClaude, callPerplexity, callGemini, compareAll } from "@/lib/ai";

/**
 * /api/studio — Multi-model AI Studio endpoint.
 *
 * POST { prompt, model, system?, compare? }
 *   model: "grok" | "claude" | "perplexity" | "gemini" | "all"
 *   compare: true → sends to all 4 models in parallel
 */

export async function POST(req: NextRequest) {
  const { prompt, model, system, compare } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const start = Date.now();

  // Compare mode: fire all 4 in parallel
  if (compare || model === "all") {
    const results = await compareAll(prompt, system);
    return NextResponse.json({
      mode: "compare",
      prompt,
      results,
      elapsed: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  }

  // Single model mode
  let result;
  switch (model) {
    case "grok":
      result = await callGrok(prompt);
      break;
    case "claude":
      result = await callClaude(prompt, system);
      break;
    case "perplexity":
      result = await callPerplexity(prompt);
      break;
    case "gemini":
      result = await callGemini(prompt, system);
      break;
    default:
      result = await callGrok(prompt);
  }

  return NextResponse.json({
    mode: "single",
    prompt,
    result,
    elapsed: Date.now() - start,
    timestamp: new Date().toISOString(),
  });
}
