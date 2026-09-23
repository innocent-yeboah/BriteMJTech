/**
 * Smoke-check the quote lead path dependencies (no secrets printed).
 *
 * Usage: node scripts/smoke-lead-path.mjs
 *
 * Reads .env.local for NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY,
 * verifies DNS, then attempts a service-role insert + delete on `leads`.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lookup } from "node:dns/promises";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = m[2].trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function maskEmail(email) {
  return String(email).replace(/(.{2}).+(@.*)/, "$1***$2");
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const resendKey = process.env.RESEND_API_KEY || "";

  console.log("=== smoke-lead-path ===");
  console.log("SUPABASE_URL_SET:", Boolean(url));
  console.log("SERVICE_ROLE_SET:", Boolean(serviceKey));
  console.log("RESEND_KEY_SET:", Boolean(resendKey));

  if (!url) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL missing");
    process.exit(1);
  }

  let host;
  try {
    host = new URL(url).host;
  } catch {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
    process.exit(1);
  }
  console.log("SUPABASE_HOST:", host);

  try {
    const dns = await lookup(host);
    console.log("DNS_OK:", dns.address);
  } catch (error) {
    console.error(
      "DNS_FAIL:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "The Supabase project host does not resolve. Create or restore a project,",
    );
    console.error(
      "then update NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,",
    );
    console.error("and SUPABASE_SERVICE_ROLE_KEY in .env.local + Vercel.");
    process.exit(1);
  }

  if (!serviceKey) {
    console.error("FAIL: SUPABASE_SERVICE_ROLE_KEY missing");
    process.exit(1);
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const marker = `SMOKE_TEST_${Date.now()}`;
  const { data: inserted, error: insertError } = await sb
    .from("leads")
    .insert({
      name: marker,
      email: "smoke-test@britemjtechnologies.com",
      phone: "0200000000",
      service_interest: ["cctv-camera-installation"],
      property_type: "residential",
      message: "Automated smoke test — safe to delete",
      source: "website",
      status: "new",
    })
    .select("id,email")
    .single();

  if (insertError) {
    console.error("LEADS_INSERT_FAIL:", insertError.message);
    process.exit(1);
  }

  console.log(
    "LEADS_INSERT_OK:",
    inserted.id.slice(0, 8),
    maskEmail(inserted.email),
  );

  const { error: deleteError } = await sb
    .from("leads")
    .delete()
    .eq("id", inserted.id);

  if (deleteError) {
    console.error("LEADS_DELETE_FAIL:", deleteError.message);
    process.exit(1);
  }

  console.log("LEADS_DELETE_OK");
  console.log("PASS: lead storage path is healthy");
}

main().catch((error) => {
  console.error("FATAL:", error instanceof Error ? error.message : error);
  process.exit(1);
});
