import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)",
          borderRadius: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              fontSize: "90px",
              fontWeight: "bold",
              color: "#10b981",
              fontFamily: "monospace",
              lineHeight: 1,
              display: "flex",
            }}
          >
            CI
          </div>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7)",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
