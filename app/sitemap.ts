import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coreintent.dev";
  const now = new Date("2026-04-16");

  const pages: {
    path: string;
    lastModified: Date;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  }[] = [
    { path: "", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/stack", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return pages.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "en-NZ": `${base}${path}`,
      },
    },
  }));
}
