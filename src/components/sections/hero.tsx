"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Award, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  HeroSlideshow,
  type HeroSlide,
} from "@/components/sections/hero-slideshow";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 6000;

const badges = [
  {
    icon: Award,
    value: 10,
    suffix: "+",
    label: "Years Experience",
    durationMs: 1400,
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: "+",
    label: "Projects Completed",
    durationMs: 1800,
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support",
    durationMs: 1200,
  },
];

const heroSlides: HeroSlide[] = [
  {
    src: "/images/hero/cctv-install.png",
    alt: "Brite MJ Technologies technician installing a CCTV security camera on site",
    position:
      "object-[60%_center] sm:object-[65%_center] lg:object-[70%_center]",
    eyebrow: "CCTV installation across Accra",
    headline: [
      { text: "Keep an eye on" },
      { text: "what matters most.", accent: true },
    ],
    description:
      "We install clear, reliable cameras so you can check in from your phone whenever you need to. Day or night, you’re covered.",
  },
  {
    src: "/images/hero/team-install.png",
    alt: "Brite MJ Technologies team installing security and networking systems",
    position: "object-[55%_center] lg:object-center",
    eyebrow: "People who show up and get it done",
    headline: [
      { text: "From the first visit" },
      { text: "to the final handover.", accent: true },
    ],
    description:
      "We walk your property with you, recommend what actually fits, then install and support it. No pressure, no guesswork.",
  },
  {
    src: "/images/hero/building-cctv.png",
    alt: "Technicians installing outdoor CCTV cameras on a commercial building",
    position: "object-[35%_center] lg:object-[40%_center]",
    eyebrow: "Homes, shops, offices, and schools",
    headline: [
      { text: "Security that fits" },
      { text: "the way you work.", accent: true },
    ],
    description:
      "One camera or a full building setup, we size it to your space and your budget. You get a system that works for you, not the other way around.",
  },
  {
    src: "/images/hero/site-work.png",
    alt: "Field technicians on a secured worksite with safety barriers",
    position: "object-[45%_center] lg:object-center",
    eyebrow: "Built for real sites in Ghana",
    headline: [
      { text: "Strong fencing." },
      { text: "Smart access. Real peace of mind.", accent: true },
    ],
    description:
      "We put up the barriers, gates, and networks that keep your site safe through the heat, the rain, and the long days on the job.",
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
      className="relative isolate min-h-[min(88vh,760px)] overflow-hidden bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroSlideshow slides={heroSlides} activeIndex={activeIndex} />

      <div aria-hidden="true" className="absolute inset-0 bg-brand-950/25" />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-brand-950/70 via-brand-950/45 to-transparent md:from-brand-950/55 md:via-brand-950/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-950/40 to-transparent"
      />

      <Container className="relative flex min-h-[min(88vh,760px)] items-center py-20 md:py-28">
        <div className="max-w-2xl">
          <div key={activeIndex} className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              {slide.eyebrow}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
              {slide.headline.map((part, i) => (
                <span key={`${part.text}-${i}`}>
                  {i > 0 ? " " : null}
                  {part.accent ? (
                    <span className="text-accent">{part.text}</span>
                  ) : (
                    part.text
                  )}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
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

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {badges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <span className="text-sm font-semibold text-white drop-shadow-sm">
                  <CountUp
                    value={badge.value}
                    suffix={badge.suffix}
                    durationMs={badge.durationMs}
                    className="text-base font-bold text-accent"
                  />{" "}
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-8 flex items-center gap-2"
            role="tablist"
            aria-label="Hero highlights"
          >
            {heroSlides.map((item, i) => (
              <button
                key={item.src}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show: ${item.eyebrow}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-8 bg-accent"
                    : "w-3 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
