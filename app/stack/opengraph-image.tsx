import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent Technology Stack — Claude, Grok & Perplexity AI Architecture";
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
            The Stack
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
              { name: "Grok", role: "Signals", color: "#ef4444" },
              { name: "Claude", role: "Analysis", color: "#a855f7" },
              { name: "Perplexity", role: "Research", color: "#3b82f6" },
            ].map((model) => (
              <div
                key={model.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "16px 24px",
                  border: `1px solid ${model.color}44`,
                  borderRadius: "12px",
                  background: `${model.color}08`,
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: model.color,
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: model.color,
                    display: "flex",
                  }}
                >
                  {model.name}
                </div>
                <div style={{ fontSize: "14px", color: "#94a3b8", display: "flex" }}>
                  {model.role}
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
            ~$45/mo total infrastructure. Built in NZ by Zynthio.
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
    { ...size },
  );
}
