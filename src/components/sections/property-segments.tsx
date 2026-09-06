import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-ctas";

const segments = [
  {
    title: "Homes & Residences",
    description:
      "Coverage for entrances, yards, gates and living spaces — planned around how your household actually uses the property.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on securing my home/property.",
    placement: "property_segment_homes",
  },
  {
    title: "Businesses & Offices",
    description:
      "Surveillance, access and networking that support day-to-day operations without disrupting how your team works.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on securing my business/office.",
    placement: "property_segment_businesses",
  },
  {
    title: "Shops & Commercial Properties",
    description:
      "Visibility over stock, entrances and trading hours — systems designed for busy commercial floors.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on securing my commercial property.",
    placement: "property_segment_shops",
  },
  {
    title: "Warehouses & Industrial Properties",
    description:
      "Perimeter, yard and loading-area protection where boundaries and blind spots matter most.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on securing my warehouse/industrial property.",
    placement: "property_segment_warehouses",
  },
  {
    title: "Schools & Institutions",
    description:
      "Campus-aware layouts for entrances, corridors and shared spaces — installed with clear handover for staff.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on securing my school/institution.",
    placement: "property_segment_schools",
  },
  {
    title: "Property Developers & Managers",
    description:
      "Coordinated systems across units or sites — from assessment through installation and support.",
    whatsappMessage:
      "Hello Brite MJ Technologies, I'd like advice on security systems for my property/project.",
    placement: "property_segment_developers",
  },
] as const;

/**
 * Helps visitors self-identify their property type.
 * CTAs open contextual WhatsApp (no invented segment landing pages).
 */
export function PropertySegments() {
  return (
    <section className="section bg-white">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Who We Work With"
            title="Security Solutions for Different Properties"
            description="Tell us what you need to protect — homes, workplaces, commercial sites and institutions across Greater Accra."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment, index) => (
            <ScrollReveal key={segment.title} delayMs={index * 70}>
              <TrackedWhatsAppLink
                placement={segment.placement}
                message={segment.whatsappMessage}
                className="group flex h-full flex-col border-b border-slate-200 pb-5 transition-colors hover:border-accent"
              >
                <h3 className="font-heading text-lg font-bold text-brand-950 group-hover:text-accent">
                  {segment.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {segment.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800">
                  Talk to us about your property
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </TrackedWhatsAppLink>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
