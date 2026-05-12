"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Terminal" },
  { href: "/demo", label: "Demo" },
  { href: "/stack", label: "Stack" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-secondary)",
      }}
    >
      <Link
        href="/"
        aria-label="CoreIntent — Home"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "var(--accent-green)",
          }}
        >
          CoreIntent
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          v0.2.0-alpha | Zynthio.ai
        </span>
      </Link>
      <nav style={{ display: "flex", gap: "4px", alignItems: "center" }} aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontFamily: "inherit",
              textDecoration: "none",
              background:
                pathname === link.href ? "var(--accent-green)" : "transparent",
              color:
                pathname === link.href ? "#000" : "var(--text-secondary)",
            }}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            marginLeft: "8px",
            background: "transparent",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "11px",
            color: "var(--text-secondary)",
            transition: "border-color 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
            e.currentTarget.style.color = "var(--accent-green)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          aria-label="Open command palette"
        >
          <span style={{ fontSize: "10px" }}>&#9889;</span>
          <kbd style={{ fontSize: "9px", padding: "1px 3px", background: "var(--bg-primary)", borderRadius: "3px", border: "1px solid var(--border-color)" }}>
            Ctrl+K
          </kbd>
        </button>
      </nav>
    </header>
  );
}
