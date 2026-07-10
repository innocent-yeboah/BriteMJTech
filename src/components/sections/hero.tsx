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
    <section className="relative isolate overflow-hidden bg-brand-950">
      {/* Background image — REPLACE with client's own hero photography */}
      <Image
        src="https://images.unsplash.com/photo-1544890225-2f3faec4cd60?auto=format&fit=crop&w=2000&q=80"
        alt="Modern security control room with surveillance monitors"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-950 via-brand-950/95 to-brand-900/85" />

      <Container className="relative py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur">
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
