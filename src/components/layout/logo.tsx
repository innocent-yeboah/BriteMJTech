import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies logo — official MJ mark + wordmark.
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
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <MjMark className="h-10 w-auto shrink-0 sm:h-11" />
      {!markOnly ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-heading text-[1.125rem] font-extrabold tracking-[-0.02em]",
              light ? "text-white" : "text-brand-950",
            )}
          >
            Brite <span className="text-accent">MJ</span>
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-semibold uppercase tracking-[0.28em]",
              light ? "text-brand-100/85" : "text-slate-500",
            )}
          >
            Technologies
          </span>
        </span>
      ) : null}
    </span>
  );
}

/**
 * Official MJ mark — black plate, white monogram, red edge accent.
 */
export function MjMark({
  className,
  title = "Brite MJ Technologies",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src="/images/logo/mj-mark.png"
      alt={title}
      width={254}
      height={260}
      priority
      className={cn("h-10 w-auto object-contain sm:h-11", className)}
    />
  );
}
