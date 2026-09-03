"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  getGaMeasurementId,
  getMetaPixelId,
  type AnalyticsEventParams,
} from "@/lib/analytics";
import { readCookieConsent, type CookieConsent } from "@/lib/cookies";

/**
 * Loads GA4 and/or Meta Pixel only after cookie consent.
 * Listens for consent changes so Accept all enables trackers without reload.
 */
export function ConsentAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const hide =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  useEffect(() => {
    if (hide) {
      setConsent(null);
      return;
    }
    setConsent(readCookieConsent());

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsent>).detail;
      setConsent(detail);
    };
    window.addEventListener("britemj:cookie-consent", onConsent);
    return () => {
      window.removeEventListener("britemj:cookie-consent", onConsent);
    };
  }, [hide, pathname]);

  if (hide || !consent) return null;

  const gaId = getGaMeasurementId();
  const pixelId = getMetaPixelId();
  const enableGa = Boolean(consent.analytics && gaId);
  const enablePixel = Boolean(consent.marketing && pixelId);

  return (
    <>
      {enableGa && gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
      {enablePixel && pixelId ? <MetaPixel pixelId={pixelId} /> : null}
    </>
  );
}

function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
    } satisfies AnalyticsEventParams);
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true, send_page_view: false });
        `}
      </Script>
    </>
  );
}

function MetaPixel({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
