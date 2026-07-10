import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { trustBadges } from "@/lib/data";

export function TrustBar() {
  return (
    <section className="border-b border-slate-100 bg-white">
      <Container>
        <ul className="grid grid-cols-2 divide-slate-100 py-6 sm:grid-cols-4 sm:divide-x">
          {trustBadges.map((badge) => (
            <li
              key={badge}
              className="flex items-center justify-center gap-2.5 px-4 py-2 text-center"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-sm font-semibold text-brand-950">
                {badge}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
