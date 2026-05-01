import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — Agentic AI Trading Engine powered by Claude, Grok & Perplexity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7, #ef4444)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "20px",
              fontSize: "14px",
              color: "#10b981",
              letterSpacing: "1px",
              textTransform: "uppercase" as const,
            }}
          >
            Paper Trading Mode
          </div>

          {/* Logo text */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#10b981",
              letterSpacing: "-2px",
              display: "flex",
            }}
          >
            CoreIntent
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "26px",
              color: "#e2e8f0",
              display: "flex",
              gap: "8px",
            }}
          >
            Three AI Models. One Engine. Zero Subscriptions.
          </div>

          {/* Separator */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "4px 0",
              display: "flex",
            }}
          />

          {/* AI Models row */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "4px",
            }}
          >
            {[
              { name: "Grok", role: "Signal Detection", color: "#ef4444" },
              { name: "Claude", role: "Deep Analysis", color: "#a855f7" },
              { name: "Perplexity", role: "Live Research", color: "#3b82f6" },
            ].map((m) => (
              <div
                key={m.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: m.color,
                    display: "flex",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "18px", color: m.color, fontWeight: "bold", display: "flex" }}>{m.name}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280", display: "flex" }}>{m.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "16px",
            }}
          >
            {[
              { value: "$0", label: "Entry Fee", color: "#10b981" },
              { value: "3", label: "AI Models", color: "#a855f7" },
              { value: "6", label: "Trading Agents", color: "#3b82f6" },
              { value: "96%", label: "Audit Score", color: "#f59e0b" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "28px", fontWeight: "bold", color: s.color, display: "flex" }}>
                  {s.value}
                </span>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", display: "flex" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              fontSize: "16px",
              color: "#6b7280",
              marginTop: "12px",
              display: "flex",
            }}
          >
            Free Competitions. Bots Welcome. Built in NZ by Zynthio.
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #ef4444, #a855f7, #3b82f6, #10b981)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
