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
import { callPerplexity, callClaude, callGrok, validateAiContent } from "@/lib/ai";
import { ok, err, badRequest, gatewayError, preflight, serverError, validateString, validateEnum } from "@/lib/api";

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

const VALID_TASKS = ["research", "analysis", "signal", "sentiment"] as const satisfies ResearchTask[];

export async function GET() {
  try {
    const [perplexityResult, grokResult, claudeResult] = await Promise.all([
      callPerplexity(
        `Search for "${IDENTITY.name}" OR "${IDENTITY.project}" OR "${IDENTITY.domain}" OR "${IDENTITY.twitter}". ` +
        `Find mentions, profiles, articles, or social media posts. ` +
        `What is the current web presence of this person and project?`
      ),
      callGrok(
        `Search X/Twitter for ${IDENTITY.twitter} and CoreIntent. ` +
        `Latest activity? Any mentions? Overall sentiment? ` +
        `Are there any impersonation attempts on this account?`
      ),
      callClaude(
        `You are analyzing the digital twin of Corey McIvor (${IDENTITY.handle}), creator of ${IDENTITY.project}. ` +
        `Summarize the current project state, identify the top 3 risks to the digital identity, ` +
        `and suggest 3 immediate actions to strengthen online presence and protect the brand.`,
        "You are CoreIntent's self-awareness module. Be precise, honest, and direct."
      ),
    ]);

    return ok({
      identity: IDENTITY,
      research: {
        webPresence:     { ...perplexityResult, purpose: "Web presence scan",        contentValid: validateAiContent(perplexityResult) },
        socialSentiment: { ...grokResult,       purpose: "X/Twitter monitoring",     contentValid: validateAiContent(grokResult)       },
        selfAnalysis:    { ...claudeResult,     purpose: "Threat & brand analysis",  contentValid: validateAiContent(claudeResult)     },
      },
      allLive:  perplexityResult.live && grokResult.live && claudeResult.live,
      allValid: validateAiContent(perplexityResult) && validateAiContent(grokResult) && validateAiContent(claudeResult),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<ResearchRequest>;
  try {
    body = (await req.json()) as Partial<ResearchRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const topic = validateString(body.topic, 1000);
  if (!topic) return badRequest("topic is required and must be 1000 characters or fewer");

  const task: ResearchTask = validateEnum(body.task, VALID_TASKS) ?? "research";

  try {
    type TaskFn = () => ReturnType<typeof callPerplexity | typeof callClaude | typeof callGrok>;
    const taskMap: Record<ResearchTask, TaskFn> = {
      research:  () => callPerplexity(topic),
      analysis:  () => callClaude(topic),
      signal:    () => callGrok(topic),
      sentiment: () => callGrok(`Analyze market and social sentiment for: ${topic}`),
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
