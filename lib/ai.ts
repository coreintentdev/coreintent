/**
 * AI Service Layer — CoreIntent's three-model orchestra.
 *
 * Real API calls when env keys are present; honest demo fallback when not.
 * Every function catches network errors and returns a safe fallback — never throws.
 * Request timeouts prevent hung processes when upstream APIs are slow.
 * Prompt caching is enabled for Claude to reduce cost on repeated system-prompt calls.
 *
 * Cost guide:
 *   Grok       — near-free with X Premium+ subscription
 *   Claude     — ~$0.01/request (sonnet-4-6); prompt caching cuts repeated-call cost
 *   Perplexity — $20/mo flat (sonar-pro, unlimited)
 *
 * Routing strategy:
 *   signal/content → Grok        (fast, cheap)
 *   analysis       → Claude       (deep reasoning, long context)
 *   research       → Perplexity   (live web facts, citations)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIResponse {
  source: "grok" | "claude" | "perplexity";
  model: string;
  content: string;
  /** true = live API call succeeded; false = demo or error fallback */
  live: boolean;
  /**
   * Only present when live === false due to a failure (not demo).
   * Enables monitoring dashboards to classify failure modes.
   */
  errorType?: "api_error" | "rate_limit" | "network_error" | "timeout";
}

export type OrchestrateTask = "signal" | "analysis" | "research" | "content";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns true when the key is missing or is a known placeholder value. */
function isDemoKey(key: string | undefined, placeholder: string): boolean {
  return !key || key === placeholder;
}

/**
 * fetch() with an AbortController timeout.
 * Throws DOMException { name: "AbortError" } when the deadline is exceeded.
 */
function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

/** Classify an unknown caught error into an AIResponse error payload. */
function classifyFetchError(
  e: unknown,
  source: AIResponse["source"],
  model: string
): AIResponse {
  if (e instanceof DOMException && e.name === "AbortError") {
    return {
      source,
      model,
      content: `[TIMEOUT] Request to ${source} exceeded the allowed time limit.`,
      live: false,
      errorType: "timeout",
    };
  }
  const msg = e instanceof Error ? e.message : String(e);
  return {
    source,
    model,
    content: `[NETWORK ERROR] ${msg}`,
    live: false,
    errorType: "network_error",
  };
}

// ---------------------------------------------------------------------------
// GROK — via X.ai — Fast signals, near-free with X Premium+
// ---------------------------------------------------------------------------

/** Request timeout for Grok (ms). */
const GROK_TIMEOUT_MS = 15_000;

/**
 * System prompt for Grok.
 * Structured for trading signals: concise, data-driven, no hallucinations.
 */
const GROK_SYSTEM =
  "You are CoreIntent's signal detection AI (paper trading mode).\n" +
  "Output rules:\n" +
  "- Be concise and data-driven. Max 3 sentences per signal.\n" +
  "- Never fabricate prices, volume, or statistics.\n" +
  "- Flag uncertainty explicitly: [UNCERTAIN: <reason>].\n" +
  "- Signal format when applicable: Pair | Direction | Confidence (0–1) | Rationale.";

/**
 * Call Grok (X.ai) for fast trading signals and content drafts.
 * Falls back gracefully when the API key is absent or the call fails.
 */
