import { cn } from "@/lib/utils";

type StatBadgeKind = "experience" | "projects" | "support";

const titles: Record<StatBadgeKind, string> = {
  experience: "Years of experience",
  projects: "Projects completed",
  support: "Round-the-clock support",
};

export function StatBadge({
  kind,
  className,
}: {
  kind: StatBadgeKind;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center",
        className,
      )}
      role="img"
      aria-label={titles[kind]}
    >
      {kind === "experience" ? <ExperienceBadge /> : null}
      {kind === "projects" ? <ProjectsBadge /> : null}
      {kind === "support" ? <SupportBadge /> : null}
    </span>
  );
}

function ExperienceBadge() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="exp-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="55%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#b91c28" />
        </linearGradient>
        <linearGradient id="exp-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <path d="M14 22 L11 36 L20 30 L29 36 L26 22 Z" fill="url(#exp-ribbon)" />
      <circle cx="20" cy="16" r="12" fill="url(#exp-face)" />
      <circle
        cx="20"
        cy="16"
        r="9.5"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.25"
      />
      <path
        d="M20 8.5l1.7 3.45 3.8.55-2.75 2.68.65 3.8L20 17.2l-3.4 1.78.65-3.8-2.75-2.68 3.8-.55L20 8.5z"
        fill="#fff"
      />
    </svg>
  );
}

function ProjectsBadge() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="proj-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="50%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>
      <path
        d="M20 3.5c4.2 2.8 7.8 3.8 11.5 3.8v11.2c0 7.4-4.8 12.4-11.5 15.2C13.3 30.9 8.5 25.9 8.5 18.5V7.3C12.2 7.3 15.8 6.3 20 3.5z"
        fill="url(#proj-face)"
      />
      <path
        d="M20 6.2c3.5 2.2 6.5 3 9.5 3v9.3c0 5.8-3.7 9.7-9.5 12.1-5.8-2.4-9.5-6.3-9.5-12.1V9.2c3 0 6-.8 9.5-3z"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.1"
      />
      <path
        d="M14.2 18.2l3.6 3.6 8-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SupportBadge() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-md" aria-hidden="true">
      <defs>
        <linearGradient id="sup-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="55%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#b91c28" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="15" fill="url(#sup-face)" />
      <circle
        cx="20"
        cy="20"
        r="12"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <circle cx="20" cy="20" r="1.6" fill="#fff" />
      <path
        d="M20 11.5v9l5.2 3.1"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="8.2" r="1.1" fill="#fff" />
      <circle cx="31.8" cy="20" r="1.1" fill="#fff" />
      <circle cx="8.2" cy="20" r="1.1" fill="#fff" />
    </svg>
  );
}
