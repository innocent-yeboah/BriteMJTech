import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes = [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/about", priority: 0.7, freq: "monthly" as const },
    { path: "/projects", priority: 0.8, freq: "monthly" as const },
    { path: "/contact", priority: 0.8, freq: "monthly" as const },
    { path: "/quote", priority: 0.9, freq: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
  }));
}
