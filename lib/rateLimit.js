/**
 * Simple in-memory rate limiter for serverless API routes.
 * Best-effort (resets on cold start) — enough to blunt casual spam.
 */
const buckets = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now - entry.startedAt > windowMs) {
        buckets.set(key, { startedAt: now, count: 1 });
        return { ok: true, remaining: limit - 1 };
    }

    entry.count += 1;
    if (entry.count > limit) {
        return { ok: false, remaining: 0 };
    }

    return { ok: true, remaining: limit - entry.count };
}

export function clientIp(req) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}
