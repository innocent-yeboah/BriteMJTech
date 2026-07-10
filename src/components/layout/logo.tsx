import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies logo — polished vector recreation of the official MJ mark.
 *
 * Preserves the client's signature stacked monogram and stepped red accent,
 * redrawn with Fortune 500 precision: optical balance, crisp geometry, and
 * a self-contained badge that reads on both light and dark surfaces.
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
      <MjMark className="h-11 w-auto shrink-0 drop-shadow-sm" />
      {!markOnly ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-heading text-[1.05rem] font-extrabold tracking-tight",
              light ? "text-white" : "text-brand-950",
            )}
          >
            Brite<span className="text-accent">MJ</span>
          </span>
          <span
            className={cn(
              "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
              light ? "text-brand-100/90" : "text-slate-500",
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
 * Official MJ monogram.
 * Black plate · white geometric M/J · brand-red stepped accent.
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
      viewBox="0 0 72 96"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Mark plate with stepped right edge */}
      <path d="M4 2H60V56L50 66V94H4Z" fill="#0B0B0B" />

      {/* M */}
      <path
        fill="#FFFFFF"
        d="M14 42V12H22L30.5 28L39 12H47V42H39V25.5L30.5 38L22 25.5V42Z"
      />

      {/* J — stem under M's right leg; bar extends left */}
      <path fill="#FFFFFF" d="M39 50H47V80H16V72.5H39Z" />

      {/* Brand-red accent along the step */}
      <path
        d="M61.25 2V55.4L51.25 65.4V94"
        fill="none"
        stroke="#E63946"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
