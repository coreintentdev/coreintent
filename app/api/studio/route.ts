import { NextRequest, NextResponse } from "next/server";
import { callGrok, callClaude, callPerplexity } from "@/lib/ai";

/**
 * /api/studio — Multi-model AI Studio endpoint.
 *
 * POST { prompt, model, system?, compare? }
 *   model: "grok" | "claude" | "perplexity" | "all"
 *   compare: true → sends to all 3 models in parallel
 */

interface StudioRequest {
  prompt: string;
  model: "grok" | "claude" | "perplexity" | "all";
  system?: string;
  compare?: boolean;
}

export async function POST(req: NextRequest) {
  const body: StudioRequest = await req.json();
  const { prompt, model, system, compare } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const start = Date.now();

  // Compare mode: fire all 3 in parallel
  if (compare || model === "all") {
    const [grok, claude, perplexity] = await Promise.allSettled([
      callGrok(prompt),
      callClaude(prompt, system),
      callPerplexity(prompt),
    ]);

    return NextResponse.json({
      mode: "compare",
      prompt,
      results: {
        grok: grok.status === "fulfilled" ? grok.value : { source: "grok", model: "grok-3", content: `[ERROR] ${(grok as PromiseRejectedResult).reason}`, live: false },
        claude: claude.status === "fulfilled" ? claude.value : { source: "claude", model: "claude-sonnet-4-6", content: `[ERROR] ${(claude as PromiseRejectedResult).reason}`, live: false },
        perplexity: perplexity.status === "fulfilled" ? perplexity.value : { source: "perplexity", model: "sonar-pro", content: `[ERROR] ${(perplexity as PromiseRejectedResult).reason}`, live: false },
      },
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
