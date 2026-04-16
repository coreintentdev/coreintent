import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: "/api/",
      },
      // AI crawlers — welcome (bots are first-class citizens)
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: "/api/",
      },
      // Block bad actors
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
    ],
    sitemap: "https://coreintent.dev/sitemap.xml",
  };
}
