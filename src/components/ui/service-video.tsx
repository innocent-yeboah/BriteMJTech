"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Autoplaying service demo video — muted by default for browser policies,
 * with an optional unmute control. Only mounts the media once scrolled into view.
 */
export function ServiceVideo({
  src,
  poster,
  label,
  fit = "cover",
  showSoundControl = true,
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  fit?: "cover" | "contain";
  showSoundControl?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    node.muted = muted;
    if (reducedMotion) {
      node.pause();
      return;
    }
    void node.play().catch(() => {
      /* Autoplay can still be blocked; poster remains visible. */
    });
  }, [muted, reducedMotion, inView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-950 shadow-card",
        className,
      )}
    >
      {inView && !reducedMotion ? (
        <video
          ref={ref}
          className={cn(
            "absolute inset-0 h-full w-full",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
          src={src}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        />
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster fallback before video hydrates
        <img
          src={poster}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent"
      />

      {showSoundControl && inView && !reducedMotion ? (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>
  );
}
