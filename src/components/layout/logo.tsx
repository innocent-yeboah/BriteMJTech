import { cn } from "@/lib/utils";

/**
 * Brite MJ Technologies wordmark + shield mark.
 * Pure SVG/CSS so it stays crisp at any size and needs no image asset.
 * REPLACE with the client's official logo file when available.
 */
export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2L4 5v6c0 4.5 3.2 8.4 8 9.9 4.8-1.5 8-5.4 8-9.9V5l-8-3z"
            fill="currentColor"
            opacity="0.15"
          />
          <path
            d="M12 2L4 5v6c0 4.5 3.2 8.4 8 9.9 4.8-1.5 8-5.4 8-9.9V5l-8-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12.2l2.4 2.4 4.6-4.8"
            stroke="#E63946"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-extrabold tracking-tight",
            light ? "text-white" : "text-brand-950",
          )}
        >
          Brite<span className="text-accent">MJ</span>
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.18em]",
            light ? "text-brand-100" : "text-slate-500",
          )}
        >
          Technologies
        </span>
      </span>
    </span>
  );
}
