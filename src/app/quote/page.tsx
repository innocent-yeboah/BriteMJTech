import type { Metadata } from "next";
import { ShieldCheck, Clock, Award, PhoneCall } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { QuoteForm } from "@/components/forms/quote-form";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, no-obligation security quote from Brite MJ Technologies. Tell us about your property and book a free site inspection in Accra, Ghana.",
  alternates: { canonical: "/quote" },
};

const assurances = [
  { icon: ShieldCheck, text: "Free, no-obligation quote" },
  { icon: Award, text: "Certified, professional installation" },
  { icon: Clock, text: "Fast response — usually same day" },
  { icon: PhoneCall, text: "Friendly experts, ready to help" },
];

export default function QuotePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Get a Quote", url: "/quote" },
        ]}
      />
      <PageHero
        title="Get Your Free Quote"
        subtitle="Answer a few quick questions and we'll prepare a customized quote — plus a free site inspection at a time that suits you."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Get a Quote", href: "/quote" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>
            <aside className="lg:pt-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-card">
                <h2 className="text-xl text-brand-950">
                  Why request a quote?
                </h2>
                <ul className="mt-5 space-y-4">
                  {assurances.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl bg-brand-950 p-5 text-center">
                  <p className="text-sm text-brand-100">
                    Your information is kept private and used only to prepare
                    your quote. We never share your details.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
