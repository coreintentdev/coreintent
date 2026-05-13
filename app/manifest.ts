import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CoreIntent — Agentic AI Trading Engine",
    short_name: "CoreIntent",
    description:
      "Three AI models. One trading engine. Zero subscriptions. AI-powered trading competitions with Claude, Grok & Perplexity. Built in NZ by Zynthio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#10b981",
    orientation: "portrait-primary",
    categories: ["finance", "business"],
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
    ],
  };
}
