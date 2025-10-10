// Performance monitoring component for development
import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  timestamp: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
  logToConsole?: boolean;
}

const PerformanceMonitor = memo<PerformanceMonitorProps>(({
  componentName,
  children,
  className,
  enabled = process.env.NODE_ENV === 'development',
  logToConsole = true,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const renderStartTime = React.useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      const newMetrics: PerformanceMetrics = {
        renderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        componentName,
        timestamp: Date.now(),
      };

      setMetrics(newMetrics);

      if (logToConsole) {
        console.log(`[Performance] ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          memoryUsage: newMetrics.memoryUsage ? `${(newMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
        });
      }
    };
  }, [componentName, enabled, logToConsole]);

  // Show performance overlay on hover in development
  const handleMouseEnter = () => {
    if (enabled) setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (enabled) setIsVisible(false);
  };

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Performance overlay */}
      {isVisible && metrics && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-bl-lg z-50 pointer-events-none">
          <div className="font-semibold">{componentName}</div>
          <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
          {metrics.memoryUsage && (
            <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
          )}
        </div>
      )}
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

// Higher-order component for performance monitoring
export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = memo((props: P) => (
    <PerformanceMonitor componentName={componentName || Component.displayName || Component.name}>
      <Component {...props} />
    </PerformanceMonitor>
  ));

  WrappedComponent.displayName = `withPerformanceMonitor(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default PerformanceMonitor;

