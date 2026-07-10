"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Projects" },
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
        aria-label="Filter projects by category"
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
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {categoryLabels[project.category]}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg text-brand-950">{project.title}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-accent" />
                {project.location} &middot; {project.completedYear}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
              <Link
                href={`/contact?ref=${encodeURIComponent(project.title)}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-600"
              >
                Inquire About This Project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">
          No projects in this category yet — check back soon.
        </p>
      ) : null}
    </div>
  );
}
