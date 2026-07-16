import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin/auth";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Change the signed-in user's password after verifying the current one.
 */
export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const input = passwordSchema.parse(body);

    const { error: signInError } = await auth.supabase.auth.signInWithPassword({
      email: auth.profile.email,
      password: input.currentPassword,
    });

    if (signInError) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const { error: updateError } = await auth.supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
