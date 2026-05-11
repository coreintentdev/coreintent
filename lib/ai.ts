/**
 * AI Service Layer — CoreIntent's three-model orchestra.
 *
 * Real API calls when env keys are present; honest demo fallback when not.
 * Every function catches network errors and returns a safe fallback — never throws.
 * Request timeouts prevent hung processes when upstream APIs are slow.
 * Transient network failures are retried once (500 ms backoff) before failing.
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

/** Claude model identifiers — single source of truth used across lib and routes. */
export type ClaudeModelId =
  | "claude-sonnet-4-6"
  | "claude-opus-4-7"
  | "claude-haiku-4-5-20251001";

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

/**
 * fetchWithTimeout with a single automatic retry on transient network failure.
 * Does not retry timeouts (AbortError) — those indicate a slow upstream, not a blip,
 * and retrying with the same deadline would almost certainly fail again.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  try {
    return await fetchWithTimeout(url, init, timeoutMs);
  } catch (e) {
    // Timeout — rethrow immediately; retry won't help.
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    // Brief backoff before retrying a genuine network error (connection drop, DNS blip).
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    return fetchWithTimeout(url, init, timeoutMs);
  }
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

/**
 * Default system prompt for Grok — trading signals and concise output.
 * Exported for route reuse. Keep stable between calls to benefit from any server-side caching.
 */
