// Infinite scroll component with performance optimizations
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
}

const InfiniteScroll = memo<InfiniteScrollProps>(({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  className,
  loadingComponent,
  endMessage,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);

    if (entry.isIntersecting && hasMore && !isLoading) {
      // Debounce the load more function to prevent rapid calls
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        onLoadMore();
      }, 100);
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-sm text-gray-600">Loading more...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="flex items-center justify-center py-8 text-gray-500">
      <span className="text-sm">You've reached the end</span>
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {children}
      
      {/* Loading indicator */}
      {isLoading && (loadingComponent || defaultLoadingComponent)}
      
      {/* Sentinel element for intersection observer */}
      {hasMore && !isLoading && (
        <div ref={sentinelRef} className="h-1" />
      )}
      
      {/* End message */}
      {!hasMore && !isLoading && (endMessage || defaultEndMessage)}
    </div>
  );
});

InfiniteScroll.displayName = 'InfiniteScroll';

export default InfiniteScroll;

