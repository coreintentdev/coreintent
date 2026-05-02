import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  const alternates = (path: string) => ({
    languages: {
      "en-NZ": `${base}${path}`,
      "x-default": `${base}${path}`,
    },
  });

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: alternates(""),
    },
    {
      url: `${base}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alternates("/demo"),
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: alternates("/pricing"),
    },
    {
      url: `${base}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("/stack"),
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternates("/privacy"),
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternates("/terms"),
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternates("/disclaimer"),
    },
  ];
}
