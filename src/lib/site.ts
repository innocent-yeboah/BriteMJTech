/**
 * Central site configuration for Brite MJ Technologies.
 * Company facts, navigation, and contact channels live here so they can be
 * referenced consistently across pages, metadata, and structured data.
 */

const rawWhatsApp =
  process.env.NEXT_PUBLIC_COMPANY_WHATSAPP?.replace(/\D/g, "") || "233546847109";

export const siteConfig = {
  name: "Brite MJ Technologies",
  shortName: "Brite MJ",
  tagline: "Smart Solutions. Stronger Security. Better Connections.",
  description:
    "Brite MJ Technologies designs and installs advanced CCTV surveillance, security fencing, networking, and smart access systems for homes, businesses, and institutions across Accra, Ghana.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://britemjtech.com",
  address: {
    street: "Spintex — Shell Signboard",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    full: "Spintex-Shell Signboard, Accra, Ghana",
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "0203412477",
    phoneAlt: process.env.NEXT_PUBLIC_COMPANY_PHONE_ALT || "0546847109",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "britemjtechnology@gmail.com",
    whatsapp: rawWhatsApp,
  },
  hours: [
    { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { day: "Saturday", time: "9:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Emergency only" },
  ],
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61589157173544",
    instagram: "https://www.instagram.com/britemjtech/",
    tiktok: "https://www.tiktok.com/@britemjtechnology",
    linkedin: "https://www.linkedin.com/in/brite-m-j-tech",
    x: "#",
  },
} as const;

export const whatsappMessage =
  "Hello Brite MJ Technologies, I am interested in security solutions for my property. Please let me know how we can proceed.";

export function whatsappLink(message: string = whatsappMessage): string {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    message,
  )}`;
}

export function telLink(phone: string = siteConfig.contact.phone): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export const mainNav = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Contact", href: "/contact" },
] as const;

export const companyStats = [
  { value: 10, suffix: "+", label: "Years of Experience", durationMs: 1400 },
  { value: 100, suffix: "+", label: "Projects Completed", durationMs: 1800 },
  { value: 24, suffix: "/7", label: "Support & Monitoring", durationMs: 1200 },
  { value: 100, suffix: "%", label: "Quality Guaranteed", durationMs: 1600 },
] as const;
