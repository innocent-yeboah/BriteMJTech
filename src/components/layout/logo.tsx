import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies master logo.
 * The supplied artwork is a pictorial mark (no readable company name — confirmed
 * against the JPEG). Served directly (`unoptimized`). The file is already a
 * 9KB JPEG, and this project's Vercel image optimizer has rejected some static
 * files whose bytes did not match the extension. The header mark stays a
 * direct file so it does not depend on that service.
 *
 * Pass `wordmark` to set the company name in type beside the mark. Header and
 * footer use that lockup; admin and auth keep the mark alone.
 */
export function Logo({
  className,
  light = false,
  markOnly = false,
  wordmark = false,
}: {
  className?: string;
  light?: boolean;
  markOnly?: boolean;
  wordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        wordmark && "gap-2 sm:gap-2.5",
        className,
      )}
    >
      <Image
        src="/images/logo/brite-mj-technologies.jpg"
        alt={wordmark ? "" : "Brite MJ Technologies"}
        width={254}
        height={260}
        priority
        unoptimized
        className={cn(
          "shrink-0 object-contain",
          wordmark
            ? "h-10 w-auto sm:h-11 lg:h-12"
            : markOnly
              ? "h-auto w-auto max-h-10 max-w-full sm:max-h-11"
              : "h-auto w-auto max-h-12 max-w-full sm:max-h-14",
        )}
      />
      {wordmark ? <Wordmark light={light} /> : null}
    </span>
  );
}

function Wordmark({ light }: { light: boolean }) {
  return (
    <span className="flex min-w-0 flex-col justify-center leading-none">
      <span
        className={cn(
          "whitespace-nowrap font-heading text-[0.9375rem] font-bold leading-none tracking-tight",
          "sm:text-[1rem] lg:text-[1.125rem]",
          light
            ? "text-white"
            : "text-brand-950 group-hover:text-brand-700",
        )}
      >
        {siteConfig.shortName}
      </span>
      <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap">
        <span
          aria-hidden="true"
          className="h-px w-3 shrink-0 bg-accent"
        />
        <span
          className={cn(
            "font-heading text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.16em]",
            "sm:text-[0.625rem] sm:tracking-[0.2em]",
            light ? "text-white/75" : "text-brand-600",
          )}
        >
          {siteConfig.name.replace(siteConfig.shortName, "").trim()}
        </span>
      </span>
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
