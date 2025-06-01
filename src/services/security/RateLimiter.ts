// src/services/security/RateLimiter.ts
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
  onLimitReached?: (identifier: string, info: RateLimitInfo) => void;
  whitelist?: string[];
  blacklist?: string[];
}

interface RateLimitInfo {
  totalHits: number;
  remainingPoints: number;
  msBeforeNext: number;
  resetTime: Date;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

interface RequestRecord {
  count: number;
  resetTime: number;
  firstRequest: number;
}

export class RateLimiter {
  private requests: Map<string, RequestRecord> = new Map();
  private config: Required<RateLimitConfig>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (id) => id,
      onLimitReached: () => {},
      whitelist: [],
      blacklist: [],
      ...config,
    };

    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  public async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(identifier);
    
    // Check whitelist
    if (this.config.whitelist.includes(key)) {
      return this.createSuccessResult();
    }

    // Check blacklist
    if (this.config.blacklist.includes(key)) {
      return this.createDeniedResult(0);
    }

    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    let record = this.requests.get(key);
    
    // Create new record if doesn't exist or window has expired
    if (!record || record.resetTime <= now) {
      record = {
        count: 1,
        resetTime: now + this.config.windowMs,
        firstRequest: now,
      };
      this.requests.set(key, record);
      
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime: new Date(record.resetTime),
      };
    }

    // Check if limit exceeded
    if (record.count >= this.config.maxRequests) {
      const info: RateLimitInfo = {
        totalHits: record.count,
        remainingPoints: 0,
        msBeforeNext: record.resetTime - now,
        resetTime: new Date(record.resetTime),
      };

      this.config.onLimitReached(identifier, info);
      
      return this.createDeniedResult(record.resetTime - now);
    }

    // Increment counter
    record.count++;
    this.requests.set(key, record);

    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests - record.count,
      resetTime: new Date(record.resetTime),
    };
  }

  public async reset(identifier: string): Promise<void> {
    const key = this.config.keyGenerator(identifier);
    this.requests.delete(key);
  }

  public async getInfo(identifier: string): Promise<RateLimitInfo | null> {
    const key = this.config.keyGenerator(identifier);
    const record = this.requests.get(key);
    
    if (!record) {
      return null;
    }

    const now = Date.now();
    
    return {
      totalHits: record.count,
      remainingPoints: Math.max(0, this.config.maxRequests - record.count),
      msBeforeNext: Math.max(0, record.resetTime - now),
      resetTime: new Date(record.resetTime),
    };
  }

  public addToWhitelist(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    if (!this.config.whitelist.includes(key)) {
      this.config.whitelist.push(key);
    }
  }

  public removeFromWhitelist(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    const index = this.config.whitelist.indexOf(key);
    if (index > -1) {
      this.config.whitelist.splice(index, 1);
    }
  }

  public addToBlacklist(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    if (!this.config.blacklist.includes(key)) {
      this.config.blacklist.push(key);
    }
  }

  public removeFromBlacklist(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    const index = this.config.blacklist.indexOf(key);
    if (index > -1) {
      this.config.blacklist.splice(index, 1);
    }
  }

  public getStats() {
    const now = Date.now();
    let activeRecords = 0;
    let totalRequests = 0;

    for (const record of this.requests.values()) {
      if (record.resetTime > now) {
        activeRecords++;
        totalRequests += record.count;
      }
    }

    return {
      activeRecords,
      totalRequests,
      whitelistSize: this.config.whitelist.length,
      blacklistSize: this.config.blacklist.length,
      memoryUsage: this.requests.size,
    };
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }

  private createSuccessResult(): RateLimitResult {
    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests,
      resetTime: new Date(Date.now() + this.config.windowMs),
    };
  }

  private createDeniedResult(retryAfter: number): RateLimitResult {
    return {
      allowed: false,
      limit: this.config.maxRequests,
      remaining: 0,
      resetTime: new Date(Date.now() + retryAfter),
      retryAfter: Math.ceil(retryAfter / 1000), // Convert to seconds
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, record] of this.requests.entries()) {
      if (record.resetTime <= now) {
        toDelete.push(key);
      }
    }

    toDelete.forEach(key => this.requests.delete(key));
  }
}

// Specific rate limiters for different operations
export class RateLimitManager {
  private limiters: Map<string, RateLimiter> = new Map();

  constructor() {
    this.initializeDefaultLimiters();
  }

  private initializeDefaultLimiters(): void {
    // Project generation limiter
    this.limiters.set('project-generation', new RateLimiter({
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      onLimitReached: (identifier, info) => {
        console.warn(`Project generation rate limit reached for: ${identifier}`, info);
      },
    }));

    // File parsing limiter
    this.limiters.set('file-parsing', new RateLimiter({
      maxRequests: 20,
      windowMs: 60000, // 1 minute
    }));

    // Download limiter
    this.limiters.set('download', new RateLimiter({
      maxRequests: 10,
      windowMs: 300000, // 5 minutes
    }));

    // API request limiter
    this.limiters.set('api-request', new RateLimiter({
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    }));

    // Authentication limiter
    this.limiters.set('auth', new RateLimiter({
      maxRequests: 5,
      windowMs: 900000, // 15 minutes
      onLimitReached: (identifier, info) => {
        console.warn(`Authentication rate limit reached for: ${identifier}`, info);
      },
    }));

    // Template validation limiter
    this.limiters.set('template-validation', new RateLimiter({
      maxRequests: 50,
      windowMs: 60000, // 1 minute
    }));
  }

  public getLimiter(name: string): RateLimiter | null {
    return this.limiters.get(name) || null;
  }

  public async checkLimit(limiterName: string, identifier: string): Promise<RateLimitResult> {
    const limiter = this.limiters.get(limiterName);
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`);
    }
    return limiter.checkLimit(identifier);
  }

  public async resetLimit(limiterName: string, identifier: string): Promise<void> {
    const limiter = this.limiters.get(limiterName);
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`);
    }
    return limiter.reset(identifier);
  }

  public getAllStats() {
    const stats: Record<string, any> = {};
    for (const [name, limiter] of this.limiters.entries()) {
      stats[name] = limiter.getStats();
    }
    return stats;
  }

  public addCustomLimiter(name: string, config: RateLimitConfig): void {
    if (this.limiters.has(name)) {
      throw new Error(`Rate limiter '${name}' already exists`);
    }
    this.limiters.set(name, new RateLimiter(config));
  }

  public removeLimiter(name: string): boolean {
    const limiter = this.limiters.get(name);
    if (limiter) {
      limiter.destroy();
      this.limiters.delete(name);
      return true;
    }
    return false;
  }

  public destroy(): void {
    for (const limiter of this.limiters.values()) {
      limiter.destroy();
    }
    this.limiters.clear();
  }
}

// Rate limiting middleware helper
export const withRateLimit = <T extends any[], R>(
  limiterName: string,
  rateLimitManager: RateLimitManager,
  identifier: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const result = await rateLimitManager.checkLimit(limiterName, identifier);
    
    if (!result.allowed) {
      const error = new Error(`Rate limit exceeded. Try again in ${result.retryAfter} seconds.`);
      (error as any).name = 'RateLimitError';
      (error as any).retryAfter = result.retryAfter;
      (error as any).resetTime = result.resetTime;
      throw error;
    }
    
    try {
      return await fn(...args);
    } catch (error) {
      // Optionally don't count failed requests against the limit
      // This is configurable per limiter
      throw error;
    }
  };
};

// Singleton instance
export const rateLimitManager = new RateLimitManager();
