"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Autoplaying service demo video — muted by default for browser policies,
 * with an optional unmute control. Loops seamlessly in the media panel.
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
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.muted = muted;
    if (reducedMotion) {
      node.pause();
      return;
    }
    void node.play().catch(() => {
      /* Autoplay can still be blocked; poster remains visible. */
    });
  }, [muted, reducedMotion]);

  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-950 shadow-card",
        className,
      )}
    >
      {fit === "contain" && !reducedMotion ? (
        <video
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
          src={src}
          muted
          loop
          playsInline
          autoPlay={!reducedMotion}
          aria-hidden="true"
        />
      ) : null}
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full",
          fit === "contain" ? "object-contain" : "object-cover",
        )}
        src={src}
        poster={poster}
        autoPlay={!reducedMotion}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent"
      />

      {showSoundControl ? (
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
