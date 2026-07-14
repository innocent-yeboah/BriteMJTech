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
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.muted = muted;
    void node.play().catch(() => {
      /* Autoplay can still be blocked; poster remains visible. */
    });
  }, [muted]);

  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-950 shadow-card",
        className,
      )}
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
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
    </div>
  );
}
