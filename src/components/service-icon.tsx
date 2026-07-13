import {
  Cctv,
  Fence,
  Network,
  DoorOpen,
  Video,
  ShieldCheck,
  Wrench,
  Award,
  BadgeCheck,
  Headphones,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { Service, ServiceIcon, WhyChoosePillar } from "@/lib/data";
import { cn } from "@/lib/utils";

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  cctv: Cctv,
  fence: Fence,
  network: Network,
  gate: DoorOpen,
  intercom: Video,
  shield: ShieldCheck,
  wrench: Wrench,
};

const pillarIcons: Record<WhyChoosePillar["icon"], LucideIcon> = {
  experience: Award,
  quality: BadgeCheck,
  support: Headphones,
  trust: HeartHandshake,
};

export function ServiceGlyph({
  icon,
  className,
}: {
  icon: ServiceIcon;
  className?: string;
}) {
  const Icon = serviceIcons[icon];
  return <Icon className={className} aria-hidden="true" />;
}

/**
 * Service icon tile. Uses a custom `iconImage` when provided (e.g. CCTV),
 * otherwise falls back to the Lucide glyph on the brand gradient.
 */
export function ServiceIconTile({
  service,
  size = "md",
  className,
}: {
  service: Pick<Service, "name" | "icon" | "iconImage">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = {
    sm: "h-11 w-11",
    md: "h-14 w-14",
    lg: "h-16 w-16",
  }[size];

  const glyph = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-8 w-8",
  }[size];

  if (service.iconImage) {
    return (
      <span
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/10",
          dims,
          className,
        )}
      >
        {/* Native img avoids Next image cache sticking to old icons */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.iconImage}
          alt=""
          width={64}
          height={64}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <span className="sr-only">{service.name} icon</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm",
        dims,
        className,
      )}
    >
      <ServiceGlyph icon={service.icon} className={glyph} />
    </span>
  );
}

export function PillarGlyph({
  icon,
  className,
}: {
  icon: WhyChoosePillar["icon"];
  className?: string;
}) {
  const Icon = pillarIcons[icon];
  return <Icon className={className} aria-hidden="true" />;
}
