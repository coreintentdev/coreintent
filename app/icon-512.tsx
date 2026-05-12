import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
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
          borderRadius: "102px",
        }}
      >
        <div
          style={{
            fontSize: "320px",
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
