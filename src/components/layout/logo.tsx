import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies master logo.
 * The supplied full logo artwork is the single source of truth.
 * Served directly (`unoptimized`). The file is already a 9KB JPEG, and this
 * project's Vercel image optimizer has rejected some static files whose bytes
 * did not match the extension (JPEG or WebP saved as `.png`). Those photos
 * are now real WebP and use the optimizer again. The header mark stays a
 * direct file so it does not depend on that service.
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
        width={254}
        height={260}
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
      width={254}
      height={260}
      priority
      unoptimized
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
