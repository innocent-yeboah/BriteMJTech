import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-ctas";

const segments = [
  {
    title: "Homes & Residences",
    description:
      "Front gate, backyard, boys' quarters, parking — we plan around how people actually move in and out of the house.",
    whatsappMessage:
      "Hi Brite MJ, I need help securing my home. Can we talk about a site visit?",
    placement: "property_segment_homes",
  },
  {
    title: "Businesses & Offices",
    description:
      "See the entrance, storeroom and parking without slowing staff down every morning.",
    whatsappMessage:
      "Hi Brite MJ, I need security advice for my office/business.",
    placement: "property_segment_businesses",
  },
  {
    title: "Shops & Commercial Properties",
    description:
      "Watch the counter, stock room and street front during busy hours — and after closing.",
    whatsappMessage:
      "Hi Brite MJ, I want cameras/security for my shop or commercial property.",
    placement: "property_segment_shops",
  },
  {
    title: "Warehouses & Industrial Properties",
    description:
      "Long walls, loading bays and dark yards need more than one camera by the gate.",
    whatsappMessage:
      "Hi Brite MJ, I need perimeter security for a warehouse/industrial site.",
    placement: "property_segment_warehouses",
  },
  {
    title: "Schools & Institutions",
    description:
      "Entrances, corridors and shared spaces — set up so staff know how to use it after we leave.",
    whatsappMessage:
      "Hi Brite MJ, I need security for a school/institution. Can you advise?",
    placement: "property_segment_schools",
  },
  {
    title: "Property Developers & Managers",
    description:
      "Same standard across units or sites — from the first visit through install and aftercare.",
    whatsappMessage:
      "Hi Brite MJ, I manage/develop property and need security systems across sites.",
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
            eyebrow="Where we work"
            title="Homes, shops, yards and campuses"
            description="If it is in Greater Accra and you need eyes on the property or a stronger perimeter, we have likely done something similar."
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
                  WhatsApp us about your place
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
