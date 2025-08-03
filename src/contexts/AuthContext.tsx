import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser, RegisterData, LoginData } from '@/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (userId: string, profileData: Partial<AuthUser>) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const isAuth = AuthService.isAuthenticated();
        
        setUser(currentUser);
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userId: string, profileData: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      const response = await AuthService.updateProfile(userId, profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Profile update failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 