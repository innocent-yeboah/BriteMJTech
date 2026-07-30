import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * PWA-style web app manifest for install prompts and brand consistency.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0A2540",
    lang: "en-GH",
    categories: ["business", "security"],
    icons: [
      {
        src: "/images/logo/mj-mark.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo/mj-mark.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
