import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent — The Stack: Claude, Grok & Perplexity AI Architecture";
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
            background: "linear-gradient(90deg, #ef4444, #a855f7, #3b82f6, #10b981)",
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
            The Stack
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
              display: "flex",
              gap: "48px",
              marginTop: "24px",
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
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: `2px solid ${model.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: model.color,
                  }}
                >
                  {model.name[0]}
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: model.color, display: "flex" }}>
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
              display: "flex",
              gap: "24px",
              marginTop: "24px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <span style={{ display: "flex" }}>Cloudflare Pro</span>
            <span style={{ color: "#334155", display: "flex" }}>|</span>
            <span style={{ display: "flex" }}>Vercel</span>
            <span style={{ color: "#334155", display: "flex" }}>|</span>
            <span style={{ display: "flex" }}>Next.js 15</span>
            <span style={{ color: "#334155", display: "flex" }}>|</span>
            <span style={{ display: "flex" }}>~$45/mo total</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7, #ef4444)",
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
