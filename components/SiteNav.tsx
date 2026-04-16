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
          v0.1.0-alpha | Zynthio.ai
        </span>
      </Link>
      <nav style={{ display: "flex", gap: "4px" }} aria-label="Main navigation">
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
      </nav>
    </header>
  );
}
