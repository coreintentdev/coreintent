import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent Interactive Demo — AI Trading Engine Simulation";
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
            background: "linear-gradient(90deg, #f59e0b, #10b981, #3b82f6, #a855f7)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
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
              fontSize: "32px",
              color: "#e2e8f0",
              display: "flex",
              fontWeight: "bold",
            }}
          >
            Interactive Demo
          </div>

          <div
            style={{
              width: "100px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
              margin: "8px 0",
              display: "flex",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "16px",
            }}
          >
            {[
              { label: "Live Prices", icon: "$", color: "#10b981" },
              { label: "AI Debate", icon: "AI", color: "#a855f7" },
              { label: "Order Book", icon: "OB", color: "#3b82f6" },
              { label: "Signals", icon: "S", color: "#ef4444" },
            ].map((feature) => (
              <div
                key={feature.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 20px",
                  border: `1px solid ${feature.color}44`,
                  borderRadius: "12px",
                  background: `${feature.color}08`,
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: feature.color,
                    display: "flex",
                  }}
                >
                  {feature.icon}
                </div>
                <div style={{ fontSize: "14px", color: "#94a3b8", display: "flex" }}>
                  {feature.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "4px 12px",
                background: "#f59e0b22",
                border: "1px solid #f59e0b44",
                borderRadius: "20px",
                fontSize: "14px",
                color: "#f59e0b",
                display: "flex",
              }}
            >
              SIMULATED DATA
            </div>
            <div style={{ fontSize: "16px", color: "#6b7280", display: "flex" }}>
              Real architecture. Free to explore.
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #a855f7, #3b82f6, #10b981, #f59e0b)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
