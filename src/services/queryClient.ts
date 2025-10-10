// Optimized React Query configuration for performance
import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { cacheService } from './cache';

// Performance-optimized default options
const queryConfig: DefaultOptions = {
  queries: {
    // Cache data for 5 minutes by default
    staleTime: 5 * 60 * 1000,
    // Keep data in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests up to 3 times with exponential backoff
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 403) {
        return false; // Don't retry client errors
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus only for critical data
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Background refetch interval
    refetchInterval: false,
    // Network mode
    networkMode: 'online',
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    // Network mode for mutations
    networkMode: 'online',
  },
};

// Create optimized query client
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Custom query key factory for consistent caching
export const queryKeys = {
  categories: ['categories'] as const,
  topics: ['topics'] as const,
  topic: (id: string) => ['topics', id] as const,
  topicsByCategory: (categoryId: string) => ['topics', 'category', categoryId] as const,
  replies: (topicId: string) => ['replies', topicId] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  tags: ['tags'] as const,
  tagsByTopic: (topicId: string) => ['tags', 'topic', topicId] as const,
} as const;

// Performance monitoring
export const performanceMonitor = {
  trackQuery: (queryKey: string[], duration: number, fromCache: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Query ${queryKey.join('.')}: ${duration}ms ${fromCache ? '(cached)' : '(network)'}`);
    }
  },
  
  trackMutation: (mutationKey: string, duration: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mutation ${mutationKey}: ${duration}ms`);
    }
  },
};

// Optimized query functions with caching
export const optimizedQueries = {
  // Prefetch related data
  prefetchTopicData: async (topicId: string) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.topic(topicId),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.replies(topicId),
        staleTime: 2 * 60 * 1000,
      }),
    ]);
  },

  // Batch prefetch for multiple topics
  prefetchTopicsBatch: async (topicIds: string[]) => {
    const prefetchPromises = topicIds.map(id => 
      queryClient.prefetchQuery({
        queryKey: queryKeys.topic(id),
        staleTime: 5 * 60 * 1000,
      })
    );
    
    await Promise.all(prefetchPromises);
  },

  // Invalidate related queries
  invalidateTopicQueries: (topicId?: string) => {
    if (topicId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.topic(topicId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.replies(topicId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
    }
  },

  // Clear unused cache
  clearUnusedCache: () => {
    queryClient.clear();
  },
};

// Query client middleware for performance tracking
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated' && event.query.state.dataUpdatedAt) {
    const duration = Date.now() - event.query.state.dataUpdatedAt;
    const fromCache = event.query.state.dataUpdatedAt === event.query.state.dataUpdatedAt;
    performanceMonitor.trackQuery(event.query.queryKey, duration, fromCache);
  }
});

export default queryClient;

