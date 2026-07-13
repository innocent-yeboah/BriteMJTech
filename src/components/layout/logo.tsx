import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies logo.
 * Redesigned monogram inspired by the official MJ mark:
 * stacked M/J, stepped right edge, red accent — refined for crisp SVG use.
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
      <MjMark className="h-11 w-auto shrink-0" />
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
 * Redesigned MJ mark — similar to the original, Fortune 500 polish.
 *
 * Construction (viewBox 0 0 80 108):
 * - Solid black vertical plate with an inward step on the right
 * - Bold geometric M (top) and J (bottom), stems optically aligned
 * - Clear gap between letters; J bar extends under the M
 * - Brand-red hairline tracing the stepped right edge
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
      viewBox="0 0 80 108"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Black plate — stepped right edge (signature silhouette) */}
      <path
        fill="#111111"
        d="
          M 8 4
          H 66
          V 62
          L 54 74
          V 104
          H 8
          Z
        "
      />

      {/* ——— M ———
          Equal stroke weight (~9 units). Peaks meet at optical center.
          Right stem aligns with J stem below. */}
      <path
        fill="#FFFFFF"
        d="
          M 18 48
          V 14
          H 27
          L 35.5 32
          L 44 14
          H 53
          V 48
          H 44
          V 30
          L 35.5 44
          L 27 30
          V 48
          Z
        "
      />

      {/* ——— J ———
          Stem continues the M's right column; bar reaches left under M.
          Short left terminal for a finished block-J. */}
      <path
        fill="#FFFFFF"
        d="
          M 44 56
          H 53
          V 92
          H 18
          V 83
          H 44
          Z
        "
      />
      <path
        fill="#FFFFFF"
        d="
          M 18 74
          H 27
          V 92
          H 18
          Z
        "
      />

      {/* Red accent — tracks the step exactly, slightly outside the plate */}
      <path
        d="M 67.6 4 V 61.2 L 55.6 73.2 V 104"
        fill="none"
        stroke="#E63946"
        strokeWidth="2.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
