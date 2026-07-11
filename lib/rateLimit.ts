interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * In-memory sliding-window rate limiter — sufficient for a single-container
 * Docker deployment (chatbot spec §3.5); would need a shared store (Redis)
 * if this ever ran across multiple instances.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length };
}
