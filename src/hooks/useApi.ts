import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'react-oidc-context';
import { ApiService, Topic, Category, Tag, Reply, User } from '@/services/api';
import { queryKeys } from '@/services/queryClient';

// ============================================================================
// TOPICS HOOKS
// ============================================================================

/**
 * Get all topics with caching
 * Cache: 2 minutes stale time, refetches in background
 */
export function useAllTopics() {
  return useQuery({
    queryKey: queryKeys.topics,
    queryFn: ApiService.getAllTopics,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get topic by ID with caching
 */
export function useTopic(topicId: string | undefined) {
  return useQuery({
    queryKey: topicId ? queryKeys.topic(topicId) : ['topics', 'undefined'],
    queryFn: () => topicId ? ApiService.getAllTopicById(topicId) : Promise.reject('No topic ID'),
    enabled: !!topicId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Get topics by current user
 */
export function useUserTopics() {
  const auth = useAuth();
  const username = auth.user?.profile?.preferred_username || auth.user?.profile?.email || '';

  return useQuery({
    queryKey: queryKeys.topicsByUser(username),
    queryFn: () => ApiService.getTopicByUser(username),
    enabled: !!username,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Create a new topic with optimistic updates
 */
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.createTopic,
    onSuccess: () => {
      // Invalidate and refetch topics
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
    },
  });
}

// ============================================================================
// CATEGORIES HOOKS
// ============================================================================

/**
 * Get all categories with caching
 * Categories don't change often, so longer cache time
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: ApiService.getAllCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  });
}

/**
 * Create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

/**
 * Update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: any }) =>
      ApiService.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

/**
 * Delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

// ============================================================================
// TAGS HOOKS
// ============================================================================

/**
 * Get all tags with caching
 * Tags don't change often, so longer cache time
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: ApiService.getAllTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// REPLIES HOOKS
// ============================================================================

/**
 * Get replies for a specific topic
 */
export function useReplies(topicId: string | undefined) {
  return useQuery({
    queryKey: topicId ? queryKeys.replies(topicId) : ['replies', 'undefined'],
    queryFn: () => topicId ? ApiService.getRepliesByTopicId(topicId) : Promise.reject('No topic ID'),
    enabled: !!topicId,
    staleTime: 1 * 60 * 1000, // 1 minute - replies change frequently
  });
}

/**
 * Create a new reply
 */
export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.createReply,
    onSuccess: (data, variables) => {
      // Invalidate replies for this topic
      if (variables.topic_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.replies(variables.topic_id) });
      }
      // Also invalidate topics to update reply count
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
    },
  });
}

/**
 * Edit a reply
 */
export function useEditReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.editReply,
    onSuccess: () => {
      // Invalidate all replies since we don't have topic_id in the response
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
  });
}

/**
 * Delete a reply
 */
export function useDeleteReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiService.deleteReply,
    onSuccess: () => {
      // Invalidate all replies since we don't have topic_id in the parameters
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      // Also invalidate topics to update reply count
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
    },
  });
}

// ============================================================================
// USERS HOOKS
// ============================================================================

/**
 * Get all users with caching
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: ApiService.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// ANALYTICS HOOKS
// ============================================================================

/**
 * Get analytics data
 * Only for admin users
 */
export function useAnalytics(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: ApiService.getAnalytics,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Prefetch topics for faster navigation
 */
export function usePrefetchTopics() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['topics', 'all'],
      queryFn: ApiService.getAllTopics,
      staleTime: 2 * 60 * 1000,
    });
  };
}

/**
 * Invalidate all caches (useful after logout)
 */
export function useInvalidateAllCaches() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries();
  };
}

