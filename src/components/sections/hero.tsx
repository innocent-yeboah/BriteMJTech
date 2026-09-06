"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";
import {
  HeroSlideshow,
  type HeroSlide,
} from "@/components/sections/hero-slideshow";

/** Professional CCTV installation still — primary hero visual. */
const heroSlides: HeroSlide[] = [
  {
    src: "/images/hero/install-technician.jpg",
    alt: "Brite MJ Technologies technician installing an outdoor CCTV security camera",
    position: "object-[center_35%]",
    eyebrow: "Security & Smart Systems",
    headline: [
      { text: "Protect what matters." },
      { text: "Professionally installed.", accent: true },
    ],
    description:
      "CCTV, fencing, access control, and smart systems for homes and businesses across Accra.",
  },
];

/**
 * First-viewport hero: assess → install positioning, site inspection + WhatsApp.
 * Longer persuasive copy lives below the fold.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <HeroSlideshow slides={heroSlides} activeIndex={0} />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-950/45 via-brand-950/25 to-brand-950/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-950/65 to-transparent"
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Brite MJ Technologies · Accra
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-[1.85rem] font-extrabold leading-[1.12] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl">
              Protect Your Home or Business with the Right Security System
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)] sm:text-lg">
              CCTV, electric fencing, gate automation, video intercom and
              networking — professionally designed and installed across Greater
              Accra. Start with a free site inspection and get a solution suited
              to your property.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/quote" variant="primary" size="lg">
              Book a Free Site Inspection <ArrowRight className="h-5 w-5" />
            </Button>
            <WhatsAppCtaButton
              placement="hero"
              variant="white"
              label="WhatsApp an Expert"
            />
          </div>

          <p className="mt-5 text-sm font-medium tracking-wide text-white/80">
            Site assessment · Professional installation · Handover &amp; support
          </p>
        </div>
      </Container>
    </section>
  );
}
