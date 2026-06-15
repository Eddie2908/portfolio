import * as Sentry from '@sentry/nextjs';

// Client-side Sentry is only enabled when NEXT_PUBLIC_SENTRY_DSN is set.
// This avoids build/runtime errors if Sentry is not configured yet.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    // Disable PII (default, but explicit is safer)
    sendDefaultPii: false,
    // Capture Replay for UI errors (optional, low sample rate)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}
