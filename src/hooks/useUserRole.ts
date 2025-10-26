import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'react-oidc-context';
import { ApiService } from '@/services/api';
import { queryKeys } from '@/services/queryClient';

/**
 * Custom hook to check if the current user has a specific role
 * Uses React Query for caching to prevent duplicate API calls
 * 
 * @param roleId - The role ID to check (e.g., 3 for admin)
 * @param enabled - Whether the query should run (default: true)
 * @returns Object with role check data, loading state, and error
 */
export function useUserRole(roleId: number, enabled: boolean = true) {
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated && auth.user;
  const userId = auth.user?.profile?.sub || '';

  return useQuery({
    queryKey: queryKeys.userRole(userId, roleId),
    queryFn: () => ApiService.checkUserRole(roleId),
    enabled: enabled && isAuthenticated && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes - role doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

/**
 * Hook specifically for checking admin role (role_id: 3)
 */
export function useIsAdmin() {
  const { data: isAdmin, isLoading, error } = useUserRole(3);
  
  return {
    isAdmin: isAdmin ?? false,
    isLoading,
    error,
  };
}

