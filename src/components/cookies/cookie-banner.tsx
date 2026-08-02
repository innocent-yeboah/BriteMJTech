"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  acceptedAllConsent,
  defaultEssentialConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookies";

/**
 * Cookie notice for public pages. Essential cookies always run; analytics /
 * marketing stay off until the visitor accepts (ready for future trackers).
 */
export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hideOnPrivate =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  useEffect(() => {
    setMounted(true);
    if (hideOnPrivate) {
      setVisible(false);
      return;
    }

    const existing = readCookieConsent();
    setVisible(!existing);

    const onOpenPreferences = () => setVisible(true);
    window.addEventListener("britemj:cookie-preferences", onOpenPreferences);
    return () => {
      window.removeEventListener(
        "britemj:cookie-preferences",
        onOpenPreferences,
      );
    };
  }, [hideOnPrivate]);

  useEffect(() => {
    if (!mounted || hideOnPrivate) return;
    document.documentElement.dataset.cookieBanner = visible ? "open" : "closed";
    return () => {
      delete document.documentElement.dataset.cookieBanner;
    };
  }, [mounted, visible, hideOnPrivate]);

  if (!mounted || hideOnPrivate || !visible) return null;

  const save = (consent: CookieConsent) => {
    writeCookieConsent(consent);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-4 bottom-24 z-40 md:bottom-6 md:left-6 md:right-auto md:max-w-md"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card-hover">
        <h2
          id="cookie-banner-title"
          className="font-heading text-base font-bold text-brand-950"
        >
          Cookies on this site
        </h2>
        <p
          id="cookie-banner-desc"
          className="mt-2 text-sm leading-relaxed text-slate-600"
        >
          We use essential cookies to keep the site secure and run staff login.
          Optional analytics or marketing cookies stay off unless you accept.
          See our{" "}
          <Link
            href="/privacy#cookies"
            className="font-medium text-brand-800 underline underline-offset-2 hover:text-accent"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => save(acceptedAllConsent())}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => save(defaultEssentialConsent())}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-slate-50"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
