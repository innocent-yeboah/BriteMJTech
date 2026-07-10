"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Home,
  ShieldCheck,
  CalendarClock,
  Check,
} from "lucide-react";
import { quoteSchema, type QuoteInput } from "@/lib/validations";
import { submitQuote } from "@/app/actions/submit";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { services, propertyTypes } from "@/lib/data";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Contact", icon: User, fields: ["name", "email", "phone"] },
  { title: "Property", icon: Home, fields: ["propertyType", "propertySize"] },
  { title: "Security Needs", icon: ShieldCheck, fields: ["services", "message"] },
  {
    title: "Site Visit",
    icon: CalendarClock,
    fields: ["inspectionDate", "inspectionTime"],
  },
] as const;

type StepFields = (typeof steps)[number]["fields"][number];

export function QuoteForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyType: "",
      propertySize: "",
      services: [],
      message: "",
      inspectionDate: "",
      inspectionTime: "",
      company: "",
    },
  });

  const selectedServices = watch("services");
  const isLast = step === steps.length - 1;

  function toggleService(name: string) {
    const current = selectedServices ?? [];
    const next = current.includes(name)
      ? current.filter((s) => s !== name)
      : [...current, name];
    setValue("services", next, { shouldValidate: true });
  }

  async function next() {
    const fields = steps[step].fields as readonly StepFields[];
    const valid = await trigger(fields as FieldPath<QuoteInput>[]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setServerError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: QuoteInput) {
    setServerError(null);
    const result = await submitQuote(values);
    if (result.ok) {
      router.push("/quote/thank-you");
    } else {
      setServerError(result.message);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
      {/* Progress */}
      <div className="border-b border-slate-100 bg-brand-950 px-6 py-6">
        <ol className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const complete = i < step;
            return (
              <li key={s.title} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      complete
                        ? "border-accent bg-accent text-white"
                        : active
                          ? "border-accent bg-white text-accent"
                          : "border-white/30 bg-transparent text-white/50",
                    )}
                  >
                    {complete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold sm:block",
                      active || complete ? "text-white" : "text-white/50",
                    )}
                  >
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <span
                    className={cn(
                      "mx-2 h-0.5 flex-1 rounded transition-colors",
                      complete ? "bg-accent" : "bg-white/20",
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 md:p-8">
        {/* Step 1 — Contact */}
        {step === 0 ? (
          <div className="space-y-5 animate-fade-in">
            <StepHeader
              title="Let's start with your details"
              subtitle="So our team knows who to reach out to."
            />
            <div>
              <Label htmlFor="q-name" required>
                Full Name
              </Label>
              <Input
                id="q-name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="q-email" required>
                  Email
                </Label>
                <Input
                  id="q-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="q-phone" required>
                  Phone
                </Label>
                <Input
                  id="q-phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Step 2 — Property */}
        {step === 1 ? (
          <div className="space-y-5 animate-fade-in">
            <StepHeader
              title="Tell us about your property"
              subtitle="This helps us recommend the right solution and size the quote."
            />
            <div>
              <Label htmlFor="q-propertyType" required>
                Property Type
              </Label>
              <Select
                id="q-propertyType"
                defaultValue=""
                aria-invalid={!!errors.propertyType}
                {...register("propertyType")}
              >
                <option value="" disabled>
                  Select property type
                </option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.propertyType?.message} />
            </div>
            <div>
              <Label htmlFor="q-propertySize">Approximate Size / Scope</Label>
              <Input
                id="q-propertySize"
                placeholder="e.g. 4-bedroom house, 500 sqm warehouse, 2 gates"
                {...register("propertySize")}
              />
              <FieldError message={errors.propertySize?.message} />
            </div>
          </div>
        ) : null}

        {/* Step 3 — Services */}
        {step === 2 ? (
          <div className="space-y-5 animate-fade-in">
            <StepHeader
              title="What are you looking to secure?"
              subtitle="Select all the services you're interested in."
            />
            <fieldset>
              <legend className="sr-only">Services of interest</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const checked = (selectedServices ?? []).includes(service.name);
                  return (
                    <button
                      type="button"
                      key={service.slug}
                      onClick={() => toggleService(service.name)}
                      aria-pressed={checked}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition-all",
                        checked
                          ? "border-accent bg-accent-50"
                          : "border-slate-200 bg-white hover:border-brand-300",
                      )}
                    >
                      <span className="text-sm font-semibold text-brand-950">
                        {service.name}
                      </span>
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                          checked
                            ? "border-accent bg-accent text-white"
                            : "border-slate-300",
                        )}
                      >
                        {checked ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.services?.message} />
            </fieldset>
            <div>
              <Label htmlFor="q-message">Anything else we should know?</Label>
              <Textarea
                id="q-message"
                placeholder="Share any specific concerns, timelines, or questions…"
                {...register("message")}
              />
            </div>
          </div>
        ) : null}

        {/* Step 4 — Schedule */}
        {step === 3 ? (
          <div className="space-y-5 animate-fade-in">
            <StepHeader
              title="Book your free site inspection"
              subtitle="Pick a preferred date and time. We'll confirm by phone — no obligation."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="q-date">Preferred Date</Label>
                <Input
                  id="q-date"
                  type="date"
                  min={today}
                  {...register("inspectionDate")}
                />
              </div>
              <div>
                <Label htmlFor="q-time">Preferred Time</Label>
                <Select id="q-time" defaultValue="" {...register("inspectionTime")}>
                  <option value="">Any time</option>
                  <option value="08:00">Morning (8am – 12pm)</option>
                  <option value="12:00">Afternoon (12pm – 4pm)</option>
                  <option value="16:00">Evening (4pm – 6pm)</option>
                </Select>
              </div>
            </div>
            <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
              <p className="font-semibold">What happens next?</p>
              <ul className="mt-2 space-y-1 text-brand-700">
                <li>1. We call to confirm your inspection slot.</li>
                <li>2. Our expert visits and assesses your property — free.</li>
                <li>3. You receive a clear, customized quote.</li>
              </ul>
            </div>
            {serverError ? (
              <p role="alert" className="text-sm font-medium text-accent">
                {serverError}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("company")}
        />

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <span />
          )}

          {!isLast ? (
            <Button type="button" variant="accent" onClick={next}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                </>
              ) : (
                "Request My Free Quote"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
