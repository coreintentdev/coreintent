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
  model:  string;
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
// Demo response helper
// ---------------------------------------------------------------------------

/**
 * Builds an informative demo fallback response.
 * Tells the caller which env var to set, rather than just echoing the prompt.
 */
function demoFallback(
  source:  AIResponse["source"],
  envVar:  string,
  prompt:  string
): AIResponse {
  const snippet = prompt.length > 150 ? `${prompt.slice(0, 150)}…` : prompt;
  return {
    source,
    model:   `${source}-demo`,
    content: `[DEMO] ${source.toUpperCase()} is not configured. ` +
             `Set ${envVar} in your .env to enable live calls. ` +
             `Prompt received: "${snippet}"`,
    live: false,
  };
}

// ---------------------------------------------------------------------------
// isLive() — exported utility for routes that need to gate on key presence
// ---------------------------------------------------------------------------

/**
 * Returns true when a real API key is present for the given AI source.
 * Useful for status routes and conditional UI — avoids duplicating the
 * isDemoKey check across multiple files.
 *
 * @example
 * if (!isLive("grok")) return serviceUnavailable("Grok API key not configured");
 */
export function isLive(source: AIResponse["source"]): boolean {
  switch (source) {
    case "grok":       return !isDemoKey(process.env.GROK_API_KEY,       "xai-xxx");
    case "claude":     return !isDemoKey(process.env.ANTHROPIC_API_KEY,  "sk-ant-xxx");
    case "perplexity": return !isDemoKey(process.env.PERPLEXITY_API_KEY, "pplx-xxx");
  }
}

// ---------------------------------------------------------------------------
// GROK — via X.ai — Fast signals, near-free with X Premium+
// ---------------------------------------------------------------------------

const GROK_TIMEOUT_MS = 15_000;

/**
 * System prompt for Grok.
 * Structured for trading signals: concise, data-driven, no hallucinations.
 */
const GROK_SYSTEM =
  "You are CoreIntent's signal detection AI for Zynthio.ai (paper trading mode, NZ).\n\n" +
  "Signal format (use when outputting a trade signal):\n" +
  "  Pair | Direction (long/short) | Confidence 0.00–1.00 | Entry zone | Stop level | Rationale (≤2 sentences)\n\n" +
  "Output rules:\n" +
  "- Concise and data-driven. Max 3 sentences for non-signal analysis.\n" +
  "- Never fabricate prices, volume, or on-chain statistics.\n" +
  "- Flag uncertainty explicitly: [UNCERTAIN: <reason>].\n" +
  "- State 'insufficient data' rather than guessing when information is unavailable.\n" +
  "- All signals are PAPER TRADING only — no real capital at risk.";

/**
 * Call Grok (X.ai) for fast trading signals and content drafts.
 * Falls back gracefully when the API key is absent or the call fails.
 */
export async function callGrok(prompt: string): Promise<AIResponse> {
  const key = process.env.GROK_API_KEY;
  if (isDemoKey(key, "xai-xxx")) return demoFallback("grok", "GROK_API_KEY", prompt);

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
        model:  "grok-3",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source:  "grok",
      model:   data.model ?? "grok-3",
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

const CLAUDE_TIMEOUT_MS = 25_000;

/**
 * Default system prompt for Claude.
 * Marked for prompt caching — Anthropic caches it server-side after the first call,
 * reducing token cost on subsequent requests with the same system prompt.
 */
const CLAUDE_DEFAULT_SYSTEM =
  "You are CoreIntent, an agentic AI trading assistant for Zynthio.ai.\n" +
  "Owner: Corey McIvor (@coreintentdev, NZ). Mode: paper_trading.\n" +
  "Current state: demo data only — no live exchange connections (Binance/Coinbase/gTrade are PLANNED, not active).\n\n" +
  "Response principles:\n" +
  "- Precise, honest, and direct. No filler sentences.\n" +
  "- Acknowledge uncertainty explicitly. Never fabricate market data, prices, or statistics.\n" +
  "- Label all demo/placeholder data as [DEMO] so the distinction is always clear.\n" +
  "- Structure complex analysis with headers (##) for readability.\n" +
  "- NZ jurisdiction — regulatory references use NZ FMA, not ASIC.\n" +
  "- Stay within CoreIntent's trading/analysis mandate; redirect out-of-scope questions.";

/**
 * Call Claude (Anthropic) for deep analysis, risk assessment, and long-context tasks.
 * Enables prompt caching on the system prompt to reduce API cost.
 *
 * @param prompt   User-side message.
 * @param system   Optional override for the system prompt. Caching still applies.
 */
export async function callClaude(
  prompt: string,
  system?: string
): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (isDemoKey(key, "sk-ant-xxx")) return demoFallback("claude", "ANTHROPIC_API_KEY", prompt);

  const systemText = system ?? CLAUDE_DEFAULT_SYSTEM;

  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type":    "application/json",
          "x-api-key":       key!,
          "anthropic-version": "2023-06-01",
          // Enable server-side prompt caching for the system message
          "anthropic-beta":  "prompt-caching-2024-07-31",
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-6",
          max_tokens: 1024,
          system: [
            {
              type:          "text",
              text:          systemText,
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
        source:  "claude",
        model:   "claude-sonnet-4-6",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source:  "claude",
      model:   data.model ?? "claude-sonnet-4-6",
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

const PERPLEXITY_TIMEOUT_MS = 30_000;

/**
 * Wrap a research query with instructions that enforce factual, cited output.
 */
function buildPerplexityQuery(query: string): string {
  return (
    query +
    "\n\nInstructions: Provide factual, cited information only. " +
    "Distinguish confirmed facts from speculation clearly. " +
    "State explicitly if information cannot be found rather than inferring. " +
    "Prioritise sources from the last 90 days for market-sensitive data. " +
    "Include source URLs or publication names where available."
  );
}

/**
 * Call Perplexity (sonar-pro) for live web research and fact-checking.
 * Falls back gracefully when the API key is absent or the call fails.
 */
export async function callPerplexity(query: string): Promise<AIResponse> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (isDemoKey(key, "pplx-xxx")) return demoFallback("perplexity", "PERPLEXITY_API_KEY", query);

  try {
    const res = await fetchWithTimeout(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [{ role: "user", content: buildPerplexityQuery(query) }],
          max_tokens:  1024,
          temperature: 0.2,
        }),
      },
      PERPLEXITY_TIMEOUT_MS
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        source:  "perplexity",
        model:   "sonar-pro",
        content: `[API ERROR ${res.status}] ${text}`,
        live: false,
        errorType: res.status === 429 ? "rate_limit" : "api_error",
      };
    }

    const data = await res.json();
    return {
      source:  "perplexity",
      model:   data.model ?? "sonar-pro",
      content: data.choices?.[0]?.message?.content ?? "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "perplexity", "sonar-pro");
  }
}

