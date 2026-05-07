import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";

  return [
    {
      url: base,
      lastModified: "2026-05-07",
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { "en-NZ": base } },
      images: [`${base}/opengraph-image`],
    },
    {
      url: `${base}/demo`,
      lastModified: "2026-05-07",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: { "en-NZ": `${base}/demo` } },
      images: [`${base}/demo/opengraph-image`],
    },
    {
      url: `${base}/pricing`,
      lastModified: "2026-05-07",
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { "en-NZ": `${base}/pricing` } },
      images: [`${base}/pricing/opengraph-image`],
    },
    {
      url: `${base}/stack`,
      lastModified: "2026-05-07",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: { "en-NZ": `${base}/stack` } },
      images: [`${base}/stack/opengraph-image`],
    },
    {
      url: `${base}/privacy`,
      lastModified: "2026-05-07",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: { "en-NZ": `${base}/privacy` } },
    },
    {
      url: `${base}/terms`,
      lastModified: "2026-05-07",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: { "en-NZ": `${base}/terms` } },
    },
    {
      url: `${base}/disclaimer`,
      lastModified: "2026-05-07",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: { "en-NZ": `${base}/disclaimer` } },
    },
  ];
}
