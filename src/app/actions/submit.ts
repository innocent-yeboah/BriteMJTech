"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendLeadNotification,
  sendLeadConfirmation,
  sendEnquiryNotification,
  sendNewsletterNotification,
  sendNewsletterConfirmation,
} from "@/lib/email";
import {
  contactSchema,
  quoteSchema,
  newsletterSchema,
} from "@/lib/validations";
import { checkFormRateLimit } from "@/lib/rate-limit";

export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

function phoneFallbackMessage(): string {
  return (
    "Something went wrong on our side. Please call us on " +
    (process.env.NEXT_PUBLIC_COMPANY_PHONE || "0203412477") +
    " and we'll help right away."
  );
}

/** Handle a full quote / lead request (multi-step form). */
export async function submitQuote(
  raw: Record<string, unknown>,
): Promise<ActionResult> {
  if (!(await checkFormRateLimit("quote"))) {
    return {
      ok: false,
      message:
        "You've sent a few requests very quickly. Please try again in a minute.",
    };
  }

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot triggered — silently accept without doing anything.
  if (parsed.data.company.trim()) {
    return { ok: true, message: "Thank you." };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    let stored = false;

    if (supabase) {
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_interest: data.services,
        property_type: data.propertyType,
        property_size: data.propertySize || null,
        message: data.message || null,
        source: "website",
        status: data.inspectionDate ? "inspection_scheduled" : "new",
        inspection_date: data.inspectionDate || null,
        inspection_time: data.inspectionTime || null,
      });
      if (error) {
        console.error("[submitQuote] Supabase insert failed:", error.message);
        return { ok: false, message: phoneFallbackMessage() };
      }
      stored = true;
    }

    const emailResults = await Promise.allSettled([
      sendLeadNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        propertyType: data.propertyType,
        propertySize: data.propertySize || undefined,
        services: data.services,
        message: data.message || undefined,
        inspectionDate: data.inspectionDate || undefined,
        inspectionTime: data.inspectionTime || undefined,
        source: "website",
      }),
      sendLeadConfirmation({ name: data.name, email: data.email }),
    ]);

    const notified = emailResults.some(
      (r) => r.status === "fulfilled",
    );

    if (!stored && !notified) {
      return { ok: false, message: phoneFallbackMessage() };
    }

    return {
      ok: true,
      message:
        "Your request has been received. Our team will contact you shortly to confirm your free site inspection.",
    };
  } catch (error) {
    console.error("[submitQuote] Unexpected error:", error);
    return { ok: false, message: phoneFallbackMessage() };
  }
}

/** Handle a general contact-form enquiry. */
export async function submitEnquiry(
  raw: Record<string, unknown>,
): Promise<ActionResult> {
  if (!(await checkFormRateLimit("enquiry"))) {
    return {
      ok: false,
      message:
        "You've sent a few messages very quickly. Please try again in a minute.",
    };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.company.trim()) {
    return { ok: true, message: "Thank you." };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    let stored = false;

    if (supabase) {
      const { error } = await supabase.from("enquiries").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || null,
        message: data.message,
        status: "new",
      });
      if (error) {
        console.error("[submitEnquiry] Supabase insert failed:", error.message);
        return { ok: false, message: phoneFallbackMessage() };
      }
      stored = true;
    }

    const emailResults = await Promise.allSettled([
      sendEnquiryNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || undefined,
        message: data.message,
      }),
      sendLeadConfirmation({ name: data.name, email: data.email }),
    ]);

    const notified = emailResults.some((r) => r.status === "fulfilled");

    if (!stored && !notified) {
      return { ok: false, message: phoneFallbackMessage() };
    }

    return {
      ok: true,
      message:
        "Thank you for reaching out! We've received your message and will get back to you shortly.",
    };
  } catch (error) {
    console.error("[submitEnquiry] Unexpected error:", error);
    return {
      ok: false,
      message:
        "Something went wrong on our side. Please call us and we'll help right away.",
    };
  }
}

/** Handle a newsletter signup — stored as an enquiry-style lead source. */
export async function submitNewsletter(
  raw: Record<string, unknown>,
): Promise<ActionResult> {
  if (!(await checkFormRateLimit("newsletter"))) {
    return {
      ok: false,
      message:
        "You've sent a few requests very quickly. Please try again in a minute.",
    };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (parsed.data.company.trim()) {
    return { ok: true, message: "Thank you." };
  }

  try {
    const supabase = createAdminClient();
    let stored = false;

    if (supabase) {
      const { error } = await supabase.from("enquiries").insert({
        name: "Newsletter Subscriber",
        email: parsed.data.email,
        subject: "Newsletter signup",
        message: "Requested to receive security tips and offers.",
        status: "new",
      });
      if (error) {
        console.error("[submitNewsletter] insert failed:", error.message);
        return { ok: false, message: "Please try again in a moment." };
      }
      stored = true;
    }

    const emailResults = await Promise.allSettled([
      sendNewsletterNotification(parsed.data.email),
      sendNewsletterConfirmation(parsed.data.email),
    ]);

    const notified = emailResults.some((r) => r.status === "fulfilled");

    if (!stored && !notified) {
      return { ok: false, message: "Please try again in a moment." };
    }

    return { ok: true, message: "You're subscribed. Welcome aboard!" };
  } catch (error) {
    console.error("[submitNewsletter] error:", error);
    return { ok: false, message: "Please try again in a moment." };
  }
}
