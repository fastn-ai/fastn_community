// Authentication Service for fastn community platform
import { ApiService } from './api';

const API_BASE_URL = "https://qa.fastn.ai/api/v1";
const API_KEY = "59b01ec6-8f4b-490f-8be4-cd2263d36584";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-fastn-api-key": API_KEY,
  "x-fastn-space-id": "ee032b0c-ebb1-45cb-9cb3-a835d276a8e4",
  "x-fastn-space-tenantid": "",
  stage: "DRAFT",
});

// User interface for authentication
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  company?: string;
  website?: string;
  reputation?: number;
  level?: string;
  is_verified?: boolean;
  is_active?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Registration form data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
}

// Login form data
export interface LoginData {
  email: string;
  password: string;
}

// Authentication response
export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
  token?: string;
}

// Session storage keys
const SESSION_KEYS = {
  USER: 'fastn_user',
  TOKEN: 'fastn_token',
  IS_AUTHENTICATED: 'fastn_is_authenticated'
};

// Simple password hashing (in production, use proper hashing)
const hashPassword = (password: string): string => {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  return btoa(password + '_fastn_salt');
};

// Authentication Service
export class AuthService {
  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          message: "Passwords do not match"
        };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters long"
        };
      }

      // Check if user already exists
      const existingUsers = await ApiService.getAllUsers();
      const existingUser = existingUsers.find(
        user => user.email === userData.email || user.username === userData.username
      );

      if (existingUser) {
        return {
          success: false,
          message: existingUser.email === userData.email 
            ? "Email already registered" 
            : "Username already taken"
        };
      }

      // Create new user
    
      console.log("Registration request body:", requestBody);
      console.log("Registration request headers:", getHeaders());

      // Create user directly using crudUser endpoint
      try {
        const userResponse = await fetch(`${API_BASE_URL}/crudUser`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              action: "insert",
              users: [{
                id: `id_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
                username: userData.username,
                email: userData.email,
                password_hash: hashPassword(userData.password)
              }]
            }
          })
        });

          if (userResponse.ok) {
            const userResult = await userResponse.json();
            console.log("User created via crudUser:", userResult);
            
            const newUser: AuthUser = {
              id: userResult.data?.id || `id_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
              username: userData.username,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              bio: userData.bio,
              avatar_url: "",
              location: userData.location,
              company: userData.company,
              website: userData.website,
              reputation: 0,
              level: "beginner",
              is_verified: false,
              is_active: true,
              email_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            // Store user session
            this.setSession(newUser);

            return {
              success: true,
              user: newUser,
              message: "Registration successful (via fallback method)"
            };
          } else {
            const userError = await userResponse.json().catch(() => ({}));
            console.error("User creation failed:", userError);
            return {
              success: false,
              message: "Registration failed: Could not create user account"
            };
          }
        } catch (userError) {
          console.error("User creation error:", userError);
          return {
            success: false,
            message: "Registration failed: Could not create user account"
          };
        }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed"
      };
    }
  }

  // Login user
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Prepare the request body with the new format
      const requestBody = {
        input: {
          email: loginData.email,
          password: loginData.password
        }
      };

      // Make the login request with the new API structure
      let response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          ...getHeaders(),
          "x-fastn-custom-auth": "true",
          "authorization": "" // This should be set if you have an auth token
        },
        body: JSON.stringify(requestBody)
      });

      // If login flow is not deployed, try alternative approach
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === "FLOW_NOT_DEPLOYED") {
          console.log("Login flow not deployed, trying alternative approach...");
          // Try to find user by email and validate password
          const allUsers = await ApiService.getAllUsers();
          const user = allUsers.find(u => u.email === loginData.email);
          
          if (user) {
            // Simple password validation (in production, use proper hashing)
            const hashedPassword = hashPassword(loginData.password);
            if ((user as any).password_hash === hashedPassword) {
              const authUser: AuthUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: (user as any).first_name || "",
                last_name: (user as any).last_name || "",
                bio: user.bio || "",
                avatar_url: user.avatar || "",
                location: user.location || "",
                company: (user as any).company || "",
                website: user.website || "",
                reputation: user.reputation_score || 0,
                level: (user as any).level || "beginner",
                is_verified: user.is_verified || false,
                is_active: user.is_active !== false,
                email_verified: (user as any).email_verified !== false,
                created_at: user.created_at || new Date().toISOString(),
                updated_at: user.updated_at || new Date().toISOString()
              };

              // Store user session
              this.setSession(authUser);

              return {
                success: true,
                user: authUser,
                message: "Login successful"
              };
            }
          }
          
          return {
            success: false,
            message: "Invalid email or password"
          };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `Login failed with status: ${response.status}`
        };
      }

      const result = await response.json();

      // Handle the response based on the API structure
      if (result.success || result.data) {
        // Extract user data from the response
        const userData = result.data || result.user || result;
        
        const authUser: AuthUser = {
          id: userData.id || `id_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
          username: userData.username || loginData.email.split('@')[0],
          email: loginData.email,
          first_name: (userData as any).first_name || "",
          last_name: (userData as any).last_name || "",
          bio: userData.bio || "",
          avatar_url: userData.avatar_url || userData.avatar || "",
          location: userData.location || "",
          company: (userData as any).company || "",
          website: userData.website || "",
          reputation: userData.reputation || userData.reputation_score || 0,
          level: (userData as any).level || "beginner",
          is_verified: userData.is_verified || false,
          is_active: userData.is_active !== false,
          email_verified: (userData as any).email_verified !== false,
          created_at: userData.created_at || new Date().toISOString(),
          updated_at: userData.updated_at || new Date().toISOString()
        };

        // Store user session
        this.setSession(authUser);

        return {
          success: true,
          user: authUser,
          message: "Login successful",
          token: result.token || result.access_token
        };
      } else {
        return {
          success: false,
          message: result.message || "Login failed"
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed"
      };
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(SESSION_KEYS.USER);
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem(SESSION_KEYS.IS_AUTHENTICATED);
    sessionStorage.removeItem(SESSION_KEYS.USER);
    sessionStorage.removeItem(SESSION_KEYS.TOKEN);
    sessionStorage.removeItem(SESSION_KEYS.IS_AUTHENTICATED);
  }

  // Get current user
  static getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(SESSION_KEYS.USER) || sessionStorage.getItem(SESSION_KEYS.USER);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const isAuth = localStorage.getItem(SESSION_KEYS.IS_AUTHENTICATED) || sessionStorage.getItem(SESSION_KEYS.IS_AUTHENTICATED);
    return !!(user && isAuth === 'true');
  }

  // Set user session
  private static setSession(user: AuthUser): void {
    localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(SESSION_KEYS.IS_AUTHENTICATED, 'true');
    sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(SESSION_KEYS.IS_AUTHENTICATED, 'true');
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: Partial<AuthUser>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/crudUser`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          input: {
            action: "update",
            users: [
              {
                id: userId,
                ...profileData
              }
            ]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success || result.data) {
        // Update current user session
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...currentUser, ...profileData };
          this.setSession(updatedUser);
        }

        return {
          success: true,
          user: currentUser ? { ...currentUser, ...profileData } : undefined,
          message: "Profile updated successfully"
        };
      } else {
        return {
          success: false,
          message: result.message || "Profile update failed"
        };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Profile update failed"
      };
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await ApiService.getUserById(userId);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: (user as any).first_name || "",
        last_name: (user as any).last_name || "",
        bio: user.bio,
        avatar_url: user.avatar,
        location: user.location,
        company: (user as any).company || "",
        website: user.website,
        reputation: user.reputation_score,
        level: "intermediate",
        is_verified: user.is_verified,
        is_active: user.is_active,
        email_verified: true,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate username format
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  // Validate password strength
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    if (password.length > 50) {
      return { isValid: false, message: "Password must be less than 50 characters" };
    }
    return { isValid: true, message: "Password is valid" };
  }
} 