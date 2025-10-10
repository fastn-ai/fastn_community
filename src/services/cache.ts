// Caching Service for fastn community platform
// Implements intelligent caching strategies following performance optimization guidelines

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Maximum number of entries
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0
  };

  // Cache TTL configurations for different data types
  private readonly TTL_CONFIG = {
    categories: 30 * 60 * 1000, // 30 minutes
    topics: 5 * 60 * 1000, // 5 minutes
    replies: 2 * 60 * 1000, // 2 minutes
    users: 15 * 60 * 1000, // 15 minutes
    tags: 60 * 60 * 1000, // 1 hour
    static: 24 * 60 * 60 * 1000, // 24 hours
  };

  constructor() {
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Set data in cache with intelligent TTL based on data type
   */
  set<T>(key: string, data: T, dataType?: keyof typeof this.TTL_CONFIG): void {
    const ttl = dataType ? this.TTL_CONFIG[dataType] : this.defaultTTL;
    
    // Evict least recently used entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });

    this.stats.size = this.cache.size;
  }

  /**
   * Get data from cache with hit tracking
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size = this.cache.size;
      return null;
    }

    // Update hit count and timestamp for LRU tracking
    entry.hits++;
    entry.timestamp = Date.now();
    this.stats.hits++;
    
    return entry.data;
  }

  /**
   * Get or set pattern - fetch from cache or execute function
   */
  async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    dataType?: keyof typeof this.TTL_CONFIG
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, dataType);
    return data;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
    this.stats.size = this.cache.size;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Evict least recently used entries
   */
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    let leastHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Prioritize entries with fewer hits and older timestamps
      if (entry.hits < leastHits || 
          (entry.hits === leastHits && entry.timestamp < oldestTime)) {
        oldestKey = key;
        oldestTime = entry.timestamp;
        leastHits = entry.hits;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.stats.evictions++;
      }
    }
    this.stats.size = this.cache.size;
  }

  /**
   * Generate cache key for API requests
   */
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Batch cache operations for multiple keys
   */
  async batchGet<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    for (const key of keys) {
      results.set(key, this.get<T>(key));
    }
    
    return results;
  }

  /**
   * Batch set operations for multiple key-value pairs
   */
  batchSet<T>(entries: Array<{ key: string; data: T; dataType?: keyof typeof this.TTL_CONFIG }>): void {
    for (const { key, data, dataType } of entries) {
      this.set(key, data, dataType);
    }
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Cache decorator for API methods
export function cached(dataType?: keyof typeof cacheService['TTL_CONFIG']) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const key = CacheService.generateKey(`${target.constructor.name}.${propertyName}`, args[0] || {});
      
      return cacheService.getOrSet(key, () => method.apply(this, args), dataType);
    };
    
    return descriptor;
  };
}

// React hook for cache management
export function useCache() {
  return {
    get: <T>(key: string) => cacheService.get<T>(key),
    set: <T>(key: string, data: T, dataType?: keyof typeof cacheService['TTL_CONFIG']) => 
      cacheService.set(key, data, dataType),
    invalidate: (pattern: string) => cacheService.invalidate(pattern),
    clear: () => cacheService.clear(),
    getStats: () => cacheService.getStats(),
    generateKey: CacheService.generateKey
  };
}

export default cacheService;

