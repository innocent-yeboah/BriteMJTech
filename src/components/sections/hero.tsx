"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";

/**
 * First-viewport hero: assess → install positioning, site inspection + WhatsApp.
 * Uses a real Brite MJ installation photograph as immediate visual proof.
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

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="animate-fade-up">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                Brite MJ Technologies · Accra
              </p>
              <h1 className="mt-4 max-w-3xl font-heading text-[1.85rem] font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-6xl">
                Protect Your Home or Business with the Right Security System
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-100 sm:text-lg lg:mx-0">
                CCTV, electric fencing, gate automation, video intercom and
                networking — professionally designed and installed across Greater
                Accra. Start with a free site inspection and get a solution suited
                to your property.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
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

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-brand-900 shadow-2xl shadow-black/25">
              <Image
                src="/images/cctv/install-1.png"
                alt="Brite MJ Technologies technician installing a CCTV security camera"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Real installation work
                </p>
                <p className="mt-1 text-sm font-medium text-white sm:text-base">
                  Professionally installed security systems across Greater Accra
                </p>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 h-16 w-16 rounded-xl border border-accent/30 bg-accent/10"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
