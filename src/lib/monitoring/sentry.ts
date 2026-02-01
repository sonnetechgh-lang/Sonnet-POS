// Lightweight Sentry placeholder initializer (optional)
// Configure NEXT_PUBLIC_SENTRY_DSN in your deployment for production monitoring.

export function initSentry() {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) {
        // No-op in local/dev
        return;
    }

    // Dynamically import to avoid adding heavy dependency without opt-in
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
        const Sentry = await import("@sentry/nextjs");
        Sentry.init({
            dsn,
            tracesSampleRate: 0.1,
        });
    })();
}
