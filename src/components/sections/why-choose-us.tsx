import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { whyChooseUs } from "@/lib/data";
import { siteConfig } from "@/lib/site";

/**
 * Grounded "why us" story — real install photography + concrete operating
 * promises for Accra clients, without generic icon cards.
 */
export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(10,37,64,0.06),_transparent_55%)]"
      />

      <Container className="relative py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
              <Image
                src="/images/hero/team-install.png"
                alt="Brite MJ Technologies technicians installing security systems on site in Accra"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[55%_center]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-heading text-lg font-bold leading-snug">
                  On-site in Accra — from Spintex to the rest of Greater Accra.
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {siteConfig.address.full}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">Why Brite MJ</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold text-brand-950 md:text-4xl lg:text-[2.6rem] lg:leading-tight">
              We show up, explain clearly, and leave you with a system that works.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              No brochure packages. We walk your property, recommend what fits
              your space and budget, then install and stand behind it.
            </p>

            <ol className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {whyChooseUs.map((pillar, index) => (
                <li
                  key={pillar.title}
                  className="grid gap-3 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                >
                  <span className="font-heading text-3xl font-extrabold tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-brand-950">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-base leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/quote" variant="accent" size="lg">
                Book a free site inspection
                <ArrowRight className="h-5 w-5" />
              </Button>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-sm font-semibold text-brand-950 underline-offset-4 hover:underline"
              >
                Or call {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
