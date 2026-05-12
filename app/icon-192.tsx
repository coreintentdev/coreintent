import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
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
          borderRadius: "38px",
        }}
      >
        <div
          style={{
            fontSize: "120px",
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
