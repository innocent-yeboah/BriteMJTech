import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { publicRoutes } from "@/lib/seo";

/** Keep sitemap stable and crawlable for Google Search Console. */
export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * XML sitemap for Google / Bing — public marketing pages only.
 * Admin, auth, and API routes are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (siteConfig.url || "https://britemjtechnologies.com").replace(
    /\/$/,
    "",
  );
  const now = new Date();

  return publicRoutes.map((route) => {
    const path = route.path === "/" ? "" : route.path;
    return {
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}
