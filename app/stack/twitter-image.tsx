import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — The Stack: Grok, Claude, Perplexity";
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
            The Stack
          </div>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#ef4444", display: "flex" }} />
              <span style={{ fontSize: "22px", color: "#ef4444", fontWeight: "bold", display: "flex" }}>Grok</span>
              <span style={{ fontSize: "14px", color: "#94a3b8", display: "flex" }}>Fast Signals</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#a855f7", display: "flex" }} />
              <span style={{ fontSize: "22px", color: "#a855f7", fontWeight: "bold", display: "flex" }}>Claude</span>
              <span style={{ fontSize: "14px", color: "#94a3b8", display: "flex" }}>Deep Analysis</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#3b82f6", display: "flex" }} />
              <span style={{ fontSize: "22px", color: "#3b82f6", fontWeight: "bold", display: "flex" }}>Perplexity</span>
              <span style={{ fontSize: "14px", color: "#94a3b8", display: "flex" }}>Research</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              marginTop: "8px",
              display: "flex",
            }}
          >
            $45/mo infrastructure
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
