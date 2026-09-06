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
import {
  issueConversionToken,
  redeemConversionToken,
} from "@/lib/conversion-token";

export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
  /** Present only after a genuine successful quote submission (not honeypot). */
  conversionToken?: string;
}

function phoneFallbackMessage(): string {
  return (
    "Something went wrong on our side. Please call us on " +
    (process.env.NEXT_PUBLIC_COMPANY_PHONE || "0203412477") +
    " and we'll help right away."
  );
}

/**
 * Resolve Promise.allSettled email results to actual send booleans.
 * A fulfilled promise with value `false` means the send soft-failed.
 */
function emailActuallySent(
  results: PromiseSettledResult<boolean>[],
): boolean {
  return results.some(
    (r) => r.status === "fulfilled" && r.value === true,
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

  // Honeypot — silent accept, NO conversion token (must not fire ad Lead events).
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
        stored = false;
      } else {
        stored = true;
      }
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

    for (const result of emailResults) {
      if (result.status === "rejected") {
        console.error("[submitQuote] Email promise rejected:", result.reason);
      } else if (result.value === false) {
        console.error("[submitQuote] Email send returned false");
      }
    }

    const emailed = emailActuallySent(emailResults);

    if (!stored && !emailed) {
      return { ok: false, message: phoneFallbackMessage() };
    }

    if (stored && !emailed) {
      console.error(
        "[submitQuote] Lead stored but email notification/confirmation failed",
      );
    }
    if (!stored && emailed) {
      console.error(
        "[submitQuote] Email delivered but Supabase lead storage failed or skipped",
      );
    }

    const conversionToken = await issueConversionToken();

    return {
      ok: true,
      message:
        "Your request has been received. Our team will contact you shortly to confirm your free site inspection.",
      conversionToken,
    };
  } catch (error) {
    console.error("[submitQuote] Unexpected error:", error);
    return { ok: false, message: phoneFallbackMessage() };
  }
}

/**
 * Redeem a one-time quote conversion token before firing GA4/Meta Lead.
 * Safe to call repeatedly — returns ok:false after first successful redeem.
 */
export async function redeemQuoteConversionToken(
  token: string,
): Promise<{ ok: boolean }> {
  if (!token || typeof token !== "string" || token.length > 256) {
    return { ok: false };
  }

  try {
    const ok = await redeemConversionToken(token);
    return { ok };
  } catch (error) {
    console.error("[redeemQuoteConversionToken] error:", error);
    return { ok: false };
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
        stored = false;
      } else {
        stored = true;
      }
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

    const emailed = emailActuallySent(emailResults);

    if (!stored && !emailed) {
      return { ok: false, message: phoneFallbackMessage() };
    }

    if (stored && !emailed) {
      console.error(
        "[submitEnquiry] Enquiry stored but email notification failed",
      );
    }
    if (!stored && emailed) {
      console.error(
        "[submitEnquiry] Email delivered but Supabase storage failed or skipped",
      );
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
        stored = false;
      } else {
        stored = true;
      }
    }

    const emailResults = await Promise.allSettled([
      sendNewsletterNotification(parsed.data.email),
      sendNewsletterConfirmation(parsed.data.email),
    ]);

    const emailed = emailActuallySent(emailResults);

    if (!stored && !emailed) {
      return { ok: false, message: "Please try again in a moment." };
    }

    if (stored && !emailed) {
      console.error(
        "[submitNewsletter] Signup stored but email notification failed",
      );
    }

    return { ok: true, message: "You're subscribed. Welcome aboard!" };
  } catch (error) {
    console.error("[submitNewsletter] error:", error);
    return { ok: false, message: "Please try again in a moment." };
  }
}
