import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/data";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card">
      <Quote className="h-8 w-8 text-accent/30" aria-hidden="true" />
      <div
        className="mt-3 flex gap-0.5"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < testimonial.rating
                ? "h-4 w-4 fill-amber-400 text-amber-400"
                : "h-4 w-4 text-slate-300"
            }
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-slate-100 pt-4">
        <p className="font-heading font-bold text-brand-950">
          {testimonial.name}
        </p>
        <p className="text-sm text-slate-500">{testimonial.company}</p>
      </figcaption>
    </figure>
  );
}
