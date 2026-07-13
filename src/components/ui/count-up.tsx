"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animates a number from 0 to `value` when it first enters the viewport
 * (or immediately if `startOnMount` is true). Respects reduced motion.
 */
export function CountUp({
  value,
  durationMs = 1600,
  suffix = "",
  prefix = "",
  className,
  startOnMount = true,
}: {
  value: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  startOnMount?: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(value);
      return;
    }

    if (!startOnMount) {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    // Small delay so the hero mounts first, then the count feels intentional
    const kickoff = window.setTimeout(() => setStarted(true), 280);
    return () => window.clearTimeout(kickoff);
  }, [startOnMount, value]);

  useEffect(() => {
    if (!started) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // Ease-out cubic for a natural settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, durationMs]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
