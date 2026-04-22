import type { MetadataRoute } from "next";
import { i18nConfig } from "@/lib/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date("2026-04-22");

  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/stack", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of i18nConfig.locales) {
    for (const page of pages) {
      const alternates: Record<string, string> = {};
      for (const altLocale of i18nConfig.locales) {
        alternates[altLocale] = `${base}/${altLocale}${page.path}`;
      }
      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
