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
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 100%)",
          borderRadius: "102px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "220px",
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
              width: "160px",
              height: "6px",
              background: "linear-gradient(90deg, #ef4444, #a855f7, #3b82f6)",
              borderRadius: "3px",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
