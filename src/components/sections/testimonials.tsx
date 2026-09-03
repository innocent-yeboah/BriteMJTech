import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { testimonials } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export function Testimonials() {
  const googleUrl = siteConfig.googleBusinessUrl;

  return (
    <section className="section bg-surface">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Client Stories"
            title="Trusted by Families & Businesses Across Accra"
            description="Feedback from clients who chose Brite MJ Technologies to protect what matters."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delayMs={index * 100}>
              <TestimonialCard testimonial={testimonial} />
            </ScrollReveal>
          ))}
        </div>
        {googleUrl ? (
          <ScrollReveal className="mt-10 text-center">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 transition-colors hover:text-accent"
            >
              <Star className="h-4 w-4 fill-accent text-accent" />
              Read or leave a Google review
            </a>
          </ScrollReveal>
        ) : null}
      </Container>
    </section>
  );
}
