import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

/**
 * Transactional email via Resend on the verified
 * britemjtechnologies.com domain.
 *
 * Sends degrade gracefully: if Resend is missing or a send fails, we log and
 * continue so form submissions still succeed and leads are never lost.
 */

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL ||
  "Brite MJ Technologies <noreply@britemjtechnologies.com>";
/** Public branded inbox used as Reply-To on outbound mail. */
const replyToEmail =
  process.env.RESEND_REPLY_TO ||
  process.env.COMPANY_EMAIL ||
  "info@britemjtechnologies.com";
/** Where new lead/enquiry alerts are delivered. */
const internalInbox =
  process.env.LEADS_NOTIFICATION_EMAIL ||
  process.env.COMPANY_EMAIL ||
  "leads@britemjtechnologies.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const brandBlue = "#1E3A5F";
const brandDark = "#0A2540";
const brandAccent = "#E63946";

function shell(title: string, body: string): string {
  return `
  <div style="background:#f5f5f5;padding:32px 0;font-family:Segoe UI,Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(10,37,64,0.1);">
      <div style="background:${brandDark};padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;">Brite MJ Technologies</h1>
        <p style="margin:4px 0 0;color:#8aa7cd;font-size:13px;">${siteConfig.tagline}</p>
      </div>
      <div style="padding:32px;">
        <h2 style="margin:0 0 16px;color:${brandBlue};font-size:18px;">${title}</h2>
        ${body}
      </div>
      <div style="background:#f0f4f9;padding:20px 32px;color:#5a6b82;font-size:12px;">
        <p style="margin:0;">${siteConfig.address.full}</p>
        <p style="margin:4px 0 0;">${siteConfig.contact.phone} &middot; ${siteConfig.contact.email}</p>
        <p style="margin:8px 0 0;">
          <a href="${siteConfig.url}" style="color:${brandAccent};text-decoration:none;">${siteConfig.url.replace(/^https?:\/\//, "")}</a>
        </p>
      </div>
    </div>
  </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;background:#f0f4f9;font-weight:600;border-radius:6px 0 0 6px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;">${escapeHtml(value)}</td>
  </tr>`;
}

async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn("[email] Resend not configured — skipping send:", options.subject);
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      replyTo: options.replyTo || replyToEmail,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("[email] Resend API error:", error);
      return false;
    }

    console.info("[email] Sent:", options.subject, data?.id ?? "");
    return true;
  } catch (error) {
    console.error("[email] Failed to send:", options.subject, error);
    return false;
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(resendApiKey && fromEmail.includes("@"));
}

export function getEmailConfigSummary() {
  return {
    configured: isEmailConfigured(),
    from: fromEmail,
    replyTo: replyToEmail,
    inbox: internalInbox,
    domain: "britemjtechnologies.com",
  };
}

interface LeadEmailData {
  name: string;
  email: string;
  phone: string;
  propertyType?: string;
  propertySize?: string;
  services?: string[];
  message?: string;
  inspectionDate?: string;
  inspectionTime?: string;
  source: string;
}

/** Notify the Brite MJ team about a new lead / quote request. */
export async function sendLeadNotification(data: LeadEmailData): Promise<void> {
  const safeName = escapeHtml(data.name);
  const body = `
    <p>A new lead has been submitted through the website.</p>
    <table style="width:100%;border-collapse:separate;border-spacing:0 6px;font-size:14px;">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Property", data.propertyType)}
      ${row("Size", data.propertySize)}
      ${row("Services", data.services?.join(", "))}
      ${row("Inspection", [data.inspectionDate, data.inspectionTime].filter(Boolean).join(" @ "))}
      ${row("Source", data.source)}
      ${row("Message", data.message)}
    </table>
    <p style="margin-top:20px;">
      <a href="mailto:${encodeURIComponent(data.email).replace(/%40/g, "@")}" style="background:${brandBlue};color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reply to ${safeName}</a>
    </p>`;

  await sendEmail({
    to: internalInbox,
    replyTo: data.email,
    subject: `New Lead: ${data.name.replace(/[\r\n]+/g, " ")} — ${(data.services?.[0] ?? "Enquiry").replace(/[\r\n]+/g, " ")}`,
    html: shell("New Website Lead", body),
  });
}

