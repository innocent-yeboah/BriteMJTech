import { Container } from "@/components/ui/container";
import { TrustMark } from "@/components/ui/trust-mark";
import { trustBadges } from "@/lib/data";

export function TrustBar() {
  return (
    <section className="border-b border-slate-100 bg-white">
      <Container>
        <ul className="grid grid-cols-2 divide-slate-100 py-6 sm:grid-cols-4 sm:divide-x">
          {trustBadges.map((badge) => (
            <li
              key={badge.label}
              className="flex items-center justify-center gap-3 px-4 py-2 text-center"
            >
              <TrustMark kind={badge.kind} />
              <span className="text-left text-sm font-semibold leading-snug text-brand-950">
                {badge.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
