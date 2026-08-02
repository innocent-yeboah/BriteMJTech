import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="section bg-surface">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Client Stories"
            title="Trusted by Families & Businesses Across Accra"
            description="Real feedback from clients who chose Brite MJ Technologies to protect what matters."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delayMs={index * 100}>
              <TestimonialCard testimonial={testimonial} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
