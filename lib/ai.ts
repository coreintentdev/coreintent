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

// ── Generic OpenAI-compatible caller ──────────────────────────────
async function callOpenAICompatible(opts: {
  source: string;
  baseUrl: string;
  keyEnvVar: string;
  demoKey: string;
  model: string;
  prompt: string;
  maxTokens?: number;
}): Promise<AIResponse> {
  const key = process.env[opts.keyEnvVar];
  if (!key || key === opts.demoKey) {
    return { source: opts.source, model: `${opts.source}-demo`, content: `[DEMO] ${opts.source} response for: ${opts.prompt}`, live: false };
  }

  const res = await fetch(`${opts.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: opts.model,
      messages: [{ role: "user", content: opts.prompt }],
      max_tokens: opts.maxTokens || 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { source: opts.source, model: opts.model, content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: opts.source,
    model: data.model || opts.model,
    content: data.choices?.[0]?.message?.content || "",
    live: true,
  };
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

  const res = await fetch("https://api.anthropic.com/v1/messages", {
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
  });

  if (!res.ok) {
    const err = await res.text();
    return { source: "claude", model: "claude-sonnet-4-6", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: "claude",
    model: data.model || "claude-sonnet-4-6",
    content: data.content?.[0]?.text || "",
    live: true,
  };
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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const err = await res.text();
    return { source: "gemini", model: "gemini-2.0-flash", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: "gemini",
    model: data.modelVersion || "gemini-2.0-flash",
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    live: true,
  };
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

// Fire all 8 models in parallel
export async function compareAll(prompt: string, system?: string) {
  const results = await Promise.allSettled([
    callGrok(prompt),
    callClaude(prompt, system),
    callPerplexity(prompt),
    callGemini(prompt, system),
    callGroq(prompt),
    callDeepSeek(prompt),
    callMistral(prompt),
    callOpenRouter(prompt),
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
    callGrok(prompt),
    callClaude(prompt, system),
    callPerplexity(prompt),
    callGemini(prompt, system),
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
