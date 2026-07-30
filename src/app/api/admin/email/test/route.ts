import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getEmailConfigSummary, sendTestEmail } from "@/lib/email";

const testSchema = z.object({
  to: z.string().email().optional(),
});

/**
 * Admin-only Resend health check for the verified britemjtechnologies.com domain.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({ data: getEmailConfigSummary() });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const input = testSchema.parse(body);
    const result = await sendTestEmail(input.to);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: error.errors[0]?.message || "Invalid email." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, message: "Failed to send test email." },
      { status: 500 },
    );
  }
}
