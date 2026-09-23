import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/cards/service-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { featuredServices } from "@/lib/data";

/** Outcome-focused blurbs for homepage service cards (does not change service pages). */
const homepageOutcomes: Record<string, string> = {
  "cctv-camera-installation":
    "Cameras aimed at the spots that matter — entrances, walls, parking — with phone viewing when you are away.",
  "security-fencing":
    "Walls and electric fence strands that make climbing harder, fitted to the perimeter you already have.",
  "remote-gate-control":
    "Open the gate from the car or phone. Useful when it rains, when you have kids, or when you get home late.",
  "video-intercom":
    "See who is at the gate before you open. Talk to them. Unlock only when you are ready.",
  networking:
    "Cabling and Wi‑Fi that keep cameras and intercoms online — not a separate guesswork job.",
  "smart-security-systems":
    "Cameras, access and alerts set up to work together, instead of buying gadgets that never talk.",
};

export function ServicesOverview() {
  return (
    <section className="section bg-surface">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="What we install"
            title="Pick what you need — we fit it to the site"
            description="Most jobs mix a few of these. We will tell you what is worth doing and what you can skip."
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
                ctaLabel="See how we do it"
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
