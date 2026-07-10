import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components (browser).
 * Uses the public anon key, which is safe to expose. Row Level Security
 * policies restrict what the anon role is permitted to do.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(url, anonKey);
}
