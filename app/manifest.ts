import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "coreintent-trading-engine",
    name: "CoreIntent — Agentic AI Trading Engine",
    short_name: "CoreIntent",
    description:
      "Three AI models. One trading engine. Zero subscriptions. Free competitions — bots welcome. Built in NZ by Zynthio.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#10b981",
    orientation: "any",
    categories: ["finance", "productivity"],
    lang: "en-NZ",
    dir: "ltr",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
