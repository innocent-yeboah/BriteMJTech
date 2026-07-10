import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PillarGlyph } from "@/components/service-icon";
import { whyChooseUs } from "@/lib/data";

export function WhyChooseUs() {
  return (
    <section className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow="Why Brite MJ"
          title="Security You Can Trust, Service You Can Rely On"
          description="We combine technical expertise with a genuine commitment to your safety and peace of mind."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-slate-100 bg-surface/60 p-7 text-center transition-colors hover:border-brand-100 hover:bg-white hover:shadow-card"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <PillarGlyph icon={pillar.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-lg text-brand-950">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
