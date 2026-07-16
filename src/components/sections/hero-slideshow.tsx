"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Transition = "fade" | "slide-left" | "zoom" | "blur";

const TRANSITIONS: Transition[] = ["fade", "slide-left", "zoom", "blur"];

export interface HeroSlide {
  /** Still image fallback / poster */
  src: string;
  /** Optional looping background video (hero crop) */
  video?: string;
  alt: string;
  position?: string;
  eyebrow: string;
  headline: { text: string; accent?: boolean }[];
  description: string;
}

/**
 * Full-bleed hero media plane — video when available, still image otherwise.
 * Parent owns the active index so copy stays synced.
 */
export function HeroSlideshow({
  slides,
  activeIndex,
}: {
  slides: HeroSlide[];
  activeIndex: number;
}) {
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [prevIndex, setPrevIndex] = useState(activeIndex);
  const [transition, setTransition] = useState<Transition>("fade");
  const [animating, setAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastTransition = useRef<Transition>("fade");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (activeIndex === displayIndex) return;

    const pool = TRANSITIONS.filter((t) => t !== lastTransition.current);
    const next =
      reducedMotion
        ? "fade"
        : (pool[Math.floor(Math.random() * pool.length)] ?? "fade");
    lastTransition.current = next;

    setPrevIndex(displayIndex);
    setTransition(next);
    setAnimating(true);
    setDisplayIndex(activeIndex);

    const timeout = window.setTimeout(
      () => setAnimating(false),
      reducedMotion ? 0 : 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [activeIndex, displayIndex, reducedMotion]);

  if (slides.length === 0) return null;

  const current = slides[displayIndex] ?? slides[0];
  const previous = slides[prevIndex] ?? slides[0];

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {animating && previous ? (
        <div
          className={cn(
            "absolute inset-0",
            reducedMotion ? "opacity-0" : exitClass(transition),
          )}
        >
          <HeroMedia
            slide={previous}
            reducedMotion={reducedMotion}
            active={false}
          />
        </div>
      ) : null}

      <div
        key={`${displayIndex}-${transition}-${animating}`}
        className={cn(
          "absolute inset-0",
          animating && !reducedMotion ? enterClass(transition) : "opacity-100",
        )}
      >
        <HeroMedia
          slide={current}
          reducedMotion={reducedMotion}
          active
          priority={displayIndex === 0}
        />
      </div>
    </div>
  );
}

function HeroMedia({
  slide,
  reducedMotion,
  active,
  priority = false,
}: {
  slide: HeroSlide;
  reducedMotion: boolean;
  active: boolean;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !slide.video) return;
    if (reducedMotion || !active) {
      node.pause();
      return;
    }
    node.currentTime = 0;
    void node.play().catch(() => {
      /* Autoplay blocked — poster remains visible. */
    });
  }, [active, reducedMotion, slide.video]);

  const objectClass = cn(
    "object-cover",
    // Zoom in on portrait phones so landscape clips fill the frame
    "scale-[1.5] sm:scale-125 md:scale-110 lg:scale-100",
    "origin-center transition-transform duration-700",
    slide.position ?? "object-center",
  );

  if (slide.video && !reducedMotion) {
    return (
      <>
        <video
          ref={videoRef}
          className={cn("absolute inset-0 h-full w-full", objectClass)}
          src={slide.video}
          poster={slide.src}
          muted
          loop
          playsInline
          preload={active || priority ? "auto" : "metadata"}
          autoPlay={active}
        />
        {/* Soft film grade so text stays readable without washing out the shot */}
        <div className="absolute inset-0 bg-brand-950/20 mix-blend-multiply" />
      </>
    );
  }

  return (
    <Image
      src={slide.src}
      alt={slide.alt}
      fill
      priority={priority}
      sizes="100vw"
      className={objectClass}
    />
  );
}

function enterClass(t: Transition): string {
  switch (t) {
    case "fade":
      return "animate-slide-fade-in";
    case "slide-left":
      return "animate-slide-in-left";
    case "zoom":
      return "animate-slide-zoom-in";
    case "blur":
      return "animate-slide-blur-in";
  }
}

function exitClass(t: Transition): string {
  switch (t) {
    case "fade":
      return "animate-slide-fade-out";
    case "slide-left":
      return "animate-slide-out-left";
    case "zoom":
      return "animate-slide-zoom-out";
    case "blur":
      return "animate-slide-blur-out";
  }
}
