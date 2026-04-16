/**
 * AI Service Layer — CoreIntent's three-model orchestra.
 *
 * Real API calls when env keys are present; honest demo fallback when not.
 * Every function catches network errors and returns a safe fallback — never throws.
 *
 * Cost guide:
 *   Grok      — near-free with X Premium+ subscription
 *   Claude    — ~$0.01/request (sonnet-4-6)
 *   Perplexity — $20/mo flat (sonar-pro, unlimited)
 *
 * Routing strategy:
 *   signal/content → Grok   (fast, cheap)
 *   analysis       → Claude  (deep reasoning)
 *   research       → Perplexity (live web facts)
 */

export interface AIResponse {
  source: "grok" | "claude" | "perplexity";
  model: string;
  content: string;
  /** true = live API call succeeded; false = demo or error fallback */
  live: boolean;
}

/** Returns true when the key is missing or is a known placeholder value. */
function isDemoKey(key: string | undefined, placeholder: string): boolean {
  return !key || key === placeholder;
}

// ---------------------------------------------------------------------------
// GROK — via X.ai — Fast signals, near-free with X Premium+
// ---------------------------------------------------------------------------

const GROK_SYSTEM =
  "You are a CoreIntent trading signal AI. Be concise, data-driven, and direct. " +
  "Flag uncertainty clearly. Never fabricate prices, statistics, or market data.";

export async function callGrok(prompt: string): Promise<AIResponse> {
  const key = process.env.GROK_API_KEY;
  if (isDemoKey(key, "xai-xxx")) {
    return { source: "grok", model: "grok-demo", content: `[DEMO] Grok: ${prompt}`, live: false };
  }

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "grok-3",
        messages: [
          { role: "system", content: GROK_SYSTEM },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { source: "grok", model: "grok-3", content: `[API ERROR ${res.status}] ${text}`, live: false };
    }

    const data = await res.json();
    return {
      source: "grok",
      model: data.model ?? "grok-3",
      content: data.choices?.[0]?.message?.content ?? "",
      live: true,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { source: "grok", model: "grok-3", content: `[NETWORK ERROR] ${msg}`, live: false };
  }
}

// ---------------------------------------------------------------------------
// CLAUDE — Anthropic — Deep analysis, risk assessment, orchestration
// ---------------------------------------------------------------------------

const CLAUDE_DEFAULT_SYSTEM =
  "You are CoreIntent, an agentic AI trading assistant for Zynthio.ai. " +
  "Be precise, honest, and concise. Acknowledge uncertainty. Never fabricate data.";

export async function callClaude(prompt: string, system?: string): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (isDemoKey(key, "sk-ant-xxx")) {
    return { source: "claude", model: "claude-demo", content: `[DEMO] Claude: ${prompt}`, live: false };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: system ?? CLAUDE_DEFAULT_SYSTEM,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { source: "claude", model: "claude-sonnet-4-6", content: `[API ERROR ${res.status}] ${text}`, live: false };
    }

    const data = await res.json();
    return {
      source: "claude",
      model: data.model ?? "claude-sonnet-4-6",
      content: data.content?.[0]?.text ?? "",
      live: true,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { source: "claude", model: "claude-sonnet-4-6", content: `[NETWORK ERROR] ${msg}`, live: false };
  }
}

// ---------------------------------------------------------------------------
// PERPLEXITY — Research, fact-checking, 9 connectors, $20/mo flat
// ---------------------------------------------------------------------------

export async function callPerplexity(query: string): Promise<AIResponse> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (isDemoKey(key, "pplx-xxx")) {
    return { source: "perplexity", model: "perplexity-demo", content: `[DEMO] Perplexity: ${query}`, live: false };
  }

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: query }],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { source: "perplexity", model: "sonar-pro", content: `[API ERROR ${res.status}] ${text}`, live: false };
    }

    const data = await res.json();
    return {
      source: "perplexity",
      model: data.model ?? "sonar-pro",
      content: data.choices?.[0]?.message?.content ?? "",
      live: true,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { source: "perplexity", model: "sonar-pro", content: `[NETWORK ERROR] ${msg}`, live: false };
  }
}

// ---------------------------------------------------------------------------
// ORCHESTRATOR — Route each task type to the best-fit model
// ---------------------------------------------------------------------------

export type OrchestrateTask = "signal" | "analysis" | "research" | "content";

/**
 * Route a task to the most appropriate AI:
 * - signal/content → Grok   (fast, cheap, good enough for drafts)
 * - analysis       → Claude  (deep reasoning, risk, long context)
 * - research       → Perplexity (live web search, citations)
 */
export async function orchestrate(task: OrchestrateTask, prompt: string): Promise<AIResponse> {
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
