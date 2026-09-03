/**
 * Consent-aware analytics helpers for GA4 and Meta Pixel.
 * Scripts only load after the visitor accepts analytics / marketing cookies.
 */

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || undefined;
}

export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

/** GA4 custom / recommended events (requires analytics consent). */
export function trackEvent(
  name: string,
  params: AnalyticsEventParams = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Meta Pixel standard or custom events (requires marketing consent). */
export function trackMeta(
  event: string,
  params: AnalyticsEventParams = {},
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/** Quote form completion — fire once on the thank-you page. */
export function trackQuoteLead(): void {
  trackEvent("generate_lead", {
    event_category: "quote",
    currency: "GHS",
  });
  trackMeta("Lead", {
    content_name: "quote_form",
    content_category: "security_quote",
  });
}

/** WhatsApp CTA clicks across the site. */
export function trackWhatsAppClick(placement: string): void {
  trackEvent("whatsapp_click", {
    event_category: "engagement",
    placement,
  });
  trackMeta("Contact", {
    content_name: `whatsapp_${placement}`,
  });
}

/** Click-to-call tracking. */
export function trackPhoneClick(placement: string): void {
  trackEvent("phone_click", {
    event_category: "engagement",
    placement,
  });
  trackMeta("Contact", {
    content_name: `phone_${placement}`,
  });
}
