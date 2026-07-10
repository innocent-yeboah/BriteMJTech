import {
  Cctv,
  Fence,
  Network,
  DoorOpen,
  Video,
  Zap,
  ShieldCheck,
  Wrench,
  Award,
  BadgeCheck,
  Headphones,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon } from "@/lib/data";
import type { WhyChoosePillar } from "@/lib/data";

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  cctv: Cctv,
  fence: Fence,
  network: Network,
  gate: DoorOpen,
  intercom: Video,
  electric: Zap,
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
