/**
 * Static content for Brite MJ Technologies.
 *
 * These arrays power the site out-of-the-box so it looks complete and
 * professional immediately. Once the Supabase `services`, `projects`, and
 * `testimonials` tables are populated, swap the reads in the pages for
 * Supabase queries — the shapes below intentionally mirror the DB schema.
 *
 * Images use high-quality Unsplash security/industrial photography.
 * REPLACE with the client's real project photography before launch.
 */

export type ServiceIcon =
  | "cctv"
  | "fence"
  | "network"
  | "gate"
  | "intercom"
  | "electric"
  | "shield"
  | "wrench";

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  icon: ServiceIcon;
  /** Optional custom icon image (replaces the Lucide glyph). */
  iconImage?: string;
  image: string;
  /** Optional gallery for animated slideshows (e.g. CCTV section). */
  gallery?: { src: string; alt: string }[];
  featured: boolean;
}

export const services: Service[] = [
  {
    slug: "cctv-camera-installation",
    name: "CCTV Camera Installation",
    shortDescription:
      "High-definition surveillance that keeps eyes on your property day and night.",
    longDescription:
      "We design and install high-resolution CCTV systems tailored to your property's layout — from single-camera entry monitoring to multi-zone HD networks with night vision and cloud recording. View live footage and playback from your phone, anywhere in the world.",
    benefits: [
      "Crystal-clear HD & 4K camera options",
      "Night vision and motion detection",
      "Remote viewing from your phone",
      "Secure cloud & local recording",
    ],
    icon: "cctv",
    iconImage: "/images/icons/cctv-real.jpg",
    image: "/images/cctv/cameras-pole.png",
    gallery: [
      {
        src: "/images/cctv/install-1.png",
        alt: "Technician installing a CCTV camera with a power drill",
      },
      {
        src: "/images/cctv/cameras-pole.png",
        alt: "Dual bullet CCTV cameras mounted on a pole against blue sky",
      },
      {
        src: "/images/cctv/camera-closeup.png",
        alt: "Close-up of a white outdoor CCTV security camera",
      },
      {
        src: "/images/cctv/install-2.png",
        alt: "Hands adjusting a CCTV camera during professional installation",
      },
      {
        src: "/images/cctv/surevision-camera.png",
        alt: "White bullet CCTV camera mounted on an exterior wall",
      },
      {
        src: "/images/cctv/nvr-system.png",
        alt: "CCTV camera and NVR monitoring system installation",
      },
      {
        src: "/images/cctv/school-camera.png",
        alt: "Security camera installed at a school entrance",
      },
      {
        src: "/images/cctv/indoor-cameras.png",
        alt: "Selection of modern indoor security cameras",
      },
    ],
    featured: true,
  },
  {
    slug: "security-fencing",
    name: "Security Fencing",
    shortDescription:
      "Strong perimeter protection for complete peace of mind.",
    longDescription:
      "Define and defend your boundary with durable, professionally installed security fencing. We assess your site and recommend the right solution — from palisade and welded mesh to razor-topped barriers — built to withstand Ghana's climate and deter intruders.",
    benefits: [
      "Robust, weather-resistant materials",
      "Custom heights and configurations",
      "Professional site assessment",
      "Long-lasting, low-maintenance finish",
    ],
    icon: "fence",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "networking",
    name: "Networking",
    shortDescription:
      "Reliable connections and seamless performance for home and business.",
    longDescription:
      "Keep your people and systems connected with structured cabling, enterprise Wi-Fi, and network hardware installed to professional standards. We build fast, secure, and scalable networks that support your CCTV, access control, and everyday operations.",
    benefits: [
      "Structured cabling & fibre",
      "Business-grade Wi-Fi coverage",
      "Secure, segmented networks",
      "Scalable for future growth",
    ],
    icon: "network",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "remote-gate-control",
    name: "Remote Gate Control",
    shortDescription:
      "Convenience and security at your fingertips.",
    longDescription:
      "Open and secure your gate without leaving your car or couch. We install automated gate motors with remote controls, keypad, and smartphone access — so authorised people get in easily and everyone else stays out.",
    benefits: [
      "Smartphone & remote operation",
      "Keypad and intercom integration",
      "Automatic close & safety sensors",
      "Battery backup during outages",
    ],
    icon: "gate",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "video-intercom",
    name: "Video Intercom",
    shortDescription:
      "See, hear, and communicate with confidence before you open the door.",
    longDescription:
      "Know exactly who is at your gate or door. Our video intercom systems combine crisp video, two-way audio, and remote unlocking, giving households and businesses a secure, verified way to manage visitors.",
    benefits: [
      "Two-way audio and HD video",
      "Remote door & gate release",
      "Visitor call recording",
      "Indoor & mobile answering",
    ],
    icon: "intercom",
    image:
      "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "electric-fencing",
    name: "Electric Fencing",
    shortDescription:
      "A powerful deterrent that alerts you the moment your perimeter is challenged.",
    longDescription:
      "Add an active layer of defence with professionally installed electric fencing. Our systems deliver a safe but effective deterrent, integrate with alarms and monitoring, and comply with recognised safety standards.",
    benefits: [
      "Strong intruder deterrent",
      "Alarm & monitoring integration",
      "Safe, standards-compliant design",
      "Energiser battery backup",
    ],
    icon: "electric",
    image:
      "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "smart-security-systems",
    name: "Smart Security Systems",
    shortDescription:
      "Integrated, app-controlled security that works together as one system.",
    longDescription:
      "Bring your cameras, alarms, access control, and sensors together into a single smart platform you control from one app. We design integrated systems that automate, alert, and protect — intelligently.",
    benefits: [
      "One app for your whole system",
      "Automated alerts & scenes",
      "Alarm & sensor integration",
      "Future-ready smart devices",
    ],
    icon: "shield",
    image:
      "https://images.unsplash.com/photo-1563452619267-bc16ef6cecec?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    slug: "service-and-support",
    name: "Service & Support",
    shortDescription:
      "Expert installations backed by responsive, ongoing service and support.",
    longDescription:
      "Our relationship doesn't end at installation. We provide maintenance, upgrades, and rapid-response support to keep your security network performing at its best — with 24/7 assistance when it matters most.",
    benefits: [
      "24/7 responsive support",
      "Scheduled maintenance plans",
      "System upgrades & expansion",
      "Certified, professional technicians",
    ],
    icon: "wrench",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export type ProjectCategory = "residential" | "commercial" | "institutional";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  location: string;
  image: string;
  completedYear: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Gated Residence CCTV & Intercom",
    description:
      "Full HD CCTV coverage with video intercom and automated gate control for a family home.",
    category: "residential",
    location: "East Legon, Accra",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2025",
  },
  {
    id: "p2",
    title: "Warehouse Perimeter Security",
    description:
      "Electric fencing, palisade barrier, and 16-camera surveillance for a logistics warehouse.",
    category: "commercial",
    location: "Tema Industrial Area",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2025",
  },
  {
    id: "p3",
    title: "School Campus Safety Network",
    description:
      "Campus-wide CCTV, structured networking, and access control for a private school.",
    category: "institutional",
    location: "Spintex, Accra",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2024",
  },
  {
    id: "p4",
    title: "Retail Store Surveillance Upgrade",
    description:
      "4K camera upgrade with cloud recording and remote monitoring for a busy retail shop.",
    category: "commercial",
    location: "Osu, Accra",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2024",
  },
  {
    id: "p5",
    title: "Apartment Complex Access Control",
    description:
      "Remote gate control, video intercom, and networked cameras across a residential complex.",
    category: "residential",
    location: "Cantonments, Accra",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2025",
  },
  {
    id: "p6",
    title: "Government Facility Security Network",
    description:
      "High-security fencing, integrated alarms, and 24/7 monitored surveillance system.",
    category: "institutional",
    location: "Accra Central",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
    completedYear: "2023",
  },
];

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ama Boateng",
    company: "Homeowner, East Legon",
    content:
      "Brite MJ installed our CCTV and intercom system flawlessly. The team was professional, tidy, and patient in explaining everything. I finally feel completely safe at home.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Kwame Mensah",
    company: "Operations Manager, Tema",
    content:
      "Our warehouse perimeter has never been more secure. The electric fencing and camera coverage are excellent, and their support team responds fast whenever we call.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Grace Owusu",
    company: "School Administrator, Spintex",
    content:
      "From site inspection to handover, the process was smooth and transparent. Our campus network and cameras work perfectly. Highly recommended for institutions.",
    rating: 5,
  },
];

export interface WhyChoosePillar {
  icon: "experience" | "quality" | "support" | "trust";
  title: string;
  description: string;
}

export const whyChooseUs: WhyChoosePillar[] = [
  {
    icon: "experience",
    title: "Experience",
    description:
      "Years of expert installations across homes, businesses, and institutions in Accra.",
  },
  {
    icon: "quality",
    title: "Quality",
    description:
      "Certified products and professional standards on every single project we deliver.",
  },
  {
    icon: "support",
    title: "Support",
    description:
      "24/7 customer service and rapid response when your security matters most.",
  },
  {
    icon: "trust",
    title: "Trust",
    description:
      "Trusted by families, companies, and institutions across the Greater Accra region.",
  },
];

export const trustBadges = [
  "Free Site Inspection",
  "Certified Installations",
  "24/7 Support",
  "Quality Guaranteed",
];

export const propertyTypes = [
  "Home / Residential",
  "Office",
  "Shop / Retail",
  "Warehouse",
  "Construction Site",
  "School / Institution",
  "Government Facility",
  "Other",
] as const;
