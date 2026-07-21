import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { mainNav, siteConfig, telLink } from "@/lib/site";
import { services } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-100/80">
              {siteConfig.tagline} Protecting homes, businesses, and
              institutions across Accra with certified security and smart
              systems.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.77a8.2 8.2 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15Z" />
                </svg>
              </a>
              {siteConfig.social.linkedin !== "#" ? (
                <a
                  href={siteConfig.social.linkedin}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-100/80 transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/quote"
                  className="text-brand-100/80 transition-colors hover:text-accent"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Our Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-brand-100/80 transition-colors hover:text-accent"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-brand-100/80">
                  {siteConfig.address.full}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-brand-100/80">
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
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-brand-100/80 hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-brand-100/80">
                  Mon–Fri: 8am–6pm
                  <br />
                  Sat: 9am–4pm
                  <br />
                  Sun: emergency only
                </span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-white">
                Get security tips & offers
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-5 text-center text-xs text-brand-100/70 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="https://buildwithinnocent.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-100/70 transition-colors hover:text-accent"
          >
            Built by Build With Innocent — Digital Business Systems for African
            Enterprises
          </a>
        </div>
      </div>
    </footer>
  );
}
