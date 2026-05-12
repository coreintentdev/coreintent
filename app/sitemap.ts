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
      alternates: {
        languages: {
          "en-NZ": base,
          "x-default": base,
        },
      },
      images: [`${base}/opengraph-image`],
    },
    {
      url: `${base}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "en-NZ": `${base}/demo`,
          "x-default": `${base}/demo`,
        },
      },
      images: [`${base}/demo/opengraph-image`],
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "en-NZ": `${base}/pricing`,
          "x-default": `${base}/pricing`,
        },
      },
      images: [`${base}/pricing/opengraph-image`],
    },
    {
      url: `${base}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "en-NZ": `${base}/stack`,
          "x-default": `${base}/stack`,
        },
      },
      images: [`${base}/stack/opengraph-image`],
    },
    {
      url: `${base}/privacy`,
      lastModified: "2026-05-12",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/privacy`,
          "x-default": `${base}/privacy`,
        },
      },
    },
    {
      url: `${base}/terms`,
      lastModified: "2026-05-12",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/terms`,
          "x-default": `${base}/terms`,
        },
      },
    },
    {
      url: `${base}/disclaimer`,
      lastModified: "2026-05-12",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          "en-NZ": `${base}/disclaimer`,
          "x-default": `${base}/disclaimer`,
        },
      },
    },
  ];
}
