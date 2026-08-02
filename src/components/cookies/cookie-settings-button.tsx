"use client";

import { openCookiePreferences } from "@/lib/cookies";

export function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className={className}
    >
      Cookie settings
    </button>
  );
}
