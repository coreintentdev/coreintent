/**
 * AI Service Layer — Real API calls when keys are set, demo fallback when not.
 * The orchestra: Grok (fast) → Claude (deep) → Perplexity (research) → Gemini (code/scan)
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

// --- PERPLEXITY — Research, fact-checking ---
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

// --- GEMINI (Google) — Code generation, scanning, grounding ---
export async function callGemini(prompt: string, system?: string): Promise<AIResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "gemini-xxx") {
    return { source: "gemini", model: "gemini-demo", content: `[DEMO] Gemini response for: ${prompt}`, live: false };
  }

  const contents: { role: string; parts: { text: string }[] }[] = [];

  // Gemini uses systemInstruction separately
  const body: Record<string, unknown> = {
    contents: [
      { role: "user", parts: [{ text: prompt }] },
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  };

  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return { source: "gemini", model: "gemini-2.0-flash", content: `[ERROR] ${err}`, live: false };
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return {
    source: "gemini",
    model: data.modelVersion || "gemini-2.0-flash",
    content: text,
    live: true,
  };
}

// --- ORCHESTRATOR — Send to best AI for the job ---
export async function orchestrate(
  task: "signal" | "analysis" | "research" | "content" | "code" | "scan",
  prompt: string
) {
  switch (task) {
    case "signal":
      return callGrok(prompt);       // Fast, cheap
    case "content":
      return callGrok(prompt);       // Draft with Grok
    case "analysis":
      return callClaude(prompt);     // Deep with Claude
    case "research":
      return callPerplexity(prompt); // Facts with Perplexity
    case "code":
      return callGemini(prompt);     // Code gen with Gemini
    case "scan":
      return callGemini(prompt);     // File/Drive scanning
    default:
      return callGrok(prompt);
  }
}

// --- COMPARE ALL — Fire all 4 models in parallel ---
export async function compareAll(prompt: string, system?: string) {
  const [grok, claude, perplexity, gemini] = await Promise.allSettled([
    callGrok(prompt),
    callClaude(prompt, system),
    callPerplexity(prompt),
    callGemini(prompt, system),
  ]);

  return {
    grok: grok.status === "fulfilled" ? grok.value : { source: "grok", model: "grok-3", content: `[ERROR] ${(grok as PromiseRejectedResult).reason}`, live: false },
    claude: claude.status === "fulfilled" ? claude.value : { source: "claude", model: "claude-sonnet-4-6", content: `[ERROR] ${(claude as PromiseRejectedResult).reason}`, live: false },
    perplexity: perplexity.status === "fulfilled" ? perplexity.value : { source: "perplexity", model: "sonar-pro", content: `[ERROR] ${(perplexity as PromiseRejectedResult).reason}`, live: false },
    gemini: gemini.status === "fulfilled" ? gemini.value : { source: "gemini", model: "gemini-2.0-flash", content: `[ERROR] ${(gemini as PromiseRejectedResult).reason}`, live: false },
  };
}
