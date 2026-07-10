import { Container } from "@/components/ui/container";
import { companyStats } from "@/lib/site";

export function StatsBand() {
  return (
    <section className="bg-brand-950 py-12">
      <Container>
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {companyStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-heading text-4xl font-extrabold text-accent md:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm font-medium text-brand-100">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
