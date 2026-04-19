"use client";

import { useState, useRef, useEffect, useCallback, Component, type ErrorInfo, type ReactNode } from "react";
import SiteNav from "@/components/SiteNav";

const STUDIO_FETCH_MS = 120_000;

class StudioErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("StudioErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: "var(--text-primary)", background: "var(--bg-primary)", minHeight: "100vh" }}>
          <SiteNav />
          <p style={{ marginTop: 24 }}>Something broke in AI Studio.</p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "var(--text-secondary)" }}>
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type Model = "grok" | "claude" | "perplexity" | "gemini" | "groq" | "deepseek" | "mistral" | "openrouter" | "primary" | "all";

interface AIResult {
  source: string;
  model: string;
  content: string;
  live: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  source?: string;
  live?: boolean;
  elapsed?: number;
  compare?: Record<string, AIResult>;
}

const MODELS: { id: Model; label: string; desc: string; color: string; group: "primary" | "extended" | "compare" }[] = [
  // Primary Orchestra
  { id: "grok", label: "Grok", desc: "Fast signals, X/Twitter", color: "#ef4444", group: "primary" },
  { id: "claude", label: "Claude", desc: "Deep analysis, orchestration", color: "#a855f7", group: "primary" },
  { id: "perplexity", label: "Perplexity", desc: "Research, fact-checking", color: "#3b82f6", group: "primary" },
  { id: "gemini", label: "Gemini", desc: "Code gen, scanning, grounding", color: "#f59e0b", group: "primary" },
  // Extended Fleet (free tiers)
  { id: "groq", label: "Groq", desc: "Fastest inference (LPU)", color: "#06b6d4", group: "extended" },
  { id: "deepseek", label: "DeepSeek", desc: "Cheapest quality LLM", color: "#22d3ee", group: "extended" },
  { id: "mistral", label: "Mistral", desc: "1B tokens/mo free (EU)", color: "#fb923c", group: "extended" },
  { id: "openrouter", label: "OpenRouter", desc: "400+ models, single key", color: "#a3e635", group: "extended" },
  // Compare modes
  { id: "primary", label: "Compare 4", desc: "Grok + Claude + Perplexity + Gemini", color: "#10b981", group: "compare" },
  { id: "all", label: "Compare 8", desc: "All models side-by-side", color: "#10b981", group: "compare" },
];

const ALL_MODEL_KEYS = ["grok", "claude", "perplexity", "gemini", "groq", "deepseek", "mistral", "openrouter"];
const PRIMARY_MODEL_KEYS = ["grok", "claude", "perplexity", "gemini"];

