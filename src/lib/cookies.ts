export const COOKIE_CONSENT_KEY = "britemj_cookie_consent";

export type CookieConsent = {
  /** Always true — required for site security and staff login sessions. */
  essential: true;
  /** Optional analytics / measurement cookies (off until you enable a tracker). */
  analytics: boolean;
  /** Optional marketing cookies (off until you enable ads/pixels). */
  marketing: boolean;
  updatedAt: string;
};

export const defaultEssentialConsent = (): CookieConsent => ({
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
});

export const acceptedAllConsent = (): CookieConsent => ({
  essential: true,
  analytics: true,
  marketing: true,
  updatedAt: new Date().toISOString(),
});

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") {
      return null;
    }
    return {
      essential: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: CookieConsent): void {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent("britemj:cookie-consent", { detail: consent }),
  );
}

/** Open the banner again from footer / settings. */
export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent("britemj:cookie-preferences"));
}
