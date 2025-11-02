// Mock API Service for fastn community platform
// This is a frontend-only implementation with mock data

import { INSERT_USER_API_URL, FASTN_SPACE_ID, FASTN_API_KEY, CUSTOM_AUTH_KEY, CUSTOM_AUTH_TOKEN_KEY, TENANT_ID_KEY, CRUD_CATEGORIES_API_URL, CRUD_TAGS_API_URL, GET_TOPIC_BY_USER_API_URL, INSERT_TOPIC_TAGS_API_URL, INSERT_TOPICS_API_URL, GET_TOPICS_API_URL, CREATE_REPLY_API_URL, GET_REPLIES_API_URL, UPDATE_REPLY_API_URL, DELETE_REPLY_API_URL, UPDATE_TOPIC_STATUS_API_URL, DELETE_TOPIC_API_URL, GET_ALL_USERS_API_URL, SUBMIT_LIKES_API_URL, SUBMIT_LIKES_FOR_REPLY_API_URL } from "@/constants";
import { getCookie } from "@/routes/login/oauth";
import { generateConsistentColor, PREDEFINED_COLORS } from "@/lib/utils";

// Mock data interfaces
export interface Topic {
  id: number;
  title: string;
  description: string;
  content?: string;
  author_username: string;
  author_name?: string;
  username?: string;
  author_avatar?: string;
  author_id?: string;
  category_name: string;
  category_color?: string;
  category_id?: string;
  tag_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  is_featured?: boolean;
  is_hot?: boolean;
  is_new?: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  topics_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  is_verified: boolean;
  is_active: boolean;
  topics_count: number;
  replies_count: number;
  likes_received: number;
  badges_count: number;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

export interface Reply {
  id: string;
  topic_id: string;
  author_id?: string;
  author_username: string;
  author_name?: string;
  username?: string;
  author_avatar?: string;
  content: string;
  tutorial_id?: string;
  parent_reply_id?: string;
  is_accepted: boolean;
  is_helpful: boolean;
  like_count: number;
  dislike_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  slug: string;
  color?: string;
  topics_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface InsertUserPayload {
  data: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    role_id?: number;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: string;
    created_at?: string;
    updated_at?: string;
  };
  action: "insertUser";
}

export interface CrudCategoriesPayload {
  action: "getAllCategories" | "createCategory" | "updateCategory" | "deleteCategory";
  data?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CrudTagsPayload {
  action: "getAllTags" | "createTag" | "updateTag" | "deleteTag";
  data?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}


// Separate payload interfaces for the extracted endpoints
export interface GetTopicByUserPayload {
  action: "getTopicByUser";
  data?: {
    user_id?: string;
    author_id?: string;
  };
}

export interface InsertTopicsPayload {
  action: "insertTopics";
  data?: {
    author_id?: string;
    category_id?: number | null;
    title?: string;
    description?: string;
    content?: string;
    status?: "pending" | "approved" | "rejected";
    view_count?: number;
    reply_count?: number;
    like_count?: number;
    role_id?: number;
  };
}

export interface InsertTopicTagsPayload {
  action: "insertTopic_tags";
  data?: {
    topic_id?: number;
    tag_id?: number;
  };
}

export interface CrudRepliesPayload {
  action: "createReply" | "getAllReplies" | "getReplies" | "updateReply" | "deleteReply";
  data?: {
    id?: string | number;
    topic_id?: string | number;
    author_id?: string;
    parent_reply_id?: string | number;
    content?: string;
    like_count?: number;
  };
}

// Mock data storage
let mockCategories: Category[] = [];
let mockUsers: User[] = [];
let mockTopics: Topic[] = [];
let mockReplies: Reply[] = [
  {
    id: 'reply_1',
    topic_id: '1',
    author_id: 'user_1',
    author_username: 'automation@fastn.ai',
    author_avatar: '',
    content: 'hj',
    tutorial_id: undefined,
    parent_reply_id: '',
    is_accepted: false,
    is_helpful: false,
    like_count: 0,
    dislike_count: 0,
    reply_count: 0,
    created_at: '2025-10-21T00:00:00Z',
    updated_at: '2025-10-21T00:00:00Z',
  }
];
let mockTags: Tag[] = [];

// Initialize mock data
const initializeMockData = () => {
  // Mock Categories
  mockCategories = [
    {
      id: 'cat_1',
      name: 'Questions',
      description: 'Ask questions and get help from the community',
      slug: 'questions',
      icon: 'help-circle',
      color: '#3B82F6',
      topics_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_2',
      name: 'Announcements',
      description: 'Important updates and announcements',
      slug: 'announcements',
      icon: 'megaphone',
      color: '#EF4444',
      topics_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_3',
      name: 'Best Practices',
      description: 'Share best practices and tips',
      slug: 'best-practices',
      icon: 'star',
      color: '#10B981',
      topics_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Mock Users
  mockUsers = [
    {
      id: 'user_1',
      username: 'admin',
      email: 'admin@fastn.ai',
      avatar: '',
      bio: 'Platform Administrator',
      location: 'Global',
      website: 'https://fastn.ai',
      twitter: '',
      github: '',
      linkedin: '',
      is_verified: true,
      is_active: true,
      topics_count: 0,
      replies_count: 0,
      likes_received: 0,
      badges_count: 0,
      reputation_score: 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'user_2',
      username: 'john_doe',
      email: 'john@example.com',
      avatar: '',
      bio: 'Fastn Developer',
      location: 'San Francisco',
      website: '',
      twitter: '',
      github: '',
      linkedin: '',
      is_verified: false,
      is_active: true,
      topics_count: 0,
      replies_count: 0,
      likes_received: 0,
      badges_count: 0,
      reputation_score: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];


  // Mock Tags
  mockTags = [
    {
      id: 'tag_1',
      name: 'fastn',
      description: 'Fastn framework related topics',
      slug: 'fastn',
      color: '#8B5CF6',
      topics_count: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tag_2',
      name: 'development',
      description: 'Development related topics',
      slug: 'development',
      color: '#06B6D4',
      topics_count: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

// Initialize mock data on first load
if (mockCategories.length === 0) {
  initializeMockData();
}

// Mock API Service Class
export class ApiService {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await crudCategories({ action: "getAllCategories" }, "", FASTN_API_KEY);
          return ApiService.processCategoriesResponse(response);
        } catch (error) {
          return new Promise((resolve) => {
            setTimeout(() => resolve([...mockCategories]), 100);
          });
        }
      }

      const payload: CrudCategoriesPayload = {
        action: "getAllCategories"
      };
      const response = await crudCategories(payload, authToken);
      
      // Transform API response to match Category interface
      // The API returns data in response.result, not response.data
      if (response && response.result) {
        const categories = Array.isArray(response.result) ? response.result : [];
        const transformedCategories = categories.map((cat: any, index: number) => ({
          id: cat.id?.toString() || '',
          name: cat.name || '',
          description: cat.description || '',
          slug: cat.slug || '',
          icon: cat.icon || 'folder',
          color: cat.color || generateConsistentColor(cat.name || `category-${index}`),
          topics_count: cat.topics_count || 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        }));
        
        return transformedCategories;
      }
      
      return [...mockCategories];
    } catch (error) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockCategories]), 100);
      });
    }
  }

  // Create a new category
  static async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    is_active?: boolean;
  }): Promise<Category> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload: CrudCategoriesPayload = {
        action: "createCategory",
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          is_active: categoryData.is_active !== false,
        }
      };

      const response = await crudCategories(payload, authToken);
      
      if (response && response.data) {
        const cat = response.data;
        return {
          id: cat.id?.toString() || '',
          name: cat.name || '',
          description: cat.description || '',
          slug: cat.slug || '',
          icon: cat.icon || 'folder',
          color: cat.color || generateConsistentColor(cat.name || 'new-category'),
          topics_count: 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        };
      }
      
      throw new Error("Failed to create category");
    } catch (error) {
      throw error;
    }
  }

  // Update an existing category
  static async updateCategory(categoryId: string, categoryData: {
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
  }): Promise<Category> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload: CrudCategoriesPayload = {
        action: "updateCategory",
        data: {
          id: categoryId,
          ...categoryData
        }
      };

      const response = await crudCategories(payload, authToken);
      
      if (response && response.data) {
        const cat = response.data;
        return {
          id: cat.id?.toString() || '',
          name: cat.name || '',
          description: cat.description || '',
          slug: cat.slug || '',
          icon: cat.icon || 'folder',
          color: cat.color || generateConsistentColor(cat.name || 'updated-category'),
          topics_count: cat.topics_count || 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        };
      }
      
      throw new Error("Failed to update category");
    } catch (error) {
      throw error;
    }
  }

  // Delete a category
  static async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload: CrudCategoriesPayload = {
        action: "deleteCategory",
        data: {
          id: categoryId
        }
      };

      const response = await crudCategories(payload, authToken);
      return response && response.success !== false;
    } catch (error) {
      throw error;
    }
  }

  // Get all topics with cache busting
  static async getAllTopics(forceRefresh: boolean = false): Promise<Topic[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      // Check if we have custom auth available
      const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
      const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
      
      // Use custom auth if available, otherwise use regular auth token
      const tokenToUse = (isCustomAuth && customAuthToken) ? customAuthToken : authToken;
      
      if (!tokenToUse) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await getAllTopics(null, "", FASTN_API_KEY, forceRefresh);
          return ApiService.processTopicsResponse(response);
        } catch (apiError) {
          // API call failed with API key, falling back to mock data
          return ApiService.getMockTopics();
        }
      }

      try {
        const response = await getAllTopics(null, tokenToUse, undefined, forceRefresh);
        return ApiService.processTopicsResponse(response);
      } catch (apiError) {
        // API call failed with auth token, falling back to mock data
        return ApiService.getMockTopics();
      }
    } catch (error) {
      // getAllTopics failed, falling back to mock data
      return ApiService.getMockTopics();
    }
  }

  // Optimized method to get topics with better caching
  static async getTopicsOptimized(options: {
    forceRefresh?: boolean;
    includePending?: boolean;
    categoryId?: string;
    userId?: string;
  } = {}): Promise<Topic[]> {
    const { forceRefresh = false, includePending = true, categoryId, userId } = options;
    
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
      const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
      const tokenToUse = (isCustomAuth && customAuthToken) ? customAuthToken : authToken;
      
      if (!tokenToUse) {
        try {
          const response = await getAllTopics(null, "", FASTN_API_KEY, forceRefresh);
          return ApiService.processTopicsResponse(response);
        } catch (apiError) {
          return ApiService.getMockTopics();
        }
      }

      const response = await getAllTopics(null, tokenToUse, undefined, forceRefresh);
      let topics = ApiService.processTopicsResponse(response);
      
      // Apply filters
      if (!includePending) {
        topics = topics.filter(topic => topic.status === 'approved');
      }
      
      if (categoryId) {
        topics = topics.filter(topic => topic.category_id === categoryId);
      }
      
      if (userId) {
        topics = topics.filter(topic => topic.author_id === userId);
      }
      
      return topics;
    } catch (error) {
      // getTopicsOptimized failed, falling back to mock data
      return ApiService.getMockTopics();
    }
  }

  // Helper method to get mock topics
  private static getMockTopics(): Topic[] {
    // If we have cached mock topics, return them
    if (mockTopics.length > 0) {
      return mockTopics;
    }

    // Create some default mock topics with different statuses
    mockTopics = [
      {
        id: 1,
        title: "Welcome to Fastn Community",
        description: "This is a sample topic to help you get started with the Fastn community platform.",
        content: "Welcome! This is mock data shown because the API is currently rate-limited. Your actual topics will appear once the rate limit is lifted.",
        author_username: "admin",
        author_avatar: "",
        author_id: "1",
        category_name: "General",
        category_color: "#3B82F6",
        category_id: "1",
        status: "approved",
        is_featured: true,
        is_hot: false,
        is_new: true,
        view_count: 150,
        reply_count: 5,
        like_count: 10,
        bookmark_count: 3,
        share_count: 2,
        tags: ["welcome", "general"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Getting Started with Fastn",
        description: "Learn the basics of using Fastn for your projects.",
        content: "This is a mock topic. The actual content will be available once the API rate limit is reset.",
        author_username: "community",
        author_avatar: "",
        author_id: "2",
        category_name: "Best Practices",
        category_color: "#10B981",
        category_id: "2",
        status: "approved",
        is_featured: false,
        is_hot: true,
        is_new: false,
        view_count: 320,
        reply_count: 12,
        like_count: 25,
        bookmark_count: 8,
        share_count: 5,
        tags: ["best-practices", "guide"],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return mockTopics;
  }

  // Helper method to process topics response
  private static processTopicsResponse(response: any): Topic[] {
    // The API returns {data: Array} structure
    if (response && response.data && Array.isArray(response.data)) {
      const topics = response.data;
      
      const transformedTopics = topics.map((topic: any) => {
        return {
          id: topic.topic_id || topic.id || 0,
          title: topic.title || '',
          description: topic.description || '',
          content: topic.content || topic.body || topic.text || topic.message || '',
          author_username: topic.author_name || topic.author_username || topic.username || 'anonymous',
          author_avatar: topic.author_avatar || '',
          author_id: topic.author_id || '',
          category_name: topic.category_name || '',
          category_color: topic.category_color || '#3B82F6',
          category_id: topic.category_id?.toString() || '',
          status: topic.status || 'approved',
          is_featured: topic.is_featured || false,
          is_hot: topic.is_hot || false,
          is_new: topic.is_new || false,
          view_count: topic.view_count || 0,
          reply_count: topic.reply_count || 0,
          like_count: topic.like_count || 0,
          bookmark_count: topic.bookmark_count || 0,
          share_count: topic.share_count || 0,
          tags: topic.tags?.value ? JSON.parse(topic.tags.value) : (topic.tags || []),
          created_at: topic.created_at || new Date().toISOString(),
          updated_at: topic.updated_at || new Date().toISOString(),
        };
      });
      
      return transformedTopics;
    }
    
    return [];
  }

  // Helper method to process categories response
  private static processCategoriesResponse(response: any): Category[] {
    // The API returns {result: Array} structure
    if (response && response.result && Array.isArray(response.result)) {
      const categories = response.result;
      
      const transformedCategories = categories.map((category: any) => {
        return {
          id: category.category_id || category.id || 0,
          name: category.name || '',
          description: category.description || '',
          color: category.color || generateConsistentColor(category.name || ''),
          created_at: category.created_at || new Date().toISOString(),
          updated_at: category.updated_at || new Date().toISOString(),
        };
      });
      
      return transformedCategories;
    }
    
    return [];
  }

  // Helper method to process tags response
  private static processTagsResponse(response: any): Tag[] {
    // The API returns {result: Array} structure
    if (response && response.result && Array.isArray(response.result)) {
      const tags = response.result;
      
      const transformedTags = tags.map((tag: any, index: number) => ({
        id: tag.id?.toString() || '',
        name: tag.name || '',
        description: tag.description || '',
        slug: tag.slug || '',
        color: tag.color || generateConsistentColor(tag.name || `tag-${index}`),
        created_at: tag.created_at || new Date().toISOString(),
        updated_at: tag.updated_at || new Date().toISOString(),
      }));
      
      return transformedTags;
    }
    
    return [];
  }

  // Get topic by ID
  static async getAllTopicById(topicId: string): Promise<Topic> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      // Check if we have custom auth available
      const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
      const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
      
      // Use custom auth if available, otherwise use regular auth token
      const tokenToUse = (isCustomAuth && customAuthToken) ? customAuthToken : authToken;
      
      if (!tokenToUse) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await getAllTopics(null, "", FASTN_API_KEY);
          const topics = ApiService.processTopicsResponse(response);
          const topic = topics.find((t: any) => (t.topic_id || t.id)?.toString() === topicId);
          
          if (topic) {
            return topic;
          }
          throw new Error("Topic not found");
        } catch (apiError) {
          // API call failed with API key, falling back to mock data
          const mockTopicsData = ApiService.getMockTopics();
          const topic = mockTopicsData.find((t: any) => t.id?.toString() === topicId);
          
          if (topic) {
            return topic;
          }
          throw new Error("Topic not found");
        }
      }

      try {
        const response = await getAllTopics(null, tokenToUse);
        const topics = ApiService.processTopicsResponse(response);
        const topic = topics.find((t: any) => (t.topic_id || t.id)?.toString() === topicId);
        
        if (topic) {
          return topic;
        }
        
        throw new Error("Topic not found");
      } catch (apiError) {
        // API call failed with auth token, falling back to mock data
        const mockTopicsData = ApiService.getMockTopics();
        const topic = mockTopicsData.find((t: any) => t.id?.toString() === topicId);
        
        if (topic) {
          return topic;
        }
        
        throw new Error("Topic not found");
      }
    } catch (error) {
      // getAllTopicById failed, falling back to mock data
      const mockTopicsData = ApiService.getMockTopics();
      const topic = mockTopicsData.find((t: any) => t.id?.toString() === topicId);
      
      if (topic) {
        return topic;
      }
      
      throw error;
    }
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      const payload = {
        action: "getAllUsers"
      };

      if (!authToken) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await getAllUsersApi(payload, "", FASTN_API_KEY);
          
          if (response && response.result) {
            const users = Array.isArray(response.result) ? response.result : [];
            return users.map((user: any) => ({
              id: user.id?.toString() || '',
              username: user.username || user.preferred_username || 'anonymous',
              email: user.email || '',
              avatar: user.avatar || user.picture || '',
              bio: user.bio || '',
              location: user.location || '',
              website: user.website || '',
              twitter: user.twitter || '',
              github: user.github || '',
              linkedin: user.linkedin || '',
              is_verified: user.is_verified || false,
              is_active: user.is_active !== undefined ? user.is_active : true,
              topics_count: user.topics_count || 0,
              replies_count: user.replies_count || 0,
              likes_received: user.likes_received || 0,
              badges_count: user.badges_count || 0,
              reputation_score: user.reputation_score || 0,
              created_at: user.created_at || user.createdAt || new Date().toISOString(),
              updated_at: user.updated_at || user.updatedAt || new Date().toISOString(),
            }));
          }
        } catch (error) {
          // Failed to fetch users with API key
        }
        
        // Fallback to mock data
        return new Promise((resolve) => {
          setTimeout(() => resolve([...mockUsers]), 100);
        });
      }

      // Call the real API with auth token
      const response = await getAllUsersApi(payload, authToken);
      
      if (response && response.result) {
        const users = Array.isArray(response.result) ? response.result : [];
        return users.map((user: any) => ({
          id: user.id?.toString() || '',
          username: user.username || user.preferred_username || 'anonymous',
          email: user.email || '',
          avatar: user.avatar || user.picture || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
          twitter: user.twitter || '',
          github: user.github || '',
          linkedin: user.linkedin || '',
          is_verified: user.is_verified || false,
          is_active: user.is_active !== undefined ? user.is_active : true,
          topics_count: user.topics_count || 0,
          replies_count: user.replies_count || 0,
          likes_received: user.likes_received || 0,
          badges_count: user.badges_count || 0,
          reputation_score: user.reputation_score || 0,
          created_at: user.created_at || user.createdAt || new Date().toISOString(),
          updated_at: user.updated_at || user.updatedAt || new Date().toISOString(),
        }));
      }
      
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockUsers]), 100);
      });
    } catch (error) {
      // Error fetching users
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockUsers]), 100);
      });
    }
  }

  // Get all replies
  static async getAllReplies(): Promise<Reply[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const payload: CrudRepliesPayload = {
            action: "getAllReplies"
          };
          const response = await getRepliesApi(payload, "", FASTN_API_KEY);
          
          if (response && response.result) {
            const replies = Array.isArray(response.result) ? response.result : [];
            return replies.map((reply: any) => ({
              id: reply.id?.toString() || '',
              topic_id: reply.topic_id?.toString() || '',
              author_id: reply.author_id?.toString() || '',
              author_username: reply.author_username || 'anonymous',
              author_avatar: reply.author_avatar || '',
              content: reply.content || '',
              tutorial_id: reply.tutorial_id,
              parent_reply_id: reply.parent_reply_id?.toString() || '',
              is_accepted: reply.is_accepted || false,
              is_helpful: reply.is_helpful || false,
              like_count: reply.like_count || 0,
              dislike_count: reply.dislike_count || 0,
              reply_count: reply.reply_count || 0,
              created_at: reply.created_at || new Date().toISOString(),
              updated_at: reply.updated_at || new Date().toISOString(),
            }));
          }
        } catch (error) {
          // Failed to fetch replies with API key
        }
        
        // Fallback to mock data
        return new Promise((resolve) => {
          setTimeout(() => resolve([...mockReplies]), 100);
        });
      }

      const payload: CrudRepliesPayload = {
        action: "getAllReplies"
      };
      
      const response = await getRepliesApi(payload, authToken);
      
      if (response && response.result) {
        const replies = Array.isArray(response.result) ? response.result : [];
        return replies.map((reply: any) => ({
          id: reply.id?.toString() || '',
          topic_id: reply.topic_id?.toString() || '',
          author_id: reply.author_id?.toString() || '',
          author_username: reply.author_username || 'anonymous',
          author_avatar: reply.author_avatar || '',
          content: reply.content || '',
          tutorial_id: reply.tutorial_id || '',
          parent_reply_id: reply.parent_reply_id?.toString() || '',
          is_accepted: reply.is_accepted || false,
          is_helpful: reply.is_helpful || false,
          like_count: reply.like_count || 0,
          dislike_count: reply.dislike_count || 0,
          reply_count: reply.reply_count || 0,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString(),
        }));
      }
      
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockReplies]), 100);
      });
    } catch (error) {
      // Failed to fetch replies
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockReplies]), 100);
      });
    }
  }

  // Helper function to resolve author names from author_ids
  private static async resolveAuthorNames(replies: any[], authToken: string): Promise<any[]> {
    // Since the API now provides author_name directly, we don't need to make additional API calls
    // Just return the replies as they are since author_username is already set from author_name
    return replies;
  }

  // Get replies for a specific topic
  static async getRepliesByTopicId(topicId: string): Promise<Reply[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      const payload: CrudRepliesPayload = {
        action: "getReplies",
        data: {
          topic_id: topicId,
        }
      };

      if (!authToken) {
        // Try with API key instead of falling back to mock data
        try {
          const response = await getRepliesApi(payload, "", FASTN_API_KEY);
          
          // Check if response is an array directly
          if (response && Array.isArray(response)) {
            
            const processedReplies = response.map((reply: any) => ({
              id: reply.id?.toString() || `reply_${Date.now()}`,
              topic_id: reply.topic_id?.toString() || topicId,
              author_id: reply.author_id || '',
              author_username: reply.author_name || reply.author_username || reply.author_id?.split('-')[0] || 'anonymous',
              author_avatar: reply.author_avatar || '',
              content: reply.content || '',
              tutorial_id: reply.tutorial_id,
              parent_reply_id: reply.parent_reply_id?.toString() || '',
              is_accepted: reply.is_accepted || false,
              is_helpful: reply.is_helpful || false,
              like_count: reply.like_count || 0,
              dislike_count: reply.dislike_count || 0,
              reply_count: reply.reply_count || 0,
              created_at: reply.created_at || new Date().toISOString(),
              updated_at: reply.updated_at || new Date().toISOString(),
            }));
            
            // Resolve author names
            return await this.resolveAuthorNames(processedReplies, "");
          }
          
          // Check if response has data property
          if (response && response.data && Array.isArray(response.data)) {
            
            const processedReplies = response.data.map((reply: any) => ({
              id: reply.id?.toString() || `reply_${Date.now()}`,
              topic_id: reply.topic_id?.toString() || topicId,
              author_id: reply.author_id || '',
              author_username: reply.author_name || reply.author_username || reply.author_id?.split('-')[0] || 'anonymous',
              author_avatar: reply.author_avatar || '',
              content: reply.content || '',
              tutorial_id: reply.tutorial_id,
              parent_reply_id: reply.parent_reply_id?.toString() || '',
              is_accepted: reply.is_accepted || false,
              is_helpful: reply.is_helpful || false,
              like_count: reply.like_count || 0,
              dislike_count: reply.dislike_count || 0,
              reply_count: reply.reply_count || 0,
              created_at: reply.created_at || new Date().toISOString(),
              updated_at: reply.updated_at || new Date().toISOString(),
            }));
            
            // Resolve author names
            return await this.resolveAuthorNames(processedReplies, "");
          }
        } catch (error) {
          // Failed to fetch replies with API key
        }
        
        // Fallback to mock data
        const filteredReplies = [...mockReplies].filter(reply => reply.topic_id === topicId);
        return new Promise((resolve) => { 
          setTimeout(() => resolve(filteredReplies), 100); 
        });
      }

      const response = await getRepliesApi(payload, authToken);
      
      // Check if response is an array directly
      if (response && Array.isArray(response)) {
        
        const processedReplies = response.map((reply: any) => ({
          id: reply.id?.toString() || `reply_${Date.now()}`,
          topic_id: reply.topic_id?.toString() || topicId,
          author_id: reply.author_id || '',
          author_username: reply.author_name || reply.author_username || reply.author_id?.split('-')[0] || 'anonymous',
          author_avatar: reply.author_avatar || '',
          content: reply.content || '',
          tutorial_id: reply.tutorial_id || '',
          parent_reply_id: reply.parent_reply_id?.toString() || '',
          is_accepted: reply.is_accepted || false,
          is_helpful: reply.is_helpful || false,
          like_count: reply.like_count || 0,
          dislike_count: reply.dislike_count || 0,
          reply_count: reply.reply_count || 0,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString(),
        }));
        
        // Resolve author names
        return await this.resolveAuthorNames(processedReplies, authToken);
      }
      
          // Check if response has data property
          if (response && response.data && Array.isArray(response.data)) {
        
        const processedReplies = response.data.map((reply: any) => ({
          id: reply.id?.toString() || `reply_${Date.now()}`,
          topic_id: reply.topic_id?.toString() || topicId,
          author_id: reply.author_id || '',
          author_username: reply.author_name || reply.author_username || reply.author_id?.split('-')[0] || 'anonymous',
          author_avatar: reply.author_avatar || '',
          content: reply.content || '',
          tutorial_id: reply.tutorial_id || '',
          parent_reply_id: reply.parent_reply_id?.toString() || '',
          is_accepted: reply.is_accepted || false,
          is_helpful: reply.is_helpful || false,
          like_count: reply.like_count || 0,
          dislike_count: reply.dislike_count || 0,
          reply_count: reply.reply_count || 0,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString(),
        }));
        
        // Resolve author names
        return await this.resolveAuthorNames(processedReplies, authToken);
      }
      
      // API response structure not recognized, falling back to mock data
      const filteredReplies = [...mockReplies].filter(reply => reply.topic_id === topicId);
      return new Promise((resolve) => { 
        setTimeout(() => resolve(filteredReplies), 100); 
      });
    } catch (error) {
      // Failed to fetch replies for topic, falling back to mock data
      const filteredReplies = [...mockReplies].filter(reply => reply.topic_id === topicId);
      return new Promise((resolve) => { 
        setTimeout(() => resolve(filteredReplies), 100); 
      });
    }
  }

  // Get all tags
  static async getAllTags(): Promise<Tag[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await crudTags({ action: "getAllTags" }, "", FASTN_API_KEY);
          return ApiService.processTagsResponse(response);
        } catch (error) {
          return new Promise((resolve) => {
            setTimeout(() => resolve([...mockTags]), 100);
          });
        }
      }

      const payload: CrudTagsPayload = {
        action: "getAllTags"
      };

      const response = await crudTags(payload, authToken);
      
      // Transform API response to match Tag interface
      // The API returns data in response.result, not response.data
      if (response && response.result) {
        const tags = Array.isArray(response.result) ? response.result : [];
        const transformedTags = tags.map((tag: any, index: number) => ({
          id: tag.id?.toString() || '',
          name: tag.name || '',
          description: tag.description || '',
          slug: tag.slug || '',
          color: tag.color || generateConsistentColor(tag.name || `tag-${index}`),
          topics_count: tag.topics_count || 0,
          is_active: tag.is_active !== false,
          created_at: tag.created_at || new Date().toISOString(),
          updated_at: tag.updated_at || new Date().toISOString(),
        }));
        
        return transformedTags;
      }
      
      return [...mockTags];
    } catch (error) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockTags]), 100);
      });
    }
  }




  // Create new topic
  static async createTopic(topicData: Partial<Topic>): Promise<Topic> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      // Helper function to safely convert to integer or null
      const safeParseInt = (value: string | number | null | undefined): number | null => {
        if (value === null || value === undefined || value === '' || value === 'null') {
          return null;
        }
        if (typeof value === 'number') {
          return value;
        }
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      };

      const payload: InsertTopicsPayload = {
        action: "insertTopics",
        data: {
          author_id: topicData.author_id,
          category_id: safeParseInt(topicData.category_id),
          title: topicData.title,
          description: topicData.description,
          content: topicData.content,
          status: "pending",
          view_count: 0,
          reply_count: 0,
          like_count: 0,
          role_id: 2, // Set role_id to 2 for all users
        }
      };


      const response = await insertTopics(payload, authToken);
      
      if (response && response.data) {
        const topic = response.data;
        
        // WORKAROUND: If no ID is returned, use a fallback
        let topicId = topic.id || '';
        if (!topicId || topicId === '') {
          // Generate a fallback ID if none is returned
          topicId = `topic_${Date.now()}`;
        }
        
        const createdTopic = {
          id: topicId,
          title: topic.title || '',
          description: topic.description || '',
          content: topic.content || '',
          author_username: topicData.author_name || topicData.author_username || topicData.username || 'anonymous',
          author_avatar: topicData.author_avatar || '',
          author_id: topic.author_id || '',
          category_name: topicData.category_name || '',
          category_color: topicData.category_color || '#3B82F6',
          category_id: topic.category_id?.toString() || '',
          status: topic.status || 'pending',
          is_featured: false,
          is_hot: false,
          is_new: true,
          view_count: topic.view_count || 0,
          reply_count: topic.reply_count || 0,
          like_count: topic.like_count || 0,
          bookmark_count: 0,
          share_count: 0,
          tags: topicData.tags || [],
          created_at: new Date().toISOString(),
        };

        // Insert tags if they exist and we have a valid topic ID
        if (topicData.tags && topicData.tags.length > 0 && createdTopic.id && createdTopic.id !== '') {
          try {
            
            // Validate topic ID
            const topicId = Number(createdTopic.id);
            if (isNaN(topicId) || topicId <= 0) {
              return createdTopic;
            }
            
            // Get all available tags to convert names to IDs
            const allTags = await ApiService.getAllTags();
            
            // Convert tag names to tag IDs
            const tagIds = topicData.tags
              .map(tagName => {
                const tag = allTags.find(t => t.name === tagName);
                return tag ? Number(tag.id) : null;
              })
              .filter(id => id !== null) as number[];
            
            
            if (tagIds.length > 0) {
              await ApiService.insertTopicTags(topicId, tagIds);
            } else {
            }
          } catch (tagError) {
            // Don't throw error here - topic creation succeeded, tag insertion failed
          }
        }

        return createdTopic;
      }
      
      throw new Error("Failed to create topic");
    } catch (error) {
      throw error;
    }
  }


  // Get topics by user
  static async getTopicByUser(userId: string): Promise<Topic[]> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload: GetTopicByUserPayload = {
        action: "getTopicByUser",
        data: {
          user_id: userId,
          author_id: userId
        }
      };

      const response = await getTopicByUser(payload, authToken);
      
      // Handle different response structures
      let topics = [];
      if (response && response.result) {
        topics = Array.isArray(response.result) ? response.result : [];
      } else if (response && Array.isArray(response)) {
        topics = response;
      } else if (response && response.data) {
        topics = Array.isArray(response.data) ? response.data : [];
      }
      
      return topics.map((topic: any) => ({
          id: topic.id?.toString() || '',
          title: topic.title || '',
          description: topic.description || '',
          content: topic.content || '',
          author_username: topic.author_name || topic.author_username || 'Unknown User',
          author_avatar: topic.author_avatar || '',
          author_id: topic.author_id || '',
          category_name: topic.category_name || '',
          category_color: topic.category_color || '#3B82F6',
          category_id: topic.category_id?.toString() || '',
          status: topic.status || 'published',
          is_featured: topic.is_featured || false,
          is_hot: topic.is_hot || false,
          is_new: topic.is_new || false,
          view_count: topic.view_count || 0,
          reply_count: topic.reply_count || 0,
          like_count: topic.like_count || 0,
          bookmark_count: topic.bookmark_count || 0,
          share_count: topic.share_count || 0,
          tags: topic.tags || [],
          created_at: topic.created_at || new Date().toISOString(),
          updated_at: topic.updated_at || new Date().toISOString(),
        }));
      
      return [];
    } catch (error) {
      return [];
    }
  }

  // Insert topic tags
  static async insertTopicTags(topicId: number, tagIds: number[]): Promise<void> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      // Validate inputs
      if (!topicId || topicId <= 0) {
        throw new Error(`Invalid topic ID: ${topicId}`);
      }
      
      if (!tagIds || tagIds.length === 0) {
        return;
      }

      // Filter out any invalid tag IDs
      const validTagIds = tagIds.filter(id => id && id > 0);
      if (validTagIds.length === 0) {
        return;
      }


      // Insert each tag individually
      for (const tagId of validTagIds) {
        const payload: InsertTopicTagsPayload = {
          action: "insertTopic_tags",
          data: {
            topic_id: topicId,
            tag_id: tagId
          }
        };


        try {
          const response = await insertTopicTags(payload, authToken);
          if (!response) {
          } else {
          }
        } catch (tagError) {
          // Continue with other tags even if one fails
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Create reply
  static async createReply(replyData: Partial<Reply>): Promise<Reply> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      
      const payload: CrudRepliesPayload = {
        action: "createReply",
        data: {
          topic_id: replyData.topic_id,
          author_id: replyData.author_id,
          parent_reply_id: replyData.parent_reply_id,
          content: replyData.content,
          like_count: replyData.like_count || 0,
        }
      };

      if (!authToken) {
        // Try with API key instead of falling back to mock data
        const response = await createReplyApi(payload, "", FASTN_API_KEY);
        
        if (response && response.data) {
          const reply = response.data;
          return {
            id: reply.id?.toString() || `reply_${Date.now()}`,
            topic_id: reply.topic_id?.toString() || replyData.topic_id || '',
            author_id: reply.author_id || replyData.author_id || '',
            author_username: replyData.author_name || replyData.author_username || replyData.username || 'anonymous',
            author_avatar: replyData.author_avatar || '',
            content: reply.content || replyData.content || '',
            tutorial_id: reply.tutorial_id || replyData.tutorial_id,
            parent_reply_id: reply.parent_reply_id?.toString() || replyData.parent_reply_id || '',
            is_accepted: reply.is_accepted || false,
            is_helpful: reply.is_helpful || false,
            like_count: reply.like_count || 0,
            dislike_count: reply.dislike_count || 0,
            reply_count: reply.reply_count || 0,
            created_at: reply.created_at || new Date().toISOString(),
            updated_at: reply.updated_at || new Date().toISOString(),
          };
        }
        
        throw new Error("No auth token available");
      }

      const response = await createReplyApi(payload, authToken);
      
      if (response && response.data) {
        const reply = response.data;
        return {
          id: reply.id?.toString() || `reply_${Date.now()}`,
          topic_id: reply.topic_id?.toString() || replyData.topic_id || '',
          author_id: reply.author_id || replyData.author_id || '',
          author_username: replyData.author_name || replyData.author_username || replyData.username || 'anonymous',
          author_avatar: replyData.author_avatar || '',
          content: reply.content || replyData.content || '',
          tutorial_id: reply.tutorial_id || replyData.tutorial_id || '',
          parent_reply_id: reply.parent_reply_id?.toString() || replyData.parent_reply_id || '',
          is_accepted: reply.is_accepted || false,
          is_helpful: reply.is_helpful || false,
          like_count: reply.like_count || 0,
          dislike_count: reply.dislike_count || 0,
          reply_count: reply.reply_count || 0,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString(),
        };
      }
      
      throw new Error("Failed to create reply");
    } catch (error) {
      // Fallback to mock data if API fails
      // API call failed, using mock data
      return new Promise((resolve) => {
        const newReply: Reply = {
          id: `reply_${Date.now()}`,
          topic_id: replyData.topic_id || '',
          author_id: replyData.author_id || 'user_1',
          author_username: replyData.author_name || replyData.author_username || replyData.username || 'admin',
          author_avatar: replyData.author_avatar || '',
          content: replyData.content || '',
          tutorial_id: replyData.tutorial_id,
          parent_reply_id: replyData.parent_reply_id || '',
          is_accepted: false,
          is_helpful: false,
          like_count: 0,
          dislike_count: 0,
          reply_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        mockReplies.push(newReply);
        setTimeout(() => resolve(newReply), 100);
      });
    }
  }

  // Edit reply
  static async editReply(replyData: { id: string; content: string }): Promise<Reply> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      
      const payload: CrudRepliesPayload = {
        action: "updateReply",
        data: {
          id: replyData.id,
          content: replyData.content,
        }
      };

      if (!authToken) {
        // Try with API key instead of falling back to mock data
        const response = await updateReply(payload, "", FASTN_API_KEY);
        
        if (response && response.data) {
          const reply = response.data;
          return {
            id: reply.id?.toString() || replyData.id,
            topic_id: reply.topic_id?.toString() || '',
            author_id: reply.author_id || '',
            author_username: reply.author_username || 'anonymous',
            author_avatar: reply.author_avatar || '',
            content: reply.content || replyData.content,
            tutorial_id: reply.tutorial_id || '',
            parent_reply_id: reply.parent_reply_id?.toString() || '',
            is_accepted: reply.is_accepted || false,
            is_helpful: reply.is_helpful || false,
            like_count: reply.like_count || 0,
            dislike_count: reply.dislike_count || 0,
            reply_count: reply.reply_count || 0,
            created_at: reply.created_at || new Date().toISOString(),
            updated_at: reply.updated_at || new Date().toISOString(),
          };
        }
        
        // Fallback to mock data
        return new Promise((resolve) => { 
          setTimeout(() => {
            const reply = mockReplies.find(r => r.id === replyData.id);
            if (reply) {
              reply.content = replyData.content;
              reply.updated_at = new Date().toISOString();
            }
            resolve(reply!);
          }, 100); 
        });
      }

      const response = await updateReply(payload, authToken);
      
      if (response && response.data) {
        const reply = response.data;
        return {
          id: reply.id?.toString() || replyData.id,
          topic_id: reply.topic_id?.toString() || '',
          author_id: reply.author_id || '',
          author_username: reply.author_username || 'anonymous',
          author_avatar: reply.author_avatar || '',
          content: reply.content || replyData.content,
          tutorial_id: reply.tutorial_id || '',
          parent_reply_id: reply.parent_reply_id?.toString() || '',
          is_accepted: reply.is_accepted || false,
          is_helpful: reply.is_helpful || false,
          like_count: reply.like_count || 0,
          dislike_count: reply.dislike_count || 0,
          reply_count: reply.reply_count || 0,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString(),
        };
      }
      
      // Fallback to mock data
      return new Promise((resolve) => { 
        setTimeout(() => {
          const reply = mockReplies.find(r => r.id === replyData.id);
          if (reply) {
            reply.content = replyData.content;
            reply.updated_at = new Date().toISOString();
          }
          resolve(reply!);
        }, 100); 
      });
    } catch (error) {
      // Failed to edit reply
      // Fallback to mock data
      return new Promise((resolve) => { 
        setTimeout(() => {
          const reply = mockReplies.find(r => r.id === replyData.id);
          if (reply) {
            reply.content = replyData.content;
            reply.updated_at = new Date().toISOString();
          }
          resolve(reply!);
        }, 100); 
      });
    }
  }

  // Delete reply
  static async deleteReply(replyId: string): Promise<boolean> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      const payload: CrudRepliesPayload = {
        action: "deleteReply",
        data: {
          id: replyId,
        }
      };

      if (!authToken) {
        // Try with API key instead of falling back to mock data
        const response = await deleteReply(payload, "", FASTN_API_KEY);
        
        if (response) {
          return true;
        }
        
        // Fallback to mock data
        return new Promise((resolve) => {
          setTimeout(() => {
            const index = mockReplies.findIndex(r => r.id === replyId);
            if (index !== -1) {
              mockReplies.splice(index, 1);
            }
            resolve(true);
          }, 100); 
        });
      }

      const response = await deleteReply(payload, authToken);
      
      if (response) {
        return true;
      }
      
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockReplies.findIndex(r => r.id === replyId);
          if (index !== -1) {
            mockReplies.splice(index, 1);
          }
          resolve(true);
        }, 100); 
      });
    } catch (error) {
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockReplies.findIndex(r => r.id === replyId);
          if (index !== -1) {
            mockReplies.splice(index, 1);
          }
          resolve(true);
        }, 100); 
      });
    }
  }

  // Update topic status with proper cache invalidation
  static async updateTopicStatus(topicId: string | number, status: 'pending' | 'approved' | 'rejected'): Promise<Topic> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload = {
        action: "getTopicbystatus",
        data: {
          status: status,
          id: topicId.toString()
        }
      };

      const response = await updateTopicStatusApi(payload, authToken);
      
      // Handle different response formats
      if (response && Array.isArray(response) && response.length > 0) {
        // The API returns an array with the updated topic
        const updatedTopic = response[0];
        
        const result = {
          id: updatedTopic.id || (typeof topicId === 'string' ? parseInt(topicId) : topicId),
          title: updatedTopic.title || 'Updated Topic',
          description: updatedTopic.description || '',
          content: updatedTopic.content || '',
          author_username: updatedTopic.author_name || 'System',
          author_avatar: '',
          author_id: updatedTopic.author_id || '',
          category_name: updatedTopic.category_name || '',
          category_color: '#3B82F6',
          category_id: updatedTopic.category_id?.toString() || '',
          status: updatedTopic.status || status, // Use the actual status from API response
          is_featured: false,
          is_hot: false,
          is_new: false,
          view_count: updatedTopic.view_count || 0,
          reply_count: updatedTopic.reply_count || 0,
          like_count: updatedTopic.like_count || 0,
          bookmark_count: 0,
          share_count: 0,
          tags: [],
          created_at: updatedTopic.created_at || new Date().toISOString(),
          updated_at: updatedTopic.updated_at || new Date().toISOString(),
        };

        // Clear cache after successful update
        ApiService.clearTopicCache();
        
        return result;
      }
      
      // Fallback if response format is different
      if (response) {
        const result = {
          id: typeof topicId === 'string' ? parseInt(topicId) : topicId,
          title: 'Updated Topic',
          description: 'Status updated successfully',
          content: '',
          author_username: 'System',
          author_avatar: '',
          author_id: '',
          category_name: '',
          category_color: '#3B82F6',
          category_id: '',
          status: status,
          is_featured: false,
          is_hot: false,
          is_new: false,
          view_count: 0,
          reply_count: 0,
          like_count: 0,
          bookmark_count: 0,
          share_count: 0,
          tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Clear cache after successful update
        ApiService.clearTopicCache();
        
        return result;
      }
      
      throw new Error("No response received from API");
    } catch (error) {
      // Error updating topic status
      throw error;
    }
  }

  // Clear topic-related cache
  static clearTopicCache(): void {
    try {
      // Clear React Query cache for topics
      const { queryClient } = require('@/services/queryClient');
      queryClient.removeQueries({ queryKey: ['topics'] });
      queryClient.removeQueries({ queryKey: ['topics', 'public'] });
      queryClient.removeQueries({ queryKey: ['topics', 'admin'] });
      queryClient.removeQueries({ queryKey: ['analytics'] });
      
      // Clear custom cache service
      const { cacheService } = require('@/services/cache');
      cacheService.invalidate('topics');
      cacheService.invalidate('analytics');
      
    } catch (error) {
      // Failed to clear topic cache
    }
  }

  // Update topic using insertTopics API (since we don't have a dedicated update endpoint)
  static async updateTopic(topicId: string, topicData: Partial<Topic>): Promise<Topic> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      // For now, we'll use a mock implementation since we don't have a dedicated update endpoint
      // In a real implementation, you would call the appropriate API endpoint
      
      // Clear cache after update
      ApiService.clearTopicCache();
      
      // Return the updated topic data
      return {
        id: parseInt(topicId),
        title: topicData.title || 'Updated Topic',
        description: topicData.description || '',
        content: topicData.content || '',
        author_username: topicData.author_username || 'User',
        author_avatar: topicData.author_avatar || '',
        author_id: topicData.author_id || '',
        category_name: topicData.category_name || '',
        category_color: topicData.category_color || '#3B82F6',
        category_id: topicData.category_id || '',
        status: topicData.status || 'approved',
        is_featured: topicData.is_featured || false,
        is_hot: topicData.is_hot || false,
        is_new: topicData.is_new || false,
        view_count: topicData.view_count || 0,
        reply_count: topicData.reply_count || 0,
        like_count: topicData.like_count || 0,
        bookmark_count: topicData.bookmark_count || 0,
        share_count: topicData.share_count || 0,
        tags: topicData.tags || [],
        created_at: topicData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      // Error updating topic
      throw error;
    }
  }

  // Delete topic using the DeleteTopic API endpoint
  static async deleteTopic(topicId: string): Promise<boolean> {
    try {
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const payload = {
        action: "deletetopic",
        data: {
          id: topicId
        }
      };

      
      const response = await deleteTopicApi(payload, authToken, FASTN_API_KEY);
      
      // Clear cache after successful deletion
      ApiService.clearTopicCache();
      
      return true;
    } catch (error) {
      // Error deleting topic
      throw error;
    }
  }

  // Get analytics data using optimized topics method
  static async getAnalytics(): Promise<{
    totalUsers: number;
    totalTopics: number;
    totalReplies: number;
    pendingTopics: number;
    approvedTopics: number;
    rejectedTopics: number;
    activeUsers: number;
    totalViews: number;
    totalLikes: number;
  }> {
    try {
      // Use the admin topics query to get all topics including pending
      const { queryClient } = await import('@/services/queryClient');
      
      // Try to get cached admin topics first
      const cachedTopics = queryClient.getQueryData(['topics', 'admin']);
      
      let topics: Topic[];
      if (cachedTopics) {
        topics = cachedTopics as Topic[];
      } else {
        // Fallback to direct call if not cached
        topics = await ApiService.getTopicsOptimized({ 
          forceRefresh: false, 
          includePending: true 
        });
      }
      
      const analytics = {
        totalUsers: mockUsers.length,
        totalTopics: topics.length,
        totalReplies: mockReplies.length,
        pendingTopics: topics.filter(t => t.status === 'pending').length,
        approvedTopics: topics.filter(t => t.status === 'approved').length,
        rejectedTopics: topics.filter(t => t.status === 'rejected').length,
        activeUsers: mockUsers.filter(u => u.is_active).length,
        totalViews: topics.reduce((sum, t) => sum + (t.view_count || 0), 0),
        totalLikes: topics.reduce((sum, t) => sum + (t.like_count || 0), 0),
      };
      
      return analytics;
    } catch (error) {
      throw error;
    }
  }
}

