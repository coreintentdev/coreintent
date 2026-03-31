import { NextRequest, NextResponse } from "next/server";
import { callPerplexity, callClaude, callGrok } from "@/lib/ai";

/**
 * /api/research — The stack researches YOU and FOR you.
 * This is the digital twin brain. It uses all 3 AIs:
 * - Perplexity: finds info, checks facts, monitors web presence
 * - Claude: analyzes, summarizes, makes decisions
 * - Grok: fast scans, sentiment, X/Twitter monitoring
 *
 * GET  = research Corey / CoreIntent / digital identity
 * POST = research any topic using the orchestra
 */

const IDENTITY = {
  name: "Corey McIvor",
  handle: "@coreintentdev",
  project: "CoreIntent / Zynthio.ai",
  twitter: "@coreintentai",
  github: "https://github.com/coreintentdev",
  domain: "coreintent.dev",
};

export async function GET() {
  // Run all 3 AIs in parallel — research the digital identity
  const [perplexityResult, grokResult, claudeResult] = await Promise.all([
    callPerplexity(
      `Search for "${IDENTITY.name}" OR "${IDENTITY.project}" OR "${IDENTITY.domain}" OR "${IDENTITY.twitter}". ` +
      `Find any mentions, profiles, articles, social media posts, or references. ` +
      `Report what you find about this person and project.`
    ),
    callGrok(
      `Search X/Twitter for @coreintentai and CoreIntent. ` +
      `What's the latest activity? Any mentions? Sentiment? ` +
      `Also check if anyone is impersonating this account.`
    ),
    callClaude(
      `You are the digital twin of Corey McIvor (@coreintentdev), creator of CoreIntent/Zynthio.ai. ` +
      `Based on what you know: summarize the current state of the project, identify risks to the digital identity, ` +
      `and suggest 3 immediate actions to strengthen online presence and protect the brand.`,
      "You are CoreIntent's self-awareness module. Think about the project holistically."
    ),
  ]);

  return NextResponse.json({
    identity: IDENTITY,
    research: {
      webPresence: { ...perplexityResult, purpose: "Web presence scan" },
      socialSentiment: { ...grokResult, purpose: "X/Twitter monitoring" },
      selfAnalysis: { ...claudeResult, purpose: "Threat & brand analysis" },
    },
    allLive: perplexityResult.live && grokResult.live && claudeResult.live,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const { topic, task = "research" } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  // Route to the right AI based on task type
  const taskMap: Record<string, () => Promise<unknown>> = {
    research: () => callPerplexity(topic),
    analysis: () => callClaude(topic),
    signal: () => callGrok(topic),
    sentiment: () => callGrok(`Analyze sentiment for: ${topic}`),
  };

  const fn = taskMap[task] || taskMap.research;
  const result = await fn();

  return NextResponse.json({ topic, task, result, timestamp: new Date().toISOString() });
}
