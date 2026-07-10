import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore completed security projects by Brite MJ Technologies across Accra — residential, commercial, and institutional CCTV, fencing, and smart systems installations.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ]}
      />
      <PageHero
        title="Our Work Speaks for Itself"
        subtitle="A selection of security and smart-system projects we've delivered for homes, businesses, and institutions across Accra."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            title="Recently Completed Projects"
            description="Every project reflects our commitment to quality installation and lasting protection. Photos are representative — real project galleries available on request."
          />
          <div className="mt-12">
            <ProjectsGallery projects={projects} />
          </div>
        </Container>
      </section>

      <CtaSection
        title="Your Project Could Be Next"
        subtitle="Tell us what you'd like to secure and we'll design a solution that fits — starting with a free site inspection."
      />
    </>
  );
}
