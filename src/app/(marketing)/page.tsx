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
  title: "CCTV, Fencing & Gate Security Installed in Accra",
  description:
    "We install CCTV, electric fencing, gate motors, video intercoms and networking across Accra. Free site visit before we quote.",
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
      <InstallationProof />
      <ScrollReveal>
        <TrustProof />
      </ScrollReveal>
      <ScrollReveal variant="scale" delayMs={40}>
        <CtaSection />
      </ScrollReveal>
    </>
  );
}
