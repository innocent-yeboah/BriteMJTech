import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { ProjectsGallery } from "@/components/projects/projects-gallery";
import {
  BreadcrumbJsonLd,
  ExampleSolutionsJsonLd,
} from "@/components/structured-data";
import { projects } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Typical Installations",
  description:
    "Examples of the kinds of systems we design and install across Accra and Ghana — CCTV, fencing, access control, and smart systems. Illustrative examples; ask us for a tailored proposal.",
  path: "/projects",
  keywords: [
    "typical security installations Accra",
    "example CCTV systems Ghana",
    "security system examples Accra",
  ],
  image: "/images/projects/gated-residence.webp",
});

export default function ProjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Typical Installations", url: "/projects" },
        ]}
      />
      <ExampleSolutionsJsonLd
        items={projects.map((project) => ({
          name: project.title,
          description: `${project.scenario} ${project.system}`,
        }))}
      />
      <PageHero
        title="Typical Installations"
        subtitle="Examples of the kinds of systems we design and install across Accra and Ghana."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Typical Installations", href: "/projects" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Example solutions"
            title="Systems for homes, businesses and institutions"
            description="Each example describes a typical situation, the system we would recommend, the equipment types, and the result you can expect."
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500">
            Illustrative examples; ask us for a tailored proposal.
          </p>
          <div className="mt-12">
            <ProjectsGallery projects={projects} />
          </div>
        </Container>
      </section>

      <CtaSection
        title="Want a system planned for your site?"
        subtitle="Book a free site inspection. We will walk the property with you and recommend what fits."
      />
    </>
  );
}