/** Send a friendly confirmation to the person who submitted the form. */
export async function sendLeadConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  const firstName = escapeHtml(data.name.split(" ")[0] || "there");
  const body = `
    <p>Hi ${firstName},</p>
    <p>Thank you for reaching out to <strong>Brite MJ Technologies</strong>. We've received your request and a member of our team will contact you shortly to arrange your <strong>free site inspection</strong> and a tailored quote.</p>
    <p>Need us sooner? Call or WhatsApp us:</p>
    <p style="font-size:15px;">
      📞 <a href="tel:${siteConfig.contact.phone}" style="color:${brandBlue};">${siteConfig.contact.phone}</a>
      &nbsp;/&nbsp;
      <a href="tel:${siteConfig.contact.phoneAlt}" style="color:${brandBlue};">${siteConfig.contact.phoneAlt}</a>
    </p>
    <p>Warm regards,<br/>The Brite MJ Technologies Team</p>`;

  await sendEmail({
    to: data.email,
    replyTo: replyToEmail,
    subject: "We've received your request — Brite MJ Technologies",
    html: shell("Thank you for contacting us", body),
  });
}

interface EnquiryEmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/** Notify the team about a general enquiry (contact form). */
export async function sendEnquiryNotification(
  data: EnquiryEmailData,
): Promise<void> {
  const safeName = escapeHtml(data.name);
  const body = `
    <p>A new enquiry has been submitted through the contact form.</p>
    <table style="width:100%;border-collapse:separate;border-spacing:0 6px;font-size:14px;">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Subject", data.subject)}
      ${row("Message", data.message)}
    </table>
    <p style="margin-top:20px;">
      <a href="mailto:${encodeURIComponent(data.email).replace(/%40/g, "@")}" style="background:${brandBlue};color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reply to ${safeName}</a>
    </p>`;

  await sendEmail({
    to: internalInbox,
    replyTo: data.email,
    subject: `New Enquiry: ${(data.subject || data.name).replace(/[\r\n]+/g, " ")}`,
    html: shell("New Contact Enquiry", body),
  });
}

/** Notify the team about a newsletter signup. */
export async function sendNewsletterNotification(email: string): Promise<void> {
  const body = `
    <p>Someone subscribed to security tips and offers.</p>
    <table style="width:100%;border-collapse:separate;border-spacing:0 6px;font-size:14px;">
      ${row("Email", email)}
      ${row("Source", "Website newsletter")}
    </table>`;

  await sendEmail({
    to: internalInbox,
    replyTo: email,
    subject: `Newsletter signup: ${email}`,
    html: shell("New Newsletter Subscriber", body),
  });
}

/** Confirm newsletter signup to the subscriber. */
export async function sendNewsletterConfirmation(email: string): Promise<void> {
  const body = `
    <p>You're in.</p>
    <p>Thanks for joining the Brite MJ Technologies list. We'll share practical security tips and occasional offers for homes and businesses in Accra.</p>
    <p>If you ever need protection for your property, book a free site inspection anytime.</p>
    <p style="margin-top:20px;">
      <a href="${siteConfig.url}/quote" style="background:${brandAccent};color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Get a Free Quote</a>
    </p>`;

  await sendEmail({
    to: email,
    replyTo: replyToEmail,
    subject: "You're subscribed — Brite MJ Technologies",
    html: shell("Welcome to the list", body),
  });
}

/** Admin diagnostic: send a test message to the internal inbox. */
export async function sendTestEmail(to?: string): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!isEmailConfigured()) {
    return {
      ok: false,
      message:
        "Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.",
    };
  }

  const recipient = to || internalInbox;
  const ok = await sendEmail({
    to: recipient,
    replyTo: internalInbox,
    subject: "Resend test — Brite MJ Technologies",
    html: shell(
      "Email system is ready",
      `<p>This is a test message from the Brite MJ Technologies website.</p>
       <p>Domain: <strong>britemjtechnologies.com</strong></p>
       <p>From: <strong>${fromEmail}</strong></p>
       <p>If you received this, lead and enquiry notifications are ready to send.</p>`,
    ),
  });

  return ok
    ? { ok: true, message: `Test email sent to ${recipient}.` }
    : {
        ok: false,
        message:
          "Failed to send test email. Check Resend logs and domain DNS settings.",
      };
}
