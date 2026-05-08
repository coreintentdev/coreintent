import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1, images: [`${base}/opengraph-image`] },
    { path: "/demo", changeFrequency: "weekly" as const, priority: 0.8, images: [`${base}/demo/opengraph-image`] },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8, images: [`${base}/pricing/opengraph-image`] },
    { path: "/stack", changeFrequency: "monthly" as const, priority: 0.7, images: [`${base}/stack/opengraph-image`] },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = `${base}/${l}${page.path}`;
      }

      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        ...(page.images ? { images: page.images } : {}),
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
