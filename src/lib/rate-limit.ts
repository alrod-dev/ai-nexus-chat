import { RateLimitResult } from '@/types';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now + windowMs),
    };
  }

  if (now >= entry.resetAt) {
    // Reset the counter
    entry.count = 1;
    entry.resetAt = now + windowMs;
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(entry.resetAt),
    };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt),
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: new Date(entry.resetAt),
  };
}

export function getRateLimitKey(userId: string, endpoint: string): string {
  return `${userId}:${endpoint}`;
}

export function clearRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
