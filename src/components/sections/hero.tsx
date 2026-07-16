"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  HeroSlideshow,
  type HeroSlide,
} from "@/components/sections/hero-slideshow";
import { Logo } from "@/components/layout/logo";

const INTERVAL_MS = 8000;

/** Cropped landscape hero clips from the services-page demo videos. */
const heroSlides: HeroSlide[] = [
  {
    src: "/videos/hero/cctv-hero.jpg",
    video: "/videos/hero/cctv-hero.mp4",
    alt: "CCTV surveillance monitoring in a professional office installation",
    position: "object-[center_40%]",
    eyebrow: "CCTV Camera Installation",
    headline: [
      { text: "See everything." },
      { text: "Miss nothing.", accent: true },
    ],
    description:
      "Crystal-clear cameras for homes and businesses across Accra — live on your phone, day or night.",
  },
  {
    src: "/videos/hero/gate-hero.jpg",
    video: "/videos/hero/gate-hero.mp4",
    alt: "Automated remote gate control opening for a vehicle",
    position: "object-[center_45%]",
    eyebrow: "Remote Gate Control",
    headline: [
      { text: "Open the gate." },
      { text: "Keep control.", accent: true },
    ],
    description:
      "Smartphone and remote access so authorised people get in easily — and everyone else stays out.",
  },
  {
    src: "/videos/hero/smart-hero.jpg",
    video: "/videos/hero/smart-hero.mp4",
    alt: "Smart security system with app-controlled protection",
    position: "object-[center_42%]",
    eyebrow: "Smart Security Systems",
    headline: [
      { text: "One system." },
      { text: "Total peace of mind.", accent: true },
    ],
    description:
      "Cameras, access, and alerts working together — designed, installed, and supported by Brite MJ.",
  },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[activeIndex] ?? heroSlides[0];

  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative isolate min-h-[min(92vh,820px)] overflow-hidden bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroSlideshow slides={heroSlides} activeIndex={activeIndex} />

      {/* Readable left wash — keeps photography/video dominant on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-brand-950/85 via-brand-950/50 to-transparent md:from-brand-950/75 md:via-brand-950/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-950/55 to-transparent"
      />

      <Container className="relative flex min-h-[min(92vh,820px)] items-center py-24 md:py-28">
        <div className="max-w-2xl">
          <div key={activeIndex} className="animate-fade-up">
            <Logo light className="mb-8 h-11 sm:h-12" />

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              {slide.eyebrow}
            </p>

            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.08] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl">
              {slide.headline.map((part, i) => (
                <span key={`${part.text}-${i}`}>
                  {i > 0 ? <br className="hidden sm:block" /> : null}
                  {i > 0 ? <span className="sm:hidden"> </span> : null}
                  {part.accent ? (
                    <span className="text-accent">{part.text}</span>
                  ) : (
                    part.text
                  )}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/92 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
              {slide.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/quote" variant="accent" size="lg">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/services" variant="white" size="lg">
              Explore Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
