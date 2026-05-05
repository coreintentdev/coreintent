import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${base}/opengraph-image`],
    },
    {
      url: `${base}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${base}/demo/opengraph-image`],
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${base}/pricing/opengraph-image`],
    },
    {
      url: `${base}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${base}/stack/opengraph-image`],
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-05-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-05-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date("2026-05-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
