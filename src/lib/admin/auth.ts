import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types/database";

export type AuthProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
};

/**
 * Require an authenticated, active admin for sensitive system security routes.
 */
export async function requireAdmin(): Promise<
  | { ok: true; profile: AuthProfile; supabase: ReturnType<typeof createClient> }
  | { ok: false; status: number; error: string }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Sign in required." };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { ok: false, status: 403, error: "User profile not found." };
  }

  if (!profile.is_active) {
    return { ok: false, status: 403, error: "Account is inactive." };
  }

  if (profile.role !== "admin") {
    return { ok: false, status: 403, error: "Admin access required." };
  }

  return { ok: true, profile: profile as AuthProfile, supabase };
}

export async function requireStaff(): Promise<
  | { ok: true; profile: AuthProfile; supabase: ReturnType<typeof createClient> }
  | { ok: false; status: number; error: string }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Sign in required." };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile || !profile.is_active) {
    return { ok: false, status: 403, error: "Access denied." };
  }

  return { ok: true, profile: profile as AuthProfile, supabase };
}

export function getServiceClient() {
  return createAdminClient();
}
