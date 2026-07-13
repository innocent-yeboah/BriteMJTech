import { ShieldCheck, Award, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroSlideshow, type HeroSlide } from "@/components/sections/hero-slideshow";

const badges = [
  { icon: Award, label: "10+ Years Experience" },
  { icon: ShieldCheck, label: "100+ Projects Completed" },
  { icon: Clock, label: "24/7 Support" },
];

const heroSlides: HeroSlide[] = [
  {
    src: "/images/hero/cctv-install.png",
    alt: "Brite MJ Technologies technician installing a CCTV security camera on site",
    position:
      "object-[60%_center] sm:object-[65%_center] lg:object-[70%_center]",
  },
  {
    src: "/images/hero/team-install.png",
    alt: "Brite MJ Technologies team installing security and networking systems",
    position: "object-[55%_center] lg:object-center",
  },
  {
    src: "/images/hero/building-cctv.png",
    alt: "Technicians installing outdoor CCTV cameras on a commercial building",
    position: "object-[35%_center] lg:object-[40%_center]",
  },
  {
    src: "/images/hero/site-work.png",
    alt: "Field technicians on a secured worksite with safety barriers",
    position: "object-[45%_center] lg:object-center",
  },
];

export function Hero() {
  return (
    <section className="relative isolate min-h-[min(88vh,760px)] overflow-hidden bg-brand-950">
      <HeroSlideshow slides={heroSlides} />

      {/* Light global wash — photos stay visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-950/25"
      />
      {/* Soft left scrim only behind copy */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-brand-950/70 via-brand-950/45 to-transparent md:from-brand-950/55 md:via-brand-950/25"
      />
      {/* Subtle bottom fade for badge row */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-950/40 to-transparent"
      />

      <Container className="relative flex min-h-[min(88vh,760px)] items-center py-20 md:py-28">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Trusted Security Partner in Accra, Ghana
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
            Smart Solutions.{" "}
            <span className="text-accent">Stronger Security.</span> Better
            Connections.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
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
                <span className="text-sm font-semibold text-white drop-shadow-sm">
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
