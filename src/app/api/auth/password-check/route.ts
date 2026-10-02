import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSecurePassword } from "@/lib/password-security";
import { checkPasswordCheckRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  password: z.string().min(1),
});

/**
 * Public password policy check used by recovery / update-password flows.
 * Does not change any credentials — only validates strength + HIBP.
 * Limited per IP so the route cannot be used as an open HIBP proxy.
 */
export async function POST(request: NextRequest) {
  const limit = await checkPasswordCheckRateLimit();
  if (!limit.ok) {
    return NextResponse.json(
      { error: limit.message },
      {
        status: limit.reason === "limited" ? 429 : 503,
        headers: { "Retry-After": "60" },
      },
    );
  }

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
