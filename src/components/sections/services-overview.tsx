import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/cards/service-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { featuredServices } from "@/lib/data";

/** Outcome-focused blurbs for homepage service cards (does not change service pages). */
const homepageOutcomes: Record<string, string> = {
  "cctv-camera-installation":
    "See what happens on your property — day and night — with cameras planned around real blind spots and entrances.",
  "security-fencing":
    "Strengthen boundaries and deter intrusion with fencing and electric perimeter systems suited to the site.",
  "remote-gate-control":
    "Control who enters and leaves — gate automation designed around your driveway, compound or estate access.",
  "video-intercom":
    "See and speak to visitors before opening up — clearer access decisions at the door or gate.",
  networking:
    "Reliable connectivity so cameras, intercoms and access systems work together without guesswork.",
  "smart-security-systems":
    "Combined systems that fit how you live or work — designed as one solution, not disconnected gadgets.",
};

export function ServicesOverview() {
  return (
    <section className="section bg-surface">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="What We Can Secure"
            title="Systems Matched to Your Property"
            description="We design and install the right combination of security systems for the space — not a one-size package."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, index) => (
            <ScrollReveal key={service.slug} delayMs={index * 90}>
              <ServiceCard
                service={{
                  ...service,
                  shortDescription:
                    homepageOutcomes[service.slug] ?? service.shortDescription,
                }}
                ctaLabel="Explore this system"
              />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delayMs={120} className="mt-12 text-center">
          <Button href="/services" variant="outline" size="lg">
            View All Services
          </Button>
        </ScrollReveal>
      </Container>
    </section>
  );
}
