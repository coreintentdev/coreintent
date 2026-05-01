/**
 * /api/content — Bulk content generation API.
 *
 * GET  — list available content types, templates, and pipeline details
 * POST — generate content via Grok draft → Claude refine pipeline when AI keys are
 *        configured; falls back to a "queued" demo response when keys are absent.
 *
 * Rate limit: 20 req/min (see RATE_LIMITS.content in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, badRequest, preflight, serverError, validateString, validateEnum, validatePositiveInt, checkRateLimit, tooManyRequests } from "@/lib/api";
import { callGrokContent, callClaude, validateAiContent, getAiKeyStatus, sanitizeForPrompt } from "@/lib/ai";

type ContentType = "video_6s" | "tweet" | "linkedin" | "thread" | "announcement" | "blog";
type ContentTone = "technical" | "hype" | "educational" | "community";

interface ContentRequest {
  type:   ContentType;
  topic:  string;
  count?: number;
  tone?:  ContentTone;
}

interface ContentJobResponse {
  /** "generated" when AI pipeline ran; "queued" in demo mode (no keys). */
  status:        "generated" | "queued";
  type:          ContentType;
  topic:         string;
  count:         number;
  tone:          ContentTone;
  estimatedTime: string;
  pipeline:      string[];
  message:       string;
  /** Grok raw draft — present when live AI is configured. */
  draft?:        string;
  /** Claude-refined output — present when both keys are configured. */
  content?:      string;
  /** true = live AI pipeline ran; false = demo fallback. */
  live:          boolean;
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
    specs:  { duration: 6, ratio: "9:16", resolution: "1080x1920" },
    hooks: [
      "AI just detected a {signal} on {pair}...",
      "Your portfolio while you sleep: {pnl}",
      "CoreIntent caught this before anyone: {event}",
      "{pair} signal confidence: {confidence}%",
    ],
    workflow: "Grok drafts hook → Claude refines → auto-render",
  },
  tweet: {
    format:   "X/Twitter post",
    specs:    { maxChars: 280 },
    workflow: "Grok drafts → Claude refines → X Premium+ schedules",
  },
  linkedin: {
    format:   "LinkedIn post",
    specs:    { maxChars: 3000 },
    workflow: "Claude drafts → review → post",
  },
  thread: {
    format:   "X/Twitter thread (5–10 tweets)",
    workflow: "Grok generates outline → Claude expands → X Premium+ API schedules",
  },
  announcement: {
    format:   "Product announcement",
    workflow: "Claude drafts → Corey approves → publish",
  },
  blog: {
    format:   "Long-form blog post",
    workflow: "Perplexity researches → Claude writes → review",
  },
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "content");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    return ok({
      availableTypes: VALID_TYPES,
      templates:      TEMPLATES,
      bulkLimits:     BULK_LIMITS,
      aiPipeline: {
        draft:    "Grok Pro (fast, cheap)",
        refine:   "Claude (quality polish)",
        research: "Perplexity Max (live facts)",
        schedule: "X Premium+ API",
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "content");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  let body: Partial<ContentRequest>;
  try {
    body = (await req.json()) as Partial<ContentRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const type = validateEnum(body.type, VALID_TYPES);
  if (!type) return badRequest(`type must be one of: ${VALID_TYPES.join(", ")}`);

  const topic = validateString(body.topic, 500);
  if (!topic) return badRequest("topic is required and must be 500 characters or fewer");

  const count = validatePositiveInt(body.count ?? 1, BULK_LIMITS[type]);
  if (count === null) {
    return badRequest(`count must be an integer between 1 and ${BULK_LIMITS[type]} for type "${type}"`);
  }

  const tone = validateEnum(body.tone, VALID_TONES) ?? "technical";

  try {
    const keys = getAiKeyStatus();

    if (keys.grok || keys.claude) {
      const safeTopic = sanitizeForPrompt(topic, 300);
      const typeSpec  = TEMPLATES[type];
      const specNote  = "specs" in typeSpec
        ? ` Specs: ${JSON.stringify((typeSpec as { specs: unknown }).specs)}.`
        : "";

      const grokPrompt =
        `Draft a ${type} about: "${safeTopic}". Tone: ${tone}.${specNote} ` +
        `Stay on-brand for CoreIntent (AI trading, paper mode, competition leagues). ` +
        `Output the content only — no preamble, no labels.`;

      const grokResult = await callGrokContent(grokPrompt, { maxTokens: 600 });

      let content = grokResult.content;
      let usedClaude = false;

      if (keys.claude && validateAiContent(grokResult)) {
        const claudePrompt =
          `Refine this ${type} for CoreIntent's audience. ` +
          `Tone: ${tone}. Fix any awkward phrasing, keep it punchy, stay within platform specs.` +
          `\n\nDraft:\n${grokResult.content}\n\nReturn the refined version only.`;
        const claudeResult = await callClaude(claudePrompt, undefined, { maxTokens: 700 });
        if (validateAiContent(claudeResult)) {
          content    = claudeResult.content;
          usedClaude = true;
        }
      }

      const data: ContentJobResponse = {
        status:        "generated",
        type,
        topic,
        count,
        tone,
        estimatedTime: "0s",
        pipeline:      usedClaude ? ["grok_draft", "claude_refine"] : ["grok_draft"],
        message:       count > 1
          ? `Generated 1 template for ${count}× ${type}. Use this as a base.`
          : `Generated ${type} for: "${topic}"`,
        draft:   grokResult.content,
        content,
        live:    grokResult.live,
      };
      return ok(data, 200);
    }

    // Demo fallback — no AI keys configured.
    const data: ContentJobResponse = {
      status:        "queued",
      type,
      topic,
      count,
      tone,
      estimatedTime: `${count * 2}s`,
      pipeline:      ["grok_draft", "claude_refine", "review_queue"],
      message:       `[DEMO] ${count}× ${type} queued for: "${topic}"`,
      live:          false,
    };
    return ok(data, 202);
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
