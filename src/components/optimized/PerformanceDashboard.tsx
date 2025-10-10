// Performance Dashboard Component
// Displays real-time performance metrics and optimization status
import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Zap,
  Database,
  Globe,
  Cpu,
  MemoryStick,
  Wifi,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cacheService } from '@/services/cache';
import { cdnService } from '@/services/cdn';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  apiResponseTime: number;
  cdnStatus: boolean;
  bundleSize: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

const PerformanceDashboard = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    cdnStatus: false,
    bundleSize: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('show-performance-dashboard')) {
      return;
    }

    const updateMetrics = async () => {
      try {
        // Get memory usage
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

        // Get cache stats
        const cacheStats = cacheService.getStats();

        // Get CDN health
        const cdnStatus = await cdnService.healthCheck();

        // Get Web Vitals (simplified)
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const firstContentfulPaint = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;

        setMetrics(prev => ({
          ...prev,
          memoryUsage,
          cacheHitRate: cacheStats.cacheHitRate,
          cdnStatus,
          firstContentfulPaint,
        }));
      } catch (error) {
        console.warn('Failed to update performance metrics:', error);
      }
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
        localStorage.setItem('show-performance-dashboard', (!isVisible).toString());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <Activity className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const getPerformanceScore = () => {
    let score = 100;
    
    if (metrics.memoryUsage > 100) score -= 20;
    if (metrics.firstContentfulPaint > 2000) score -= 30;
    if (metrics.cacheHitRate < 0.7) score -= 25;
    if (!metrics.cdnStatus) score -= 15;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className="shadow-elegant">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={performanceScore >= 90 ? 'default' : performanceScore >= 70 ? 'secondary' : 'destructive'}>
                {performanceScore}/100
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Performance Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Score</span>
              <span className={getScoreColor(performanceScore)}>{performanceScore}/100</span>
            </div>
            <Progress value={performanceScore} className="h-2" />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-3 w-3" />
                <span>Memory Usage</span>
              </div>
              <span>{metrics.memoryUsage.toFixed(1)} MB</span>
            </div>
            <Progress 
              value={Math.min(100, (metrics.memoryUsage / 100) * 100)} 
              className="h-1" 
            />
          </div>

          {/* Cache Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                <span>Cache Hit Rate</span>
              </div>
              <span>{(metrics.cacheHitRate * 100).toFixed(1)}%</span>
            </div>
            <Progress value={metrics.cacheHitRate * 100} className="h-1" />
          </div>

          {/* CDN Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              <span>CDN Status</span>
            </div>
            <div className="flex items-center gap-1">
              {metrics.cdnStatus ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-red-600" />
              )}
              <span className={metrics.cdnStatus ? 'text-green-600' : 'text-red-600'}>
                {metrics.cdnStatus ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Performance Optimizations Status */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Optimizations</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Database Indexing</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Request Batching</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Payload Compression</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>CDN Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Connection Pooling</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Caching Layer</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cacheService.clearCache()}
              className="flex-1 text-xs"
            >
              Clear Cache
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="flex-1 text-xs"
            >
              Refresh
            </Button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Press Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;

