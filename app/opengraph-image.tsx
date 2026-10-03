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
            gap: "16px",
          }}
        >
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
              fontSize: "28px",
              color: "#e2e8f0",
              display: "flex",
              gap: "8px",
            }}
          >
            Agentic AI Trading Engine
          </div>

          {/* Separator */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "8px 0",
              display: "flex",
            }}
          />

          {/* AI Models */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "8px",
            }}
          >
            <div
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
                  background: "#ef4444",
                  display: "flex",
                }}
              />
              <span style={{ fontSize: "20px", color: "#94a3b8", display: "flex" }}>Grok</span>
            </div>
            <div
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
                  background: "#a855f7",
                  display: "flex",
                }}
              />
              <span style={{ fontSize: "20px", color: "#94a3b8", display: "flex" }}>Claude</span>
            </div>
            <div
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
                  background: "#3b82f6",
                  display: "flex",
                }}
              />
              <span style={{ fontSize: "20px", color: "#94a3b8", display: "flex" }}>Perplexity</span>
            </div>
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              fontSize: "18px",
              color: "#6b7280",
              marginTop: "16px",
              display: "flex",
            }}
          >
            No Subscriptions. Just Competitions. Built in NZ by Zynthio.
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
