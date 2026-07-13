import { cn } from "@/lib/utils";

export type TrustMarkKind =
  | "inspection"
  | "certified"
  | "support"
  | "quality";

const titles: Record<TrustMarkKind, string> = {
  inspection: "Free site inspection",
  certified: "Certified installations",
  support: "24/7 support",
  quality: "Quality guaranteed",
};

export function TrustMark({
  kind,
  className,
}: {
  kind: TrustMarkKind;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center",
        className,
      )}
      role="img"
      aria-label={titles[kind]}
    >
      {kind === "inspection" ? <InspectionMark /> : null}
      {kind === "certified" ? <CertifiedMark /> : null}
      {kind === "support" ? <SupportMark /> : null}
      {kind === "quality" ? <QualityMark /> : null}
    </span>
  );
}

function InspectionMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-sm" aria-hidden="true">
      <defs>
        <linearGradient id="tm-insp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="55%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#b91c28" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="30" height="30" rx="8" fill="url(#tm-insp)" />
      <rect
        x="8.5"
        y="8.5"
        width="23"
        height="23"
        rx="5.5"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      <path
        d="M14 12.5h12v17H14z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M16.5 12.5v-1.2a3.5 3.5 0 0 1 7 0v1.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M17 19h6M17 23h6M17 27h3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="27.5" cy="27" r="5.2" fill="#fff" />
      <path
        d="M27.5 24.2v3.3l2.2 1.3"
        fill="none"
        stroke="#e63946"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CertifiedMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-sm" aria-hidden="true">
      <defs>
        <linearGradient id="tm-cert" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="50%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>
      <path
        d="M20 3.8l2.4 4.2 4.8.9-3.3 3.6.6 4.9L20 15.2l-4.5 2.2.6-4.9-3.3-3.6 4.8-.9L20 3.8z"
        fill="url(#tm-cert)"
      />
      <circle cx="20" cy="22" r="12" fill="url(#tm-cert)" />
      <circle
        cx="20"
        cy="22"
        r="9.2"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.15"
      />
      <path
        d="M15.2 22.1l3.1 3.1 6.6-6.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SupportMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-sm" aria-hidden="true">
      <defs>
        <linearGradient id="tm-sup" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="55%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#b91c28" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="15" fill="url(#tm-sup)" />
      <circle
        cx="20"
        cy="20"
        r="12"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.1"
      />
      <path
        d="M12.5 18.5a7.5 7.5 0 0 1 15 0"
        fill="none"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <rect x="11" y="18" width="4.2" height="7.2" rx="2.1" fill="#fff" />
      <rect x="24.8" y="18" width="4.2" height="7.2" rx="2.1" fill="#fff" />
      <path
        d="M27 25.2v1.6a3.2 3.2 0 0 1-3.2 3.2h-2.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="20" cy="29.5" r="1.5" fill="#fff" />
    </svg>
  );
}

function QualityMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-sm" aria-hidden="true">
      <defs>
        <linearGradient id="tm-qual" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b75" />
          <stop offset="55%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#b91c28" />
        </linearGradient>
        <linearGradient id="tm-qual-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <path d="M14.5 23 L11.5 36 L20 30.5 L28.5 36 L25.5 23 Z" fill="url(#tm-qual-ribbon)" />
      <circle cx="20" cy="16.5" r="12.5" fill="url(#tm-qual)" />
      <circle
        cx="20"
        cy="16.5"
        r="9.8"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.15"
      />
      <path
        d="M20 9.2l1.55 3.15 3.45.5-2.5 2.45.6 3.45L20 16.95l-3.1 1.8.6-3.45-2.5-2.45 3.45-.5L20 9.2z"
        fill="#fff"
      />
    </svg>
  );
}
