// Mock API Service for fastn community platform
// This is a frontend-only implementation with mock data

import { INSERT_USER_API_URL, FASTN_SPACE_ID, FASTN_API_KEY, CUSTOM_AUTH_KEY, CUSTOM_AUTH_TOKEN_KEY, TENANT_ID_KEY, CRUD_CATEGORIES_API_URL, CRUD_TAGS_API_URL, CRUD_TOPICS_API_URL, GET_TOPIC_BY_USER_API_URL, INSERT_TOPIC_TAGS_API_URL, INSERT_TOPICS_API_URL, GET_TOPICS_API_URL } from "@/constants";
import { getCookie } from "@/routes/login/oauth";
import { generateConsistentColor, PREDEFINED_COLORS } from "@/lib/utils";

// Mock data interfaces
export interface Topic {
  id: number;
  title: string;
  description: string;
  content?: string;
  author_username: string;
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
  tutorials_count: number;
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

export interface CrudTopicsPayload {
  action: "getAllTopics" | "updateTopic";
  data?: {
    id?: string;
    author_id?: string;
    category_id?: number | null;
    tag_id?: number | null;
    title?: string;
    description?: string;
    content?: string;
    status?: "pending" | "published" | "draft" | "rejected" | "approved";
    view_count?: number;
    reply_count?: number;
    like_count?: number;
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
    status?: "pending" | "published" | "draft" | "rejected";
    view_count?: number;
    reply_count?: number;
    like_count?: number;
  };
}

export interface InsertTopicTagsPayload {
  action: "insertTopic_tags";
  data?: {
    topic_id?: number;
    tag_id?: number;
  };
}

// Mock data storage
let mockCategories: Category[] = [];
let mockUsers: User[] = [];
let mockReplies: Reply[] = [];
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
      tutorials_count: 0,
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
      tutorials_count: 0,
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
      tutorials_count: 0,
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
      console.log('🔍 getAllCategories: Starting...')
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      console.log('🔍 getAllCategories: User and token check:', {
        hasUser: !!user,
        hasAuthToken: !!authToken,
        userProfile: user?.profile,
        tokenLength: authToken?.length
      })
      
