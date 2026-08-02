"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin reading-progress bar along the top of public pages.
 * Hidden on admin/auth and when the user prefers reduced motion.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const hide =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  useEffect(() => {
    if (hide) {
      setEnabled(false);
      return;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hide, pathname]);

  if (!enabled || hide) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-brand-950/10"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
