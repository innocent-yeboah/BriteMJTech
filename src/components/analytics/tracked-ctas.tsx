"use client";

import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { siteConfig, telLink, whatsappLink } from "@/lib/site";

type Placement = string;

/** Tracked WhatsApp CTA for hero, service pages, and CTA bands. */
export function WhatsAppCtaButton({
  placement,
  message,
  label = "Chat on WhatsApp",
  variant = "white",
  size = "lg",
  className,
}: {
  placement: Placement;
  message?: string;
  label?: string;
  variant?: "primary" | "accent" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Button
      href={whatsappLink(message)}
      variant={variant}
      size={size}
      external
      className={className}
      onClick={() => trackWhatsAppClick(placement)}
    >
      <MessageCircle className="h-5 w-5" /> {label}
    </Button>
  );
}

/** Tracked click-to-call CTA. */
export function PhoneCtaButton({
  placement,
  label,
  variant = "white",
  size = "lg",
  className,
}: {
  placement: Placement;
  label?: string;
  variant?: "primary" | "accent" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Button
      href={telLink()}
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackPhoneClick(placement)}
    >
      <Phone className="h-5 w-5" />{" "}
      {label ?? `Call ${siteConfig.contact.phone}`}
    </Button>
  );
}

/** Custom-styled WhatsApp anchor (contact sidebar, etc.). */
export function TrackedWhatsAppLink({
  placement,
  message,
  className,
  children,
}: {
  placement: Placement;
  message?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppClick(placement)}
    >
      {children}
    </a>
  );
}