export async function callGrok(prompt: string): Promise<AIResponse> {
  const key = process.env.GROK_API_KEY;
  if (isDemoKey(key, "xai-xxx")) {
    return {
      source: "grok",
      model: "grok-demo",
      content: `[DEMO] Grok: ${prompt}`,
      live: false,
    };
  }

  try {
    const res = await fetchWithTimeout(
      "https://api.x.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "grok-3",
          messages: [
            { role: "system", content: GROK_SYSTEM },
            { role: "user",   content: prompt },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      },
      GROK_TIMEOUT_MS
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        source: "grok",
        model: "grok-3",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source: "grok",
      model: data.model ?? "grok-3",
      content: data.choices?.[0]?.message?.content ?? "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "grok", "grok-3");
  }
}

// ---------------------------------------------------------------------------
// CLAUDE — Anthropic — Deep analysis, risk assessment, orchestration
// ---------------------------------------------------------------------------

/** Request timeout for Claude (ms). */
const CLAUDE_TIMEOUT_MS = 25_000;

/**
 * Default system prompt for Claude.
 * Includes project context so responses are grounded in CoreIntent's reality.
 * This string is marked for prompt caching — Anthropic will cache it server-side
 * after the first call, reducing token cost on subsequent requests.
 */
const CLAUDE_DEFAULT_SYSTEM =
  "You are CoreIntent, an agentic AI trading assistant for Zynthio.ai.\n" +
  "Owner: Corey McIvor (@coreintentdev). Mode: paper_trading. Status: demo data only, no live exchange connections.\n\n" +
  "Response principles:\n" +
  "- Precise, honest, and direct. No filler sentences.\n" +
  "- Acknowledge uncertainty explicitly. Never fabricate data, prices, or statistics.\n" +
  "- Distinguish demo from live data clearly in every response.\n" +
  "- Structure complex analysis with headers for readability.\n" +
  "- NZ-based project. Never assume Australian jurisdiction.";

/**
 * Call Claude (Anthropic) for deep analysis, risk assessment, and long-context tasks.
 * Enables prompt caching on the system prompt to reduce API cost.
 * Falls back gracefully when the API key is absent or the call fails.
 *
 * @param prompt   User-side message.
 * @param system   Optional override for the system prompt. Caching still applies.
 */
export async function callClaude(
  prompt: string,
  system?: string
): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (isDemoKey(key, "sk-ant-xxx")) {
    return {
      source: "claude",
      model: "claude-demo",
      content: `[DEMO] Claude: ${prompt}`,
      live: false,
    };
  }

  const systemText = system ?? CLAUDE_DEFAULT_SYSTEM;

  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key!,
          "anthropic-version": "2023-06-01",
          // Enable server-side prompt caching for the system message
          "anthropic-beta": "prompt-caching-2024-07-31",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          // Structured system array with cache_control marks the prompt for caching.
          // Anthropic caches it after first use — saves cost on repeated calls with
          // the same system prompt (e.g. protect, research, analysis routes).
          system: [
            {
              type: "text",
              text: systemText,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: prompt }],
        }),
      },
      CLAUDE_TIMEOUT_MS
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        source: "claude",
        model: "claude-sonnet-4-6",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source: "claude",
      model: data.model ?? "claude-sonnet-4-6",
      content: data.content?.[0]?.text ?? "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "claude", "claude-sonnet-4-6");
  }
}

// ---------------------------------------------------------------------------
// PERPLEXITY — Research, fact-checking, live web search, $20/mo flat
// ---------------------------------------------------------------------------

/** Request timeout for Perplexity (ms). */
const PERPLEXITY_TIMEOUT_MS = 30_000;

/**
 * Wrap a research query with instructions that enforce factual, cited output.
 * Appended as a suffix so any caller-supplied query is preserved verbatim at the front.
 */
function buildPerplexityQuery(query: string): string {
  return (
    query +
    "\n\nInstructions: Provide factual, cited information only. " +
    "Distinguish confirmed facts from speculation. " +
    "State explicitly if information cannot be found. " +
    "Prioritise sources from the last 90 days for market-sensitive data."
  );
}

/**
 * Call Perplexity (sonar-pro) for live web research and fact-checking.
 * Falls back gracefully when the API key is absent or the call fails.
 */
export async function callPerplexity(query: string): Promise<AIResponse> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (isDemoKey(key, "pplx-xxx")) {
    return {
      source: "perplexity",
      model: "perplexity-demo",
      content: `[DEMO] Perplexity: ${query}`,
      live: false,
    };
  }

  try {
    const res = await fetchWithTimeout(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [{ role: "user", content: buildPerplexityQuery(query) }],
          max_tokens: 1024,
          temperature: 0.2,
        }),
      },
      PERPLEXITY_TIMEOUT_MS
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        source: "perplexity",
        model: "sonar-pro",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source: "perplexity",
      model: data.model ?? "sonar-pro",
      content: data.choices?.[0]?.message?.content ?? "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "perplexity", "sonar-pro");
  }
}

// ---------------------------------------------------------------------------
// CALL ALL — Run all three models in parallel
// ---------------------------------------------------------------------------

/**
 * Fire all three AI models in parallel and return their responses as a tuple.
 * Used by routes (e.g. /api/protect, /api/research) that need multi-model consensus.
 * Individual failures do not block the others — each returns its own fallback.
 *
 * @returns [grokResult, claudeResult, perplexityResult]
 */
export async function callAll(
  grokPrompt: string,
  claudePrompt: string,
  perplexityQuery: string
): Promise<[AIResponse, AIResponse, AIResponse]> {
  return Promise.all([
    callGrok(grokPrompt),
    callClaude(claudePrompt),
    callPerplexity(perplexityQuery),
  ]);
}

// ---------------------------------------------------------------------------
// ORCHESTRATOR — Route each task type to the best-fit model
// ---------------------------------------------------------------------------

/**
 * Route a task to the most appropriate AI:
 * - signal/content → Grok        (fast, cheap, good enough for drafts)
 * - analysis       → Claude       (deep reasoning, risk, long context)
 * - research       → Perplexity   (live web search, citations)
 */
export async function orchestrate(
  task: OrchestrateTask,
  prompt: string
): Promise<AIResponse> {
  switch (task) {
    case "signal":
    case "content":
      return callGrok(prompt);
    case "analysis":
      return callClaude(prompt);
    case "research":
      return callPerplexity(prompt);
  }
}
