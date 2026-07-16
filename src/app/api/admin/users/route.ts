import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getServiceClient } from "@/lib/admin/auth";

const createUserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "staff", "technician"]).default("staff"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await auth.supabase
    .from("users")
    .select("id, email, full_name, phone, role, is_active, last_login, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
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
    const input = createUserSchema.parse(body);

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.full_name },
      app_metadata: { role: input.role },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message || "Failed to create user." },
        { status: 400 }
      );
    }

    const { error: profileError } = await admin.from("users").upsert({
      id: created.user.id,
      email: input.email,
      full_name: input.full_name,
      phone: input.phone || null,
      role: input.role,
      is_active: true,
    });

    if (profileError) {
      return NextResponse.json(
        { error: "User created in auth but profile sync failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          id: created.user.id,
          email: input.email,
          full_name: input.full_name,
          role: input.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
