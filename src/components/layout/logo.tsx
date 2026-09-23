import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies master logo.
 * The supplied full logo artwork is the single source of truth.
 * `unoptimized` bypasses the Next image optimizer, which has failed for
 * static assets on this project's Vercel deploy.
 */
export function Logo({
  className,
  light = false,
  markOnly = false,
}: {
  className?: string;
  light?: boolean;
  markOnly?: boolean;
}) {
  void light;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/logo/brite-mj-technologies.jpg"
        alt="Brite MJ Technologies — Smart Systems. Stronger Protection."
        width={1000}
        height={1000}
        priority
        unoptimized
        className={cn(
          "h-auto w-auto max-w-full object-contain",
          markOnly ? "max-h-10 sm:max-h-11" : "max-h-12 sm:max-h-14",
        )}
      />
    </span>
  );
}

export function MjMark({
  className,
  title = "Brite MJ Technologies",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src="/images/logo/brite-mj-technologies.jpg"
      alt={title}
      width={1000}
      height={1000}
      priority
      unoptimized
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
