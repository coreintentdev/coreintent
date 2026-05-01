import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist on CoreIntent.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "48px 24px",
        textAlign: "center",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: "#10b981",
          marginBottom: "8px",
          letterSpacing: "-2px",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "8px",
          color: "#e2e8f0",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#94a3b8",
          marginBottom: "24px",
          maxWidth: "400px",
        }}
      >
        The page you requested doesn&apos;t exist. It may have been moved or
        deleted.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link
          href="/"
          style={{
            padding: "12px 24px",
            background: "#10b981",
            color: "#000",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Back to Terminal
        </Link>
        <Link
          href="/pricing"
          style={{
            padding: "12px 24px",
            background: "transparent",
            color: "#e2e8f0",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Competitions
        </Link>
      </div>
    </div>
  );
}
