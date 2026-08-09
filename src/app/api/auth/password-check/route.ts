import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSecurePassword } from "@/lib/password-security";

const schema = z.object({
  password: z.string().min(1),
});

/**
 * Public password policy check used by recovery / update-password flows.
 * Does not change any credentials — only validates strength + HIBP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = schema.parse(body);
    const result = await assertSecurePassword(password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
