/**
 * /api/content — Bulk content generation API.
 *
 * GET  — list available content types, templates, and pipeline details
 * POST — queue a content generation job (Grok draft → Claude refine)
 *
 * In production, POST triggers the real Grok → Claude pipeline.
 * All generation is currently queued/demo only — no content is rendered yet.
 *
 * Rate limit: 20 req/min (see RATE_LIMITS.content in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, err, preflight } from "@/lib/api";

type ContentType = "video_6s" | "tweet" | "linkedin" | "thread" | "announcement" | "blog";
type ContentTone = "technical" | "hype" | "educational" | "community";

interface ContentRequest {
  type: ContentType;
  topic: string;
  count?: number;
  tone?: ContentTone;
}

interface ContentJobResponse {
  status: "queued";
  type: ContentType;
  topic: string;
  count: number;
  tone: ContentTone;
  estimatedTime: string;
  pipeline: string[];
  message: string;
}

const VALID_TYPES: ContentType[] = ["video_6s", "tweet", "linkedin", "thread", "announcement", "blog"];
const VALID_TONES: ContentTone[] = ["technical", "hype", "educational", "community"];

const BULK_LIMITS: Record<ContentType, number> = {
  video_6s:     50,
  tweet:        100,
  linkedin:     20,
  thread:       10,
  announcement: 10,
  blog:         5,
};

const TEMPLATES: Record<ContentType, object> = {
  video_6s: {
    format: "6-second vertical video",
    specs: { duration: 6, ratio: "9:16", resolution: "1080x1920" },
    hooks: [
      "AI just detected a {signal} on {pair}...",
      "Your portfolio while you sleep: {pnl}",
      "CoreIntent caught this before anyone: {event}",
      "{pair} signal confidence: {confidence}%",
    ],
    workflow: "Grok drafts hook → Claude refines → auto-render",
  },
  tweet: {
    format: "X/Twitter post",
    specs: { maxChars: 280 },
    workflow: "Grok drafts → Claude refines → X Premium+ schedules",
  },
  linkedin: {
    format: "LinkedIn post",
    specs: { maxChars: 3000 },
    workflow: "Claude drafts → review → post",
  },
  thread: {
    format: "X/Twitter thread (5–10 tweets)",
    workflow: "Grok generates outline → Claude expands → X Premium+ API schedules",
  },
  announcement: {
    format: "Product announcement",
    workflow: "Claude drafts → Corey approves → publish",
  },
  blog: {
    format: "Long-form blog post",
    workflow: "Perplexity researches → Claude writes → review",
  },
};

export async function GET() {
  return ok({
    availableTypes: VALID_TYPES,
    templates: TEMPLATES,
    bulkLimits: BULK_LIMITS,
    aiPipeline: {
      draft:    "Grok Pro (fast, cheap)",
      refine:   "Claude (quality polish)",
      research: "Perplexity Max (live facts)",
      schedule: "X Premium+ API",
    },
  });
}

export async function POST(req: NextRequest) {
  let body: Partial<ContentRequest>;
  try {
    body = (await req.json()) as Partial<ContentRequest>;
  } catch {
    return err("Invalid JSON body", 400);
  }

  const { type, topic, count = 1, tone = "technical" } = body;

  if (!type || !VALID_TYPES.includes(type)) {
    return err(`type must be one of: ${VALID_TYPES.join(", ")}`, 400);
  }
  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return err("topic is required", 400);
  }
  if (typeof count !== "number" || count < 1 || count > BULK_LIMITS[type]) {
    return err(`count must be between 1 and ${BULK_LIMITS[type]} for type "${type}"`, 400);
  }
  if (!VALID_TONES.includes(tone as ContentTone)) {
    return err(`tone must be one of: ${VALID_TONES.join(", ")}`, 400);
  }

  const data: ContentJobResponse = {
    status: "queued",
    type,
    topic: topic.trim(),
    count,
    tone: tone as ContentTone,
    estimatedTime: `${count * 2}s`,
    pipeline: ["grok_draft", "claude_refine", "review_queue"],
    message: `${count}x ${type} queued for: "${topic.trim()}"`,
  };
  return ok(data, 202);
}

export async function OPTIONS() {
  return preflight();
}
