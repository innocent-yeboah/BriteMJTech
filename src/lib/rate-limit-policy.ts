/**
 * Pure rate-limit decisions. No Redis, Next.js, or Sentry imports so the
 * production / outage behaviour can be checked without a server.
 *
 * Production trade-off:
 * - Redis configured and healthy: distributed sliding window (real protection
 *   across Vercel isolates).
 * - Redis configured but this call failed: a small in-memory budget on this
 *   isolate, then deny. A short outage does not reject every lead, and it does
 *   not accept unlimited traffic. The budget resets only for this process, so
 *   it is a brake, not a global limiter. The next call tries Redis again.
 * - Redis not configured in production: deny immediately. Per-isolate memory
 *   cannot protect a serverless deployment, so a missing Upstash setup must
 *   not look like a successful form.
 * - Local development: in-memory buckets, including when Redis errors, so
 *   unset credentials do not block development.
 */

export const FORM_RATE_LIMIT = 6;
export const FORM_WINDOW_MS = 60_000;

/** Per IP while Redis is erroring. Enough for a retry, not a flood. */
export const STRICT_FALLBACK_LIMIT = 2;
export const STRICT_FALLBACK_WINDOW_MS = 10 * 60_000;

/**
 * Ceiling for every public bucket on this isolate during a Redis error.
 * Stops a client that rotates addresses from multiplying the per-IP budget
 * on one warm instance. Cold starts reset it; that is why missing Redis
 * config does not use this path.
 */
export const STRICT_INSTANCE_LIMIT = 30;

export const RATE_LIMIT_UNAVAILABLE_MESSAGE = "Please try again shortly.";

export type MemoryEntry = { count: number; resetAt: number };
export type MemoryBucket = Map<string, MemoryEntry>;

export type RateLimitPlan =
  | { backend: "redis" }
  | { backend: "memory"; limit: number; windowMs: number }
  | {
      backend: "strict-memory";
      limit: number;
      windowMs: number;
      instanceLimit: number;
    }
  | { backend: "closed" };

export type RateLimitDenialReason = "limited" | "unavailable";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; reason: RateLimitDenialReason; message: string };

type EnvLike = Record<string, string | undefined>;

export function isProductionRuntime(env: EnvLike = process.env): boolean {
  return env.VERCEL === "1" || env.NODE_ENV === "production";
}

export function isRedisConfigured(env: EnvLike = process.env): boolean {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url?.trim() && token?.trim());
}

export function clientIpFromHeaders(headerList: {
  get(name: string): string | null;
}): string | null {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headerList.get("x-real-ip")?.trim();
  return realIp || null;
}

export function planPublicRateLimit(input: {
  production: boolean;
  redisConfigured: boolean;
  redisFailed: boolean;
  limit: number;
  windowMs: number;
}): RateLimitPlan {
  if (input.redisConfigured && !input.redisFailed) {
    return { backend: "redis" };
  }
  if (!input.production) {
    return {
      backend: "memory",
      limit: input.limit,
      windowMs: input.windowMs,
    };
  }
  if (input.redisConfigured && input.redisFailed) {
    return {
      backend: "strict-memory",
      limit: STRICT_FALLBACK_LIMIT,
      windowMs: STRICT_FALLBACK_WINDOW_MS,
      instanceLimit: STRICT_INSTANCE_LIMIT,
    };
  }
  return { backend: "closed" };
}

export function denyLimited(message: string): RateLimitResult {
  return { ok: false, reason: "limited", message };
}

export function denyUnavailable(
  message: string = RATE_LIMIT_UNAVAILABLE_MESSAGE,
): RateLimitResult {
  return { ok: false, reason: "unavailable", message };
}

function pruneExpired(bucket: MemoryBucket, now: number) {
  if (bucket.size < 2_000) return;
  for (const [key, entry] of bucket) {
    if (now > entry.resetAt) bucket.delete(key);
  }
}

function hasRoom(
  bucket: MemoryBucket,
  key: string,
  now: number,
  limit: number,
): boolean {
  const entry = bucket.get(key);
  if (!entry || now > entry.resetAt) return true;
  return entry.count < limit;
}

function commit(
  bucket: MemoryBucket,
  key: string,
  now: number,
  windowMs: number,
) {
  const entry = bucket.get(key);
  if (!entry || now > entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
}

/**
 * Increments every slot, or none of them, when each slot still has room.
 * Used so a denied instance ceiling does not consume a per-IP allowance.
 */
export function consumeAllOrNone(
  bucket: MemoryBucket,
  slots: { key: string; limit: number; windowMs: number }[],
  now: number,
): boolean {
  pruneExpired(bucket, now);
  if (slots.some((slot) => !hasRoom(bucket, slot.key, now, slot.limit))) {
    return false;
  }
  for (const slot of slots) {
    commit(bucket, slot.key, now, slot.windowMs);
  }
  return true;
}

export function consumeMemoryBucket(
  bucket: MemoryBucket,
  key: string,
  now: number,
  limit: number,
  windowMs: number,
): boolean {
  return consumeAllOrNone(bucket, [{ key, limit, windowMs }], now);
}

/**
 * Local (non-Redis) decision. `closed` and an unknown IP during the strict
 * fallback deny without touching the bucket.
 */
export function applyLocalLimit(input: {
  plan: Exclude<RateLimitPlan, { backend: "redis" }>;
  bucketName: string;
  ip: string | null;
  store: MemoryBucket;
  now: number;
  limitedMessage: string;
}): RateLimitResult {
  const { plan } = input;
  if (plan.backend === "closed") {
    return denyUnavailable();
  }

  if (plan.backend === "strict-memory") {
    if (!input.ip) return denyUnavailable();
    const allowed = consumeAllOrNone(
      input.store,
      [
        {
          key: `ip:${input.bucketName}:${input.ip}`,
          limit: plan.limit,
          windowMs: plan.windowMs,
        },
        {
          key: "instance:public",
          limit: plan.instanceLimit,
          windowMs: plan.windowMs,
        },
      ],
      input.now,
    );
    return allowed ? { ok: true } : denyUnavailable();
  }

  const allowed = consumeMemoryBucket(
    input.store,
    `${input.bucketName}:${input.ip ?? "unknown"}`,
    input.now,
    plan.limit,
    plan.windowMs,
  );
  return allowed ? { ok: true } : denyLimited(input.limitedMessage);
}
