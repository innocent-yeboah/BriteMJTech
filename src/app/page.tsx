import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Smart Security Systems for Home and Business",
  description:
    "CCTV, fencing, networking, and smart access systems for homes and businesses in Accra. Free site inspection. No pressure — just expert advice.",
  path: "/",
  keywords: [
    "home security Accra",
    "business CCTV Ghana",
    "free security inspection Accra",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <ServicesOverview />
      </ScrollReveal>
      <ScrollReveal delayMs={60}>
        <StatsBand />
      </ScrollReveal>
      <ScrollReveal variant="left">
        <WhyChooseUs />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal variant="scale" delayMs={40}>
        <CtaSection />
      </ScrollReveal>
    </>
  );
}
