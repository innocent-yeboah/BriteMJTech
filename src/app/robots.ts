import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Crawl rules for search engines — index the public site, keep
 * admin, auth, and thank-you flows out of search results.
 */
export default function robots(): MetadataRoute.Robots {
  const base = (siteConfig.url || "https://britemjtechnologies.com").replace(
    /\/$/,
    "",
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/auth",
          "/auth/",
          "/api/",
          "/quote/thank-you",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
