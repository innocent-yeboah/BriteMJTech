import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const priority = searchParams.get("priority");

  try {
    let query = supabase
      .from("projects")
      .select("*, tasks:project_tasks(count)")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("project_type", type);
    if (priority) query = query.eq("priority", priority);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const validated = projectSchema.parse(body);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...validated,
        client_email: validated.client_email || null,
        client_phone: validated.client_phone || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
