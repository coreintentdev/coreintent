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
import { callAIsParallel, callPerplexity, callClaude, callGrok, validateAiContent } from "@/lib/ai";
import { ok, badRequest, gatewayError, preflight, serverError, validateString } from "@/lib/api";

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

const VALID_TASKS: ResearchTask[] = ["research", "analysis", "signal", "sentiment"];

export async function GET() {
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
    });

    return ok({
      identity: IDENTITY,
      research: {
        webPresence:     { ...results.perplexity, purpose: "Web presence scan",       contentValid: validateAiContent(results.perplexity) },
        socialSentiment: { ...results.grok,       purpose: "X/Twitter monitoring",    contentValid: validateAiContent(results.grok)       },
        selfAnalysis:    { ...results.claude,     purpose: "Threat & brand analysis", contentValid: validateAiContent(results.claude)     },
      },
      allLive:   results.allLive,
      allValid:  results.allValid,
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

  const task: ResearchTask = VALID_TASKS.includes(body.task as ResearchTask)
    ? (body.task as ResearchTask)
    : "research";

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
