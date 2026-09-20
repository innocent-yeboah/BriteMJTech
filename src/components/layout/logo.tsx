import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies brand lockup.
 * Uses the official MJ mark with a responsive black/red wordmark.
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
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <MjMark className="h-9 w-auto shrink-0 sm:h-10" />
      {!markOnly ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-heading text-[1.02rem] font-extrabold uppercase tracking-[-0.025em] sm:text-[1.2rem]",
              light ? "text-white" : "text-brand-950",
            )}
          >
            BRITE<span className="text-accent">MJ</span>
          </span>
          <span
            className={cn(
              "mt-1 text-[7px] font-bold uppercase tracking-[0.22em] sm:text-[8px] sm:tracking-[0.27em]",
              light ? "text-white/80" : "text-slate-500",
            )}
          >
            TECHNOLOGIES
          </span>
          <span
            className={cn(
              "mt-1 hidden text-[6px] font-semibold uppercase tracking-[0.08em] sm:block sm:text-[6.5px]",
              light ? "text-white/70" : "text-slate-400",
            )}
          >
            SMART SYSTEMS. <span className="text-accent">STRONGER</span> PROTECTION.
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
      className={cn("h-9 w-auto object-contain sm:h-10", className)}
    />
  );
}
