import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceGlyph } from "@/components/service-icon";
import type { Service } from "@/lib/data";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
        <ServiceGlyph icon={service.icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-xl text-brand-950">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {service.shortDescription}
      </p>
      <Link
        href={`/services#${service.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-600"
      >
        Learn More
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
