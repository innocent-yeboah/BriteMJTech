import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "Smart Security Systems for Home and Business",
  description:
    "Get a free site inspection and professional security solutions. CCTV, fencing, networking, and more.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <StatsBand />
      <WhyChooseUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
