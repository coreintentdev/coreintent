import type { MetadataRoute } from "next";
import { LOCALES, getHtmlLang } from "@/lib/i18n";

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

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of LOCALES) {
      const languages: Record<string, string> = {};
      for (const loc of LOCALES) {
        languages[getHtmlLang(loc)] = `${base}/${loc}${page.path}`;
      }

      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
