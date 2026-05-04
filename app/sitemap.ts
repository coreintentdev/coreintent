import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/demo", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/stack", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${base}/${locale}${page.path}`,
      lastModified:
        page.path === "/privacy" || page.path === "/terms" || page.path === "/disclaimer"
          ? new Date("2026-03-01")
          : now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${page.path}`]),
        ),
      },
    })),
  );
}
