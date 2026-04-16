import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />
      <main
        role="main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: "bold",
            color: "var(--accent-green)",
            marginBottom: "8px",
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "20px",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          Signal Not Found
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            maxWidth: "420px",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Three AI models searched — none found a match.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              padding: "12px 28px",
              background: "var(--accent-green)",
              color: "#000",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            Back to Terminal
          </Link>
          <Link
            href="/demo"
            style={{
              padding: "12px 28px",
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "14px",
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            Try the Demo
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
