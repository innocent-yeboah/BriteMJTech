import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireStaff();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { data: lead, error: leadError } = await auth.supabase
      .from("leads")
      .select("*")
      .eq("id", params.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const { data: project, error: projectError } = await auth.supabase
      .from("projects")
      .insert({
        lead_id: lead.id,
        client_name: lead.name,
        client_phone: lead.phone,
        client_email: lead.email,
        project_name: `${lead.name} - ${lead.service_interest?.[0] || "Security Project"}`,
        project_type: lead.service_interest?.[0] || "combined",
        status: "planning",
        notes: lead.message,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    const { error: updateError } = await auth.supabase
      .from("leads")
      .update({ status: "won", won_at: new Date().toISOString() })
      .eq("id", params.id);

    if (updateError) throw updateError;

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("Failed to convert lead:", error);
    return NextResponse.json(
      { error: "Failed to convert lead to project" },
      { status: 500 },
    );
  }
}
