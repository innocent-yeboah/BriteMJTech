import { z } from "zod";

/**
 * Shared validation schemas (Zod) used by both client forms and server
 * actions. Validating on the server as well as the client protects the
 * database from malformed or malicious input.
 */

const phoneRegex = /^[+()\d\s-]{7,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number."),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2000),
  // Honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  // Step 1 — contact
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number."),
  // Step 2 — property
  propertyType: z.string().trim().min(1, "Please select a property type."),
  propertySize: z.string().trim().max(120).optional().or(z.literal("")),
  // Step 3 — services
  services: z
    .array(z.string())
    .min(1, "Please select at least one service you're interested in."),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Step 4 — inspection scheduling
  inspectionDate: z.string().trim().optional().or(z.literal("")),
  inspectionTime: z.string().trim().optional().or(z.literal("")),
  // Honeypot
  company: z.string().max(0).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
