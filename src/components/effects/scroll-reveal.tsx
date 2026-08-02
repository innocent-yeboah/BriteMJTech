"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "fade" | "left" | "right" | "scale";

const variantHidden: Record<RevealVariant, string> = {
  up: "translate-y-8 opacity-0",
  fade: "opacity-0",
  left: "-translate-x-8 opacity-0",
  right: "translate-x-8 opacity-0",
  scale: "scale-[0.97] opacity-0",
};

/**
 * Reveals children once when they enter the viewport — soft fade / slide
 * for marketing sections. Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  variant = "up",
  delayMs = 0,
  durationMs = 700,
  as: Tag = "div",
  once = true,
  threshold = 0.16,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  as?: ElementType;
  once?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reduceMotion, threshold]);

  const style: CSSProperties | undefined = reduceMotion
    ? undefined
    : {
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
      };

  return (
    <Tag
      ref={ref}
      className={cn(
        !reduceMotion && "will-change-[opacity,transform]",
        !reduceMotion && !visible && variantHidden[variant],
        !reduceMotion && visible && "translate-x-0 translate-y-0 scale-100 opacity-100",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
