import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

/**
 * Restrained credibility section.
 * Named testimonials and project case studies are withheld until owner-verified.
 */
export function TrustProof() {
  return (
    <section className="section bg-surface">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
              <Image
                src="/images/hero/team-install.jpg"
                alt="Brite MJ Technologies technicians installing security equipment on site"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80} className="lg:col-span-7">
            <p className="eyebrow">Installed on Real Properties</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold text-brand-950 md:text-4xl">
              Security Systems Installed for Real Properties
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              We work on homes, workplaces and institutions across Greater Accra
              — assessing the site, installing the right systems, and handing
              over clearly so you know how everything works.
            </p>
            <ul className="mt-6 space-y-2 text-base text-slate-700">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Site assessment before recommendations
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Installation and configuration by our team
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Clear handover and ongoing support
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote" variant="primary" size="lg">
                Book a Free Site Inspection
                <ArrowRight className="h-5 w-5" />
              </Button>
              <WhatsAppCtaButton
                placement="trust_proof"
                variant="outline"
                label="WhatsApp an Expert"
              />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
