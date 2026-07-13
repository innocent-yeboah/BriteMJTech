import Image from "next/image";
import { ShieldCheck, Award, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const badges = [
  { icon: Award, label: "10+ Years Experience" },
  { icon: ShieldCheck, label: "100+ Projects Completed" },
  { icon: Clock, label: "24/7 Support" },
];

export function Hero() {
  return (
    <section className="relative isolate min-h-[min(88vh,760px)] overflow-hidden bg-brand-950">
      {/* Client hero photography — technician installing CCTV on-site */}
      <Image
        src="/images/hero/cctv-install.png"
        alt="Brite MJ Technologies technician installing a CCTV security camera on site"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_center] sm:object-[65%_center] lg:object-[70%_center]"
      />

      {/* Readability overlays — keep copy clear over the busy street */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950/25 md:via-brand-950/85 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-950/75 via-transparent to-brand-950/40"
      />

      <Container className="relative flex min-h-[min(88vh,760px)] items-center py-20 md:py-28">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Trusted Security Partner in Accra, Ghana
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Smart Solutions.{" "}
            <span className="text-accent">Stronger Security.</span> Better
            Connections.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
            Protect your property with advanced security systems from Brite MJ
            Technologies — expert CCTV, fencing, networking, and smart access
            for homes, businesses, and institutions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/quote" variant="accent" size="lg">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/services" variant="white" size="lg">
              Explore Services
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {badges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
