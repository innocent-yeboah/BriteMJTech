"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Headphones,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  HeroSlideshow,
  type HeroSlide,
} from "@/components/sections/hero-slideshow";

const INTERVAL_MS = 8000;

const leadHooks = [
  {
    label: "Ready when you are",
    question:
      "Are you ready to finally secure your property and protect what matters most?",
    copy:
      "You have thought about security for a while. You have seen the news, heard the stories, and maybe felt that uneasy feeling late at night. You are ready to protect your family, your business, and your peace of mind. We are here to help you take that next step.",
  },
  {
    label: "A better way forward",
    question:
      "Are you frustrated that you still do not have proper security in place?",
    copy:
      "You have worried about it and told yourself you would get to it. Living without the right protection can feel uncertain, but choosing a solution does not need to be stressful. We will help you understand the options and choose what genuinely fits your property.",
  },
  {
    label: "A clear process",
    question: "What if getting security was easier than you thought?",
    copy:
      "We do not just sell equipment. We assess your property, understand your needs, recommend the right systems, install them professionally, and support you long after installation. The process is straightforward, transparent, and built around you.",
  },
] as const;

const trustIndicators = [
  { label: "Free Site Inspection", icon: ClipboardCheck },
  { label: "Certified Installations", icon: BadgeCheck },
  { label: "24/7 Support", icon: Headphones },
] as const;

/** On-site installation footage for the homepage hero. */
const heroSlides: HeroSlide[] = [
  {
    src: "/videos/hero/hero-main.jpg",
    video: "/videos/hero/hero-main.mp4",
    alt: "Brite MJ Technologies technician installing security fencing on site",
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

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative isolate overflow-hidden bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroSlideshow slides={heroSlides} activeIndex={activeIndex} />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-950/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-950/25 via-brand-950/40 to-brand-950/70"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Welcome to Brite MJ Technologies
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl">
              Smart Security Systems for Home and Business
            </h1>
            <p className="mx-auto mt-5 max-w-3xl font-heading text-xl font-semibold leading-relaxed text-accent drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)] sm:text-2xl">
              You have been thinking about security. Let us make it happen.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)] sm:text-lg">
              Smart security systems for your home, business, and peace of mind.
            </p>
          </div>

          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {leadHooks.map((hook, index) => (
              <article
                key={hook.label}
                className="rounded-2xl border border-white/15 bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 font-heading text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    {hook.label}
                  </p>
                </div>
                <h2 className="mt-5 font-heading text-xl font-bold leading-snug text-brand-950">
                  {hook.question}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {hook.copy}
                </p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-9 max-w-2xl text-lg leading-relaxed text-white">
            Contact us today for a free site inspection. No pressure. Just a
            conversation.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/quote" variant="primary" size="lg">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/services" variant="white" size="lg">
              Explore Our Services
            </Button>
          </div>

          <ul className="mt-8 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-white/90 sm:flex-row sm:gap-8">
            {trustIndicators.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
