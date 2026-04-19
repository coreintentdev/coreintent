/**
 * AI Service Layer — 8 models, real API calls, demo fallback.
 *
 * PRIMARY ORCHESTRA:
 *   Grok (fast) → Claude (deep) → Perplexity (research) → Gemini (code/scan)
 *
 * EXTENDED FLEET (free tiers):
 *   Groq (fastest inference) → DeepSeek (cheapest) → Mistral (1B tokens/mo free) → OpenRouter (400+ models)
 */

export interface AIResponse {
  source: string;
  model: string;
  content: string;
  live: boolean;
}

/** Which of the 8 orchestra API keys are configured (never exposes secret values). */
export interface AiKeyStatus {
  grok: boolean;
  claude: boolean;
  perplexity: boolean;
  gemini: boolean;
  groq: boolean;
  deepseek: boolean;
  mistral: boolean;
  openrouter: boolean;
}

export function getAiKeyStatus(): AiKeyStatus {
  const ok = (key: string | undefined, placeholder: string) =>
    Boolean(key && key !== placeholder);
  return {
    grok: ok(process.env.GROK_API_KEY, "xai-xxx"),
    claude: ok(process.env.ANTHROPIC_API_KEY, "sk-ant-xxx"),
    perplexity: ok(process.env.PERPLEXITY_API_KEY, "pplx-xxx"),
    gemini: ok(process.env.GEMINI_API_KEY, "gemini-xxx"),
    groq: ok(process.env.GROQ_API_KEY, "groq-xxx"),
    deepseek: ok(process.env.DEEPSEEK_API_KEY, "deepseek-xxx"),
    mistral: ok(process.env.MISTRAL_API_KEY, "mistral-xxx"),
    openrouter: ok(process.env.OPENROUTER_API_KEY, "openrouter-xxx"),
  };
}

const DEFAULT_COMPAT_TIMEOUT_MS = 30_000;
const CLAUDE_TIMEOUT_MS = 30_000;
const GEMINI_TIMEOUT_MS = 30_000;

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

function classifyFetchError(e: unknown, source: string, model: string): AIResponse {
  if (e instanceof DOMException && e.name === "AbortError") {
    return {
      source,
      model,
      content: `[TIMEOUT] ${source} request exceeded ${DEFAULT_COMPAT_TIMEOUT_MS / 1000}s.`,
      live: false,
    };
  }
  const msg = e instanceof Error ? e.message : String(e);
  return {
    source,
    model,
    content: `[NETWORK ERROR] ${msg}`,
    live: false,
  };
}

