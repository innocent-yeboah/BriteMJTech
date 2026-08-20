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
import { CookieSettingsButton } from "@/components/cookies/cookie-settings-button";
import { mainNav, siteConfig, telLink } from "@/lib/site";
import { services } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container py-8 md:py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:gap-8 lg:grid-cols-4 lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-3 max-w-xs text-sm leading-snug text-brand-100/80 md:mt-4 md:leading-relaxed">
              <span className="md:hidden">{siteConfig.tagline}</span>
              <span className="hidden md:inline">
                {siteConfig.tagline} Protecting homes, businesses, and
                institutions across Accra with certified security and smart
                systems.
              </span>
            </p>
            <div className="mt-3 flex gap-2.5 md:mt-5 md:gap-3">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent md:h-9 md:w-9"
              >
                <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent md:h-9 md:w-9"
              >
                <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent md:h-9 md:w-9"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-current md:h-4 md:w-4"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.77a8.2 8.2 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15Z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent md:h-9 md:w-9"
              >
                <Linkedin className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white md:text-sm">
              Quick Links
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-sm md:mt-4 md:space-y-2.5">
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-white md:text-sm">
              Our Services
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-sm md:mt-4 md:space-y-2.5">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-brand-100/80 transition-colors hover:text-accent"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white md:text-sm">
              Get in Touch
            </h3>
            <ul className="mt-2.5 space-y-2 text-sm md:mt-4 md:space-y-3">
              <li className="flex items-start gap-2.5 md:gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-brand-100/80">
                  {siteConfig.address.full}
                </span>
              </li>
              <li className="flex items-center gap-2.5 md:gap-3">
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
              <li className="flex items-center gap-2.5 md:gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-brand-100/80 hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 md:gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-brand-100/80">
                  <span className="md:hidden">
                    Mon–Fri 8am–6pm · Sat 9am–4pm · Sun emergency
                  </span>
                  <span className="hidden md:inline">
                    Mon–Fri: 8am–6pm
                    <br />
                    Sat: 9am–4pm
                    <br />
                    Sun: emergency only
                  </span>
                </span>
              </li>
            </ul>
            <div className="mt-4 md:mt-5">
              <p className="mb-2 text-sm font-semibold text-white">
                Get security tips & offers
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-4 text-center text-xs text-brand-100/70 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-5 sm:text-left">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-end">
            <Link
              href="/privacy"
              className="transition-colors hover:text-accent"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-accent">
              Terms of Service
            </Link>
            <CookieSettingsButton className="transition-colors hover:text-accent" />
            <a
              href="https://buildwithinnocent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              Built by Build With Innocent
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
