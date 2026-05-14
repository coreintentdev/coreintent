import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";

  return [
    {
      url: base,
      lastModified: "2026-05-14",
      changeFrequency: "weekly",
      priority: 1,
      images: [`${base}/opengraph-image`],
    },
    {
      url: `${base}/demo`,
      lastModified: "2026-05-14",
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${base}/demo/opengraph-image`],
    },
    {
      url: `${base}/pricing`,
      lastModified: "2026-05-14",
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${base}/pricing/opengraph-image`],
    },
    {
      url: `${base}/stack`,
      lastModified: "2026-05-14",
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${base}/stack/opengraph-image`],
    },
    {
      url: `${base}/privacy`,
      lastModified: "2026-05-14",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: "2026-05-14",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: "2026-05-14",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
