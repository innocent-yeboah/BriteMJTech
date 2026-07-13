"use client";

import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
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
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  durationMs={stat.durationMs}
                  startOnMount={false}
                  className="block font-heading text-4xl font-extrabold text-accent md:text-5xl"
                />
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
