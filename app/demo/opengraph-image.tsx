import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent Interactive Demo — Watch AI Models Debate Trades in Real-Time";
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
            Interactive Demo
          </div>
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, #10b981, #a855f7)",
              display: "flex",
              marginTop: "4px",
            }}
          />
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              marginTop: "8px",
              display: "flex",
            }}
          >
            Watch Three AI Models Debate Trades in Real-Time
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                color: "#10b981",
                fontSize: "14px",
                display: "flex",
              }}
            >
              Paper Trading Simulation
            </div>
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                color: "#3b82f6",
                fontSize: "14px",
                display: "flex",
              }}
            >
              Real Architecture
            </div>
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "8px",
                color: "#a855f7",
                fontSize: "14px",
                display: "flex",
              }}
            >
              Free to Try
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginTop: "12px",
              display: "flex",
            }}
          >
            Simulated data for demonstration | coreintent.dev/demo
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
