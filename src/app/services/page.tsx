import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import {
  BreadcrumbJsonLd,
  ServicesJsonLd,
} from "@/components/structured-data";
import { getProductsForService, services } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Security Services in Accra",
  description:
    "Professional CCTV installation, security and electric fencing, networking, remote gate control, video intercom, and smart security systems across Accra, Ghana.",
  path: "/services",
  keywords: [
    "CCTV services Accra",
    "electric fence installation Ghana",
    "gate automation Accra",
  ],
  image: "/images/hero/cctv-install.png",
});

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <ServicesJsonLd />
      <PageHero
        title="Our Security Solutions"
        subtitle="Comprehensive, professionally installed security and smart systems — each with the products we install for that service."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Full Service Range"
            title="Choose a Service"
            description="Open any service to see how we install it and which products we typically use."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const productCount = getProductsForService(service.slug).length;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-brand-950">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {service.shortDescription}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">
                      {productCount > 0
                        ? `${productCount} installation products`
                        : "View service details"}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                      View service
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button href="/quote" variant="accent" size="lg">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>

      <CtaSection
        title="Not Sure Which Solution You Need?"
        subtitle="Book a free site inspection and our experts will recommend the perfect setup for your property and budget."
      />
    </>
  );
}
