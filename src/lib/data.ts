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
      "Cameras on the spots that matter — with phone viewing when you are not home.",
    longDescription:
      "We plan camera positions around your entrances, walls and parking, then install and set up recording so you can watch live or play back from your phone. Day and night coverage, sized for a single house or a larger site.",
    benefits: [
      "HD cameras with night vision options",
      "Motion alerts when something moves",
      "Watch from your phone",
      "Local NVR and/or cloud recording",
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
      "Perimeter fencing and electric strands that make climbing harder.",
    longDescription:
      "We fit fencing and electric perimeter lines to the wall or boundary you already have — mesh, palisade, or razor toppings where they make sense. Built for Accra weather, wired so the alarm can shout when someone tries the fence.",
    benefits: [
      "Palisade, mesh and high-security options",
      "Electric fence with alarm link-up",
      "Materials that hold up in the heat and rain",
      "Free site visit and a clear quote",
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
      "Cabling and Wi‑Fi so cameras and intercoms stay online.",
    longDescription:
      "Security gear is only as good as the network under it. We run structured cabling, set up switches and Wi‑Fi, and leave you with a tidy rack instead of a bird’s nest of cables behind the TV.",
    benefits: [
      "Structured copper and fibre runs",
      "Wi‑Fi that reaches the cameras",
      "Separate guest and work traffic when needed",
      "Room to add more cameras later",
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
      "Open the gate from the car, phone or keypad — without getting out in the rain.",
    longDescription:
      "We fit gate motors with remotes, keypad and phone control so authorised people get in and everyone else waits. Includes auto-close and safety sensors, plus battery backup for the cuts that always seem to hit at the wrong time.",
    benefits: [
      "Phone and remote open/close",
      "Keypad and intercom options",
      "Auto-close with safety sensors",
      "Battery backup when power drops",
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
      "See who is at the gate, talk to them, then unlock only when you are ready.",
    longDescription:
      "Outdoor stations at the gate or door with indoor panels and phone answering. Useful for households and offices that get a lot of visitors and do not want to open on a voice alone.",
    benefits: [
      "Clear video and two-way talk",
      "Unlock the door or gate remotely",
      "Keep a record of calls when needed",
      "Answer from inside or on your phone",
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
      "Cameras, access and alerts set up to work as one setup — not loose gadgets.",
    longDescription:
      "If you already have (or want) cameras, alarms and access on one phone app, we wire and configure them so alerts make sense and you are not juggling three different logins.",
    benefits: [
      "One app where it makes sense",
      "Alerts you can actually act on",
      "Alarms and sensors linked in",
      "Room to add devices later",
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
      "After install, we still pick up — maintenance, fixes and expansions.",
    longDescription:
      "Install day is not the end. Call when a camera goes offline, you need another channel, or something needs a clean. We keep numbers local and response practical.",
    benefits: [
      "Call or WhatsApp when something breaks",
      "Maintenance visits on a schedule",
      "Add cameras or zones later",
      "Technicians who know the job",
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
      "Cameras around the compound, video intercom at the gate, and remote gate control for a family home.",
    category: "residential",
    location: "East Legon, Accra",
    image: "/images/projects/gated-residence.jpg",
    completedYear: "2025",
  },
  {
    id: "p2",
    title: "Warehouse Perimeter Security",
    description:
      "Electric fence, palisade, and a 16-camera setup for a logistics yard in Tema.",
    category: "commercial",
    location: "Tema Industrial Area",
    image: "/images/projects/warehouse-perimeter.jpg",
    completedYear: "2025",
  },
  {
    id: "p3",
    title: "School Campus Safety Network",
    description:
      "Campus cameras, cabling, and access points so staff can see entrances and corridors.",
    category: "institutional",
    location: "Spintex, Accra",
    image: "/images/about/schools-institutions.jpg",
    completedYear: "2024",
  },
  {
    id: "p4",
    title: "Retail Store Surveillance Upgrade",
    description:
      "Camera upgrade with recording and phone viewing for a busy shop floor.",
    category: "commercial",
    location: "Osu, Accra",
    image: "/images/projects/retail-store-surveillance.jpg",
    completedYear: "2024",
  },
  {
    id: "p5",
    title: "Apartment Complex Access Control",
    description:
      "Gate motor, video intercom, and cameras shared across a residential block.",
    category: "residential",
    location: "Cantonments, Accra",
    image: "/images/about/homes-residences.jpg",
    completedYear: "2025",
  },
  {
    id: "p6",
    title: "Government Facility Security Network",
    description:
      "High fencing, linked alarms, and round-the-clock camera coverage for a public facility.",
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
      "They came, walked the compound with us, and put cameras where we actually needed them. Tidied up after, showed me the phone app, and still pick up when I call.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Kwame Mensah",
    company: "Operations Manager, Tema",
    content:
      "Electric fence and cameras on a long warehouse wall. When a strand came loose months later, they were back the same day. That is what I care about.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Grace Owusu",
    company: "School Administrator, Spintex",
    content:
      "Quote was clear, install did not drag on for weeks, and they trained the security staff on the monitors before they left. No surprises.",
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
    title: "Assess",
    description:
      "We walk the site with you — gates, walls, dark corners, power points — and note what is missing.",
  },
  {
    icon: "quality",
    title: "Design",
    description:
      "You get a plain recommendation and price. We say what is essential and what can wait.",
  },
  {
    icon: "trust",
    title: "Install",
    description:
      "Our technicians mount, cable and test the equipment on site. No subcontractors you have never met.",
  },
  {
    icon: "support",
    title: "Configure",
    description:
      "Phones, remotes, NVRs and Wi‑Fi get set up so everything talks to everything else.",
  },
  {
    icon: "experience",
    title: "Handover",
    description:
      "We show you (and whoever keeps the keys) how to view cameras, open the gate and silence false alerts.",
  },
  {
    icon: "support",
    title: "Support",
    description:
      "After we leave, call or WhatsApp 0203412477 / 0546847109 if something needs a look.",
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
