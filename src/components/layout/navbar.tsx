"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mainNav, siteConfig, telLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur"
          : "border-transparent bg-white",
      )}
    >
      <nav
        className="container flex h-20 items-center justify-between py-3"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "text-accent"
                      : "text-brand-950 hover:text-brand-600",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={telLink()}
            className="flex items-center gap-2 text-sm font-semibold text-brand-950 hover:text-brand-600"
          >
            <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
          <Button href="/quote" variant="accent" size="sm">
            Get a Free Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-950 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white lg:hidden"
        >
          <ul className="container flex flex-col py-4">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-base font-semibold text-brand-950 hover:bg-brand-50"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-3 px-3">
              <a
                href={telLink()}
                className="flex items-center gap-2 py-1 text-sm font-semibold text-brand-950"
              >
                <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
              <Button href="/quote" variant="accent">
                Get a Free Quote
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
