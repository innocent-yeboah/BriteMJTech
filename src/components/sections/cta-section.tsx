import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  PhoneCtaButton,
  WhatsAppCtaButton,
} from "@/components/analytics/tracked-ctas";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

export function CtaSection({
  title = "Not sure what you need yet?",
  subtitle = "Book a free visit. We will walk the site with you and give a plain quote — no pressure to buy everything.",
  primaryLabel = "Book a Free Site Inspection",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="section bg-brand-gradient">
      <Container>
        <ScrollReveal variant="scale" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-100">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/quote" variant="accent" size="lg">
              {primaryLabel} <ArrowRight className="h-5 w-5" />
            </Button>
            <WhatsAppCtaButton
              placement="cta_band"
              variant="white"
              label="WhatsApp us"
            />
            <PhoneCtaButton placement="cta_band" variant="white" />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
