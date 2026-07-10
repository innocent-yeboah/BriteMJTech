import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <StatsBand />
      <WhyChooseUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
