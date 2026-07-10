import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the service-role key.
 *
 * SERVER-ONLY. Never import this into a Client Component — the service-role
 * key bypasses Row Level Security and must never reach the browser.
 *
 * Returns `null` when the environment is not configured, so callers can
 * degrade gracefully (e.g. still send an email notification) instead of
 * crashing during local development or a misconfigured deploy.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
