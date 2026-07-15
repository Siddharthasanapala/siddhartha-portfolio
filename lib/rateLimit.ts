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

// Shared with both /api/contact (direct submissions) and /api/chat (the
// AI-driven contact flow) so the two paths rate-limit the same visitor
// identically instead of drifting out of sync — see lib/email.ts's
// sendContactEmail callers for why this single definition matters.
export const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

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
