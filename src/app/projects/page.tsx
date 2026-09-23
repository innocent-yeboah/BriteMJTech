import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { projects } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Security Projects Across Accra",
  description:
    "Completed residential, commercial, and institutional security projects by Brite MJ Technologies — CCTV, fencing, access control, and smart systems.",
  path: "/projects",
  keywords: [
    "security projects Accra",
    "CCTV installation portfolio Ghana",
    "completed fencing projects Accra",
  ],
  image: "/images/projects/gated-residence.jpg",
});

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
        title="Recent work around Accra"
        subtitle="A few installs we have finished for homes, shops and institutions. Want something close to your property type? Ask on WhatsApp."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ]}
      />

      <section className="section bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected jobs"
            description="Locations and scopes vary. Photos help you see the finish — not a polished brochure set."
          />
          <div className="mt-12">
            <ProjectsGallery projects={projects} />
          </div>
        </Container>
      </section>

      <CtaSection
        title="Got a similar property?"
        subtitle="Tell us what you want covered. We will visit for free and send a quote that matches the site."
      />
    </>
  );
}
