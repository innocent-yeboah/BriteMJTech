"use client";

import { useEffect, useRef } from "react";
import { trackQuoteLead } from "@/lib/analytics";

const SESSION_KEY = "britemj_quote_lead_tracked";

/**
 * Fires GA4 generate_lead + Meta Lead once per thank-you visit session.
 */
export function QuoteLeadTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage blocked — still fire once this mount
    }
    fired.current = true;
    trackQuoteLead();
  }, []);

  return null;
}
