import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CoreIntent Privacy Policy — NZ Privacy Act 2020 Compliant";
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
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#10b981", display: "flex" }}>
            CoreIntent
          </div>
          <div style={{ fontSize: "36px", color: "#e2e8f0", display: "flex" }}>
            Privacy Policy
          </div>
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "8px 0",
              display: "flex",
            }}
          />
          <div style={{ fontSize: "20px", color: "#6b7280", display: "flex" }}>
            NZ Privacy Act 2020 Compliant — Operated under New Zealand law
          </div>
          <div style={{ fontSize: "16px", color: "#4b5563", display: "flex", marginTop: "8px" }}>
            Built by Corey McIvor / Zynthio
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
    { ...size },
  );
}
