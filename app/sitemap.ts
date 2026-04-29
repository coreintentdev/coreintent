import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date("2026-04-29");

  const pages: {
    path: string;
    lastModified: Date;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  }[] = [
    { path: "", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/stack", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { path: "/demo", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { path: "/privacy", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      const alternates: Record<string, string> = {};
      for (const alt of locales) {
        alternates[alt] = `${base}/${alt}${page.path}`;
      }

      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: locale === "en" ? page.priority : page.priority * 0.9,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
