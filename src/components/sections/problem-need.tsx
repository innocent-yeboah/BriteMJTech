import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Need recognition — frames the property problem before the service list.
 */
export function ProblemNeed() {
  return (
    <section className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow="Every Property Is Different"
          title="Your Property Needs More Than a Camera on the Wall."
          description={
            <>
              Blind spots, entrances, boundaries, gates, access points and
              network conditions all affect what security system will actually
              work. We assess your property first, then recommend and install
              the right combination of systems for the space.
            </>
          }
        />
      </Container>
    </section>
  );
}