export const GROK_SYSTEM =
  "You are CoreIntent's signal detection AI for Zynthio.ai (paper trading mode, NZ).\n" +
  "All signals are PAPER TRADING only — no real capital at risk.\n\n" +
  "Signal output format (one signal per line, no blank lines between signals):\n" +
  "  Pair | Direction (long/short) | Confidence 0.00–1.00 | Entry zone | Stop level | Rationale (≤2 sentences)\n\n" +
  "Confidence calibration:\n" +
  "  0.90–1.00 = strong multi-factor confluence (trend + volume + sentiment all aligned)\n" +
  "  0.75–0.89 = moderate confluence (2 of 3 factors aligned, name which are missing)\n" +
  "  0.50–0.74 = weak signal (single factor, must be flagged as low-confidence)\n" +
  "  < 0.50    = do not emit — output 'INSUFFICIENT SIGNAL: <reason>'\n\n" +
  "Factors to consider when confidence is available:\n" +
  "  1. Trend (price action, moving averages, higher highs/lows)\n" +
  "  2. Volume (unusual volume, breakout confirmation)\n" +
  "  3. Sentiment (social, news, fear/greed index)\n\n" +
  "Output rules:\n" +
  "- Concise and data-driven. Max 3 sentences for non-signal analysis.\n" +
  "- Never fabricate prices, volume, or on-chain statistics.\n" +
  "- Flag uncertainty explicitly: [UNCERTAIN: <reason>].\n" +
  "- State 'INSUFFICIENT DATA' (not a guess) when input context is missing or stale.\n" +
  "- If asked about current data you cannot access, ask for context rather than fabricating.\n" +
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
      content:
        "[DEMO] Grok response unavailable — GROK_API_KEY not configured.\n" +
        "In live mode, Grok provides: trading signals, social sentiment, and content drafts via X Premium+.\n" +
        "Set GROK_API_KEY in your environment to enable live responses.",
      live: false,
    };
  }

  try {
    const res = await fetchWithRetry(
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
  "Platform state (May 2026):\n" +
  "- All API routes return demo/static data — no live exchange connections.\n" +
  "- Binance, Coinbase, and gTrade are PLANNED integrations, not yet active.\n" +
  "- Business model: competition-based leagues (daily/weekly/monthly), NOT subscriptions.\n" +
  "- AI agents are code-ready but not yet deployed to the Cloudzy VPS.\n" +
  "- Authentication and database layers do not yet exist.\n\n" +
  "In-scope topics: trading signals, portfolio analysis, market research, risk assessment,\n" +
  "AI agent coordination, platform architecture, brand protection (F18 Security).\n" +
  "Out-of-scope: personal advice, legal opinions, anything requiring live exchange data.\n\n" +
  "Response format:\n" +
  "- Use Markdown headers (##) when the response has 2+ distinct sections.\n" +
  "- Use bullet points for lists of 3+ items.\n" +
  "- For risk/threat analysis, lead with severity: Critical > High > Medium > Low.\n" +
  "- For trade analysis, always state: pair | direction | rationale | risk factors.\n\n" +
  "Response principles:\n" +
  "- Precise, honest, and direct. No filler sentences.\n" +
  "- Acknowledge uncertainty explicitly with [UNCERTAIN: <reason>].\n" +
  "- Never fabricate market data, prices, volume, or on-chain statistics.\n" +
  "- Label all demo/placeholder data as [DEMO] so the distinction is always clear.\n" +
  "- NZ jurisdiction — regulatory references use NZ FMA, not ASIC. Never reference ASIC.\n" +
  "- For out-of-scope questions, redirect briefly: 'That’s outside CoreIntent’s mandate. Try…'\n" +
  "- Target ≤600 tokens for standard responses; up to 1024 for deep analysis tasks.";

/**
 * Call Claude (Anthropic) for deep analysis, risk assessment, and long-context tasks.
 * Enables prompt caching on the system prompt to reduce API cost.
 *
 * @param prompt   User-side message.
 * @param system   Optional override for the system prompt. Caching still applies.
 * @param options  Optional overrides — maxTokens and model (defaults to sonnet-4-6).
 */
export async function callClaude(
  prompt: string,
  system?: string,
  options?: { maxTokens?: number; model?: ClaudeModelId }
): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (isDemoKey(key, "sk-ant-xxx")) {
    return {
      source:  "claude",
      model:   "claude-demo",
      content:
        "[DEMO] Claude response unavailable — ANTHROPIC_API_KEY not configured.\n" +
        "In live mode, Claude provides: deep analysis, risk assessment, long-context reasoning, and orchestration.\n" +
        "Set ANTHROPIC_API_KEY in your environment to enable live responses.",
      live: false,
    };
  }

  const systemText = system ?? CLAUDE_DEFAULT_SYSTEM;
  const modelId    = options?.model ?? "claude-sonnet-4-6";

  try {
    const res = await fetchWithRetry(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         key!,
          "anthropic-version": "2023-06-01",
          // Enable server-side prompt caching for the system message
          "anthropic-beta":    "prompt-caching-2024-07-31",
        },
        body: JSON.stringify({
          model:      modelId,
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
        model:     modelId,
        content:   sanitizeApiError(res.status, "claude"),
        live:      false,
        errorType: res.status === 429 ? "rate_limit"
                 : (res.status === 401 || res.status === 403) ? "auth_error"
                 : "api_error",
      };
    }

    const data = await res.json();
    // Claude can return non-text blocks (tool_use, etc.) before the text block — .find() is required.
    const textBlock = Array.isArray(data.content)
      ? (data.content as Array<{ type: string; text?: string }>).find((b) => b.type === "text")
      : undefined;
    return {
      source:  "claude",
      model:   data.model ?? modelId,
      content: textBlock?.text ?? "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "claude", modelId);
  }
}

/**
 * Convenience wrapper for deep-analysis tasks using claude-opus-4-7.
 * Use for security threat assessments, multi-step reasoning, and long-context analysis
 * where accuracy matters more than speed or cost.
 *
 * @example
 * const result = await callClaudeDeep("Assess the top 3 risks to CoreIntent's brand.");
 */
export async function callClaudeDeep(
  prompt: string,
  system?: string,
  options?: { maxTokens?: number; model?: ClaudeModelId }
): Promise<AIResponse> {
  return callClaude(prompt, system, { ...options, model: options?.model ?? "claude-opus-4-7" });
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
  "Citation format (use for every factual claim with a source):\n" +
  "  [Source: Publication Name, Month YYYY] — key claim or data point\n\n" +
  "Research rules:\n" +
  "- Provide factual, cited information only. No speculation presented as fact.\n" +
  "- Distinguish confirmed facts from speculation clearly (prefix speculation with [UNCONFIRMED]).\n" +
  "- State explicitly if information cannot be found: 'No reliable source found for X.'\n" +
  "- Prioritise sources from the last 90 days for market-sensitive data.\n" +
  "- For data older than 90 days, flag age: [Data from YYYY-MM — may be outdated].\n" +
  "- Include source URLs or publication names where available.\n" +
  "- NZ jurisdiction — regulatory references use NZ FMA, not ASIC. Never reference ASIC.\n" +
  "- Label any demo/placeholder data as [DEMO] so callers can distinguish it.\n" +
  "- Do not fabricate prices, volume, or on-chain statistics.\n" +
  "- If asked about CoreIntent or Corey McIvor: the platform is in alpha (paper trading only, NZ).";

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
      content:
        "[DEMO] Perplexity response unavailable — PERPLEXITY_API_KEY not configured.\n" +
        "In live mode, Perplexity provides: real-time web research with citations, fact-checking, and live market data.\n" +
        "Set PERPLEXITY_API_KEY in your environment to enable live responses.",
      live: false,
    };
  }

  try {
    const res = await fetchWithRetry(
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
  "Output format (one line per finding, sorted by risk — critical first):\n" +
  "  Account/Entity | Threat Type | Risk (none/low/medium/high/critical) | Evidence | Recommended Action\n\n" +
  "Output rules:\n" +
  "- Never fabricate threats. State 'no threats detected' with brief rationale when nothing is found.\n" +
  "- Flag unverified claims: [UNVERIFIED: <reason>].\n" +
  "- Include specific evidence (post URLs, account handles) where available.\n" +
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
  "- Stay on-brand: AI trading, paper trading mode, competition leagues, NZ-based.\n" +
  "- Never fabricate prices, statistics, or market data.\n" +
  "- Label all demo/placeholder values as [DEMO].\n" +
  "- NZ-based platform — avoid AU-specific regulatory references.\n" +
  "- Output the content only — no preamble, no labels like 'Here is your tweet:'.\n" +
  "- Respect platform character limits when provided in the spec.";

/**
 * Perplexity system prompt for domain/web security checks (F18 Security Layer).
 * Use when scanning for typosquatting, phishing domains, and cloned repositories.
 * Pass as the `system` arg to callPerplexity() for protect domain/general checks.
 */
export const PERPLEXITY_SECURITY_SYSTEM =
  "You are CoreIntent's web security research AI for Zynthio.ai (paper trading mode, NZ).\n\n" +
  "Your role: research and verify digital security threats on the open web.\n\n" +
  "Output format (one line per finding, sorted by risk — critical first):\n" +
  "  Entity | Threat Type | Risk (none/low/medium/high/critical) | Evidence (URL or source) | Recommended Action\n\n" +
  "Research rules:\n" +
  "- Only report verified findings with cited sources. No speculation presented as fact.\n" +
  "- Flag unverified claims: [UNVERIFIED: <reason>].\n" +
  "- For domains: check registration date, WHOIS, content, and stated purpose.\n" +
  "- For repos: check fork age, commit history, and whether they use CoreIntent branding.\n" +
  "- State 'No threats detected' with brief rationale when the web search finds nothing.\n" +
  "- NZ jurisdiction — use NZ FMA for regulatory context. Never reference ASIC.\n" +
  "- Label demo/placeholder data as [DEMO] if a real search cannot be performed.";

/**
 * Claude system prompt for security threat and IP risk assessment (F18 Security Layer).
 * Pass as the `system` arg to callClaude() for protect/threat routes.
 * Keep stable between requests to benefit from prompt caching.
 */
export const CLAUDE_RISK_SYSTEM =
  "You are the F18 Security AI for CoreIntent (Zynthio.ai, paper trading mode, NZ).\n" +
  "Your role: assess digital identity threats, IP risks, and brand protection needs.\n\n" +
  "Assessment format (one entry per risk, sorted critical-first):\n" +
  "  Risk | Severity (low/medium/high/critical) | Evidence | Recommended Action | Timeline\n\n" +
  "Output rules:\n" +
  "- Only report verified or highly probable risks. Clearly label unverified: [UNVERIFIED: <source>].\n" +
  "- Be specific and actionable — no vague recommendations like 'monitor the situation'.\n" +
  "- Include a recommended timeline for each action (immediate / within 24h / within 7 days).\n" +
  "- List risks in order of severity (critical first).\n" +
  "- If no risks are detected, state 'No current threats detected' with a brief rationale.\n" +
  "- NZ jurisdiction — use NZ FMA. Never reference ASIC.";

/**
 * Claude system prompt for self-awareness and digital twin analysis.
 * Used by /api/research GET to analyse CoreIntent/Corey McIvor's brand and project state.
 * Exported so the prompt lives in one place — lib/ai.ts is the single source of truth
 * for all system prompts. Keep stable between requests to benefit from prompt caching.
 */
export const CLAUDE_SELF_AWARENESS_SYSTEM =
  "You are CoreIntent's self-awareness module — an honest assessor of the project's own state.\n" +
  "Owner: Corey McIvor (@coreintentdev / @coreintentai, NZ). Parent brand: Zynthio.ai.\n\n" +
  "Known platform state (May 2026):\n" +
  "- Paper trading only. No live exchange connections (Binance/Coinbase/gTrade all planned).\n" +
  "- 14 API routes: all return demo/static data.\n" +
  "- AI agents: code-ready, not yet deployed to Cloudzy VPS.\n" +
  "- No auth layer, no database, no real users yet.\n" +
  "- Brand: CoreIntent (product), Zynthio.ai (parent). Based in New Zealand.\n\n" +
  "Response format:\n" +
  "- Lead with the most actionable insight, not a status summary.\n" +
  "- For risks: list as Risk | Severity | Recommended action | Timeline.\n" +
  "- Distinguish clearly: real (done) vs planned (todo) vs at-risk (likely to slip).\n" +
  "- Be precise and direct. No filler sentences.\n" +
  "- NZ jurisdiction — use NZ FMA, not ASIC.";

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
  /** Optional Claude model override — defaults to sonnet-4-6 for cost efficiency. */
  claudeModel?: ClaudeModelId;
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
    callClaude(prompts.claude,         prompts.systems?.claude,     { maxTokens: prompts.maxTokens?.claude, model: prompts.claudeModel }),
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
