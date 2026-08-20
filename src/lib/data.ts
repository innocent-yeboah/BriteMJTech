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
    image: "/images/cctv/hikvision-street-view.jpg",
    video: "/videos/cctv-office.mp4",
    videoPoster: "/videos/cctv-office.jpg",
    videoFit: "contain",
    gallery: [
      {
        src: "/images/cctv/hikvision-street-view.jpg",
        alt: "Hikvision bullet CCTV camera installed under a roof eave overlooking the street",
      },
      {
        src: "/images/cctv/hikvision-wall-closeup.jpg",
        alt: "Close-up of a professionally mounted Hikvision CCTV camera with junction box",
      },
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
    image: "/images/networking/rack-install-monitor.png",
    gallery: [
      {
        src: "/images/networking/rack-install-monitor.png",
        alt: "Technician installing wall-mounted network racks above a multi-camera monitoring screen",
      },
      {
        src: "/images/networking/cctv-monitor-wall.png",
        alt: "Large dual-monitor CCTV and network monitoring wall with UPS backup",
      },
      {
        src: "/images/networking/starlink-install.png",
        alt: "Starlink satellite dish installed on a balcony railing for high-speed internet",
      },
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
    image: "/images/gate/remote-swing-gate.png",
    video: "/videos/remote-gate.mp4",
    videoPoster: "/videos/remote-gate-poster.jpg",
    gallery: [
      {
        src: "/images/gate/remote-swing-gate.png",
        alt: "Hand operating a remote control to open a wooden swing driveway gate",
      },
      {
        src: "/images/gate/sliding-wood-motor.png",
        alt: "Automated sliding wooden gate with ground-mounted motor and track",
      },
      {
        src: "/images/gate/ornamental-swing-actuators.png",
        alt: "Black ornamental double-swing gate with linear actuator arms on stone pillars",
      },
      {
        src: "/images/gate/beninca-sliding-motor.png",
        alt: "Close-up of a Beninca sliding gate motor and gear rack installation",
      },
    ],
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
    image: "/images/projects/gated-residence.jpg",
    completedYear: "2025",
  },
  {
    id: "p2",
    title: "Warehouse Perimeter Security",
    description:
      "Electric fencing, palisade barrier, and 16-camera surveillance for a logistics warehouse.",
    category: "commercial",
    location: "Tema Industrial Area",
    image: "/images/projects/warehouse-perimeter.jpg",
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
    image: "/images/projects/retail-store-surveillance.jpg",
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
    image: "/images/projects/government-security-network.jpg",
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
    title: "We start with a free site visit",
    description:
      "Before any quote, we walk the property with you — entry points, lighting, power, and how you actually use the space — so the recommendation fits Accra homes and workplaces, not a one-size template.",
  },
  {
    icon: "quality",
    title: "Installed by our own crew",
    description:
      "Cabling, mounting, gate motors, and network setup are handled by Brite MJ technicians. You get one team accountable from the first visit to handover — based out of Spintex.",
  },
  {
    icon: "support",
    title: "You stay in control after handover",
    description:
      "We set up phone viewing, remotes, and access the way you need them, then leave clear instructions. When something needs adjusting, you reach us on 0203412477 or 0546847109.",
  },
  {
    icon: "trust",
    title: "Built for Ghana conditions",
    description:
      "Outdoor cameras, fencing, and gate systems specified for heat, rain, and power interruptions — so your security holds up through the seasons, not just on installation day.",
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

/** Product categories used in installation and service work. */
export type ProductCategory =
  | "cctv"
  | "fencing"
  | "networking"
  | "gate-control"
  | "intercom"
  | "smart-security"
  | "accessories";

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  uses: string[];
  image: string;
  imagePosition?: string;
  /** Related marketing service slug for deep links. */
  serviceSlug?: string;
  featured?: boolean;
}

export const productCategories: {
  id: ProductCategory | "all";
  label: string;
  description: string;
}[] = [
  {
    id: "all",
    label: "All products",
    description: "Hardware we install across Accra homes and businesses.",
  },
  {
    id: "cctv",
    label: "CCTV & Recording",
    description: "Cameras, NVRs, and monitoring gear for clear day/night coverage.",
  },
  {
    id: "fencing",
    label: "Electric Fencing",
    description: "Energizers, conductors, and perimeter hardware for secure boundaries.",
  },
  {
    id: "networking",
    label: "Networking",
    description: "Switches, cabling, and connectivity that keep systems online.",
  },
  {
    id: "gate-control",
    label: "Gate Control",
    description: "Motors, remotes, and access hardware for driveway automation.",
  },
  {
    id: "intercom",
    label: "Video Intercom",
    description: "Outdoor stations, indoor panels, and visitor entry systems.",
  },
  {
    id: "smart-security",
    label: "Smart Security",
    description: "Integrated locks, sensors, and connected security components.",
  },
  {
    id: "accessories",
    label: "Accessories",
    description: "Mounts, power, and cabling that finish a reliable install.",
  },
];

export const products: Product[] = [
  {
    slug: "hd-bullet-cameras",
    name: "HD Bullet CCTV Cameras",
    category: "cctv",
    shortDescription:
      "Weather-ready outdoor cameras for perimeter walls, poles, and entry points.",
    uses: [
      "Day/night perimeter monitoring",
      "Driveway and gate coverage",
      "Warehouse and yard surveillance",
    ],
    image: "/images/cctv/hikvision-wall-closeup.jpg",
    serviceSlug: "cctv-camera-installation",
    featured: true,
  },
  {
    slug: "hikvision-outdoor-bullet",
    name: "Hikvision Outdoor Bullet Cameras",
    category: "cctv",
    shortDescription:
      "Professionally mounted Hikvision bullet cameras with clean conduit and junction-box installs.",
    uses: [
      "Residential street and gate views",
      "Shop and office entry monitoring",
      "Weather-ready outdoor coverage",
    ],
    image: "/images/cctv/hikvision-street-view.jpg",
    serviceSlug: "cctv-camera-installation",
    featured: true,
  },
  {
    slug: "dome-indoor-cameras",
    name: "Indoor Dome Cameras",
    category: "cctv",
    shortDescription:
      "Discreet indoor cameras for offices, shops, and reception areas.",
    uses: [
      "Retail floor monitoring",
      "Office and lobby coverage",
      "Cash desk and corridor views",
    ],
    image: "/images/cctv/indoor-cameras.png",
    serviceSlug: "cctv-camera-installation",
  },
  {
    slug: "nvr-recording-systems",
    name: "NVR Recording Systems",
    category: "cctv",
    shortDescription:
      "Local network video recorders for multi-camera storage and playback.",
    uses: [
      "Multi-zone recording",
      "Playback for incident review",
      "Remote mobile viewing setup",
    ],
    image: "/images/cctv/nvr-system.png",
    serviceSlug: "cctv-camera-installation",
    featured: true,
  },
  {
    slug: "surevision-cameras",
    name: "SureVision Camera Kits",
    category: "cctv",
    shortDescription:
      "Reliable camera packages we specify for homes and small businesses.",
    uses: [
      "Residential starter systems",
      "Shop front monitoring",
      "Expandable multi-camera setups",
    ],
    image: "/images/cctv/surevision-camera.png",
    serviceSlug: "cctv-camera-installation",
  },
  {
    slug: "wall-mounted-electric-fence",
    name: "Wall-Mounted Electric Fence Systems",
    category: "fencing",
    shortDescription:
      "Perimeter conductors and brackets installed on boundary walls.",
    uses: [
      "Residential compound security",
      "Commercial yard protection",
      "Deterrent + alarm signalling",
    ],
    image: "/images/fencing/wall-electric-1.png",
    serviceSlug: "security-fencing",
    featured: true,
  },
  {
    slug: "grille-electric-fencing",
    name: "Grille & Roof Electric Fencing",
    category: "fencing",
    shortDescription:
      "Electric fencing for roofs, windows, and vulnerable climb points.",
    uses: [
      "Roof access deterrence",
      "Window and grille protection",
      "Multi-storey property hardening",
    ],
    image: "/images/fencing/grille-electric.png",
    serviceSlug: "security-fencing",
  },
  {
    slug: "fence-energizer-kits",
    name: "Fence Energizer Kits",
    category: "fencing",
    shortDescription:
      "Power units and control hardware that drive electric fence lines safely.",
    uses: [
      "High-voltage pulse control",
      "Fault monitoring readiness",
      "Residential and commercial zones",
    ],
    image: "/images/fencing/wall-electric-2.png",
    serviceSlug: "security-fencing",
  },
  {
    slug: "network-switches",
    name: "Network Switches & Patching",
    category: "networking",
    shortDescription:
      "Structured switching for CCTV, access control, and office data.",
    uses: [
      "PoE camera backbones",
      "Office LAN expansion",
      "Clean rack and cabinet installs",
    ],
    image: "/images/networking/switch-cabling.png",
    serviceSlug: "networking",
    featured: true,
  },
  {
    slug: "fiber-and-structured-cabling",
    name: "Fiber & Structured Cabling",
    category: "networking",
    shortDescription:
      "Fiber and copper runs that keep cameras and networks stable over distance.",
    uses: [
      "Long-run CCTV backhaul",
      "Building backbone links",
      "Reliable low-latency data paths",
    ],
    image: "/images/networking/fiber-install.png",
    serviceSlug: "networking",
  },
  {
    slug: "network-termination-kits",
    name: "Termination & Testing Kits",
    category: "networking",
    shortDescription:
      "Professional termination hardware used on every certified network install.",
    uses: [
      "RJ45 and fiber terminations",
      "Link testing before handover",
      "Neat cabinet finishes",
    ],
    image: "/images/networking/cable-tech.png",
    serviceSlug: "networking",
  },
  {
    slug: "network-rack-installation",
    name: "Network Rack Installation",
    category: "networking",
    shortDescription:
      "Wall-mounted racks, switches, and organised cabling for reliable site networks.",
    uses: [
      "Server and switch cabinets",
      "PoE backbones for cameras",
      "Clean, labelled cable management",
    ],
    image: "/images/networking/rack-install-monitor.png",
    imagePosition: "center",
    serviceSlug: "networking",
    featured: true,
  },
  {
    slug: "monitoring-control-rooms",
    name: "Monitoring & Control Rooms",
    category: "networking",
    shortDescription:
      "Multi-screen monitoring walls with UPS backup for 24/7 network visibility.",
    uses: [
      "CCTV and network oversight",
      "Multi-channel video walls",
      "Backup power for continuous uptime",
    ],
    image: "/images/networking/cctv-monitor-wall.png",
    imagePosition: "center",
    serviceSlug: "networking",
    featured: true,
  },
  {
    slug: "starlink-satellite-internet",
    name: "Starlink Satellite Internet",
    category: "networking",
    shortDescription:
      "High-speed satellite connectivity for homes and sites where fibre is limited.",
    uses: [
      "Remote and suburban coverage",
      "Fast backup or primary internet",
      "Professional dish mounting",
    ],
    image: "/images/networking/starlink-install.png",
    imagePosition: "center",
    serviceSlug: "networking",
    featured: true,
  },
  {
    slug: "gate-motors-and-remotes",
    name: "Gate Motors & Remotes",
    category: "gate-control",
    shortDescription:
      "Automation kits for swing and sliding gates with handheld remotes.",
    uses: [
      "Residential driveway automation",
      "Estate and compound gates",
      "Secure remote open/close",
    ],
    image: "/images/gate/beninca-sliding-motor.png",
    imagePosition: "center",
    serviceSlug: "remote-gate-control",
    featured: true,
  },
  {
    slug: "sliding-gate-automation",
    name: "Sliding Gate Automation",
    category: "gate-control",
    shortDescription:
      "Track-mounted motors for wooden and metal sliding driveway gates.",
    uses: [
      "Residential sliding gates",
      "Compound and estate entrances",
      "Quiet, reliable open and close",
    ],
    image: "/images/gate/sliding-wood-motor.png",
    imagePosition: "center",
    serviceSlug: "remote-gate-control",
    featured: true,
  },
  {
    slug: "swing-gate-actuators",
    name: "Swing Gate Actuators",
    category: "gate-control",
    shortDescription:
      "Linear actuator arms for ornamental and double-swing gate leaves.",
    uses: [
      "Double-swing driveway gates",
      "Stone pillar installations",
      "Smooth automated entry",
    ],
    image: "/images/gate/ornamental-swing-actuators.png",
    imagePosition: "center",
    serviceSlug: "remote-gate-control",
    featured: true,
  },
  {
    slug: "handheld-gate-remotes",
    name: "Handheld Gate Remotes",
    category: "gate-control",
    shortDescription:
      "Secure remotes and smartphone options to open your gate from the car or couch.",
    uses: [
      "One-touch gate open/close",
      "Multi-user remote kits",
      "Works with swing and sliding motors",
    ],
    image: "/images/gate/remote-swing-gate.png",
    imagePosition: "center",
    serviceSlug: "remote-gate-control",
    featured: true,
  },
  {
    slug: "outdoor-intercom-stations",
    name: "Outdoor Video Intercom Stations",
    category: "intercom",
    shortDescription:
      "Weather-resistant call panels for gates, lobbies, and main entrances.",
    uses: [
      "Visitor identification",
      "Two-way audio/video calls",
      "Door release integration",
    ],
    image: "/images/intercom/outdoor-call.png",
    serviceSlug: "video-intercom",
    featured: true,
  },
  {
    slug: "indoor-intercom-panels",
    name: "Indoor Intercom Monitors",
    category: "intercom",
    shortDescription:
      "Indoor screens and handsets for answering and opening access points.",
    uses: [
      "Home and office answering",
      "Multi-unit apartment lobbies",
      "Remote unlock when verified",
    ],
    image: "/images/intercom/indoor-panel.png",
    serviceSlug: "video-intercom",
  },
  {
    slug: "lobby-intercom-stations",
    name: "Lobby Entry Stations",
    category: "intercom",
    shortDescription:
      "Multi-tenant lobby stations for apartments, offices, and hostels.",
    uses: [
      "Directory-based calling",
      "Shared building access",
      "Visitor logging readiness",
    ],
    image: "/images/intercom/lobby-station.png",
    serviceSlug: "video-intercom",
  },
  {
    slug: "biometric-access-readers",
    name: "Biometric Access Readers",
    category: "smart-security",
    shortDescription:
      "Fingerprint and credential readers for staff and restricted zones.",
    uses: [
      "Office door access",
      "Server room protection",
      "Staff attendance-ready setups",
    ],
    image: "/images/intercom/biometric-unlock.png",
    serviceSlug: "smart-security-systems",
    featured: true,
  },
  {
    slug: "smart-security-locks",
    name: "Smart Security Locks",
    category: "smart-security",
    shortDescription:
      "Connected lock hardware for doors that need stronger control.",
    uses: [
      "Main door hardening",
      "App-assisted access where specified",
      "Integrated alarm readiness",
    ],
    image: "/images/icons/smart-security-lock.jpg",
    serviceSlug: "smart-security-systems",
  },
  {
    slug: "camera-mounts-and-brackets",
    name: "Camera Mounts & Brackets",
    category: "accessories",
    shortDescription:
      "Poles, wall arms, and brackets that keep cameras stable and correctly aimed.",
    uses: [
      "Pole and wall mounting",
      "Corner and eaves installs",
      "Clean cable management",
    ],
    image: "/images/cctv/install-2.png",
    serviceSlug: "cctv-camera-installation",
  },
  {
    slug: "power-and-backup-kits",
    name: "Power & Backup Kits",
    category: "accessories",
    shortDescription:
      "Power supplies and backup options that keep systems running through outages.",
    uses: [
      "Camera and NVR power",
      "Fence energizer supply",
      "Short outage continuity",
    ],
    image: "/images/support/service-support.png",
    serviceSlug: "service-and-support",
  },
];

export function getProductsByCategory(category: ProductCategory | "all") {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

/** Products installed as part of a given service. */
export function getProductsForService(serviceSlug: string) {
  return products.filter((product) => product.serviceSlug === serviceSlug);
}
