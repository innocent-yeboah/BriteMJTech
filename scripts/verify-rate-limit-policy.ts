/**
 * Demonstrates production fail-closed rate limiting without Redis or Next.js.
 * Run: npm run verify:rate-limit
 */
import {
  FORM_RATE_LIMIT,
  FORM_WINDOW_MS,
  RATE_LIMIT_UNAVAILABLE_MESSAGE,
  STRICT_FALLBACK_LIMIT,
  STRICT_FALLBACK_WINDOW_MS,
  STRICT_INSTANCE_LIMIT,
  applyLocalLimit,
  isProductionRuntime,
  isRedisConfigured,
  planPublicRateLimit,
  type MemoryBucket,
} from "../src/lib/rate-limit-policy";

let failed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    failed += 1;
    console.error(`FAIL: ${message}`);
    return;
  }
  console.log(`PASS: ${message}`);
}

function local(input: {
  production: boolean;
  redisConfigured: boolean;
  redisFailed: boolean;
  ip: string | null;
  bucketName?: string;
  store: MemoryBucket;
  now: number;
  limit?: number;
  windowMs?: number;
  limitedMessage?: string;
}) {
  const plan = planPublicRateLimit({
    production: input.production,
    redisConfigured: input.redisConfigured,
    redisFailed: input.redisFailed,
    limit: input.limit ?? FORM_RATE_LIMIT,
    windowMs: input.windowMs ?? FORM_WINDOW_MS,
  });
  if (plan.backend === "redis") {
    return { ok: true as const, backend: "redis" as const };
  }
  const decision = applyLocalLimit({
    plan,
    bucketName: input.bucketName ?? "quote",
    ip: input.ip,
    store: input.store,
    now: input.now,
    limitedMessage:
      input.limitedMessage ??
      "You've sent a few requests very quickly. Please try again in a minute.",
  });
  return { ...decision, backend: plan.backend };
}

