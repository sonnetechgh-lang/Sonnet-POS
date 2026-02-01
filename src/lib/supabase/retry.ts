// Simple retry helper for network/backoff around Supabase calls
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelay = 300) {
    let lastErr: any = null;
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            const delay = baseDelay * Math.pow(2, i);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    throw lastErr;
}
