"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
};

type ParticleCanvasProps = {
  className?: string;
  /** Soft brand-navy particle field for ambient depth. */
  density?: number;
  interactRadius?: number;
  mode?: "repel" | "attract";
};

const HIDDEN_PREFIXES = ["/admin", "/auth"];

/**
 * Full-bleed interactive particle field — lightweight canvas (no tsparticles)
 * so the marketing site stays fast while feeling alive under the cursor.
 */
export function ParticleCanvas({
  className,
  density = 0.00009,
  interactRadius = 120,
  mode = "repel",
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const disabled = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let particles: Particle[] = [];

    const mouse = { x: -9999, y: -9999, active: false };
    const radiusSq = interactRadius * interactRadius;
    const forceSign = mode === "attract" ? 1 : -1;
    const linkDistance = 110;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        48,
        Math.min(220, Math.floor(width * height * density)),
      );
      const cols = Math.ceil(Math.sqrt(count * (width / Math.max(height, 1))));
      const rows = Math.ceil(count / cols);
      const gapX = width / (cols + 1);
      const gapY = height / (rows + 1);

      particles = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (particles.length >= count) break;
          const ox = gapX * (col + 1) + (Math.random() - 0.5) * gapX * 0.35;
          const oy = gapY * (row + 1) + (Math.random() - 0.5) * gapY * 0.35;
          particles.push({
            x: ox,
            y: oy,
            ox,
            oy,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            size: 1.1 + Math.random() * 1.6,
          });
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !reducedMotion) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(30, 58, 95, 0.28)";
        ctx.arc(p.ox, p.oy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running || reducedMotion) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Gentle autonomous drift around home position.
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx += (p.ox - p.x) * 0.01;
        p.vy += (p.oy - p.y) * 0.01;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((interactRadius - dist) / interactRadius) * 0.9;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += nx * force * forceSign;
            p.vy += ny * force * forceSign;
          }
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = "rgba(30, 58, 95, 0.35)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparse links between nearby particles for a subtle grid texture.
      for (let i = 0; i < particles.length; i += 3) {
        const a = particles[i];
        for (let j = i + 1; j < Math.min(i + 8, particles.length); j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDistance * linkDistance) {
            const alpha = 0.12 * (1 - Math.sqrt(distSq) / linkDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(30, 58, 95, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (reducedMotion) {
      drawStatic();
    } else {
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, disabled, interactRadius, mode]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[5] h-full w-full mix-blend-multiply opacity-80",
        className,
      )}
    />
  );
}