function main() {
  assert(
    isProductionRuntime({ NODE_ENV: "production" }) &&
      isProductionRuntime({ VERCEL: "1", NODE_ENV: "development" }) &&
      !isProductionRuntime({ NODE_ENV: "development" }),
    "production is NODE_ENV=production or VERCEL=1",
  );
  assert(
    isRedisConfigured({
      UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "token",
    }) &&
      !isRedisConfigured({}) &&
      !isRedisConfigured({
        UPSTASH_REDIS_REST_URL: "  ",
        UPSTASH_REDIS_REST_TOKEN: "token",
      }),
    "Redis is configured only when both env vars are non-empty",
  );

  const devPlan = planPublicRateLimit({
    production: false,
    redisConfigured: false,
    redisFailed: false,
    limit: FORM_RATE_LIMIT,
    windowMs: FORM_WINDOW_MS,
  });
  assert(devPlan.backend === "memory", "development without Redis uses memory");

  const devRedisError = planPublicRateLimit({
    production: false,
    redisConfigured: true,
    redisFailed: true,
    limit: FORM_RATE_LIMIT,
    windowMs: FORM_WINDOW_MS,
  });
  assert(
    devRedisError.backend === "memory",
    "development still uses memory when Redis errors",
  );

  assert(
    planPublicRateLimit({
      production: true,
      redisConfigured: true,
      redisFailed: false,
      limit: FORM_RATE_LIMIT,
      windowMs: FORM_WINDOW_MS,
    }).backend === "redis",
    "production uses Redis when it is configured and healthy",
  );

  const closedStore: MemoryBucket = new Map();
  const now = 1_700_000_000_000;
  const firstClosed = local({
    production: true,
    redisConfigured: false,
    redisFailed: false,
    ip: "203.0.113.10",
    store: closedStore,
    now,
  });
  const secondClosed = local({
    production: true,
    redisConfigured: false,
    redisFailed: false,
    ip: "203.0.113.10",
    store: closedStore,
    now,
  });
  assert(
    firstClosed.backend === "closed" &&
      firstClosed.ok === false &&
      firstClosed.reason === "unavailable" &&
      firstClosed.message === RATE_LIMIT_UNAVAILABLE_MESSAGE &&
      secondClosed.ok === false &&
      closedStore.size === 0,
    "production without Redis fails closed and does not open a memory bucket",
  );

  const strictStore: MemoryBucket = new Map();
  for (let i = 0; i < STRICT_FALLBACK_LIMIT + 1; i += 1) {
    const decision = local({
      production: true,
      redisConfigured: true,
      redisFailed: true,
      ip: "203.0.113.20",
      store: strictStore,
      now,
    });
    if (i < STRICT_FALLBACK_LIMIT) {
      assert(
        decision.ok && decision.backend === "strict-memory",
        `Redis error allows strict in-memory request ${i + 1}`,
      );
    } else {
      assert(
        !decision.ok &&
          decision.backend === "strict-memory" &&
          decision.reason === "unavailable" &&
          decision.message === "Please try again shortly.",
        "Redis error denies after the strict per-IP budget",
      );
    }
  }

  const otherIp = local({
    production: true,
    redisConfigured: true,
    redisFailed: true,
    ip: "203.0.113.21",
    store: strictStore,
    now,
  });
  assert(otherIp.ok, "a different IP still has its own strict budget");

  const unknownIp = local({
    production: true,
    redisConfigured: true,
    redisFailed: true,
    ip: null,
    bucketName: "enquiry",
    store: strictStore,
    now,
  });
  assert(
    !unknownIp.ok && unknownIp.reason === "unavailable",
    "unknown IP during a Redis error fails closed",
  );

  const beforeInstance = strictStore.get("instance:public")?.count ?? 0;
  let filled = true;
  for (let n = beforeInstance; n < STRICT_INSTANCE_LIMIT; n += 1) {
    const decision = local({
      production: true,
      redisConfigured: true,
      redisFailed: true,
      ip: `198.51.100.${n}`,
      bucketName: n % 2 === 0 ? "quote" : "password-check",
      store: strictStore,
      now,
    });
    if (!decision.ok) filled = false;
  }
  assert(
    filled && strictStore.get("instance:public")?.count === STRICT_INSTANCE_LIMIT,
    "strict fallback allows requests until the per-instance ceiling",
  );
  const overInstance = local({
    production: true,
    redisConfigured: true,
    redisFailed: true,
    ip: "198.51.100.250",
    bucketName: "newsletter",
    store: strictStore,
    now,
  });
  assert(
    !overInstance.ok && overInstance.message === RATE_LIMIT_UNAVAILABLE_MESSAGE,
    "instance ceiling fails closed even for a new IP",
  );

  const later = local({
    production: true,
    redisConfigured: true,
    redisFailed: true,
    ip: "203.0.113.20",
    store: strictStore,
    now: now + STRICT_FALLBACK_WINDOW_MS + 1,
  });
  assert(
    later.ok,
    "strict budget resets after the window so an outage does not last forever",
  );

  const devStore: MemoryBucket = new Map();
  for (let i = 0; i < FORM_RATE_LIMIT; i += 1) {
    const decision = local({
      production: false,
      redisConfigured: false,
      redisFailed: false,
      ip: "127.0.0.1",
      store: devStore,
      now,
    });
    assert(decision.ok && decision.backend === "memory", `dev request ${i + 1} allowed`);
  }
  const devBlocked = local({
    production: false,
    redisConfigured: false,
    redisFailed: false,
    ip: "127.0.0.1",
    store: devStore,
    now,
  });
  assert(
    !devBlocked.ok &&
      devBlocked.reason === "limited" &&
      devBlocked.message?.includes("try again in a minute"),
    "development over the normal limit is a rate-limit response, not fail-closed",
  );

  if (failed > 0) {
    console.error(`RATE LIMIT POLICY CHECK FAILED (${failed})`);
    process.exit(1);
  }
  console.log("RATE LIMIT POLICY CHECK PASSED");
}

main();
