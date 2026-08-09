/**
 * Shared Sentry init options. SDK only activates when NEXT_PUBLIC_SENTRY_DSN is set.
 */

export function getSentryDsn(): string | undefined {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  return dsn || undefined;
}

export function getSentryTracesSampleRate(): number {
  if (process.env.NODE_ENV === "development") return 1;
  const raw = process.env.SENTRY_TRACES_SAMPLE_RATE;
  if (raw == null || raw === "") return 0.1;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0.1;
}

export function isSentryEnabled(): boolean {
  return Boolean(getSentryDsn());
}
