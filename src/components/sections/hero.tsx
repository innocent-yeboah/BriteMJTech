"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";

/**
 * First-viewport hero: assess → install positioning, site inspection + WhatsApp.
 * No background photo/video — brand surface only.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12),_transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent"
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Brite MJ Technologies · Accra
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-[1.85rem] font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-6xl">
              Protect Your Home or Business with the Right Security System
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-100 sm:text-lg">
              CCTV, electric fencing, gate automation, video intercom and
              networking — professionally designed and installed across Greater
              Accra. Start with a free site inspection and get a solution suited
              to your property.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/quote" variant="primary" size="lg">
              Book a Free Site Inspection <ArrowRight className="h-5 w-5" />
            </Button>
            <WhatsAppCtaButton
              placement="hero"
              variant="white"
              label="WhatsApp an Expert"
            />
          </div>

          <p className="mt-5 text-sm font-medium tracking-wide text-white/80">
            Site assessment · Professional installation · Handover &amp; support
          </p>
        </div>
      </Container>
    </section>
  );
}
