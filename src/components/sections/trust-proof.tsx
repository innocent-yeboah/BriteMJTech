import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

/**
 * Credibility section built around real installation evidence.
 * Named testimonials and project case studies remain withheld until owner-verified.
 */
export function TrustProof() {
  return (
    <section className="section bg-surface">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
              <Image
                src="/images/cctv/install-1.png"
                alt="Brite MJ Technologies technician installing a CCTV camera on site"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80} className="lg:col-span-7">
            <p className="eyebrow">On real Accra properties</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold text-brand-950 md:text-4xl">
              We install. We show you how it works. We pick up when you call.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              Most people do not want a lecture about “smart ecosystems.” They
              want the gate to open, the cameras to record, and someone local
              to call if a cable comes loose.
            </p>
            <ul className="mt-6 space-y-2 text-base text-slate-700">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Free site visit before we quote
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Our team does the install and setup
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                You leave knowing the remotes, app and numbers to call
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
                label="WhatsApp us"
              />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
