import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";

const installationPhotos = [
  {
    src: "/images/cctv/install-1.png",
    alt: "Technician installing a CCTV camera on a property",
    label: "CCTV installation",
  },
  {
    src: "/images/cctv/install-2.png",
    alt: "Technician adjusting a CCTV camera during installation",
    label: "Camera positioning",
  },
  {
    src: "/images/cctv/nvr-system.png",
    alt: "Installed CCTV monitoring system showing multiple camera views",
    label: "CCTV monitoring",
  },
  {
    src: "/images/fencing/install-tech.png",
    alt: "Technician installing electric fencing on a perimeter wall",
    label: "Electric fencing",
  },
  {
    src: "/images/fencing/wall-electric-1.png",
    alt: "Completed electric fencing installed along a perimeter wall",
    label: "Perimeter protection",
  },
  {
    src: "/images/cctv/cameras-pole.png",
    alt: "Outdoor CCTV cameras mounted on a security pole",
    label: "Outdoor surveillance",
  },
] as const;

export function InstallationProof() {
  return (
    <section className="section bg-brand-950 text-white">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-accent">Real Installation Work</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">
              See the Systems We Actually Install
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-100">
              Real photographs from Brite MJ Technologies installation work —
              from CCTV and monitoring to electric perimeter fencing.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {installationPhotos.map((photo, index) => (
            <ScrollReveal key={photo.src} delayMs={index * 50}>
              <figure className="group overflow-hidden border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-semibold text-white/90">
                  {photo.label}
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={100}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/quote" variant="primary" size="lg">
              Book a Free Site Inspection
              <ArrowRight className="h-5 w-5" />
            </Button>
            <WhatsAppCtaButton
              placement="installation_proof"
              variant="white"
              label="WhatsApp an Expert"
            />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
