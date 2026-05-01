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
  errorType?: "api_error" | "auth_error" | "rate_limit" | "network_error" | "timeout";
}

/** Which AI API keys are configured (true) vs demo placeholder (false). */
export interface AiKeyStatus {
  claude:     boolean;
  grok:       boolean;
  perplexity: boolean;
}

/**
 * Returns which AI API keys are configured.
 * Centralises key-presence detection so routes don't duplicate the logic.
 * Returns booleans only — never exposes the key values.
 */
export function getAiKeyStatus(): AiKeyStatus {
  return {
    claude:     !isDemoKey(process.env.ANTHROPIC_API_KEY, "sk-ant-xxx"),
    grok:       !isDemoKey(process.env.GROK_API_KEY, "xai-xxx"),
    perplexity: !isDemoKey(process.env.PERPLEXITY_API_KEY, "pplx-xxx"),
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns true when the key is missing or is a known placeholder value. */
function isDemoKey(key: string | undefined, placeholder: string): boolean {
  return !key || key === placeholder;
}

/**
 * Strip control characters and normalize whitespace in user-supplied text
 * before embedding it in an AI prompt. validateString() enforces length upstream;
 * this adds AI-layer defense against control-character-based prompt injection.
 *
 * @param text   User-supplied string (already length-validated by validateString).
 * @param maxLen Hard cap applied after stripping — redundant safety net.
 */
export function sanitizeForPrompt(text: string, maxLen = 1000): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ") // strip control chars (keep \t \n \r)
    .replace(/[ \t]+/g, " ")  // collapse horizontal whitespace
    .trim()
    .slice(0, maxLen);
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

/**
 * Map an HTTP error status to a safe, non-leaking error message.
 * Never expose raw upstream response bodies — they may contain internal API details.
 */
function sanitizeApiError(status: number, source: AIResponse["source"]): string {
  if (status === 429) return `[RATE LIMITED] ${source} API is throttling requests. Retry shortly.`;
  if (status === 401 || status === 403) return `[AUTH ERROR ${status}] ${source} API key is invalid or lacks permission.`;
  if (status >= 500) return `[UPSTREAM ERROR ${status}] ${source} API returned a server error.`;
  return `[API ERROR ${status}] ${source} API returned an unexpected response.`;
}

// ---------------------------------------------------------------------------
// GROK — via X.ai — Fast signals, near-free with X Premium+
// ---------------------------------------------------------------------------

const GROK_TIMEOUT_MS = 15_000;

/** Default system prompt for Grok — trading signals and concise output. Exported for route reuse. */
export const GROK_SYSTEM =
  "You are CoreIntent's signal detection AI for Zynthio.ai (paper trading mode, NZ).\n" +
  "All signals are PAPER TRADING only — no real capital at risk.\n\n" +
  "Signal format (use when outputting a trade signal):\n" +
  "  Pair | Direction (long/short) | Confidence 0.00–1.00 | Entry zone | Stop level | Rationale (≤2 sentences)\n\n" +
  "Output rules:\n" +
  "- Concise and data-driven. Max 3 sentences for non-signal analysis.\n" +
  "- Never fabricate prices, volume, or on-chain statistics.\n" +
  "- Flag uncertainty explicitly: [UNCERTAIN: <reason>].\n" +
  "- State 'insufficient data' rather than guessing when information is unavailable.\n" +
  "- NZ jurisdiction — do not reference ASIC; use NZ FMA for regulatory context.";

/**
 * Call Grok (X.ai) for fast trading signals and content drafts.
 * Falls back gracefully when the API key is absent or the call fails.
 *
 * @param prompt   User-side message.
 * @param system   Optional override for the system prompt.
 * @param options  Optional overrides (e.g. maxTokens for cost control).
 */
export async function callGrok(
  prompt: string,
  system?: string,
  options?: { maxTokens?: number }
): Promise<AIResponse> {
  const key = process.env.GROK_API_KEY;
  if (isDemoKey(key, "xai-xxx")) {
    return {
      source: "grok",
      model:  "grok-demo",
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
            { role: "system", content: system ?? GROK_SYSTEM },
            { role: "user",   content: prompt },
          ],
          max_tokens: options?.maxTokens ?? 1000,
          temperature: 0.3,
        }),
      },
      GROK_TIMEOUT_MS
    );

    if (!res.ok) {
      return {
        source:    "grok",
        model:     "grok-3",
        content:   sanitizeApiError(res.status, "grok"),
        live:      false,
        errorType: res.status === 429 ? "rate_limit"
                 : (res.status === 401 || res.status === 403) ? "auth_error"
                 : "api_error",
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

/**
 * Convenience wrapper for Grok content drafting.
 * Pre-wires GROK_CONTENT_SYSTEM so callers don't need to import the system prompt.
 */
export async function callGrokContent(
  prompt: string,
  options?: { maxTokens?: number }
): Promise<AIResponse> {
  return callGrok(prompt, GROK_CONTENT_SYSTEM, options);
}

// ---------------------------------------------------------------------------
// CLAUDE — Anthropic — Deep analysis, risk assessment, orchestration
// ---------------------------------------------------------------------------

const CLAUDE_TIMEOUT_MS = 25_000;

/**
 * Default system prompt for Claude.
 * Marked for prompt caching — Anthropic caches it server-side after the first call,
 * reducing token cost on subsequent requests with the same system prompt.
 *
 * Keep this prompt stable between requests to maximise cache hit rate.
 * Avoid injecting per-request variables (timestamps, prices) here — put those
 * in the user message instead.
 */
export const CLAUDE_DEFAULT_SYSTEM =
  "You are CoreIntent, an agentic AI trading assistant for Zynthio.ai (parent brand).\n" +
  "Owner: Corey McIvor (@coreintentdev / @coreintentai, NZ). Mode: paper_trading.\n\n" +
  "Platform state (as of April 2026):\n" +
  "- All API routes return demo/static data — no live exchange connections.\n" +
  "- Binance, Coinbase, and gTrade are PLANNED integrations, not yet active.\n" +
  "- Business model: competition-based leagues (daily/weekly/monthly), NOT subscriptions.\n" +
  "- AI agents are code-ready but not yet deployed to the Cloudzy VPS.\n" +
  "- Authentication and database layers do not yet exist.\n\n" +
  "Response principles:\n" +
  "- Precise, honest, and direct. No filler sentences.\n" +
  "- Acknowledge uncertainty explicitly with [UNCERTAIN: <reason>].\n" +
  "- Never fabricate market data, prices, volume, or on-chain statistics.\n" +
  "- Label all demo/placeholder data as [DEMO] so the distinction is always clear.\n" +
  "- Structure analysis with Markdown headers (##) when the response has multiple sections.\n" +
  "- NZ jurisdiction — regulatory references use NZ FMA, not ASIC. Never reference ASIC.\n" +
  "- Stay within CoreIntent's trading/analysis mandate; redirect out-of-scope questions.\n" +
  "- Target ≤600 tokens unless complexity warrants more.\n" +
  "  For deep analysis (task context = 'analysis'), use up to 1024 tokens.";

/**
 * Call Claude (Anthropic) for deep analysis, risk assessment, and long-context tasks.
 * Enables prompt caching on the system prompt to reduce API cost.
 *
 * @param prompt   User-side message.
 * @param system   Optional override for the system prompt. Caching still applies.
 * @param options  Optional overrides (e.g. maxTokens for cost control).
 */
export async function callClaude(
  prompt: string,
  system?: string,
  options?: { maxTokens?: number }
): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (isDemoKey(key, "sk-ant-xxx")) {
    return {
      source:  "claude",
      model:   "claude-demo",
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
          "Content-Type":    "application/json",
          "x-api-key":       key!,
          "anthropic-version": "2023-06-01",
          // Enable server-side prompt caching for the system message
          "anthropic-beta":  "prompt-caching-2024-07-31",
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-6",
          max_tokens: options?.maxTokens ?? 1024,
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
      return {
        source:    "claude",
        model:     "claude-sonnet-4-6",
        content:   sanitizeApiError(res.status, "claude"),
        live:      false,
        errorType: res.status === 429 ? "rate_limit"
                 : (res.status === 401 || res.status === 403) ? "auth_error"
                 : "api_error",
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
 * Default system prompt for Perplexity.
 * Enforces factual, cited output and sets NZ regulatory context.
 * Keep stable between requests to benefit from any server-side caching.
 */
export const PERPLEXITY_SYSTEM =
  "You are CoreIntent's research AI for Zynthio.ai (paper trading mode, NZ).\n\n" +
  "Research rules:\n" +
  "- Provide factual, cited information only. No speculation presented as fact.\n" +
  "- Distinguish confirmed facts from speculation clearly.\n" +
  "- State explicitly if information cannot be found rather than inferring.\n" +
  "- Prioritise sources from the last 90 days for market-sensitive data.\n" +
  "- Include source URLs or publication names where available.\n" +
  "- NZ jurisdiction — regulatory references use NZ FMA, not ASIC. Never reference ASIC.\n" +
  "- Label any demo/placeholder data as [DEMO] so callers can distinguish it.\n" +
  "- Do not fabricate prices, volume, or on-chain statistics.\n" +
  "- If a query is about Corey McIvor or CoreIntent, note that the platform is in alpha (paper trading only).";

/**
 * Call Perplexity (sonar-pro) for live web research and fact-checking.
 * Falls back gracefully when the API key is absent or the call fails.
 *
 * @param query   The research query.
 * @param system  Optional override for the system prompt. Defaults to PERPLEXITY_SYSTEM.
 * @param options Optional overrides (e.g. maxTokens for cost control).
 */
export async function callPerplexity(
  query: string,
  system?: string,
  options?: { maxTokens?: number }
): Promise<AIResponse> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (isDemoKey(key, "pplx-xxx")) {
    return {
      source:  "perplexity",
      model:   "perplexity-demo",
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
          Authorization:  `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            { role: "system", content: system ?? PERPLEXITY_SYSTEM },
            { role: "user",   content: query },
          ],
          max_tokens:  options?.maxTokens ?? 1024,
          temperature: 0.2,
        }),
      },
      PERPLEXITY_TIMEOUT_MS
    );

    if (!res.ok) {
      return {
        source:    "perplexity",
        model:     "sonar-pro",
        content:   sanitizeApiError(res.status, "perplexity"),
        live:      false,
        errorType: res.status === 429 ? "rate_limit"
                 : (res.status === 401 || res.status === 403) ? "auth_error"
                 : "api_error",
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
// SPECIALIZED SYSTEM PROMPTS (exported for route reuse)
// ---------------------------------------------------------------------------

/**
 * Grok system prompt for X/Twitter security monitoring.
 * Use when scanning for impersonation, brand abuse, or copycat accounts.
 * Pass as the `system` arg to callGrok() — overrides GROK_SYSTEM.
 */
export const GROK_SECURITY_SYSTEM =
  "You are CoreIntent's security monitoring AI for Zynthio.ai.\n" +
  "Your role: detect impersonation, brand abuse, and digital identity threats on X/Twitter.\n\n" +
  "Output format (one line per finding):\n" +
  "  Account/Entity | Threat Type | Risk (none/low/medium/high/critical) | Recommended Action\n\n" +
  "Output rules:\n" +
  "- Never fabricate threats. State 'no threats found' when nothing is detected.\n" +
  "- Flag uncertainty: [UNCERTAIN: <reason>].\n" +
  "- NZ jurisdiction — use NZ FMA for regulatory context. Never reference ASIC.";

/**
 * Grok system prompt for content drafting (tweets, threads, announcements).
 * Pass as the `system` arg to callGrok() when generating content, not signals.
 */
export const GROK_CONTENT_SYSTEM =
  "You are CoreIntent's content drafting AI for Zynthio.ai.\n" +
  "Draft concise, engaging content for trading and tech audiences.\n\n" +
  "Output rules:\n" +
  "- Match the requested tone exactly: technical / hype / educational / community.\n" +
  "- Stay on-brand: AI trading, paper trading mode, competition leagues.\n" +
  "- Never fabricate prices, statistics, or market data.\n" +
  "- Label all demo/placeholder values as [DEMO].\n" +
  "- NZ-based platform — avoid AU-specific regulatory references.";

/**
 * Claude system prompt for security threat and IP risk assessment (F18 Security Layer).
 * Pass as the `system` arg to callClaude() for protect/threat routes.
 * Keep stable between requests to benefit from prompt caching.
 */
export const CLAUDE_RISK_SYSTEM =
  "You are the F18 Security AI for CoreIntent (Zynthio.ai, paper trading mode, NZ).\n" +
  "Your role: assess digital identity threats, IP risks, and brand protection needs.\n\n" +
  "Assessment format (one entry per risk):\n" +
  "  Risk | Severity (low/medium/high/critical) | Evidence | Recommended Action\n\n" +
  "Output rules:\n" +
  "- Only report verified or highly probable risks.\n" +
  "- Flag unverified claims: [UNVERIFIED: <source>].\n" +
  "- Be specific and actionable — no vague recommendations.\n" +
  "- List risks in order of severity (critical first).\n" +
  "- NZ jurisdiction — use NZ FMA. Never reference ASIC.";

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
 * if (!validateAiContent(result)) return gatewayError("AI returned empty response");
 */
export function validateAiContent(response: AIResponse): boolean {
  return Boolean(response.content?.trim());
}

/**
 * Returns true when the response is both live (not demo/fallback) AND contains
 * non-empty content. Use when you need to confirm a real API response before
 * persisting or acting on the result.
 *
 * Use validateAiContent() instead when demo fallbacks are acceptable.
 *
 * @example
 * const result = await callClaude(prompt);
 * if (!isLiveAndValid(result)) return gatewayError("Live AI response required");
 */
export function isLiveAndValid(response: AIResponse): boolean {
  return response.live && validateAiContent(response);
}

// ---------------------------------------------------------------------------
// PARALLEL ORCHESTRATION
// ---------------------------------------------------------------------------

/** Prompts for a three-way parallel AI call. */
export interface ParallelAIPrompts {
  grok:       string;
  perplexity: string;
  claude:     string;
  /** Optional system-prompt overrides per model. */
  systems?: {
    grok?:       string;
    perplexity?: string;
    claude?:     string;
  };
  /** Optional per-model max_tokens overrides for cost control. */
  maxTokens?: {
    grok?:       number;
    perplexity?: number;
    claude?:     number;
  };
}

/** Results from a three-way parallel AI call with pre-computed aggregate flags. */
export interface ParallelAIResults {
  grok:       AIResponse;
  perplexity: AIResponse;
  claude:     AIResponse;
  /** true when all three live API calls succeeded. */
  allLive:     boolean;
  /** true when at least one live API call succeeded. */
  partialLive: boolean;
  /** true when all three responses contain non-empty content. */
  allValid:    boolean;
}

/**
 * Call all three AIs in parallel with distinct prompts.
 * Pre-computes allLive and allValid so callers avoid repeating the boolean chain.
 * Every underlying call falls back gracefully — this function never rejects.
 *
 * Use this for routes that need input from all three models simultaneously
 * (e.g. /api/protect GET, /api/research GET). For single-model calls use
 * callGrok / callClaude / callPerplexity directly.
 */
export async function callAIsParallel(
  prompts: ParallelAIPrompts
): Promise<ParallelAIResults> {
  const [grok, perplexity, claude] = await Promise.all([
    callGrok(prompts.grok,             prompts.systems?.grok,       { maxTokens: prompts.maxTokens?.grok }),
    callPerplexity(prompts.perplexity, prompts.systems?.perplexity, { maxTokens: prompts.maxTokens?.perplexity }),
    callClaude(prompts.claude,         prompts.systems?.claude,     { maxTokens: prompts.maxTokens?.claude }),
  ]);
  return {
    grok,
    perplexity,
    claude,
    allLive:     grok.live && perplexity.live && claude.live,
    partialLive: grok.live || perplexity.live || claude.live,
    allValid:    validateAiContent(grok) && validateAiContent(perplexity) && validateAiContent(claude),
  };
}

