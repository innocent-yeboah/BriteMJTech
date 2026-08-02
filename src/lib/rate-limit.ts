import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Distributed form rate limiting via Upstash Redis (works across Vercel
 * instances). Falls back to an in-memory bucket when Upstash env vars are
 * missing so local development still has basic spam protection.
 */

const RATE_LIMIT = 6;
const WINDOW = "1 m" as const;
const WINDOW_MS = 60_000;

const memoryBucket = new Map<string, { count: number; resetAt: number }>();

function getClientIp(): string {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function memoryAllow(key: string): boolean {
  const now = Date.now();
  const entry = memoryBucket.get(key);
  if (!entry || now > entry.resetAt) {
    memoryBucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

let upstash: Ratelimit | null | undefined;

function getUpstashLimiter(): Ratelimit | null {
  if (upstash !== undefined) return upstash;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    upstash = null;
    return upstash;
  }

  upstash = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, WINDOW),
    analytics: true,
    prefix: "britemj:forms",
  });

  return upstash;
}

/**
 * Returns true when the request is within the limit.
 * Prefix isolates quote / contact / newsletter buckets if desired.
 */
export async function checkFormRateLimit(
  bucket: "quote" | "enquiry" | "newsletter" = "quote",
): Promise<boolean> {
  const ip = getClientIp();
  const key = `${bucket}:${ip}`;
  const limiter = getUpstashLimiter();

  if (!limiter) {
    return memoryAllow(key);
  }

  try {
    const { success } = await limiter.limit(key);
    return success;
  } catch (error) {
    console.error("[rate-limit] Upstash error — allowing request:", error);
    return memoryAllow(key);
  }
}

export function isUpstashRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}
