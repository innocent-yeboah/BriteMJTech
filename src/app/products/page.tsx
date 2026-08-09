import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  BreadcrumbJsonLd,
  ProductsJsonLd,
} from "@/components/structured-data";
import {
  productCategories,
  products,
  getProductsByCategory,
  type ProductCategory,
} from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Security Products for Installation in Accra",
  description:
    "Cameras, NVRs, electric fencing, networking gear, gate motors, video intercoms, and smart access products used in Brite MJ Technologies installations across Accra.",
  path: "/products",
  keywords: [
    "CCTV cameras Accra",
    "electric fence products Ghana",
    "gate motor Accra",
    "video intercom systems Accra",
    "security installation products",
  ],
  image: "/images/cctv/nvr-system.png",
});

const categoryOrder = productCategories.filter((c) => c.id !== "all");

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
        ]}
      />
      <ProductsJsonLd />
      <PageHero
        title="Products We Install"
        subtitle="Professional-grade cameras, fencing, networking, gate control, and access hardware — selected and installed for Accra homes and businesses."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Installation Hardware"
            title="Built Into Every Service We Deliver"
            description="Browse by category, then request a free site inspection so we can specify the right kit for your property."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryOrder.map((category) => {
              const count = getProductsByCategory(
                category.id as ProductCategory,
              ).length;
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <p className="text-sm font-semibold text-brand-950">
                    {category.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {category.description}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-accent">
                    {count} products
                  </p>
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      <div className="bg-white">
        {categoryOrder.map((category) => {
          const items = getProductsByCategory(category.id as ProductCategory);
          if (items.length === 0) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-24 border-b border-slate-100 py-16 md:py-20 last:border-0"
            >
              <Container>
                <SectionHeading
                  align="left"
                  eyebrow="Product category"
                  title={category.label}
                  description={category.description}
                />

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <article
                      key={product.slug}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-surface shadow-sm"
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
                        <div className="mt-6 flex flex-wrap gap-3">
                          {product.serviceSlug ? (
                            <Link
                              href={`/services#${product.serviceSlug}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
                            >
                              Related service
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="section bg-surface">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Not sure what you need?"
              title="We Specify Products After a Free Site Inspection"
              description="Every property is different. We recommend cameras, fencing, networking, and access hardware based on layout, risk, and budget — then install and support the full system."
            />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/quote">
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href={whatsappLink(
                  "Hello Brite MJ Technologies, I want advice on products for a security installation.",
                )}
                external
                variant="outline"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
              <Button href="/services" variant="ghost">
                View services
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Showing {products.length} installation products across{" "}
              {categoryOrder.length} categories.
            </p>
          </div>
        </Container>
      </section>

      <CtaSection
        title="Ready to Secure Your Property?"
        subtitle="Tell us about your site and we will recommend the right products and installation plan."
      />
    </>
  );
}
