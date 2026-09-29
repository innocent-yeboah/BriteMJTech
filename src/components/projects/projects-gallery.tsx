"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All examples" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "institutional", label: "Institutional" },
];

const categoryLabels: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  institutional: "Institutional",
};

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("all");

  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter examples by property type"
        className="flex flex-wrap justify-center gap-2"
      >
        {filters.map((filter) => {
          const selected = active === filter.value;
          return (
            <button
              key={filter.value}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(filter.value)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                selected
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-white text-brand-950 ring-1 ring-slate-200 hover:ring-brand-300",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <article
            key={project.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.image}
                alt={`${project.title} — illustrative example, not a client site`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {categoryLabels[project.category]}
              </span>
              <span className="absolute bottom-3 right-3 rounded-full bg-brand-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {project.imageCaption}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg text-brand-950">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {project.scenario}
              </p>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold text-brand-950">Recommended system</dt>
                  <dd className="text-slate-600">{project.system}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-950">Equipment types</dt>
                  <dd className="text-slate-600">{project.equipment}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-950">What you can expect</dt>
                  <dd className="text-slate-600">{project.outcome}</dd>
                </div>
              </dl>
              <Link
                href="/quote"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-600"
              >
                Book a free site inspection
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">
          No examples in this category.
        </p>
      ) : null}
    </div>
  );
}
