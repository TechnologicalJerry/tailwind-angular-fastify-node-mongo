import { FastifyRequest, FastifyReply } from 'fastify';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimitMiddleware {
  private static store: RateLimitStore = {};
  private static cleanupInterval: NodeJS.Timeout | null = null;

  static init() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  static destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  static create(config: RateLimitConfig) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const key = this.getKey(request);
      const now = Date.now();
      const windowStart = now - config.windowMs;

      // Get or create rate limit entry
      let entry = this.store[key];
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 0,
          resetTime: now + config.windowMs
        };
        this.store[key] = entry;
      }

      // Increment count
      entry.count++;

      // Check if limit exceeded
      if (entry.count > config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        
        reply.header('Retry-After', retryAfter);
        reply.header('X-RateLimit-Limit', config.maxRequests);
        reply.header('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count));
        reply.header('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
        
        return reply.status(429).send({
          success: false,
          message: 'Too many requests',
          retryAfter
        });
      }

      // Add rate limit headers
      reply.header('X-RateLimit-Limit', config.maxRequests);
      reply.header('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count));
      reply.header('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    };
  }

  private static getKey(request: FastifyRequest): string {
    // Use IP address as the key
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    return `rate_limit:${ip}`;
  }

  private static cleanup() {
    const now = Date.now();
    for (const [key, entry] of Object.entries(this.store)) {
      if (entry.resetTime < now) {
        delete this.store[key];
      }
    }
  }
}

// Default rate limiters
export const authRateLimit = RateLimitMiddleware.create({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5 // 5 attempts per window
});

export const generalRateLimit = RateLimitMiddleware.create({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 requests per window
});

export const strictRateLimit = RateLimitMiddleware.create({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // 10 requests per window
});
