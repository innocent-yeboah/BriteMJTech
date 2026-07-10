"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { submitEnquiry } from "@/app/actions/submit";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";

export function ContactForm() {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setStatus(null);
    const result = await submitEnquiry(values);
    if (result.ok) {
      setStatus({ type: "success", message: result.message });
      reset();
    } else {
      setStatus({ type: "error", message: result.message });
    }
  }

  if (status?.type === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl text-brand-950">Message sent!</h3>
        <p className="mt-2 text-slate-600">{status.message}</p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setStatus(null)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {status?.type === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm text-accent-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{status.message}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Full Name
          </Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="phone" required>
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="subject">Service of Interest</Label>
        <Select id="subject" defaultValue="" {...register("subject")}>
          <option value="">Select a service (optional)</option>
          {services.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="General Enquiry">General Enquiry</option>
        </Select>
        <FieldError message={errors.subject?.message} />
      </div>

      <div>
        <Label htmlFor="message" required>
          How can we help?
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us about your property and what you'd like to secure…"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("company")}
      />

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>
      <p className="text-center text-xs text-slate-500">
        We respect your privacy. Your details are only used to respond to your
        enquiry.
      </p>
    </form>
  );
}
