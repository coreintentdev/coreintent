import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1, images: [`${base}/opengraph-image`] },
    { path: "/demo", changeFrequency: "weekly" as const, priority: 0.8, images: [`${base}/demo/opengraph-image`] },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8, images: [`${base}/pricing/opengraph-image`] },
    { path: "/stack", changeFrequency: "monthly" as const, priority: 0.7, images: [`${base}/stack/opengraph-image`] },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3, images: undefined },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3, images: undefined },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3, images: undefined },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    entries.push({
      url: `${base}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.images ? { images: page.images } : {}),
    });

    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${base}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority * 0.9,
        ...(page.images ? { images: page.images } : {}),
      });
    }
  }

  return entries;
}
