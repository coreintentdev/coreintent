import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        background: "var(--bg-secondary)",
        padding: "24px",
        fontSize: "12px",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: "bold",
              color: "var(--accent-green)",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            CoreIntent
          </div>
          <div>Agentic AI Trading Engine</div>
          <div style={{ marginTop: "4px" }}>
            Built by Corey McIvor | Zynthio.ai
          </div>
        </div>

        <nav
          style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
          aria-label="Footer navigation"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Product
            </span>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Terminal
            </Link>
            <Link href="/stack" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Stack
            </Link>
            <Link href="/pricing" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Pricing
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Legal
            </span>
            <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Terms of Service
            </Link>
            <Link href="/disclaimer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Disclaimer
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
              Connect
            </span>
            <a
              href="https://github.com/coreintentdev"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              GitHub
            </a>
            <a
              href="mailto:corey@coreyai.ai"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Contact
            </a>
          </div>
        </nav>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "16px auto 0",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>&copy; {new Date().getFullYear()} Corey McIvor. All rights reserved.</span>
        <span>
          Trading cryptocurrency involves significant risk. Past performance does
          not guarantee future results. Paper trading mode.
        </span>
      </div>
    </footer>
  );
}
