import { NextRequest, NextResponse } from "next/server";

/**
 * Bulk content generation API
 * Handles: 6-second videos, social posts, marketing assets
 * Uses Grok (fast, cheap) for drafts, Claude for polish
 */

interface ContentRequest {
  type: "video_6s" | "tweet" | "linkedin" | "thread" | "announcement" | "blog";
  topic: string;
  count?: number;
  tone?: "technical" | "hype" | "educational" | "community";
}

// Demo bulk content templates
const TEMPLATES: Record<string, object> = {
  video_6s: {
    format: "6-second vertical video",
    specs: { duration: 6, ratio: "9:16", resolution: "1080x1920" },
    hooks: [
      "AI just detected a {signal} on {pair}...",
      "Your portfolio while you sleep: {pnl}",
      "CoreIntent caught this before anyone: {event}",
      "{pair} signal confidence: {confidence}%",
      "From signal to trade in {time}ms",
    ],
    workflow: "Grok drafts hook → Claude refines → auto-render",
  },
  tweet: {
    format: "X/Twitter post",
    specs: { maxChars: 280 },
    templates: [
      "Market update: {pair} {direction} — AI confidence {confidence}%. CoreIntent agents are tracking.",
      "Just deployed a new agent: {agent_name}. It's already scanning {count} pairs across {exchanges}.",
      "{pair} circuit breaker almost triggered at {threshold}%. Risk management isn't optional.",
    ],
  },
  thread: {
    format: "X/Twitter thread (5-10 tweets)",
    workflow: "Grok generates outline → Claude expands → schedule via X Premium+ API",
  },
  linkedin: {
    format: "LinkedIn post",
    specs: { maxChars: 3000 },
    workflow: "Claude drafts → review → post",
  },
};

export async function GET() {
  return NextResponse.json({
    availableTypes: Object.keys(TEMPLATES),
    templates: TEMPLATES,
    bulkLimits: {
      video_6s: 50,
      tweet: 100,
      linkedin: 20,
      thread: 10,
      announcement: 10,
      blog: 5,
    },
    aiPipeline: {
      draft: "Grok Pro (fast, cheap)",
      refine: "Claude (quality)",
      research: "Perplexity Max (facts)",
      schedule: "X Premium+ API",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ContentRequest;
  const { type, topic, count = 1, tone = "technical" } = body;

  // In production, this calls Grok → Claude pipeline
  return NextResponse.json({
    status: "queued",
    type,
    topic,
    count,
    tone,
    estimatedTime: `${count * 2}s`,
    pipeline: ["grok_draft", "claude_refine", "review_queue"],
    message: `${count}x ${type} content generation queued for topic: "${topic}"`,
  });
}
