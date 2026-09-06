"use client";

import { useEffect, useRef, useState } from "react";
import { trackQuoteLead } from "@/lib/analytics";
import { redeemQuoteConversionToken } from "@/app/actions/submit";

/**
 * Fires GA4 generate_lead + Meta Lead only after a server-issued one-time
 * conversion token is successfully redeemed.
 *
 * Direct visits / missing / invalid / reused / expired tokens do NOT fire Lead.
 */
export function QuoteLeadTracker({ token }: { token?: string }) {
  const attempted = useRef(false);
  const [status, setStatus] = useState<"idle" | "ok" | "denied">("idle");

  useEffect(() => {
    if (attempted.current) return;
    if (!token) {
      setStatus("denied");
      return;
    }

    attempted.current = true;
    let cancelled = false;

    void (async () => {
      const result = await redeemQuoteConversionToken(token);
      if (cancelled) return;
      if (result.ok) {
        trackQuoteLead();
        setStatus("ok");
      } else {
        setStatus("denied");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Invisible to users; status retained for debugging in React DevTools.
  return <span data-lead-track={status} className="hidden" aria-hidden="true" />;
}
