import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — Interactive AI Trading Demo. Watch 3 Models Debate Trades.";
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
            background: "linear-gradient(90deg, #10b981, #f59e0b, #ef4444)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
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
              fontSize: "16px",
              color: "#94a3b8",
              letterSpacing: "3px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            CoreIntent
          </div>

          <div
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#e2e8f0",
              display: "flex",
            }}
          >
            Interactive Demo
          </div>

          <div
            style={{
              width: "100px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "4px 0",
              display: "flex",
            }}
          />

          <div
            style={{
              fontSize: "22px",
              color: "#10b981",
              marginTop: "8px",
              display: "flex",
            }}
          >
            Watch 3 AI Models Debate Trades in Real-Time
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {[
              { label: "SIGNAL", pair: "BTC/USDT", dir: "LONG", conf: "87%", color: "#10b981" },
              { label: "RISK", pair: "ETH/USDT", dir: "HOLD", conf: "65%", color: "#f59e0b" },
              { label: "SIGNAL", pair: "SOL/USDT", dir: "LONG", conf: "91%", color: "#10b981" },
            ].map((signal, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  border: `1px solid ${signal.color}33`,
                  borderRadius: "8px",
                  background: `${signal.color}08`,
                }}
              >
                <div style={{ fontSize: "10px", color: signal.color, textTransform: "uppercase", display: "flex" }}>
                  {signal.label}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#e2e8f0", display: "flex" }}>
                  {signal.pair}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: signal.color, display: "flex" }}>
                  {signal.dir} {signal.conf}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#f59e0b",
                padding: "4px 10px",
                background: "#f59e0b18",
                borderRadius: "4px",
                display: "flex",
              }}
            >
              DEMO DATA
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280", display: "flex" }}>
              Paper trading simulation. Free to explore.
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
            background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)",
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
