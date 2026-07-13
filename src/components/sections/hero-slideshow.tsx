"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Transition = "fade" | "slide-left" | "zoom" | "blur";

const TRANSITIONS: Transition[] = ["fade", "slide-left", "zoom", "blur"];

export interface HeroSlide {
  src: string;
  alt: string;
  /** Tailwind object-position for framing the subject. */
  position?: string;
}

/**
 * Full-bleed hero background slideshow with random transitions.
 */
export function HeroSlideshow({
  slides,
  intervalMs = 5500,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
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

  const pickTransition = useCallback((): Transition => {
    if (reducedMotion) return "fade";
    const pool = TRANSITIONS.filter((t) => t !== lastTransition.current);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? "fade";
    lastTransition.current = next;
    return next;
  }, [reducedMotion]);

  const goTo = useCallback(
    (next: number) => {
      if (animating || next === index || slides.length < 2) return;
      setPrevIndex(index);
      setTransition(pickTransition());
      setAnimating(true);
      setIndex(next);
      window.setTimeout(() => setAnimating(false), reducedMotion ? 0 : 1000);
    },
    [animating, index, slides.length, pickTransition, reducedMotion],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      goTo((index + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, index, goTo]);

  if (slides.length === 0) return null;

  const current = slides[index];
  const previous = slides[prevIndex];

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
        key={`${index}-${transition}-${animating}`}
        className={cn(
          "absolute inset-0",
          animating && !reducedMotion ? enterClass(transition) : "opacity-100",
        )}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
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
