"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendLeadNotification,
  sendLeadConfirmation,
  sendEnquiryNotification,
} from "@/lib/email";
import {
  contactSchema,
  quoteSchema,
  newsletterSchema,
} from "@/lib/validations";

export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Very small in-memory rate limiter. For a single-instance deployment this
 * curbs abusive form spam. For multi-region/serverless scale, back this with
 * Upstash Redis or Supabase. Keyed by client IP.
 */
const rateBucket = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(): boolean {
  const ip =
    headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers().get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now > entry.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/** Handle a full quote / lead request (multi-step form). */
export async function submitQuote(
  raw: Record<string, unknown>,
): Promise<ActionResult> {
  if (!checkRateLimit()) {
    return {
      ok: false,
      message: "You've sent a few requests very quickly. Please try again in a minute.",
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
  if (parsed.data.company) {
    return { ok: true, message: "Thank you." };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    if (supabase) {
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_interest: data.services,
        property_type: data.propertyType,
        message: data.message || null,
        source: "website",
        status: data.inspectionDate ? "inspection_scheduled" : "new",
        inspection_date: data.inspectionDate || null,
        inspection_time: data.inspectionTime || null,
      });
      if (error) {
        console.error("[submitQuote] Supabase insert failed:", error.message);
      }
    }

    await Promise.allSettled([
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

    return {
      ok: true,
      message:
        "Your request has been received. Our team will contact you shortly to confirm your free site inspection.",
    };
  } catch (error) {
    console.error("[submitQuote] Unexpected error:", error);
    return {
      ok: false,
      message:
        "Something went wrong on our side. Please call us on " +
        (process.env.NEXT_PUBLIC_COMPANY_PHONE || "0203412477") +
        " and we'll help right away.",
    };
  }
}

/** Handle a general contact-form enquiry. */
export async function submitEnquiry(
  raw: Record<string, unknown>,
): Promise<ActionResult> {
  if (!checkRateLimit()) {
    return {
      ok: false,
      message: "You've sent a few messages very quickly. Please try again in a minute.",
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

  if (parsed.data.company) {
    return { ok: true, message: "Thank you." };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
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
      }
    }

    await Promise.allSettled([
      sendEnquiryNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || undefined,
        message: data.message,
      }),
      sendLeadConfirmation({ name: data.name, email: data.email }),
    ]);

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
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (parsed.data.company) {
    return { ok: true, message: "Thank you." };
  }

  try {
    const supabase = createAdminClient();
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
      }
    }
    return { ok: true, message: "You're subscribed. Welcome aboard!" };
  } catch (error) {
    console.error("[submitNewsletter] error:", error);
    return { ok: false, message: "Please try again in a moment." };
  }
}
