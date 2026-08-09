import * as Sentry from "@sentry/nextjs";
import {
  getSentryDsn,
  getSentryTracesSampleRate,
  isSentryEnabled,
} from "./src/lib/sentry";

const dsn = getSentryDsn();

Sentry.init({
  dsn,
  enabled: isSentryEnabled(),
  tracesSampleRate: getSentryTracesSampleRate(),
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: isSentryEnabled() ? 1.0 : 0,
  integrations: isSentryEnabled()
    ? [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })]
    : [],
});
