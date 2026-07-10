import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

/**
 * Transactional email via Resend.
 *
 * Every send is wrapped in try/catch and degrades gracefully: if Resend is
 * not configured, or a send fails, we log and continue so the visitor still
 * gets a successful submission experience and the lead is never lost.
 */

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL ||
  `Brite MJ Technologies <onboarding@resend.dev>`;
const internalInbox =
  process.env.LEADS_NOTIFICATION_EMAIL ||
  process.env.COMPANY_EMAIL ||
  siteConfig.contact.email;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const brandBlue = "#1E3A5F";
const brandDark = "#0A2540";

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
      </div>
    </div>
  </div>`;
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;background:#f0f4f9;font-weight:600;border-radius:6px 0 0 6px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;">${value}</td>
  </tr>`;
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
  if (!resend) {
    console.warn("[email] Resend not configured — skipping lead notification.");
    return;
  }
  try {
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
        <a href="mailto:${data.email}" style="background:${brandBlue};color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reply to ${data.name}</a>
      </p>`;
    await resend.emails.send({
      from: fromEmail,
      to: internalInbox,
      replyTo: data.email,
      subject: `New Lead: ${data.name} — ${data.services?.[0] ?? "Enquiry"}`,
      html: shell("New Website Lead", body),
    });
  } catch (error) {
    console.error("[email] Failed to send lead notification:", error);
  }
}

/** Send a friendly confirmation to the person who submitted the form. */
export async function sendLeadConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  if (!resend) return;
  try {
    const body = `
      <p>Hi ${data.name.split(" ")[0]},</p>
      <p>Thank you for reaching out to <strong>Brite MJ Technologies</strong>. We've received your request and a member of our team will contact you shortly to arrange your <strong>free site inspection</strong> and a tailored quote.</p>
      <p>Need us sooner? Call or WhatsApp us:</p>
      <p style="font-size:15px;">
        📞 <a href="tel:${siteConfig.contact.phone}" style="color:${brandBlue};">${siteConfig.contact.phone}</a>
        &nbsp;/&nbsp;
        <a href="tel:${siteConfig.contact.phoneAlt}" style="color:${brandBlue};">${siteConfig.contact.phoneAlt}</a>
      </p>
      <p>Warm regards,<br/>The Brite MJ Technologies Team</p>`;
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "We've received your request — Brite MJ Technologies",
      html: shell("Thank you for contacting us", body),
    });
  } catch (error) {
    console.error("[email] Failed to send confirmation:", error);
  }
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
  if (!resend) {
    console.warn("[email] Resend not configured — skipping enquiry notification.");
    return;
  }
  try {
    const body = `
      <p>A new enquiry has been submitted through the contact form.</p>
      <table style="width:100%;border-collapse:separate;border-spacing:0 6px;font-size:14px;">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}
        ${row("Subject", data.subject)}
        ${row("Message", data.message)}
      </table>`;
    await resend.emails.send({
      from: fromEmail,
      to: internalInbox,
      replyTo: data.email,
      subject: `New Enquiry: ${data.subject || data.name}`,
      html: shell("New Contact Enquiry", body),
    });
  } catch (error) {
    console.error("[email] Failed to send enquiry notification:", error);
  }
}
