"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Transition =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "zoom"
  | "blur";

const TRANSITIONS: Transition[] = [
  "fade",
  "slide-left",
  "slide-right",
  "slide-up",
  "zoom",
  "blur",
];

export interface SlideshowImage {
  src: string;
  alt: string;
}

interface ImageSlideshowProps {
  images: SlideshowImage[];
  intervalMs?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  label?: string;
}

/**
 * Auto-advancing image slideshow that picks a random CSS transition
 * for each slide change. Respects prefers-reduced-motion.
 */
export function ImageSlideshow({
  images,
  intervalMs = 4200,
  className,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  label = "Service photos",
}: ImageSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [transition, setTransition] = useState<Transition>("fade");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
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
      if (animating || next === index || images.length < 2) return;
      setPrevIndex(index);
      setTransition(pickTransition());
      setAnimating(true);
      setIndex(next);
      window.setTimeout(() => setAnimating(false), reducedMotion ? 0 : 900);
    },
    [animating, index, images.length, pickTransition, reducedMotion],
  );

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = window.setInterval(() => {
      goTo((index + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, images.length, intervalMs, index, goTo]);

  if (images.length === 0) return null;

  const current = images[index];
  const previous = images[prevIndex];

  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-950 shadow-card",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {/* Outgoing slide */}
      {animating && previous ? (
        <div
          className={cn(
            "absolute inset-0",
            reducedMotion ? "opacity-0" : exitClass(transition),
          )}
          aria-hidden="true"
        >
          <Image
            src={previous.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Incoming / current slide */}
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
          sizes={sizes}
          priority={priority && index === 0}
          className="object-cover"
        />
      </div>

      {/* Soft vignette for polish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/35 via-transparent to-transparent"
      />

      <span className="sr-only" aria-live="polite">
        Photo {index + 1} of {images.length}
      </span>
    </div>
  );
}

function enterClass(t: Transition): string {
  switch (t) {
    case "fade":
      return "animate-slide-fade-in";
    case "slide-left":
      return "animate-slide-in-left";
    case "slide-right":
      return "animate-slide-in-right";
    case "slide-up":
      return "animate-slide-in-up";
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
    case "slide-right":
      return "animate-slide-out-right";
    case "slide-up":
      return "animate-slide-out-up";
    case "zoom":
      return "animate-slide-zoom-out";
    case "blur":
      return "animate-slide-blur-out";
  }
}
