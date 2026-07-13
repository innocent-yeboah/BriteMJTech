import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Check, Building2, Users, Award } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaSection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Brite MJ Technologies — a trusted security and smart systems company in Accra, Ghana, dedicated to protecting homes, businesses, and institutions.",
  alternates: { canonical: "/about" },
};

const values = [
  "Certified products and professional installation standards",
  "Transparent, honest advice with no pressure selling",
  "Rapid-response support whenever you need us",
  "Solutions tailored to your property and budget",
];

const clientTypes = [
  { icon: Building2, label: "Homes & Residences" },
  { icon: Users, label: "Businesses & Offices" },
  { icon: Award, label: "Schools & Institutions" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <PageHero
        title="Securing Accra, One Property at a Time"
        subtitle="Brite MJ Technologies is a security and smart systems company built on trust, expertise, and a genuine commitment to your peace of mind."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* Story */}
      <section className="section bg-white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              {/* REPLACE with a real photo of the Brite MJ team or completed work */}
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="The Brite MJ Technologies team collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="eyebrow">Our Story</span>
              <h2 className="mt-3 text-3xl text-brand-950 md:text-4xl">
                Trusted Security Expertise, Rooted in Accra
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-600">
                <p>
                  Brite MJ Technologies was founded on a simple belief: everyone
                  deserves to feel safe. From our base at Spintex — Shell
                  Signboard, we&apos;ve grown into a trusted partner for
                  families, businesses, and institutions across Accra.
                </p>
                <p>
                  We specialise in advanced CCTV surveillance, security and
                  electric fencing, networking, and smart access systems. Every
                  project begins with a free site inspection and ends with a
                  system you can rely on, backed by responsive, ongoing support.
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {values.map((value) => (
                  <li key={value} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-slate-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <StatsBand />

      {/* Mission & Vision */}
      <section className="section bg-surface">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Target className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-2xl text-brand-950">Our Mission</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                To deliver smart, reliable security solutions that protect what
                matters most — with expert installation, honest advice, and
                support you can count on, every day.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-white">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-2xl text-brand-950">Our Vision</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                To be Ghana&apos;s most trusted name in security and smart
                systems — setting the standard for quality, innovation, and
                customer care across every community we serve.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <WhyChooseUs />

      {/* Who we serve */}
      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Protection for Every Kind of Property"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {clientTypes.map((client) => (
              <div
                key={client.label}
                className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-card"
              >
                <client.icon className="h-10 w-10 text-accent" />
                <p className="mt-4 font-heading text-lg font-bold text-brand-950">
                  {client.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-slate-600">
            We also proudly serve construction sites and government facilities
            with tailored, high-security solutions.
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
