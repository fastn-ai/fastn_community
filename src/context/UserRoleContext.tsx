import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { insertUser } from '@/services/api';
import type { InsertUserPayload } from '@/services/api';

interface UserRoleContextType {
  roleId: number | null;
  isLoading: boolean;
  isAdmin: boolean;
  refetch: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const fetchUserRole = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.user) {
      setRoleId(null);
      setIsLoading(false);
      return;
    }

    try {
      const authToken = auth.user.access_token || '';
      const userId = auth.user.profile.sub;

      if (!authToken || !userId) {
        setRoleId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Call insertUser to get/create user and retrieve role_id from response
      const payload: InsertUserPayload = {
        action: "insertUser",
        data: {
          id: auth.user.profile.sub || auth.user.profile.sid || auth.user.profile.email || '',
          username: auth.user.profile.preferred_username || auth.user.profile.email?.split("@")[0] || "user",
          email: auth.user.profile.email || "",
          avatar: auth.user.profile.picture || "",
          bio: "",
          location: auth.user.profile.locale || "",
          website: "",
          twitter: "",
          github: "",
          linkedin: "",
          role_id: 2,
          is_verified: true,
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: undefined,
          updated_at: new Date().toISOString(),
        },
      };
      
      const response = await insertUser(payload, authToken);

      // Handle different response formats
      let userData = null;
      
      if (Array.isArray(response)) {
        userData = response[0];
      } else if (response && response.result && Array.isArray(response.result)) {
        userData = response.result[0];
      } else if (response && response.data) {
        userData = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (response && typeof response === 'object') {
        userData = response;
      }

      // Extract role_id from the user data
      const userRoleId = userData?.role_id ?? userData?.data?.role_id ?? null;
      setRoleId(userRoleId);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setRoleId(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    auth.isAuthenticated, 
    auth.user?.access_token, 
    auth.user?.profile?.sub,
    auth.user?.profile?.sid,
    auth.user?.profile?.email,
    auth.user?.profile?.preferred_username,
    auth.user?.profile?.picture,
    auth.user?.profile?.locale
  ]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole, shouldRefetch]);

  const refetch = () => {
    setShouldRefetch((prev) => !prev);
  };

  const isAdmin = roleId === 3;

  const value: UserRoleContextType = {
    roleId,
    isLoading,
    isAdmin,
    refetch,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

