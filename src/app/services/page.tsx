import type { Metadata } from "next";
import Image from "next/image";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { ServiceGlyph } from "@/components/service-icon";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { services } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Security Solutions",
  description:
    "Explore Brite MJ Technologies' full range of security services: CCTV installation, security & electric fencing, networking, remote gate control, video intercom, and smart systems in Accra, Ghana.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <PageHero
        title="Our Security Solutions"
        subtitle="Comprehensive, professionally installed security and smart systems — tailored to your property and backed by 24/7 support."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      {/* Quick category grid */}
      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Full Service Range"
            title="Everything You Need, Under One Roof"
            description="Select a service to jump to details, or request a free quote for a combined solution."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <ServiceGlyph icon={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-950">
                  {service.name}
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed service sections */}
      <div className="bg-white">
        {services.map((service, index) => {
          const reversed = index % 2 === 1;
          return (
            <section
              key={service.slug}
              id={service.slug}
              className="scroll-mt-24 border-b border-slate-100 py-16 md:py-20 last:border-0"
            >
              <Container>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card",
                      reversed && "lg:order-2",
                    )}
                  >
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={cn(reversed && "lg:order-1")}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <ServiceGlyph icon={service.icon} className="h-7 w-7" />
                    </span>
                    <h2 className="mt-5 text-3xl text-brand-950">
                      {service.name}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">
                      {service.longDescription}
                    </p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <span className="text-sm text-slate-700">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button href="/quote" variant="accent">
                        Get a Quote <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        href={whatsappLink(
                          `Hello Brite MJ Technologies, I'm interested in your ${service.name} service. Please advise on next steps.`,
                        )}
                        variant="outline"
                        external
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp Us
                      </Button>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <CtaSection
        title="Not Sure Which Solution You Need?"
        subtitle="Book a free site inspection and our experts will recommend the perfect setup for your property and budget."
      />
    </>
  );
}
