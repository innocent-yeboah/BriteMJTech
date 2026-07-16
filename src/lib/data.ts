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
  /** CSS object-position for icon crop (e.g. "62% 48%"). */
  iconImagePosition?: string;
  image: string;
  /** Optional looping demo video for the service media panel. */
  video?: string;
  /** Poster image shown before / while the video loads. */
  videoPoster?: string;
  /** Keep portrait videos fully visible inside the landscape media panel. */
  videoFit?: "cover" | "contain";
  /** Hide sound controls when the source has no audio track. */
  videoHasAudio?: boolean;
  /** Optional gallery for animated slideshows (e.g. CCTV section). */
  gallery?: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
    position?: string;
  }[];
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
    image: "/videos/cctv-office.jpg",
    video: "/videos/cctv-office.mp4",
    videoPoster: "/videos/cctv-office.jpg",
    videoFit: "contain",
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
    name: "Security & Electric Fencing",
    shortDescription:
      "Strong perimeter fencing with optional electric deterrents for real peace of mind.",
    longDescription:
      "We design and install perimeter fencing that fits your property, from palisade and welded mesh to razor-topped barriers. Need an extra layer? We add safe, standards-compliant electric fencing that deters intruders and can link to your alarms. Built for Ghana's weather, installed to last.",
    benefits: [
      "Palisade, mesh, and high-security options",
      "Electric fencing with alarm integration",
      "Weather-resistant materials and finishes",
      "Free site assessment and clear quotes",
    ],
    icon: "fence",
    iconImage: "/images/icons/fence-live.jpg",
    image: "/images/fencing/wall-electric-1.png",
    gallery: [
      {
        src: "/images/fencing/wall-electric-1.png",
        alt: "Concrete perimeter wall with multi-strand electric fencing against blue sky",
      },
      {
        src: "/images/fencing/wall-electric-2.png",
        alt: "Long security wall with arched panels and electric fence brackets",
      },
      {
        src: "/images/fencing/grille-electric.png",
        alt: "Residential perimeter with metal grilles and electric fencing on top",
      },
      {
        src: "/images/fencing/install-tech.png",
        alt: "Technician installing electric fence strands on a brick wall",
      },
    ],
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
    iconImage: "/images/icons/network-real.png",
    iconImagePosition: "68% 52%",
    image: "/images/networking/fiber-install.png",
    gallery: [
      {
        src: "/images/networking/fiber-install.png",
        alt: "Technician connecting a fibre optic cable to an active network switch",
      },
      {
        src: "/images/networking/switch-cabling.png",
        alt: "Organised yellow fibre and blue Ethernet cabling on a network switch",
      },
      {
        src: "/images/networking/engineer-cabling.png",
        alt: "Network engineer organising Ethernet cables in a server rack",
      },
      {
        src: "/images/networking/engineer-laptop.png",
        alt: "Network engineer configuring servers with a laptop in a data centre",
      },
      {
        src: "/images/networking/cable-tech.png",
        alt: "Technician terminating and securing network cable connectors on site",
      },
    ],
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
    iconImage: "/images/icons/gate-remote-icon.jpg",
    iconImagePosition: "55% 45%",
    image: "/videos/remote-gate-poster.jpg",
    video: "/videos/remote-gate.mp4",
    videoPoster: "/videos/remote-gate-poster.jpg",
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
    iconImage: "/images/icons/intercom-lock.jpg",
    iconImagePosition: "50% 45%",
    image: "/images/intercom/outdoor-call.png",
    gallery: [
      {
        src: "/images/intercom/outdoor-call.png",
        alt: "Visitor pressing the call button on an outdoor video intercom at a gate",
        position: "object-[45%_40%]",
      },
      {
        src: "/images/intercom/indoor-panel.png",
        alt: "Indoor video intercom panel with live visitor feed beside entrance doors",
        position: "object-[60%_45%]",
      },
      {
        src: "/images/intercom/lobby-station.png",
        alt: "Wall-mounted video intercom station showing a live call interface",
        position: "object-[70%_center]",
      },
      {
        src: "/images/intercom/biometric-unlock.png",
        alt: "Fingerprint unlock on a secure access and intercom control panel",
        position: "object-[55%_70%]",
      },
    ],
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
    iconImage: "/images/icons/smart-security-lock.jpg",
    iconImagePosition: "50% 48%",
    image: "/videos/smart-security.jpg",
    video: "/videos/smart-security.mp4",
    videoPoster: "/videos/smart-security.jpg",
    videoFit: "contain",
    videoHasAudio: false,
    featured: true,
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
    iconImage: "/images/icons/service-support.jpg",
    iconImagePosition: "58% 42%",
    image: "/images/support/service-support.png",
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
  { kind: "inspection" as const, label: "Free Site Inspection" },
  { kind: "certified" as const, label: "Certified Installations" },
  { kind: "support" as const, label: "24/7 Support" },
  { kind: "quality" as const, label: "Quality Guaranteed" },
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
