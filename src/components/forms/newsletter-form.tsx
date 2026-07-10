"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations";
import { submitNewsletter } from "@/app/actions/submit";

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", company: "" },
  });

  async function onSubmit(values: NewsletterInput) {
    const result = await submitNewsletter(values);
    if (result.ok) setDone(true);
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-emerald-300">
        <CheckCircle2 className="h-4 w-4" /> You&apos;re subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email"
          {...register("email")}
          className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-100/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("company")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {errors.email ? (
        <p className="text-xs text-accent-300">{errors.email.message}</p>
      ) : null}
    </form>
  );
}