// ── Generic OpenAI-compatible caller ──────────────────────────────
async function callOpenAICompatible(opts: {
  source: string;
  baseUrl: string;
  keyEnvVar: string;
  demoKey: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<AIResponse> {
  const key = process.env[opts.keyEnvVar];
  if (!key || key === opts.demoKey) {
    return { source: opts.source, model: `${opts.source}-demo`, content: `[DEMO] ${opts.source} response for: ${opts.prompt}`, live: false };
  }

  const timeoutMs = opts.timeoutMs ?? DEFAULT_COMPAT_TIMEOUT_MS;

  try {
    const res = await fetchWithTimeout(
      `${opts.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: opts.model,
          messages: [{ role: "user", content: opts.prompt }],
          max_tokens: opts.maxTokens || 1024,
        }),
      },
      timeoutMs
    );

    if (!res.ok) {
      const err = await res.text();
      const rate = res.status === 429;
      return {
        source: opts.source,
        model: opts.model,
        content: rate ? `[RATE LIMIT] ${err}` : `[ERROR] ${err}`,
        live: false,
      };
    }

    const data = await res.json();
    return {
      source: opts.source,
      model: data.model || opts.model,
      content: data.choices?.[0]?.message?.content || "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, opts.source, opts.model);
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRIMARY ORCHESTRA (4 models)
// ═══════════════════════════════════════════════════════════════════

// --- GROK (via X.ai) — Fast, near-free with X Premium+ ---
export async function callGrok(prompt: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "grok", baseUrl: "https://api.x.ai/v1",
    keyEnvVar: "GROK_API_KEY", demoKey: "xai-xxx",
    model: "grok-3", prompt, maxTokens: 1000,
  });
}

// --- CLAUDE (Anthropic) — Deep analysis, risk, orchestration ---
export async function callClaude(prompt: string, system?: string): Promise<AIResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === "sk-ant-xxx") {
    return { source: "claude", model: "claude-demo", content: `[DEMO] Claude response for: ${prompt}`, live: false };
  }

  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: system || "You are CoreIntent, an AI trading assistant. Be concise and direct.",
          messages: [{ role: "user", content: prompt }],
        }),
      },
      CLAUDE_TIMEOUT_MS
    );

    if (!res.ok) {
      const err = await res.text();
      return {
        source: "claude",
        model: "claude-sonnet-4-6",
        content: res.status === 429 ? `[RATE LIMIT] ${err}` : `[ERROR] ${err}`,
        live: false,
      };
    }

    const data = await res.json();
    return {
      source: "claude",
      model: data.model || "claude-sonnet-4-6",
      content: data.content?.[0]?.text || "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "claude", "claude-sonnet-4-6");
  }
}

// --- PERPLEXITY — Research, fact-checking ---
export async function callPerplexity(query: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "perplexity", baseUrl: "https://api.perplexity.ai",
    keyEnvVar: "PERPLEXITY_API_KEY", demoKey: "pplx-xxx",
    model: "sonar-pro", prompt: query,
  });
}

// --- GEMINI (Google) — Code generation, scanning, grounding ---
export async function callGemini(prompt: string, system?: string): Promise<AIResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "gemini-xxx") {
    return { source: "gemini", model: "gemini-demo", content: `[DEMO] Gemini response for: ${prompt}`, live: false };
  }

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  try {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
      GEMINI_TIMEOUT_MS
    );

    if (!res.ok) {
      const err = await res.text();
      return {
        source: "gemini",
        model: "gemini-2.0-flash",
        content: res.status === 429 ? `[RATE LIMIT] ${err}` : `[ERROR] ${err}`,
        live: false,
      };
    }

    const data = await res.json();
    return {
      source: "gemini",
      model: data.modelVersion || "gemini-2.0-flash",
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      live: true,
    };
  } catch (e) {
    return classifyFetchError(e, "gemini", "gemini-2.0-flash");
  }
}

// ═══════════════════════════════════════════════════════════════════
// EXTENDED FLEET (4 more — all free tiers, all OpenAI-compatible)
// ═══════════════════════════════════════════════════════════════════

// --- GROQ — Fastest inference engine (LPU hardware) ---
export async function callGroq(prompt: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "groq", baseUrl: "https://api.groq.com/openai/v1",
    keyEnvVar: "GROQ_API_KEY", demoKey: "groq-xxx",
    model: "llama-3.3-70b-versatile", prompt,
  });
}

// --- DEEPSEEK — Cheapest quality LLM ($0.28/M tokens) ---
export async function callDeepSeek(prompt: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "deepseek", baseUrl: "https://api.deepseek.com",
    keyEnvVar: "DEEPSEEK_API_KEY", demoKey: "deepseek-xxx",
    model: "deepseek-chat", prompt, maxTokens: 2048,
  });
}

// --- MISTRAL — 1B tokens/month free (EU-based) ---
export async function callMistral(prompt: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "mistral", baseUrl: "https://api.mistral.ai/v1",
    keyEnvVar: "MISTRAL_API_KEY", demoKey: "mistral-xxx",
    model: "mistral-large-latest", prompt,
  });
}

// --- OPENROUTER — 400+ models via single API key ---
export async function callOpenRouter(prompt: string, model?: string): Promise<AIResponse> {
  return callOpenAICompatible({
    source: "openrouter", baseUrl: "https://openrouter.ai/api/v1",
    keyEnvVar: "OPENROUTER_API_KEY", demoKey: "openrouter-xxx",
    model: model || "meta-llama/llama-3.3-70b-instruct:free", prompt,
  });
}

// ═══════════════════════════════════════════════════════════════════
// ORCHESTRATOR & COMPARE
// ═══════════════════════════════════════════════════════════════════

export type OrchestratorTask = "signal" | "analysis" | "research" | "content" | "code" | "scan" | "fast" | "cheap" | "bulk";

export async function orchestrate(task: OrchestratorTask, prompt: string) {
  switch (task) {
    case "signal":   return callGrok(prompt);
    case "fast":     return callGroq(prompt);       // Fastest inference
    case "content":  return callGrok(prompt);
    case "analysis": return callClaude(prompt);
    case "research": return callPerplexity(prompt);
    case "code":     return callGemini(prompt);
    case "scan":     return callGemini(prompt);
    case "cheap":    return callDeepSeek(prompt);    // Cheapest quality
    case "bulk":     return callMistral(prompt);     // 1B free tokens
    default:         return callGroq(prompt);        // Default to fastest
  }
}

const MODEL_CALL_TIMEOUT_MS = 30_000;

/** Caps wall-clock wait per model when running parallel compares (fetch timeouts still apply first). */
export function raceAiResponse(
  p: Promise<AIResponse>,
  meta: { source: string; model: string }
): Promise<AIResponse> {
  return Promise.race([
    p,
    new Promise<AIResponse>((resolve) =>
      setTimeout(
        () =>
          resolve({
            source: meta.source,
            model: meta.model,
            content: `[TIMEOUT] ${meta.source} exceeded ${MODEL_CALL_TIMEOUT_MS / 1000}s.`,
            live: false,
          }),
        MODEL_CALL_TIMEOUT_MS
      )
    ),
  ]);
}

// Fire all 8 models in parallel
export async function compareAll(prompt: string, system?: string) {
  const results = await Promise.allSettled([
    raceAiResponse(callGrok(prompt), { source: "grok", model: "grok-3" }),
    raceAiResponse(callClaude(prompt, system), { source: "claude", model: "claude-sonnet-4-6" }),
    raceAiResponse(callPerplexity(prompt), { source: "perplexity", model: "sonar-pro" }),
    raceAiResponse(callGemini(prompt, system), { source: "gemini", model: "gemini-2.0-flash" }),
    raceAiResponse(callGroq(prompt), { source: "groq", model: "llama-3.3-70b-versatile" }),
    raceAiResponse(callDeepSeek(prompt), { source: "deepseek", model: "deepseek-chat" }),
    raceAiResponse(callMistral(prompt), { source: "mistral", model: "mistral-large-latest" }),
    raceAiResponse(callOpenRouter(prompt), {
      source: "openrouter",
      model: "meta-llama/llama-3.3-70b-instruct:free",
    }),
  ]);

  const names = ["grok", "claude", "perplexity", "gemini", "groq", "deepseek", "mistral", "openrouter"] as const;
  const defaults = ["grok-3", "claude-sonnet-4-6", "sonar-pro", "gemini-2.0-flash", "llama-3.3-70b-versatile", "deepseek-chat", "mistral-large-latest", "llama-3.3-70b-instruct:free"];

  const out: Record<string, AIResponse> = {};
  names.forEach((name, i) => {
    const r = results[i];
    out[name] = r.status === "fulfilled"
      ? r.value
      : { source: name, model: defaults[i], content: `[ERROR] ${(r as PromiseRejectedResult).reason}`, live: false };
  });
  return out;
}

// Fire only primary 4 (for lighter compare)
export async function comparePrimary(prompt: string, system?: string) {
  const results = await Promise.allSettled([
    raceAiResponse(callGrok(prompt), { source: "grok", model: "grok-3" }),
    raceAiResponse(callClaude(prompt, system), { source: "claude", model: "claude-sonnet-4-6" }),
    raceAiResponse(callPerplexity(prompt), { source: "perplexity", model: "sonar-pro" }),
    raceAiResponse(callGemini(prompt, system), { source: "gemini", model: "gemini-2.0-flash" }),
  ]);

  const names = ["grok", "claude", "perplexity", "gemini"] as const;
  const defaults = ["grok-3", "claude-sonnet-4-6", "sonar-pro", "gemini-2.0-flash"];

  const out: Record<string, AIResponse> = {};
  names.forEach((name, i) => {
    const r = results[i];
    out[name] = r.status === "fulfilled"
      ? r.value
      : { source: name, model: defaults[i], content: `[ERROR] ${(r as PromiseRejectedResult).reason}`, live: false };
  });
  return out;
}
