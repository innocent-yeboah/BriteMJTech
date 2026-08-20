import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { ServiceVideo } from "@/components/ui/service-video";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import {
  getProductsForService,
  getService,
  services,
} from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);
  const service = getService(slug);
  if (!service) {
    return createPageMetadata({
      title: "Service Not Found",
      description: "The requested service could not be found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${service.name} in Accra`,
    description: service.longDescription,
    path: `/services/${service.slug}`,
    keywords: [service.name, `${service.name} Accra`, `${service.name} Ghana`],
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const service = getService(slug);
  if (!service) notFound();

  const relatedProducts = getProductsForService(service.slug);
  const otherServices = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.name, url: `/services/${service.slug}` },
        ]}
      />
      <PageHero
        title={service.name}
        subtitle={service.shortDescription}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <section className="section bg-white">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              {service.gallery && service.gallery.length > 0 ? (
                <ImageSlideshow
                  images={service.gallery}
                  priority
                  label={`${service.name} photos`}
                />
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              {service.video ? (
                <ServiceVideo
                  src={service.video}
                  poster={service.videoPoster ?? service.image}
                  label={`${service.name} demo video`}
                  fit={service.videoFit}
                  showSoundControl={service.videoHasAudio !== false}
                />
              ) : null}
            </div>

            <div>
              <p className="eyebrow">Service detail</p>
              <h2 className="mt-3 text-3xl text-brand-950 md:text-4xl">
                {service.name}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {service.longDescription}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-slate-700">{benefit}</span>
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

      {relatedProducts.length > 0 ? (
        <section className="section bg-surface">
          <Container>
            <SectionHeading
              eyebrow="Products we install"
              title={`Hardware for ${service.name}`}
              description="These are the installation products we commonly specify for this service after a free site inspection."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <article
                  key={product.slug}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      style={
                        product.imagePosition
                          ? { objectPosition: product.imagePosition }
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-brand-950">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {product.shortDescription}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {product.uses.map((use) => (
                        <li
                          key={use}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button href="/quote" variant="primary">
                Request product advice <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section bg-white">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrow="More services"
              title="Explore related solutions"
              description="Combine services for complete property protection."
            />
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              <ArrowLeft className="h-4 w-4" />
              All services
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.slice(0, 6).map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-slate-100 bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <h3 className="font-semibold text-brand-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title={`Ready for ${service.name}?`}
        subtitle="Book a free site inspection and we will recommend the right products and install plan for your property."
      />
    </>
  );
}
