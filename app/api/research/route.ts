/**
 * /api/research — Digital twin research engine.
 *
 * Uses all 3 AIs in parallel to research Corey McIvor / CoreIntent / digital identity.
 * In demo mode (no API keys), all calls return [DEMO] fallback responses.
 *
 * GET  — full self-research: web presence, X/Twitter sentiment, brand analysis
 * POST — research any topic using the AI orchestra
 *
 * Rate limit: 5 req/min — AI calls are expensive (see RATE_LIMITS.research in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { callAIsParallel, callPerplexity, callClaudeDeep, callGrok, validateAiContent, sanitizeForPrompt, type AIResponse } from "@/lib/ai";
import { ok, badRequest, gatewayError, preflight, serverError, validateString, validateEnum, checkRateLimit, tooManyRequests } from "@/lib/api";

type ResearchTask = "research" | "analysis" | "signal" | "sentiment";

interface ResearchRequest {
  topic: string;
  task?: ResearchTask;
}

const IDENTITY = {
  name:    "Corey McIvor",
  handle:  "@coreintentdev",
  project: "CoreIntent / Zynthio.ai",
  twitter: "@coreintentai",
  github:  "https://github.com/coreintentdev",
  domain:  "coreintent.dev",
} as const;

const VALID_TASKS: readonly ResearchTask[] = ["research", "analysis", "signal", "sentiment"];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "research");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    const results = await callAIsParallel({
      perplexity:
        `Search for "${IDENTITY.name}" OR "${IDENTITY.project}" OR "${IDENTITY.domain}" OR "${IDENTITY.twitter}". ` +
        `Find mentions, profiles, articles, or social media posts. ` +
        `What is the current web presence of this person and project?`,
      grok:
        `Search X/Twitter for ${IDENTITY.twitter} and CoreIntent. ` +
        `Latest activity? Any mentions? Overall sentiment? ` +
        `Are there any impersonation attempts on this account?`,
      claude:
        `You are analyzing the digital twin of Corey McIvor (${IDENTITY.handle}), creator of ${IDENTITY.project}. ` +
        `Summarize the current project state, identify the top 3 risks to the digital identity, ` +
        `and suggest 3 immediate actions to strengthen online presence and protect the brand.`,
      systems: {
        claude: "You are CoreIntent's self-awareness module. Be precise, honest, and direct.",
      },
      claudeModel: "claude-opus-4-7",
    });

    return ok({
      identity: IDENTITY,
      research: {
        webPresence:     { ...results.perplexity, purpose: "Web presence scan",       contentValid: validateAiContent(results.perplexity) },
        socialSentiment: { ...results.grok,       purpose: "X/Twitter monitoring",    contentValid: validateAiContent(results.grok)       },
        selfAnalysis:    { ...results.claude,     purpose: "Threat & brand analysis", contentValid: validateAiContent(results.claude)     },
      },
      allLive:     results.allLive,
      partialLive: results.partialLive,
      allValid:    results.allValid,
      timestamp:   new Date().toISOString(),
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "research");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  let body: Partial<ResearchRequest>;
  try {
    body = (await req.json()) as Partial<ResearchRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const topic = validateString(body.topic, 1000);
  if (!topic) return badRequest("topic is required and must be 1000 characters or fewer");

  const task = validateEnum(body.task, VALID_TASKS) ?? "research";

  const safeTopic = sanitizeForPrompt(topic, 1000);

  try {
    type TaskFn = () => Promise<AIResponse>;
    const taskMap: Record<ResearchTask, TaskFn> = {
      research:  () => callPerplexity(safeTopic),
      analysis:  () => callClaudeDeep(safeTopic),
      signal:    () => callGrok(safeTopic),
      sentiment: () => callGrok(`Analyze market and social sentiment for: ${safeTopic}`),
    };

    const result = await taskMap[task]();
    if (!validateAiContent(result)) {
      return gatewayError("AI returned an empty response");
    }

    return ok({ topic, task, result, timestamp: new Date().toISOString() });
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
