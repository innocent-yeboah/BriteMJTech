"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";
import {
  HeroSlideshow,
  type HeroSlide,
} from "@/components/sections/hero-slideshow";

/** CCTV installation footage (same clip as Services → CCTV Camera Installation). */
const heroSlides: HeroSlide[] = [
  {
    src: "/videos/cctv-office.jpg",
    video: "/videos/cctv-office.mp4",
    alt: "Brite MJ Technologies CCTV camera installation for office and business security",
    position: "object-center",
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
 * First-viewport hero: brand promise, one supporting line, Quote + WhatsApp.
 * Longer persuasive copy lives below the fold in other sections.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <HeroSlideshow slides={heroSlides} activeIndex={0} />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-transparent to-brand-950/55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-950/50 to-transparent"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Brite MJ Technologies · Accra
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl">
              Smart Security Systems for Home and Business
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)] sm:text-lg">
              CCTV, fencing, gate control, and smart access — professionally
              installed across Greater Accra. Free site inspection. No pressure.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/quote" variant="primary" size="lg">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Button>
            <WhatsAppCtaButton
              placement="hero"
              variant="white"
              label="WhatsApp Us"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
