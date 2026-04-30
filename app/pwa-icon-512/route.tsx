import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e17",
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
    { width: 512, height: 512 },
  );
}
