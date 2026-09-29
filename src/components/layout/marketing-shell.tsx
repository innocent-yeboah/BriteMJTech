import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DeferredEffects } from "@/components/effects/deferred-effects";
import { OrganizationJsonLd } from "@/components/structured-data";
import { CookieBanner } from "@/components/cookies/cookie-banner";
import { ConsentAnalytics } from "@/components/analytics/consent-analytics";

/** Public-site chrome. Admin and auth routes do not use this shell. */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-950 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
      <CookieBanner />
      <ConsentAnalytics />
      <DeferredEffects />
      <OrganizationJsonLd />
    </>
  );
}
