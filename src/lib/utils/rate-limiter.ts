// src/lib/utils/rate-limiter.ts
import { trackEvent } from '@/lib/analytics/event-tracker';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
  onLimitReached?: (identifier: string) => void;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (id) => id,
      ...config
    };
  }

  check(identifier: string): RateLimitResult {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.config.windowMs);
    
    const remaining = Math.max(0, this.config.maxRequests - validRequests.length);
    const resetTime = now + this.config.windowMs;
    
    if (validRequests.length >= this.config.maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const retryAfter = oldestRequest + this.config.windowMs - now;
      
      // Track rate limit exceeded
      trackEvent('rate_limit_exceeded', {
        identifier: key,
        current_requests: validRequests.length,
        max_requests: this.config.maxRequests,
        window_ms: this.config.windowMs
      });
      
      this.config.onLimitReached?.(identifier);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.max(0, retryAfter)
      };
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return {
      allowed: true,
      remaining: remaining - 1,
      resetTime
    };
  }

  reset(identifier: string): void {
    const key = this.config.keyGenerator!(identifier);
    this.requests.delete(key);
  }

  getRemainingRequests(identifier: string): number {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.config.windowMs);
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }
}

// Specific rate limiters for different operations
export const projectGenerationLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000, // 1 minute
  onLimitReached: (identifier) => {
    console.warn(`Project generation rate limit reached for: ${identifier}`);
  }
});

export const fileParsingLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000, // 1 minute
});

export const downloadLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 300000, // 5 minutes
});

export const apiRequestLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
});

// Rate limiting middleware for async operations
export const withRateLimit = <T extends any[], R>(
  rateLimiter: RateLimiter,
  identifier: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const result = rateLimiter.check(identifier);
    
    if (!result.allowed) {
      const error = new Error(`Rate limit exceeded. Try again in ${Math.ceil((result.retryAfter || 0) / 1000)} seconds.`);
      error.name = 'RateLimitError';
      throw error;
    }
    
    try {
      return await fn(...args);
    } catch (error) {
      // Optionally don't count failed requests against the limit
      if (rateLimiter.config.skipFailedRequests) {
        // Remove the last request from the count
        const key = rateLimiter.config.keyGenerator!(identifier);
        const requests = rateLimiter.requests.get(key) || [];
        requests.pop();
        rateLimiter.requests.set(key, requests);
      }
      throw error;
    }
  };
};

// Hook for React components
export const useRateLimit = (
  rateLimiter: RateLimiter,
  identifier: string
) => {
  const checkLimit = (): RateLimitResult => {
    return rateLimiter.check(identifier);
  };

  const getRemainingRequests = (): number => {
    return rateLimiter.getRemainingRequests(identifier);
  };

  const resetLimit = (): void => {
    rateLimiter.reset(identifier);
  };

  return {
    checkLimit,
    getRemainingRequests,
    resetLimit
  };
};
