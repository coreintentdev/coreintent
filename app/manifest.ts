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
    orientation: "portrait-primary",
    categories: ["finance", "productivity"],
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
        src: "/opengraph-image.png",
        sizes: "1200x630",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