export async function getUserById(userId: string, authToken: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const payload = {
    action: "getUserById",
    data: {
      id: userId
    }
  };

  const res = await fetch(INSERT_USER_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getUserById failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function insertUser(payload: InsertUserPayload, authToken: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  // Ensure role_id is always set to 2 if not explicitly provided
  const finalPayload = {
    ...payload,
    data: {
      ...payload.data,
      role_id: payload.data.role_id ?? 1, // Default to role_id 2 (user/moderator role)
    }
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(INSERT_USER_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: finalPayload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`insertUser failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function crudCategories(payload: CrudCategoriesPayload, authToken: string, apiKey?: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(CRUD_CATEGORIES_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`crudCategories failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function crudTags(payload: CrudTagsPayload, authToken: string, apiKey?: string) {
  // Create a cache key for deduplication
  const cacheKey = `crudTags-${payload.action}-${authToken ? 'auth' : 'key'}`;
  
  // If request is already in progress, return the existing promise
  if (tagsCache.has(cacheKey)) {
    return tagsCache.get(cacheKey);
  }

  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  // Create the request promise
  const requestPromise = (async () => {
    const res = await fetch(CRUD_TAGS_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ input: payload }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`crudTags failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
  })();

  // Cache the promise for deduplication
  tagsCache.set(cacheKey, requestPromise);
  
  // Clear cache after 5 minutes to prevent stale data
  setTimeout(() => {
    tagsCache.delete(cacheKey);
  }, 5 * 60 * 1000);

  return requestPromise;
}


// Separate API functions for the extracted endpoints
export async function getTopicByUser(payload: GetTopicByUserPayload, authToken: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(GET_TOPIC_BY_USER_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getTopicByUser failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function insertTopics(payload: InsertTopicsPayload, authToken: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(INSERT_TOPICS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`insertTopics failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function insertTopicTags(payload: InsertTopicTagsPayload, authToken: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(INSERT_TOPIC_TAGS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`insertTopicTags failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();
const tagsCache = new Map<string, Promise<any>>();
const repliesCache = new Map<string, Promise<any>>();

export async function getAllTopics(payload: any, authToken: string, apiKey?: string, forceRefresh: boolean = false) {
  // Create a cache key for deduplication
  const cacheKey = `getAllTopics-${authToken ? 'auth' : 'key'}-${forceRefresh}`;
  
  // If not forcing refresh and request is already in progress, return the existing promise
  if (!forceRefresh && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  // Add cache busting headers
  if (forceRefresh) {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
    headers["X-Cache-Bust"] = Date.now().toString();
  }

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  // Create the request promise
  const requestPromise = (async () => {
    const res = await fetch(GET_TOPICS_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        input: forceRefresh ? { cacheBust: Date.now() } : {} 
      }),
      cache: forceRefresh ? 'no-store' : 'default'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`getAllTopics failed: ${res.status} ${res.statusText} - ${text}`);
    }

    const result = await res.json();
    return result;
  })();

  // Cache the promise for deduplication
  if (!forceRefresh) {
    requestCache.set(cacheKey, requestPromise);
    
    // Clear cache after 30 seconds to prevent stale data
    setTimeout(() => {
      requestCache.delete(cacheKey);
    }, 30000);
  }

  return requestPromise;
}

export async function createReplyApi(payload: CrudRepliesPayload, authToken: string, apiKey?: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(CREATE_REPLY_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API call failed
    throw new Error(`createReplyApi failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function getRepliesApi(payload: CrudRepliesPayload, authToken: string, apiKey?: string) {
  // Create a cache key for deduplication
  const cacheKey = `getRepliesApi-${payload.action}-${payload.data?.topic_id || 'all'}-${authToken ? 'auth' : 'key'}`;
  
  // If request is already in progress, return the existing promise
  if (repliesCache.has(cacheKey)) {
    return repliesCache.get(cacheKey);
  }

  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  // Create the request promise
  const requestPromise = (async () => {
    const res = await fetch(GET_REPLIES_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ input: payload }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`getRepliesApi failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
  })();

  // Cache the promise for deduplication
  repliesCache.set(cacheKey, requestPromise);
  
  // Clear cache after 2 minutes to prevent stale data
  setTimeout(() => {
    repliesCache.delete(cacheKey);
  }, 2 * 60 * 1000);

  return requestPromise;
}

export async function updateReply(payload: CrudRepliesPayload, authToken: string, apiKey?: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(UPDATE_REPLY_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API call failed
    throw new Error(`updateReply failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function deleteReply(payload: CrudRepliesPayload, authToken: string, apiKey?: string) {
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(DELETE_REPLY_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteReply failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

export async function updateTopicStatusApi(payload: any, authToken: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(UPDATE_TOPIC_STATUS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API Error
    throw new Error(`updateTopicStatus failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function deleteTopicApi(payload: { action: string; data: { id: string } }, authToken: string, apiKey?: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(DELETE_TOPIC_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API Error
    throw new Error(`deleteTopic failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function getAllUsersApi(payload: { action: string }, authToken: string, apiKey?: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(GET_ALL_USERS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API Error
    throw new Error(`getAllUsers failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function submitLikesApi(payload: { data: { userId: string; topicId: number } }, authToken: string, apiKey?: string) {
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }


  const res = await fetch(SUBMIT_LIKES_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });


  if (!res.ok) {
    const text = await res.text();
    // API Error
    
    // Try to parse error message from JSON
    let errorMessage = text;
    let errorJson: any = null;
    try {
      errorJson = JSON.parse(text);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch (e) {
      // Use plain text if JSON parse fails
    }
    
    const error = new Error(`submitLikes failed: ${res.status} ${res.statusText} - ${errorMessage}`);
    // Attach the original response for additional context
    (error as any).response = { status: res.status, text };
    (error as any).errorJson = errorJson; // Attach parsed JSON for easier access
    throw error;
  }

  const result = await res.json();
  return result;
}

export async function submitLikesForReplyApi(payload: { data: { userId: string; reply_id: number } }, authToken: string, apiKey?: string) {
  console.log("submitLikesForReplyApi called with:", { payload, authToken: authToken ? "present" : "missing" });
  
  const isCustomAuth = getCookie(CUSTOM_AUTH_KEY) === "true";
  const customAuthToken = getCookie(CUSTOM_AUTH_TOKEN_KEY) || "";
  const tenantId = getCookie(TENANT_ID_KEY) || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-fastn-space-id": FASTN_SPACE_ID,
    stage: "DRAFT",
  };

  if (isCustomAuth && customAuthToken) {
    headers["x-fastn-custom-auth"] = "true";
    headers["authorization"] = customAuthToken; // raw JWT for custom auth
    if (tenantId) headers["x-fastn-space-tenantid"] = tenantId;
  } else if (apiKey) {
    headers["x-fastn-api-key"] = apiKey;
    headers["authorization"] = authToken; // Include auth token even with API key
  } else {
    headers["authorization"] = `Bearer ${authToken}`;
  }

  console.log("Making request to:", SUBMIT_LIKES_FOR_REPLY_API_URL);
  console.log("With headers:", headers);
  console.log("With body:", JSON.stringify({ input: payload }));

  const res = await fetch(SUBMIT_LIKES_FOR_REPLY_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  console.log("Response status:", res.status);
  console.log("Response ok:", res.ok);

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", { status: res.status, statusText: res.statusText, text });
    
    // Try to parse error message from JSON
    let errorMessage = text;
    let errorJson: any = null;
    try {
      errorJson = JSON.parse(text);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch (e) {
      // Use plain text if JSON parse fails
    }
    
    const error = new Error(`submitLikesForReply failed: ${res.status} ${res.statusText} - ${errorMessage}`);
    // Attach the original response for additional context
    (error as any).response = { status: res.status, text };
    (error as any).errorJson = errorJson; // Attach parsed JSON for easier access
    throw error;
  }

  const result = await res.json();
  console.log("API Response:", result);
  return result;
}

// Hook for using API in React components
export const useApi = () => {
  return {
    getAllCategories: ApiService.getAllCategories,
    createCategory: ApiService.createCategory,
    updateCategory: ApiService.updateCategory,
    deleteCategory: ApiService.deleteCategory,
    getAllTopics: ApiService.getAllTopics,
    getTopicsOptimized: ApiService.getTopicsOptimized,
    getAllTopicById: ApiService.getAllTopicById,
    getAllUsers: ApiService.getAllUsers,
    getAllReplies: ApiService.getAllReplies,
    getRepliesByTopicId: ApiService.getRepliesByTopicId,
    getAllTags: ApiService.getAllTags,
    createTopic: ApiService.createTopic,
    updateTopic: ApiService.updateTopic,
    deleteTopic: ApiService.deleteTopic,
    updateTopicStatus: ApiService.updateTopicStatus,
    clearTopicCache: ApiService.clearTopicCache,
    insertTopicTags: ApiService.insertTopicTags,
    getTopicByUser: ApiService.getTopicByUser,
    createReply: ApiService.createReply,
    editReply: ApiService.editReply,
    deleteReply: ApiService.deleteReply,
    getAnalytics: ApiService.getAnalytics,
    // Categories API functions
    crudCategories,
    // Tags API functions
    crudTags,
    // Separated topic endpoint functions
    getTopicByUserApi: getTopicByUser,
    insertTopicsApi: insertTopics,
    insertTopicTagsApi: insertTopicTags,
    getAllTopicsApi: getAllTopics,
    updateTopicStatusApi,
    deleteTopicApi,
    // Replies API functions
    createReplyApi,
    getRepliesApi,
    updateReply,
    // Users API functions
    getAllUsersApi,
    // Likes API functions
    submitLikesApi,
    submitLikesForReplyApi,
  };
};