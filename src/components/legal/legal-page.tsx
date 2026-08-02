import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { siteConfig } from "@/lib/site";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export function LegalPage({
  title,
  subtitle,
  path,
  breadcrumbLabel,
  effectiveDate,
  sections,
}: {
  title: string;
  subtitle: string;
  path: string;
  breadcrumbLabel: string;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: breadcrumbLabel, url: path },
        ]}
      />
      <PageHero
        title={title}
        subtitle={subtitle}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: breadcrumbLabel, href: path },
        ]}
      />

      <section className="section bg-white">
        <Container className="max-w-3xl">
          <p className="text-sm text-slate-500">
            Effective date: <time dateTime={effectiveDate}>{formatDate(effectiveDate)}</time>
          </p>

          <nav
            aria-label="On this page"
            className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              On this page
            </p>
            <ol className="mt-3 space-y-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-brand-800 transition-colors hover:text-accent"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="font-display text-xl font-bold text-brand-950 md:text-2xl">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-brand-800 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:font-semibold [&_strong]:text-slate-900">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
            Questions?{" "}
            <Link href="/contact" className="font-medium text-brand-800 hover:text-accent">
              Contact us
            </Link>{" "}
            or email{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-medium text-brand-800 hover:text-accent"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
