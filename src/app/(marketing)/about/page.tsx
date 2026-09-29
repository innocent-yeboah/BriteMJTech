import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaSection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About Brite MJ Technologies",
  description:
    "We are a Spintex-based security install team — CCTV, fencing, networking and access for homes and businesses across Accra.",
  path: "/about",
  keywords: [
    "security company Accra",
    "Brite MJ Technologies about",
    "Spintex CCTV installers",
  ],
  image: "/images/hero/team-install.jpg",
});

const values = [
  "We use gear we are willing to stand behind",
  "Straight talk on price — no pressure to buy extras",
  "We pick up when something needs fixing",
  "Quotes match the property and the budget you share",
];

/** Real environments help visitors recognise the communities we protect. */
const clientTypes = [
  {
    image: "/images/about/homes-residences.jpg",
    label: "Homes & Residences",
    alt: "Modern family residence protected by Brite MJ security systems",
  },
  {
    image: "/images/about/businesses-offices.jpg",
    label: "Businesses & Offices",
    alt: "Professional office environment protected by Brite MJ security systems",
  },
  {
    image: "/images/about/schools-institutions.jpg",
    label: "Schools & Institutions",
    alt: "Classroom representing schools and institutions served by Brite MJ",
  },
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
        title="A Spintex team that installs security for Accra"
        subtitle="We put up cameras, fencing, gate motors and networks — then we show you how to use them and stay reachable after."
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
              <Image
                src="/images/hero/team-install.jpg"
                alt="Brite MJ Technologies technicians installing security systems on site in Accra"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[55%_center]"
              />
            </div>
            <div>
              <span className="eyebrow">How we got here</span>
              <h2 className="mt-3 text-3xl text-brand-950 md:text-4xl">
                Local installers, not a brochure company
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-600">
                <p>
                  Brite MJ Technologies works from Spintex — Shell Signboard.
                  Most of our days are spent on compounds, shop fronts and
                  yards around Greater Accra: measuring walls, pulling cable,
                  aiming cameras.
                </p>
                <p>
                  We do CCTV, electric fencing, networking and access systems.
                  Every job starts with a free site visit. You get a clear
                  quote, an install by our team, and numbers to call when
                  something needs a look later.
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
              <h3 className="mt-5 text-2xl text-brand-950">What we aim for</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                Install security that works on the day we leave — and still
                works six months later — with honest advice and a phone that
                gets answered.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-white">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-2xl text-brand-950">Where we are headed</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                Keep earning referrals across Accra by doing tidy installs and
                fixing issues without drama — not by chasing every buzzword in
                security marketing.
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
            eyebrow="Who calls us"
            title="Houses, shops, schools and yards"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {clientTypes.map((client) => (
              <article
                key={client.label}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={client.image}
                    alt={client.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/35 via-transparent to-transparent"
                  />
                </div>
                <p className="px-6 py-5 text-center font-heading text-lg font-bold text-brand-950">
                  {client.label}
                </p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-slate-600">
            We also take on construction sites and public facilities when the
            brief is clear and the perimeter needs real work.
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