function StudioPageInner() {
  const [model, setModel] = useState<Model>("grok");
  const [input, setInput] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("You are CoreIntent, an AI trading assistant built by Corey McIvor. Be concise and direct.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send() {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let fetchTimer: number | undefined;
    try {
      const isCompare = model === "all" || model === "primary";
      const controller = new AbortController();
      fetchTimer = window.setTimeout(() => controller.abort(), STUDIO_FETCH_MS);
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          system: systemPrompt || undefined,
          compare: isCompare ? (model === "all" ? "all" : "primary") : undefined,
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.mode?.startsWith("compare")) {
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          elapsed: data.elapsed,
          compare: data.results,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.result?.content || data.error || "No response",
          model: data.result?.model,
          source: data.result?.source,
          live: data.result?.live,
          elapsed: data.elapsed,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aborted
          ? `[TIMEOUT] Request exceeded ${STUDIO_FETCH_MS / 1000}s. Try a shorter prompt or a single model.`
          : `[ERROR] ${err instanceof Error ? err.message : "Network error"}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      if (fetchTimer !== undefined) window.clearTimeout(fetchTimer);
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const selectedModel = MODELS.find((m) => m.id === model)!;
  const liveCount = messages.filter((m) => m.live).length;
  const demoCount = messages.filter((m) => m.role === "assistant" && m.live === false && !m.compare).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-primary)" }}>
      <SiteNav />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            borderRight: "1px solid var(--border-color)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--bg-secondary)",
            overflow: "auto",
          }}
        >
          <h2 style={{ fontSize: "16px", margin: 0 }}>AI Studio</h2>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>
            Multi-model playground. Real API calls.
          </p>

          {/* Model selector */}
          <div>
            {(["primary", "extended", "compare"] as const).map((group) => (
              <div key={group}>
                <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "4px", marginTop: group === "primary" ? 0 : "12px" }}>
                  {group === "primary" ? "Orchestra" : group === "extended" ? "Free Fleet" : "Compare"}
                </div>
                {MODELS.filter((m) => m.group === group).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 10px",
                      marginBottom: "3px",
                      borderRadius: "6px",
                      border: model === m.id ? `2px solid ${m.color}` : "1px solid var(--border-color)",
                      background: model === m.id ? m.color + "15" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      color: "var(--text-primary)",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "12px", color: m.color }}>{m.label}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "1px" }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* System prompt */}
          <div>
            <button
              onClick={() => setShowSystem(!showSystem)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "8px 0",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "11px",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              <span>System Prompt</span>
              <span>{showSystem ? "\u25B2" : "\u25BC"}</span>
            </button>
            {showSystem && (
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  resize: "vertical",
                }}
              />
            )}
          </div>

          {/* Stats */}
          <div style={{ marginTop: "auto", fontSize: "11px", color: "var(--text-secondary)" }}>
            <div>{messages.filter((m) => m.role === "user").length} prompts sent</div>
            <div style={{ color: "#10b981" }}>{liveCount} live responses</div>
            {demoCount > 0 && <div style={{ color: "#f59e0b" }}>{demoCount} demo responses</div>}
          </div>

          {/* Clear */}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: "transparent",
                cursor: "pointer",
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontFamily: "inherit",
              }}
            >
              Clear conversation
            </button>
          )}
        </aside>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflow: "auto",
              padding: "24px",
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "120px", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>Z</div>
                <h3 style={{ fontWeight: "normal", marginBottom: "8px" }}>Zynthio AI Studio</h3>
                <p style={{ fontSize: "13px", maxWidth: "440px", margin: "0 auto", lineHeight: 1.5 }}>
                  Select a model and start chatting. &quot;Compare 8&quot; runs all eight models in parallel
                  (Grok, Claude, Perplexity, Gemini, Groq, DeepSeek, Mistral, OpenRouter). &quot;Compare 4&quot; uses
                  the primary orchestra only (Grok, Claude, Perplexity, Gemini).
                </p>
                <div style={{ marginTop: "24px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    "What is CoreIntent?",
                    "Analyze BTC sentiment",
                    "Research Zynthio.ai",
                    "Write a trading strategy",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "16px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-secondary)",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        fontFamily: "inherit",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: "16px",
                  maxWidth: msg.compare ? "100%" : "720px",
                }}
              >
                {/* User message */}
                {msg.role === "user" && (
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      C
                    </div>
                    <div style={{ fontSize: "14px", lineHeight: "1.6", paddingTop: "4px", whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                )}

                {/* Assistant message — single model */}
                {msg.role === "assistant" && !msg.compare && (
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: MODELS.find((m) => m.id === msg.source)?.color || "#10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {(msg.source || "AI").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: MODELS.find((m) => m.id === msg.source)?.color }}>
                          {msg.model || msg.source || "AI"}
                        </span>
                        {msg.live !== undefined && (
                          <span style={{ fontSize: "10px", color: msg.live ? "#10b981" : "#f59e0b" }}>
                            {msg.live ? "LIVE" : "DEMO"}
                          </span>
                        )}
                        {msg.elapsed !== undefined && (
                          <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                            {msg.elapsed}ms
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Assistant message — compare mode */}
                {msg.role === "assistant" && msg.compare && (
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Compare All {msg.elapsed !== undefined && `\u2014 ${msg.elapsed}ms`}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(Object.keys(msg.compare!).length, 4)}, 1fr)`, gap: "8px" }}>
                      {Object.keys(msg.compare!).map((key) => {
                        const r = msg.compare![key];
                        const m = MODELS.find((x) => x.id === key);
                        return (
                          <div
                            key={key}
                            style={{
                              padding: "14px",
                              background: "var(--bg-secondary)",
                              border: `1px solid var(--border-color)`,
                              borderTop: `3px solid ${m?.color || "#64748b"}`,
                              borderRadius: "8px",
                              overflow: "auto",
                              maxHeight: "400px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "bold", fontSize: "13px", color: m?.color || "#64748b" }}>{m?.label || key}</span>
                              <span style={{ fontSize: "10px", color: r.live ? "#10b981" : "#f59e0b" }}>
                                {r.live ? "LIVE" : "DEMO"}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", color: "var(--text-primary)" }}>
                              {r.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: selectedModel.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#fff",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                >
                  {selectedModel.label.charAt(0)}
                </div>
                <span>
                  {model === "all"
                    ? "Querying all 8 models..."
                    : model === "primary"
                      ? "Querying 4 primary models..."
                      : `${selectedModel.label} is thinking...`}
                </span>
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-end",
                maxWidth: "720px",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedModel.label}... (Enter to send, Shift+Enter for newline)`}
                rows={1}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1px solid ${selectedModel.color}40`,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  resize: "none",
                  minHeight: "44px",
                  maxHeight: "120px",
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading || !input.trim() ? "#64748b" : selectedModel.color,
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  minHeight: "44px",
                }}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default function StudioPage() {
  return (
    <StudioErrorBoundary>
      <StudioPageInner />
    </StudioErrorBoundary>
  );
}
