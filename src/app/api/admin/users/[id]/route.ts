import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getServiceClient } from "@/lib/admin/auth";

const updateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  role: z.enum(["admin", "manager", "staff", "technician"]).optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const admin = getServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Service role is not configured. Add SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const input = updateUserSchema.parse(body);
    const userId = params.id;

    // Prevent an admin from locking themselves out of the last admin seat.
    if (userId === auth.profile.id && input.role && input.role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      );
    }
    if (userId === auth.profile.id && input.is_active === false) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account." },
        { status: 400 }
      );
    }

    const profileUpdates: Record<string, unknown> = {};
    if (input.full_name !== undefined) profileUpdates.full_name = input.full_name;
    if (input.phone !== undefined) profileUpdates.phone = input.phone;
    if (input.role !== undefined) profileUpdates.role = input.role;
    if (input.is_active !== undefined) profileUpdates.is_active = input.is_active;

    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await admin.from("users").update(profileUpdates).eq("id", userId);
      if (error) {
        return NextResponse.json({ error: "Failed to update user profile." }, { status: 500 });
      }
    }

    const authUpdates: {
      password?: string;
      ban_duration?: string;
      app_metadata?: { role: string };
      user_metadata?: { full_name: string };
    } = {};

    if (input.password) authUpdates.password = input.password;
    if (input.role) authUpdates.app_metadata = { role: input.role };
    if (input.full_name) authUpdates.user_metadata = { full_name: input.full_name };
    if (input.is_active === false) authUpdates.ban_duration = "876000h";
    if (input.is_active === true) authUpdates.ban_duration = "none";

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await admin.auth.admin.updateUserById(userId, authUpdates);
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }
    }

    const { data } = await admin
      .from("users")
      .select("id, email, full_name, phone, role, is_active, last_login, created_at, updated_at")
      .eq("id", userId)
      .single();

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
