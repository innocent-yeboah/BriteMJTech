import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig, telLink } from "@/lib/site";

export function CtaSection({
  title = "Ready to Secure Your Property?",
  subtitle = "Contact us for a free site inspection and a customized quote. No pressure, no obligation — just expert advice.",
  primaryLabel = "Get Your Free Quote Now",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="section bg-brand-gradient">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
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
            <Button href={telLink()} variant="white" size="lg">
              <Phone className="h-5 w-5" /> Call {siteConfig.contact.phone}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
