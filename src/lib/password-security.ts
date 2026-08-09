/**
 * Password strength + Have I Been Pwned (k-anonymity) checks.
 * Complements Supabase Auth "Prevent use of leaked passwords" (Pro+) so
 * password changes fail closed even before the dashboard toggle is on.
 */

import { createHash } from "crypto";

const SYMBOLS = `!@#$%^&*()_+-=[]{};'\\:"|<>?,./\`~`;

export type PasswordCheckResult =
  | { ok: true }
  | { ok: false; error: string; reasons: string[] };

export function validatePasswordStrength(password: string): PasswordCheckResult {
  const reasons: string[] = [];
  const messages: string[] = [];

  if (password.length < 10) {
    reasons.push("length");
    messages.push("Password must be at least 10 characters.");
  }
  if (!/[a-z]/.test(password)) {
    reasons.push("characters");
    messages.push("Include at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    reasons.push("characters");
    messages.push("Include at least one uppercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    reasons.push("characters");
    messages.push("Include at least one number.");
  }
  if (![...SYMBOLS].some((s) => password.includes(s))) {
    reasons.push("characters");
    messages.push("Include at least one symbol.");
  }

  if (reasons.length > 0) {
    return {
      ok: false,
      error: messages.join(" "),
      reasons: [...new Set(reasons)],
    };
  }

  return { ok: true };
}

/**
 * Checks the password against HaveIBeenPwned using the k-anonymity range API
 * (only the first 5 SHA-1 hex chars are sent; the full password never leaves the server).
 */
export async function isPasswordLeaked(password: string): Promise<boolean> {
  const hash = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    {
      headers: {
        "Add-Padding": "true",
        "User-Agent": "BriteMJTech-PasswordCheck",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`HIBP lookup failed (${response.status})`);
  }

  const body = await response.text();
  return body.split("\n").some((line) => {
    const [hashSuffix] = line.trim().split(":");
    return hashSuffix?.toUpperCase() === suffix;
  });
}

export async function assertSecurePassword(
  password: string,
): Promise<PasswordCheckResult> {
  const strength = validatePasswordStrength(password);
  if (!strength.ok) return strength;

  try {
    const leaked = await isPasswordLeaked(password);
    if (leaked) {
      return {
        ok: false,
        error:
          "This password appears in known data breaches. Please choose a different one.",
        reasons: ["pwned"],
      };
    }
  } catch (error) {
    // Fail closed: do not accept passwords if we cannot verify them.
    console.error("[password-security] HIBP check failed:", error);
    return {
      ok: false,
      error:
        "Unable to verify password security right now. Please try again in a moment.",
      reasons: ["hibp_unavailable"],
    };
  }

  return { ok: true };
}
