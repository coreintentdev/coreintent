import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent Technology Stack — Claude, Grok & Perplexity AI Orchestration";
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#10b981",
              letterSpacing: "-1px",
              display: "flex",
            }}
          >
            CoreIntent
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#e2e8f0",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            The Stack
          </div>
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, #10b981, #3b82f6)",
              display: "flex",
              marginTop: "4px",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#ef4444", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#ef4444", fontWeight: "bold", display: "flex" }}>Grok</span>
              <span style={{ fontSize: "13px", color: "#94a3b8", display: "flex" }}>Fast Signals</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#a855f7", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#a855f7", fontWeight: "bold", display: "flex" }}>Claude</span>
              <span style={{ fontSize: "13px", color: "#94a3b8", display: "flex" }}>Deep Analysis</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#3b82f6", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#3b82f6", fontWeight: "bold", display: "flex" }}>Perplexity</span>
              <span style={{ fontSize: "13px", color: "#94a3b8", display: "flex" }}>Research</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#6b7280",
              marginTop: "16px",
              display: "flex",
            }}
          >
            Multi-AI Orchestration | Cloudflare + Vercel + VPS | Built in NZ by Zynthio
          </div>
        </div>

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
