import type { MetadataRoute } from "next";
import { services } from "@/lib/data";

/**
 * Public marketing sitemap.
 *
 * Kept deliberately simple and static-safe: no DB calls, no secrets, no
 * force-static/revalidate edge cases that have caused production 500s.
 * Canonical host comes from NEXT_PUBLIC_SITE_URL with a hard fallback.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://britemjtechnologies.com"
  ).replace(/\/$/, "");

  const lastModified = new Date("2026-09-06T00:00:00.000Z");

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/quote`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticEntries, ...serviceEntries];
}
