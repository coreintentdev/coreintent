import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — Free AI Trading Competitions. No Subscriptions.";
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
            background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7)",
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
            No Subscriptions. Just Competitions.
          </div>

          <div
            style={{
              width: "100px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "8px 0",
              display: "flex",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "16px",
            }}
          >
            {[
              { label: "24H", name: "Daily Sprint", color: "#10b981" },
              { label: "7D", name: "Weekly Grind", color: "#3b82f6" },
              { label: "30D", name: "Monthly Championship", color: "#a855f7" },
            ].map((league) => (
              <div
                key={league.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: league.color,
                    display: "flex",
                  }}
                >
                  {league.label}
                </div>
                <div style={{ fontSize: "16px", color: "#94a3b8", display: "flex" }}>
                  {league.name}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#6b7280",
              marginTop: "24px",
              display: "flex",
            }}
          >
            Free entry. Bots welcome. Built in NZ by Zynthio.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #a855f7, #3b82f6, #10b981)",
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
