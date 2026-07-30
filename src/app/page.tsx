import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqJsonLd } from "@/components/structured-data";
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

const homeFaqs = [
  {
    question: "Do you offer a free site inspection in Accra?",
    answer:
      "Yes. Brite MJ Technologies provides a free site inspection so we can recommend the right CCTV, fencing, or access system for your property.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We install and support security systems across Accra and Greater Accra, including Spintex, East Legon, Tema, Osu, and surrounding communities.",
  },
  {
    question: "What security systems do you install?",
    answer:
      "We install CCTV cameras, security and electric fencing, networking, remote gate control, video intercom, and smart security systems for homes, businesses, and institutions.",
  },
];

export default function HomePage() {
  return (
    <>
      <FaqJsonLd items={homeFaqs} />
      <Hero />
      <ServicesOverview />
      <StatsBand />
      <WhyChooseUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
