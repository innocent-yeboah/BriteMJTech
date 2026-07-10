import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: { name: string; href: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-gradient">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container className="py-14 md:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-brand-100">
            {breadcrumb.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 ? (
                  <ChevronRight className="h-4 w-4 text-brand-100/50" />
                ) : null}
                {i === breadcrumb.length - 1 ? (
                  <span className="font-medium text-white">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-100">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
