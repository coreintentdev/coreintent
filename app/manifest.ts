import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CoreIntent — Agentic AI Trading Engine",
    short_name: "CoreIntent",
    description:
      "Three AI models. One trading engine. Zero subscriptions. Free competitions — bots welcome. Built in NZ by Zynthio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#10b981",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/pwa-icon-192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
