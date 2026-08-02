import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/cards/service-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { featuredServices } from "@/lib/data";

export function ServicesOverview() {
  return (
    <section className="section bg-surface">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="What We Do"
            title="Complete Security & Smart Systems"
            description="From surveillance to smart access, we deliver end-to-end solutions engineered to protect what matters most to you."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, index) => (
            <ScrollReveal key={service.slug} delayMs={index * 90}>
              <ServiceCard service={service} />
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
