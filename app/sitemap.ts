import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date("2026-04-25");

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
