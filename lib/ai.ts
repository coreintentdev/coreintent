/**
 * AI Service Layer — Real API calls when keys are set, demo fallback when not.
 * The orchestra: Grok (fast/cheap) → Claude (deep) → Perplexity (research)
 */

interface AIResponse {
  source: string;
  model: string;
  content: string;
  live: boolean;
}

// --- GROK (via X.ai) — Fast, near-free with X Premium+ ---
export async function callGrok(prompt: string): Promise<AIResponse> {
  const key = process.env.GROK_API_KEY;
  if (!key || key === "xai-xxx") {
    return { source: "grok", model: "grok-demo", content: `[DEMO] Grok response for: ${prompt}`, live: false };
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "grok-3",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { source: "grok", model: "grok-3", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: "grok",
    model: data.model || "grok-3",
    content: data.choices?.[0]?.message?.content || "",
    live: true,
  };
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

// --- PERPLEXITY (Max) — Research, fact-checking, 9 connectors ---
export async function callPerplexity(query: string): Promise<AIResponse> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key || key === "pplx-xxx") {
    return { source: "perplexity", model: "perplexity-demo", content: `[DEMO] Perplexity research for: ${query}`, live: false };
  }

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [{ role: "user", content: query }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { source: "perplexity", model: "sonar-pro", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: "perplexity",
    model: data.model || "sonar-pro",
    content: data.choices?.[0]?.message?.content || "",
    live: true,
  };
}

// --- SUNO (Paid API) — Music generation, track management ---
export async function callSuno(prompt: string, style?: string): Promise<AIResponse> {
  const key = process.env.SUNO_API_KEY;
  const baseUrl = process.env.SUNO_API_URL || "https://api.suno.ai";
  if (!key) {
    return { source: "suno", model: "suno-demo", content: `[DEMO] Suno response for: ${prompt}`, live: false };
  }

  const res = await fetch(`${baseUrl}/v1/music`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      prompt,
      style: style || "auto",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { source: "suno", model: "suno-api", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  return {
    source: "suno",
    model: "suno-api",
    content: JSON.stringify(data),
    live: true,
  };
}

// --- ORCHESTRATOR — Send to best AI for the job ---
export async function orchestrate(task: "signal" | "analysis" | "research" | "content" | "music", prompt: string) {
  switch (task) {
    case "signal":
      return callGrok(prompt);       // Fast, cheap
    case "content":
      return callGrok(prompt);       // Draft with Grok
    case "analysis":
      return callClaude(prompt);     // Deep with Claude
    case "research":
      return callPerplexity(prompt); // Facts with Perplexity
    case "music":
      return callSuno(prompt);       // Tracks with Suno
    default:
      return callGrok(prompt);
  }
}
