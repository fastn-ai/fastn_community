// CDN Service for optimized asset delivery
// Implements CDN strategies following performance optimization guidelines

interface CDNConfig {
  baseUrl: string;
  fallbackUrl?: string;
  timeout: number;
  retries: number;
  cacheStrategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

class CDNService {
  private config: CDNConfig;
  private cache = new Map<string, { url: string; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: CDNConfig) {
    this.config = config;
    
    // Cleanup expired cache entries every hour
    setInterval(() => this.cleanupCache(), 60 * 60 * 1000);
  }

  /**
   * Get optimized asset URL with CDN and fallback support
   */
  getAssetUrl(assetPath: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    fallback?: boolean;
  }): string {
    const cacheKey = `${assetPath}-${JSON.stringify(options || {})}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached URL if still valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.url;
    }

    let url = this.buildOptimizedUrl(assetPath, options);
    
    // Cache the URL
    this.cache.set(cacheKey, {
      url,
      timestamp: Date.now(),
      ttl: this.DEFAULT_TTL
    });

    return url;
  }

  /**
   * Build optimized URL with transformations
   */
  private buildOptimizedUrl(assetPath: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  }): string {
    const baseUrl = this.config.baseUrl.endsWith('/') 
      ? this.config.baseUrl.slice(0, -1) 
      : this.config.baseUrl;
    
    const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    let url = `${baseUrl}/${cleanPath}`;

    // Add optimization parameters
    const params = new URLSearchParams();
    
    if (options?.width) params.set('w', options.width.toString());
    if (options?.height) params.set('h', options.height.toString());
    if (options?.quality) params.set('q', options.quality.toString());
    if (options?.format) params.set('f', options.format);
    
    // Add cache busting for development
    if (process.env.NODE_ENV === 'development') {
      params.set('v', Date.now().toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  }

  /**
   * Preload critical assets
   */
  async preloadAssets(assetPaths: string[]): Promise<void> {
    const preloadPromises = assetPaths.map(path => this.preloadAsset(path));
    await Promise.allSettled(preloadPromises);
  }

  /**
   * Preload a single asset
   */
  private async preloadAsset(assetPath: string): Promise<void> {
    try {
      const url = this.getAssetUrl(assetPath);
      
      // Create link element for preloading
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      
      // Determine resource type based on file extension
      const extension = assetPath.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'css':
          link.as = 'style';
          break;
        case 'js':
          link.as = 'script';
          break;
        case 'woff':
        case 'woff2':
        case 'ttf':
        case 'otf':
          link.as = 'font';
          link.crossOrigin = 'anonymous';
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'svg':
          link.as = 'image';
          break;
        default:
          link.as = 'fetch';
      }
      
      document.head.appendChild(link);
      
      // Remove after a delay to clean up
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 10000);
      
    } catch (error) {
      console.warn(`Failed to preload asset: ${assetPath}`, error);
    }
  }

  /**
   * Get responsive image sources for different screen sizes
   */
  getResponsiveImageSources(
    basePath: string,
    sizes: Array<{ width: number; media?: string }>,
    options?: { quality?: number; format?: 'webp' | 'avif' | 'jpeg' | 'png' }
  ): { srcSet: string; sizes: string } {
    const srcSet = sizes
      .map(size => {
        const url = this.getAssetUrl(basePath, {
          width: size.width,
          quality: options?.quality,
          format: options?.format
        });
        return `${url} ${size.width}w`;
      })
      .join(', ');

    const sizesAttr = sizes
      .map(size => size.media ? `(${size.media}) ${size.width}px` : `${size.width}px`)
      .join(', ');

    return { srcSet, sizes: sizesAttr };
  }

  /**
   * Optimize image loading with lazy loading and progressive enhancement
   */
  createOptimizedImageProps(
    src: string,
    alt: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpeg' | 'png';
      loading?: 'lazy' | 'eager';
      priority?: boolean;
      sizes?: string;
    }
  ): {
    src: string;
    alt: string;
    loading: 'lazy' | 'eager';
    sizes?: string;
    srcSet?: string;
  } {
    const optimizedSrc = this.getAssetUrl(src, {
      width: options?.width,
      height: options?.height,
      quality: options?.quality,
      format: options?.format
    });

    const props: any = {
      src: optimizedSrc,
      alt,
      loading: options?.loading || 'lazy'
    };

    if (options?.sizes) {
      props.sizes = options.sizes;
    }

    if (options?.priority) {
      props.loading = 'eager';
    }

    return props;
  }

  /**
   * Get CDN statistics
   */
  getStats(): {
    cacheSize: number;
    cacheHitRate: number;
    totalRequests: number;
  } {
    return {
      cacheSize: this.cache.size,
      cacheHitRate: 0, // Would need to track hits/misses
      totalRequests: 0 // Would need to track total requests
    };
  }

  /**
   * Clear CDN cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Health check for CDN
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testUrl = this.getAssetUrl('/health-check');
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(this.config.timeout)
      });
      return response.ok;
    } catch (error) {
      console.warn('CDN health check failed:', error);
      return false;
    }
  }
}

// Create CDN service instance
export const cdnService = new CDNService({
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.fastn-ai-connect.com' 
    : '/',
  fallbackUrl: '/',
  timeout: 5000,
  retries: 3,
  cacheStrategy: 'stale-while-revalidate'
});

// React hook for CDN usage
export function useCDN() {
  return {
    getAssetUrl: (path: string, options?: any) => cdnService.getAssetUrl(path, options),
    preloadAssets: (paths: string[]) => cdnService.preloadAssets(paths),
    getResponsiveImageSources: (basePath: string, sizes: any[], options?: any) => 
      cdnService.getResponsiveImageSources(basePath, sizes, options),
    createOptimizedImageProps: (src: string, alt: string, options?: any) =>
      cdnService.createOptimizedImageProps(src, alt, options),
    getStats: () => cdnService.getStats(),
    clearCache: () => cdnService.clearCache(),
    healthCheck: () => cdnService.healthCheck()
  };
}

export default cdnService;

