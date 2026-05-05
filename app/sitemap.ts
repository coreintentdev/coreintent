import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date().toISOString().split("T")[0];

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      images: [`${base}/opengraph-image`],
      alternates: {
        languages: {
          "en-NZ": base,
        },
      },
    },
    {
      url: `${base}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${base}/demo/opengraph-image`],
      alternates: {
        languages: {
          "en-NZ": `${base}/demo`,
        },
      },
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${base}/pricing/opengraph-image`],
      alternates: {
        languages: {
          "en-NZ": `${base}/pricing`,
        },
      },
    },
    {
      url: `${base}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${base}/stack/opengraph-image`],
      alternates: {
        languages: {
          "en-NZ": `${base}/stack`,
        },
      },
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-05-05"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/privacy`,
        },
      },
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-05-05"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/terms`,
        },
      },
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date("2026-05-05"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/disclaimer`,
        },
      },
    },
  ];
}
