import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { isSentryEnabled } from "@/lib/sentry";
import {
  FORM_RATE_LIMIT,
  FORM_WINDOW_MS,
  RATE_LIMIT_UNAVAILABLE_MESSAGE,
  applyLocalLimit,
  clientIpFromHeaders,
  denyLimited,
  denyUnavailable,
  isProductionRuntime,
  isRedisConfigured,
  planPublicRateLimit,
  type MemoryBucket,
  type RateLimitPlan,
  type RateLimitResult,
} from "@/lib/rate-limit-policy";

/**
 * Public rate limiting.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are set. The Upstash SDK's default timeout allows the request after 5s
 * (fail open); that timeout is disabled here, and a short Redis abort turns
 * into the strict in-memory fallback (production) or the dev memory bucket.
 *
 * See rate-limit-policy.ts for the production vs development trade-off.
 */

const PASSWORD_CHECK_LIMIT = 8;
const PASSWORD_CHECK_WINDOW = "1 m" as const;
const PASSWORD_CHECK_WINDOW_MS = 60_000;
const REDIS_ABORT_MS = 2_000;

const FORM_LIMITED_MESSAGE = {
  quote: "You've sent a few requests very quickly. Please try again in a minute.",
  enquiry:
    "You've sent a few messages very quickly. Please try again in a minute.",
  newsletter:
    "You've sent a few requests very quickly. Please try again in a minute.",
} as const;

const devBuckets: MemoryBucket = new Map();
const strictBuckets: MemoryBucket = new Map();

let missingRedisReported = false;
let lastRedisErrorReport = 0;

const redisByCreds = new Map<string, Redis>();
const limiters = new Map<string, Ratelimit>();

export { RATE_LIMIT_UNAVAILABLE_MESSAGE, isRedisConfigured };

export function isUpstashRateLimitConfigured(): boolean {
  return isRedisConfigured();
}

function readClientIp(): string | null {
  try {
    return clientIpFromHeaders(headers());
  } catch (error) {
    console.error("[rate-limit] Could not read client IP:", error);
    return null;
  }
}

function getLimiter(limit: number, window: `${number} m`): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const cacheKey = `${url}:${limit}:${window}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  const credsKey = `${url}:${token}`;
  let redis = redisByCreds.get(credsKey);
  if (!redis) {
    redis = new Redis({
      url,
      token,
      // One attempt. Retries would delay the strict fallback during an outage.
      retry: false,
      signal: () => AbortSignal.timeout(REDIS_ABORT_MS),
    });
    redisByCreds.set(credsKey, redis);
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix: "britemj:rl",
    // 0 disables the SDK default, which resolves success:true on timeout.
    timeout: 0,
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

async function reportRateLimitIssue(
  kind: "missing" | "error",
  error: unknown,
  extra: Record<string, string>,
) {
  const now = Date.now();
  if (kind === "missing") {
    if (missingRedisReported) return;
    missingRedisReported = true;
  } else if (now - lastRedisErrorReport < 60_000) {
    console.error("[rate-limit] Upstash error (Sentry suppressed):", error);
    return;
  } else {
    lastRedisErrorReport = now;
  }

  console.error(
    kind === "missing"
      ? "[rate-limit] Upstash Redis is not configured. Public submissions are fail-closed in production."
      : isProductionRuntime()
        ? "[rate-limit] Upstash error. Degrading to the strict in-memory fallback."
        : "[rate-limit] Upstash error. Using the in-memory development limiter.",
    error,
  );

  if (!isSentryEnabled()) return;

  try {
    const Sentry = await import("@sentry/nextjs");
    if (kind === "missing") {
      Sentry.captureMessage(
        "Upstash Redis is not configured; public rate limiting is fail-closed in production.",
        { level: "error", tags: { area: "rate-limit" }, extra },
      );
    } else {
      Sentry.captureException(
        error instanceof Error ? error : new Error("Upstash rate limit failed"),
        { tags: { area: "rate-limit" }, extra },
      );
    }
  } catch (sentryError) {
    console.error("[rate-limit] Sentry report failed:", sentryError);
  }
}

function storeFor(plan: RateLimitPlan): MemoryBucket {
  return plan.backend === "strict-memory" ? strictBuckets : devBuckets;
}

async function checkRateLimit(options: {
  bucket: string;
  limit: number;
  window: `${number} m`;
  windowMs: number;
  limitedMessage: string;
}): Promise<RateLimitResult> {
  const production = isProductionRuntime();
  const redisConfigured = isRedisConfigured();
  const ip = readClientIp();
  let plan = planPublicRateLimit({
    production,
    redisConfigured,
    redisFailed: false,
    limit: options.limit,
    windowMs: options.windowMs,
  });

  if (plan.backend === "redis") {
    const limiter = getLimiter(options.limit, options.window);
    if (!limiter) {
      plan = planPublicRateLimit({
        production,
        redisConfigured: false,
        redisFailed: false,
        limit: options.limit,
        windowMs: options.windowMs,
      });
    } else {
      try {
        const { success } = await limiter.limit(`${options.bucket}:${ip ?? "unknown"}`);
        if (success) return { ok: true };
        return denyLimited(options.limitedMessage);
      } catch (error) {
        await reportRateLimitIssue("error", error, { bucket: options.bucket });
        plan = planPublicRateLimit({
          production,
          redisConfigured: true,
          redisFailed: true,
          limit: options.limit,
          windowMs: options.windowMs,
        });
      }
    }
  }

  if (plan.backend === "closed") {
    await reportRateLimitIssue("missing", new Error("Upstash Redis env vars are unset"), {
      bucket: options.bucket,
    });
  }

  if (plan.backend === "redis") {
    return denyUnavailable();
  }

  return applyLocalLimit({
    plan,
    bucketName: options.bucket,
    ip,
    store: storeFor(plan),
    now: Date.now(),
    limitedMessage: options.limitedMessage,
  });
}

export async function checkFormRateLimit(
  bucket: "quote" | "enquiry" | "newsletter" = "quote",
): Promise<RateLimitResult> {
  return checkRateLimit({
    bucket,
    limit: FORM_RATE_LIMIT,
    window: "1 m",
    windowMs: FORM_WINDOW_MS,
    limitedMessage: FORM_LIMITED_MESSAGE[bucket],
  });
}

/** Per-IP limit for the public Have I Been Pwned password check. */
export async function checkPasswordCheckRateLimit(): Promise<RateLimitResult> {
  return checkRateLimit({
    bucket: "password-check",
    limit: PASSWORD_CHECK_LIMIT,
    window: PASSWORD_CHECK_WINDOW,
    windowMs: PASSWORD_CHECK_WINDOW_MS,
    limitedMessage: "Too many password checks. Please try again in a minute.",
  });
}