      if (!authToken) {
        console.warn("⚠️ No auth token available, using FASTN API key for public access");
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await crudCategories({ action: "getAllCategories" }, "", FASTN_API_KEY);
          return ApiService.processCategoriesResponse(response);
        } catch (error) {
          console.warn("Failed to fetch categories with API key, falling back to mock data:", error);
          return new Promise((resolve) => {
            setTimeout(() => resolve([...mockCategories]), 100);
          });
        }
      }

      const payload: CrudCategoriesPayload = {
        action: "getAllCategories"
      };
      console.log('🚀 getAllCategories: Making API call with payload:', payload)
      const response = await crudCategories(payload, authToken);
      
      console.log('📥 getAllCategories: API response:', response)
      
      // Transform API response to match Category interface
      // The API returns data in response.result, not response.data
      if (response && response.result) {
        const categories = Array.isArray(response.result) ? response.result : [];
        console.log('✅ getAllCategories: Found categories:', categories.length)
        const transformedCategories = categories.map((cat: any, index: number) => ({
          id: cat.id?.toString() || '',
          name: cat.name || '',
          description: cat.description || '',
          slug: cat.slug || '',
          icon: cat.icon || 'folder',
          color: cat.color || generateConsistentColor(cat.name || `category-${index}`),
          topics_count: cat.topics_count || 0,
          tutorials_count: cat.tutorials_count || 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        }));
        
        console.log('🔄 getAllCategories: Transformed categories:', transformedCategories)
        return transformedCategories;
      }
      
      console.warn("⚠️ No data in API response, falling back to mock data");
      return [...mockCategories];
    } catch (error) {
      console.error("Error fetching categories from API, falling back to mock data:", error);
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
          tutorials_count: 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        };
      }
      
      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error);
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
          tutorials_count: cat.tutorials_count || 0,
          is_active: cat.is_active !== false,
          created_at: cat.created_at || new Date().toISOString(),
          updated_at: cat.updated_at || new Date().toISOString(),
        };
      }
      
      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error);
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
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Get all topics
  static async getAllTopics(): Promise<Topic[]> {
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
        console.warn("No auth token available, using FASTN API key for public access");
        // Use FASTN API key for public access when user is not logged in
        const response = await getAllTopics(null, "", FASTN_API_KEY);
        return ApiService.processTopicsResponse(response);
      }

      const response = await getAllTopics(null, tokenToUse);
      return ApiService.processTopicsResponse(response);
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
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
          content: topic.content || '',
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
        console.warn("No auth token available for getTopicById, using FASTN API key for public access");
        // Use FASTN API key for public access when user is not logged in
        const response = await getAllTopics(null, "", FASTN_API_KEY);
        const topics = ApiService.processTopicsResponse(response);
        const topic = topics.find((t: any) => (t.topic_id || t.id)?.toString() === topicId);
        
        if (topic) {
          return topic;
        }
        throw new Error("Topic not found");
      }

      const response = await getAllTopics(null, tokenToUse);
      const topics = ApiService.processTopicsResponse(response);
      const topic = topics.find((t: any) => (t.topic_id || t.id)?.toString() === topicId);
      
      if (topic) {
        return topic;
      }
      
      throw new Error("Topic not found");
    } catch (error) {
      console.error("Error fetching topic by ID:", error);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockUsers]), 100);
    });
  }

  // Get all replies
  static async getAllReplies(): Promise<Reply[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockReplies]), 100);
    });
  }

  // Get all tags
  static async getAllTags(): Promise<Tag[]> {
    try {
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        console.warn("No auth token available, using FASTN API key for public access");
        // Use FASTN API key for public access when user is not logged in
        try {
          const response = await crudTags({ action: "getAllTags" }, "", FASTN_API_KEY);
          return ApiService.processTagsResponse(response);
        } catch (error) {
          console.warn("Failed to fetch tags with API key, falling back to mock data:", error);
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
      
      console.warn("No data in API response, falling back to mock data");
      return [...mockTags];
    } catch (error) {
      console.error("Error fetching tags from API, falling back to mock data:", error);
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
          status: "published",
          view_count: 0,
          reply_count: 0,
          like_count: 0,
        }
      };


      const response = await insertTopics(payload, authToken);
      
      if (response && response.data) {
        const topic = response.data;
        
        // WORKAROUND: If no ID is returned, use a fallback
        console.log( "topic", topic)
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
          status: topic.status || 'published',
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
            console.log("createdTopic for tag insertion:", createdTopic);
            console.log("topicData.tags:", topicData.tags);
            
            // Validate topic ID
            const topicId = Number(createdTopic.id);
            if (isNaN(topicId) || topicId <= 0) {
              console.error(`Invalid topic ID: ${createdTopic.id}`);
              return createdTopic;
            }
            
            // Get all available tags to convert names to IDs
            const allTags = await ApiService.getAllTags();
            console.log("All available tags:", allTags);
            
            // Convert tag names to tag IDs
            const tagIds = topicData.tags
              .map(tagName => {
                const tag = allTags.find(t => t.name === tagName);
                console.log(`Looking for tag "${tagName}":`, tag);
                return tag ? Number(tag.id) : null;
              })
              .filter(id => id !== null) as number[];
            
            console.log("Converted tag IDs:", tagIds);
            
            if (tagIds.length > 0) {
              await ApiService.insertTopicTags(topicId, tagIds);
            } else {
              console.warn("No valid tag IDs found for tags:", topicData.tags);
            }
          } catch (tagError) {
            console.error("Error inserting topic tags:", tagError);
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
      
      if (response && response.result) {
        const topics = Array.isArray(response.result) ? response.result : [];
        return topics.map((topic: any) => ({
          id: topic.id?.toString() || '',
          title: topic.title || '',
          description: topic.description || '',
          content: topic.content || '',
          author_username: topic.author_username || '',
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
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching topics by user:", error);
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
        console.warn(`No tag IDs provided for topic ${topicId}`);
        return;
      }

      // Filter out any invalid tag IDs
      const validTagIds = tagIds.filter(id => id && id > 0);
      if (validTagIds.length === 0) {
        console.warn(`No valid tag IDs provided for topic ${topicId}`);
        return;
      }

      console.log(`Inserting tags for topic ${topicId}:`, validTagIds);

      // Insert each tag individually
      for (const tagId of validTagIds) {
        const payload: InsertTopicTagsPayload = {
          action: "insertTopic_tags",
          data: {
            topic_id: topicId,
            tag_id: tagId
          }
        };

        console.log(`Inserting tag ${tagId} for topic ${topicId}:`, JSON.stringify(payload, null, 2));

        try {
          const response = await insertTopicTags(payload, authToken);
          if (!response) {
            console.error(`Failed to insert tag ${tagId} for topic ${topicId}`);
          } else {
            console.log(`Successfully inserted tag ${tagId} for topic ${topicId}`);
          }
        } catch (tagError) {
          console.error(`Error inserting tag ${tagId} for topic ${topicId}:`, tagError);
          // Continue with other tags even if one fails
        }
      }
    } catch (error) {
      console.error("Error in insertTopicTags:", error);
      throw error;
    }
  }

  // Create reply
  static async createReply(replyData: Partial<Reply>): Promise<Reply> {
    return new Promise((resolve) => {
      const newReply: Reply = {
        id: `reply_${Date.now()}`,
        topic_id: replyData.topic_id || '',
        author_id: replyData.author_id || 'user_1',
        author_username: replyData.author_name || replyData.author_username || replyData.username || 'admin',
        author_avatar: replyData.author_avatar || '',
        content: replyData.content || '',
        tutorial_id: replyData.tutorial_id || '',
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

  // Edit reply
  static async editReply(replyData: { id: string; content: string }): Promise<Reply> {
    return new Promise((resolve) => {
      const reply = mockReplies.find(r => r.id === replyData.id);
      if (reply) {
        reply.content = replyData.content;
        reply.updated_at = new Date().toISOString();
      }
      setTimeout(() => resolve(reply!), 100);
    });
  }

  // Delete reply
  static async deleteReply(replyId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const index = mockReplies.findIndex(r => r.id === replyId);
      if (index !== -1) {
        mockReplies.splice(index, 1);
      }
      setTimeout(() => resolve(true), 100);
    });
  }

  // Get analytics data
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
      // Try to get auth token from user manager
      const { getUser } = await import("@/services/users/user-manager");
      const user = getUser();
      const authToken = user?.access_token || "";
      
      if (!authToken) {
        throw new Error("No auth token available");
      }

      // Get all topics for analytics
      const payload: CrudTopicsPayload = {
        action: "getAllTopics"
      };

      const response = await crudTopics(payload, authToken);
      
      let topics: any[] = [];
      if (response && response.result) {
        topics = Array.isArray(response.result) ? response.result : [];
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
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }
}

export async function insertUser(payload: InsertUserPayload, authToken: string) {
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

  const res = await fetch(INSERT_USER_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
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
}

export async function crudTopics(payload: CrudTopicsPayload, authToken: string) {
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

  const res = await fetch(CRUD_TOPICS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`crudTopics failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
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

export async function getAllTopics(payload: any, authToken: string, apiKey?: string) {
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

  const res = await fetch(GET_TOPICS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ input: {} }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getAllTopics failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

// Hook for using API in React components
export const useApi = () => {
  return {
    getAllCategories: ApiService.getAllCategories,
    createCategory: ApiService.createCategory,
    updateCategory: ApiService.updateCategory,
    deleteCategory: ApiService.deleteCategory,
    getAllTopics: ApiService.getAllTopics,
    getAllTopicById: ApiService.getAllTopicById,
    getAllUsers: ApiService.getAllUsers,
    getAllReplies: ApiService.getAllReplies,
    getAllTags: ApiService.getAllTags,
    createTopic: ApiService.createTopic,
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
    // Topics API functions
    crudTopics,
    // Separated topic endpoint functions
    getTopicByUserApi: getTopicByUser,
    insertTopicsApi: insertTopics,
    insertTopicTagsApi: insertTopicTags,
    getAllTopicsApi: getAllTopics,
  };
};