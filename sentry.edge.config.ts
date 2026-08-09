import * as Sentry from "@sentry/nextjs";
import {
  getSentryDsn,
  getSentryTracesSampleRate,
  isSentryEnabled,
} from "./src/lib/sentry";

Sentry.init({
  dsn: getSentryDsn(),
  enabled: isSentryEnabled(),
  tracesSampleRate: getSentryTracesSampleRate(),
});
