import type { MetadataRoute } from "next";

const locales = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi"];
const base = "https://coreintent.dev";

const pages = [
  { path: "", lastModified: "2026-04-28", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/pricing", lastModified: "2026-04-27", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/stack", lastModified: "2026-04-27", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/demo", lastModified: "2026-04-27", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/privacy", lastModified: "2026-03-01", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", lastModified: "2026-03-01", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/disclaimer", lastModified: "2026-03-01", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${base}/${l}${page.path}`;
      }

      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: new Date(page.lastModified),
        changeFrequency: page.changeFrequency,
        priority: locale === "en" ? page.priority : page.priority * 0.9,
        alternates: { languages },
      });
    }
  }

  return entries;
}
