import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";

/**
 * Short-lived, one-time conversion tokens for quote Lead events.
 *
 * Token format: `${id}.${expEpochSec}.${hmac}`
 * Presence in Upstash (or memory fallback) proves the token was issued by
 * this server and has not yet been redeemed.
 */

const TTL_SECONDS = 60 * 30; // 30 minutes
const REDIS_PREFIX = "britemj:conv:";

type MemoryEntry = { expiresAtMs: number; used: boolean };
const memoryTokens = new Map<string, MemoryEntry>();

function getSigningSecret(): string {
  const secret =
    process.env.CONVERSION_TOKEN_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.RESEND_API_KEY?.trim();

  if (!secret) {
    // Local/dev only — production should set CONVERSION_TOKEN_SECRET or
    // already have service-role / Resend keys for signing.
    return "britemj-dev-conversion-token-secret";
  }
  return secret;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function parseToken(
  token: string,
): { id: string; exp: number; sig: string; payload: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expRaw, sig] = parts;
  if (!id || !expRaw || !sig) return null;
  if (!/^[a-f0-9]{32,96}$/i.test(id)) return null;
  if (!/^[a-f0-9]{64}$/i.test(sig)) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= 0) return null;
  return { id, exp, sig, payload: `${id}.${expRaw}` };
}

/** Issue a one-time token after a genuine successful quote submission. */
export async function issueConversionToken(): Promise<string> {
  const id = randomBytes(24).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${id}.${exp}`;
  const token = `${payload}.${sign(payload)}`;

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(`${REDIS_PREFIX}${id}`, "issued", { ex: TTL_SECONDS });
      return token;
    } catch (error) {
      console.error("[conversion-token] Upstash set failed — using memory:", error);
    }
  }

  memoryTokens.set(id, {
    expiresAtMs: exp * 1000,
    used: false,
  });
  return token;
}

/**
 * Redeem a conversion token exactly once.
 * Returns true only when signature, expiry, and unused status all pass.
 */
export async function redeemConversionToken(token: string): Promise<boolean> {
  const parsed = parseToken(token.trim());
  if (!parsed) return false;

  const expectedSig = sign(parsed.payload);
  if (!safeEqualHex(parsed.sig, expectedSig)) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (parsed.exp < nowSec) return false;

  const redis = getRedis();
  if (redis) {
    try {
      // GETDEL if available; otherwise get + del race-safe enough for lead events
      const key = `${REDIS_PREFIX}${parsed.id}`;
      const existing = await redis.get<string>(key);
      if (existing !== "issued") return false;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error("[conversion-token] Upstash redeem failed:", error);
      return false;
    }
  }

  const entry = memoryTokens.get(parsed.id);
  if (!entry) return false;
  if (entry.used) return false;
  if (Date.now() > entry.expiresAtMs) {
    memoryTokens.delete(parsed.id);
    return false;
  }
  entry.used = true;
  memoryTokens.delete(parsed.id);
  return true;
}
