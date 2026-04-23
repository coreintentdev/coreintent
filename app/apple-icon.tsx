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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 100%)",
          borderRadius: "32px",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "#10b981",
            fontFamily: "monospace",
            display: "flex",
            letterSpacing: "-2px",
          }}
        >
          CI
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            fontFamily: "monospace",
            display: "flex",
            marginTop: "-4px",
          }}
        >
          CoreIntent
        </div>
      </div>
    ),
    { ...size },
  );
}
