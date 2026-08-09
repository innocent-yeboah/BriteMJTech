import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const defaultOgImage = {
  url: "/images/og/default.jpg",
  width: 1200,
  height: 630,
  alt: "Brite MJ Technologies technicians installing security systems in Accra",
};

export const defaultKeywords = [
  "CCTV installation Accra",
  "security systems Accra",
  "electric fencing Ghana",
  "security fencing Accra",
  "video intercom Ghana",
  "remote gate control Accra",
  "networking installation Accra",
  "smart security systems Ghana",
  "Brite MJ Technologies",
  "Spintex security company",
  "free site inspection Accra",
] as const;

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

/**
 * Shared metadata factory so every public page gets consistent
 * canonical, Open Graph, and Twitter tags for Accra search visibility.
 */
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const ogImage = image
    ? {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }
    : defaultOgImage;

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_GH",
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const publicRoutes = [
  {
    path: "/",
    title: "Smart Security Systems for Home and Business",
    description:
      "CCTV, fencing, networking, and smart access systems for homes and businesses in Accra. Free site inspection. No pressure — just expert advice.",
    priority: 1,
    changeFrequency: "weekly" as const,
    image: "/images/og/default.jpg",
  },
  {
    path: "/services",
    title: "Security Services in Accra",
    description:
      "Professional CCTV installation, security and electric fencing, networking, remote gate control, video intercom, and smart security systems across Accra, Ghana.",
    priority: 0.95,
    changeFrequency: "weekly" as const,
    image: "/images/hero/cctv-install.png",
  },
  {
    path: "/products",
    title: "Security Products for Installation in Accra",
    description:
      "Cameras, NVRs, electric fencing, networking gear, gate motors, video intercoms, and smart access products used in Brite MJ Technologies installations across Accra.",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    image: "/images/cctv/nvr-system.png",
  },
  {
    path: "/projects",
    title: "Security Projects Across Accra",
    description:
      "Completed residential, commercial, and institutional security projects by Brite MJ Technologies — CCTV, fencing, access control, and smart systems.",
    priority: 0.85,
    changeFrequency: "weekly" as const,
    image: "/images/projects/gated-residence.jpg",
  },
  {
    path: "/about",
    title: "About Brite MJ Technologies",
    description:
      "Learn about Brite MJ Technologies — a trusted security and smart systems company based at Spintex, Accra, protecting homes, businesses, and institutions.",
    priority: 0.75,
    changeFrequency: "monthly" as const,
    image: "/images/hero/team-install.png",
  },
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Contact Brite MJ Technologies in Accra for a free site inspection, security advice, or support. Call, WhatsApp, or send a message today.",
    priority: 0.9,
    changeFrequency: "monthly" as const,
    image: "/images/og/default.jpg",
  },
  {
    path: "/quote",
    title: "Get a Free Security Quote",
    description:
      "Request a free, no-obligation security quote from Brite MJ Technologies. Tell us about your property and we will recommend the right system.",
    priority: 0.95,
    changeFrequency: "monthly" as const,
    image: "/images/og/default.jpg",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "How Brite MJ Technologies collects, uses, stores, and protects personal information from website visitors and customers.",
    priority: 0.3,
    changeFrequency: "yearly" as const,
    image: "/images/og/default.jpg",
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description:
      "Terms governing use of the Brite MJ Technologies website and related service enquiries.",
    priority: 0.3,
    changeFrequency: "yearly" as const,
    image: "/images/og/default.jpg",
  },
] as const;
