import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CoreIntent — Agentic AI Trading Engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7)",
          }}
        />

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          <span style={{ color: "#10b981", fontSize: "16px", letterSpacing: "1px" }}>
            PAPER TRADING MODE
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#e2e8f0",
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          CoreIntent
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Three AI Models. One Engine. Zero Subscriptions.
        </div>

        {/* AI model badges */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          {[
            { name: "Grok", color: "#ef4444", role: "Signals" },
            { name: "Claude", color: "#a855f7", role: "Analysis" },
            { name: "Perplexity", color: "#3b82f6", role: "Research" },
          ].map((m) => (
            <div
              key={m.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold", color: m.color }}>
                {m.name}
              </span>
              <span style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
                {m.role}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          <span>coreintent.dev</span>
          <span style={{ color: "#1e293b" }}>|</span>
          <span>Zynthio.ai</span>
          <span style={{ color: "#1e293b" }}>|</span>
          <span>Built in New Zealand</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
