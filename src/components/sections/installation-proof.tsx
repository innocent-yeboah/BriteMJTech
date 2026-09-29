import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Button } from "@/components/ui/button";
import { WhatsAppCtaButton } from "@/components/analytics/tracked-ctas";

const installationPhotos = [
  {
    src: "/images/cctv/install-1.webp",
    alt: "Illustrative photo of a technician installing a CCTV camera",
    label: "CCTV installation",
  },
  {
    src: "/images/cctv/install-2.webp",
    alt: "Illustrative photo of a technician adjusting a CCTV camera",
    label: "Camera positioning",
  },
  {
    src: "/images/cctv/nvr-system.webp",
    alt: "Illustrative photo of a CCTV monitoring system showing multiple camera views",
    label: "CCTV monitoring",
  },
  {
    src: "/images/fencing/install-tech.webp",
    alt: "Illustrative photo of a technician installing electric fencing on a wall",
    label: "Electric fencing",
  },
  {
    src: "/images/fencing/wall-electric-1.webp",
    alt: "Illustrative photo of electric fencing along a perimeter wall",
    label: "Perimeter protection",
  },
  {
    src: "/images/cctv/cameras-pole.webp",
    alt: "Illustrative photo of outdoor CCTV cameras mounted on a pole",
    label: "Outdoor surveillance",
  },
] as const;

export function InstallationProof() {
  return (
    <section className="section bg-brand-950 text-white">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-accent">Example installations</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">
              The kinds of systems we fit
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-100">
              Cameras on walls, electric fence lines, monitoring screens —
              illustrations of the systems we design and install across Accra
              and Ghana.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {installationPhotos.map((photo) => (
            <figure
              key={photo.src}
              className="group overflow-hidden border border-white/10 bg-white/5"
            >
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
                <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-white/60">
                  Illustrative
                </span>
              </figcaption>
            </figure>
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
              label="WhatsApp us"
            />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
