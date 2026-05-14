import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — Interactive Demo: Watch 3 AI Models Debate Trades";
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
              fontSize: "72px",
              fontWeight: "bold",
              color: "#10b981",
              letterSpacing: "-2px",
              display: "flex",
            }}
          >
            CoreIntent
          </div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "#e2e8f0",
              display: "flex",
            }}
          >
            Interactive Demo
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              display: "flex",
            }}
          >
            Watch 3 AI models debate trades live
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 16px",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#ef4444", display: "flex" }}>Grok</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 0",
              }}
            >
              <span style={{ fontSize: "20px", color: "#6b7280", display: "flex" }}>vs</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "8px",
                padding: "8px 16px",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#a855f7", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#a855f7", display: "flex" }}>Claude</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 0",
              }}
            >
              <span style={{ fontSize: "20px", color: "#6b7280", display: "flex" }}>vs</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                padding: "8px 16px",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6", display: "flex" }} />
              <span style={{ fontSize: "18px", color: "#3b82f6", display: "flex" }}>Perplexity</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#6b7280",
              marginTop: "12px",
              display: "flex",
            }}
          >
            @coreintentai | Built in NZ by Zynthio.ai
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
