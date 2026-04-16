import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 100%)",
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "#10b981",
            lineHeight: 1,
          }}
        >
          CI
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#94a3b8",
            letterSpacing: 2,
          }}
        >
          COREINTENT
        </span>
      </div>
    ),
    { ...size }
  );
}