// ---------------------------------------------------------------------------
// RESPONSE VALIDATION
// ---------------------------------------------------------------------------

/**
 * Check that an AI response contains substantive content.
 * Returns true if content is non-empty (regardless of live vs demo status).
 * Use this when chaining AI calls to guard against empty responses before
 * acting on the output. Check response.live separately if you need to
 * distinguish real data from demo fallbacks.
 *
 * @example
 * const result = await callGrok(prompt);
 * if (!validateAiContent(result)) return err("AI returned empty response", 502);
 */
export function validateAiContent(response: AIResponse): boolean {
  return Boolean(response.content?.trim());
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
  grokPrompt:       string,
  claudePrompt:     string,
  perplexityQuery:  string
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
 * Route a task to the most appropriate AI, enriching the prompt with
 * task-type context so each model receives the right framing:
 * - signal    → Grok        (explicit signal format, paper trading context)
 * - content   → Grok        (fast draft for CoreIntent/Zynthio.ai, brand voice)
 * - analysis  → Claude      (deep reasoning, structured output with required sections)
 * - research  → Perplexity  (factual web research with citation enforcement, NZ context)
 */
export async function orchestrate(
  task: OrchestrateTask,
  prompt: string
): Promise<AIResponse> {
  switch (task) {
    case "signal":
      return callGrok(
        `[CoreIntent Signal Engine | paper_trading mode | ${new Date().toISOString()}]\n` +
        `TASK: Generate a trading signal analysis for: ${prompt}\n\n` +
        `Format EXACTLY: <Pair> | <long/short> | <confidence 0.00–1.00> | Entry: <zone> | Stop: <level> | Rationale: <≤2 sentences>\n` +
        `Rules: Only signal if confidence ≥ 0.70. State [INSUFFICIENT DATA] if unable to form a view. ` +
        `All signals are paper trading only — no real capital at risk.`
      );
    case "content":
      return callGrok(
        `[CoreIntent Content Engine | Zynthio.ai]\n` +
        `TASK: Generate content for CoreIntent / Zynthio.ai.\n\n${prompt}\n\n` +
        `Brand voice: Direct, data-driven, no hype. Competition-based platform (not subscriptions). NZ-based.\n` +
        `Output must be ready to publish — no placeholder text, no Lorem Ipsum.`
      );
    case "analysis":
      return callClaude(
        `[CoreIntent Analysis Engine | paper_trading mode]\n` +
        `TASK: Deep analysis for: ${prompt}\n\n` +
        `Required sections:\n## Summary\n## Key Risks\n## Recommendations\n\n` +
        `Rules: Label all data sources. Flag uncertainty with [UNCERTAIN: reason]. ` +
        `NZ regulatory context where applicable (NZ FMA, not ASIC). ` +
        `Do not fabricate prices, volume, or on-chain statistics.`
      );
    case "research":
      return callPerplexity(
        `[CoreIntent Research Engine | Zynthio.ai | NZ jurisdiction]\n` +
        `RESEARCH QUERY: ${prompt}\n\n` +
        `Context: Paper trading platform. Prioritise sources from the last 90 days for market-sensitive data. ` +
        `Cite all sources. State explicitly if information cannot be found rather than inferring.`
      );
  }
}
