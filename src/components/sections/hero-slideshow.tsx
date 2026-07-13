"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Transition = "fade" | "slide-left" | "zoom" | "blur";

const TRANSITIONS: Transition[] = ["fade", "slide-left", "zoom", "blur"];

export interface HeroSlide {
  src: string;
  alt: string;
  position?: string;
  eyebrow: string;
  headline: { text: string; accent?: boolean }[];
  description: string;
}

/**
 * Full-bleed hero background. Parent owns the active index so copy stays synced.
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
          <Image
            src={previous.src}
            alt=""
            fill
            sizes="100vw"
            className={cn("object-cover", previous.position ?? "object-center")}
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
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority={displayIndex === 0}
          sizes="100vw"
          className={cn("object-cover", current.position ?? "object-center")}
        />
      </div>
    </div>
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
