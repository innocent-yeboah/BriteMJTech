"use client";

import dynamic from "next/dynamic";

/**
 * Client-only ambient effects deferred from the initial JS bundle so the
 * first paint of marketing pages stays responsive.
 */
const ScrollProgress = dynamic(
  () =>
    import("@/components/effects/scroll-progress").then(
      (mod) => mod.ScrollProgress,
    ),
  { ssr: false },
);

export function DeferredEffects() {
  return <ScrollProgress />;
}
