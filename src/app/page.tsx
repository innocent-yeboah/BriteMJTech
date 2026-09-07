import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProblemNeed } from "@/components/sections/problem-need";
import { ServicesOverview } from "@/components/sections/services-overview";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { PropertySegments } from "@/components/sections/property-segments";
import { InstallationProof } from "@/components/sections/installation-proof";
import { TrustProof } from "@/components/sections/trust-proof";
import { CtaSection } from "@/components/sections/cta-section";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Protect Your Home or Business with the Right Security System",
  description:
    "CCTV, electric fencing, gate automation, video intercom and networking — professionally assessed, designed and installed across Greater Accra. Book a free site inspection.",
  path: "/",
  keywords: [
    "home security Accra",
    "CCTV installation Accra",
    "electric fencing Ghana",
    "free security site inspection Accra",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <ProblemNeed />
      </ScrollReveal>
      <ScrollReveal>
        <ServicesOverview />
      </ScrollReveal>
      <ScrollReveal variant="left">
        <WhyChooseUs />
      </ScrollReveal>
      <ScrollReveal>
        <PropertySegments />
      </ScrollReveal>
      <ScrollReveal>
        <InstallationProof />
      </ScrollReveal>
      <ScrollReveal>
        <TrustProof />
      </ScrollReveal>
      <ScrollReveal variant="scale" delayMs={40}>
        <CtaSection />
      </ScrollReveal>
    </>
  );
}
