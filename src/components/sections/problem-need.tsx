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
          eyebrow="Before we sell you anything"
          title="A camera alone rarely covers the whole story."
          description={
            <>
              Gates, walls, dark corners, and weak internet all change what you
              need. We walk the property with you, point out the gaps, and only
              then say what to install.
            </>
          }
        />
      </Container>
    </section>
  );
}
