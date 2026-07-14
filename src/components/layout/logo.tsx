import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies logo — stacked MJ monogram + wordmark.
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
            Brite{" "}
            <span className="text-accent">MJ</span>
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
 * MJ mark — geometric stacked monogram.
 * Deep navy plate, white letterforms, brand-red edge accent.
 */
export function MjMark({
  className,
  title = "Brite MJ Technologies",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 72 100"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Navy plate with crisp stepped right edge */}
      <path
        fill="#0A2540"
        d="M6 2h50v54l-12 12v30H6Z"
      />

      {/* Red accent bar — filled path for sharp edges at any size */}
      <path
        fill="#E63946"
        d="M56 2h3.5v54.6L47.2 69.9V98H44V68.2L56 56.2Z"
      />

      {/* M — equal stems, clean center join */}
      <path
        fill="#FFFFFF"
        d="
          M16 44V12h8.2l7.3 16.8L38.8 12H47v32h-8.2V26.4L31.5 40.2 24.2 26.4V44Z
        "
      />

      {/* J — stem aligns with M right column; bar finishes under the M */}
      <path
        fill="#FFFFFF"
        d="
          M38.8 52H47v34.5H16V78h22.8V52Z
        "
      />
      <path
        fill="#FFFFFF"
        d="M16 68.5h8.2V86.5H16Z"
      />
    </svg>
  );
}
