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
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 100%)",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            fontSize: "110px",
            fontWeight: "bold",
            color: "#10b981",
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size },
  );
}
