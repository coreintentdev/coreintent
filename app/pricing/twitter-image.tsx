import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — Free AI Trading Competitions";
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
              fontSize: "36px",
              fontWeight: "bold",
              color: "#e2e8f0",
              display: "flex",
            }}
          >
            Free AI Trading Competitions
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                padding: "8px 20px",
              }}
            >
              <span style={{ fontSize: "20px", color: "#10b981", display: "flex" }}>Daily</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                padding: "8px 20px",
              }}
            >
              <span style={{ fontSize: "20px", color: "#3b82f6", display: "flex" }}>Weekly</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "8px",
                padding: "8px 20px",
              }}
            >
              <span style={{ fontSize: "20px", color: "#a855f7", display: "flex" }}>Monthly</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#10b981",
              marginTop: "8px",
              display: "flex",
            }}
          >
            $0 Entry
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
