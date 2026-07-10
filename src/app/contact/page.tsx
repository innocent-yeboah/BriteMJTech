import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { siteConfig, telLink, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Brite MJ Technologies in Accra, Ghana. Call, WhatsApp, or send a message to book your free site inspection and quote.",
  alternates: { canonical: "/contact" },
};

const mapQuery = encodeURIComponent("Spintex Shell Signboard, Accra, Ghana");

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <PageHero
        title="Let's Secure Your Property Together"
        subtitle="Reach out for a free site inspection and a no-obligation quote. Our team is ready to help."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Contact info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl text-brand-950">Get in Touch</h2>
              <p className="mt-3 text-slate-600">
                Prefer to talk? Call or WhatsApp us directly — we&apos;re happy
                to answer any questions.
              </p>

              <ul className="mt-8 space-y-5">
                <ContactItem
                  icon={<Phone className="h-5 w-5" />}
                  label="Call Us"
                >
                  <a href={telLink()} className="hover:text-accent">
                    {siteConfig.contact.phone}
                  </a>{" "}
                  /{" "}
                  <a
                    href={telLink(siteConfig.contact.phoneAlt)}
                    className="hover:text-accent"
                  >
                    {siteConfig.contact.phoneAlt}
                  </a>
                </ContactItem>
                <ContactItem
                  icon={<Mail className="h-5 w-5" />}
                  label="Email Us"
                >
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="break-all hover:text-accent"
                  >
                    {siteConfig.contact.email}
                  </a>
                </ContactItem>
                <ContactItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Visit Us"
                >
                  {siteConfig.address.full}
                </ContactItem>
                <ContactItem
                  icon={<Clock className="h-5 w-5" />}
                  label="Business Hours"
                >
                  <ul className="space-y-0.5">
                    {siteConfig.hours.map((h) => (
                      <li key={h.day}>
                        <span className="font-medium text-brand-950">
                          {h.day}:
                        </span>{" "}
                        {h.time}
                      </li>
                    ))}
                  </ul>
                </ContactItem>
              </ul>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 font-heading font-semibold text-white transition-colors hover:bg-[#1eb955]"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
                <h2 className="text-2xl text-brand-950">Send Us a Message</h2>
                <p className="mt-1.5 text-slate-600">
                  Fill in the form and we&apos;ll get back to you shortly.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section aria-label="Our location on the map">
        <iframe
          title="Brite MJ Technologies location — Spintex, Accra"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          width="100%"
          height="440"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full border-0 grayscale-[0.2]"
        />
      </section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
        {icon}
      </span>
      <div>
        <p className="font-heading font-bold text-brand-950">{label}</p>
        <div className="mt-0.5 text-slate-600">{children}</div>
      </div>
    </li>
  );
}
