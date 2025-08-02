// API service for fastn community platform

const API_BASE_URL = 'https://qa.fastn.ai/api/v1';
const API_KEY = '59b01ec6-8f4b-490f-8be4-cd2263d36584';
const SPACE_ID = 'ee032b0c-ebb1-45cb-9cb3-a835d276a8e4';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
let lastRequestTime = 0;

// Common headers for all API requests
const getHeaders = () => ({
  'x-fastn-api-key': API_KEY,
  'Content-Type': 'application/json',
  'x-fastn-space-id': SPACE_ID,
  'x-fastn-space-tenantid': '',
  'stage': 'DRAFT'
});

// Rate limiting function
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

// Retry function with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('429')) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limited (429). Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // For other errors, use shorter delay
        const delay = baseDelay * Math.pow(1.5, attempt);
        console.log(`Request failed. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

// API response types
export interface Topic {
  id: string;
  title: string;
  description: string;
  content?: string;
  author: string;
  category: string;  // Changed from category_id to category (string)
  status: string;
  is_featured?: boolean;
  is_hot?: boolean;
  is_new?: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API service class
export class ApiService {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/getAllcategories`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ input: {} })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle different response formats
        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn('Unexpected API response format:', result);
          return [];
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    });
  }

  // Get category by ID
  static async getCategoryById(categoryId: string): Promise<Category> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/getCategoryById`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              category_id: categoryId 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
      }
    });
  }

  // Create new category
  static async createCategory(categoryData: Partial<Category>): Promise<Category> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/createCategory`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: categoryData 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    });
  }

  // Update category
  static async updateCategory(categoryId: string, categoryData: Partial<Category>): Promise<Category> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/updateCategory`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              category_id: categoryId,
              ...categoryData 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    });
  }

  // Delete category
  static async deleteCategory(categoryId: string): Promise<boolean> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/deleteCategory`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              category_id: categoryId 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || true;
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    });
  }

  // Get all topics
  static async getAllTopics(): Promise<Topic[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/getAllTopics`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ input: {} })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle different response formats
        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn('Unexpected API response format:', result);
          return [];
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }
    });
  }

  // Get topics by category
  static async getTopicsByCategory(categoryId: string): Promise<Topic[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/getTopicsByCategory`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              category_id: categoryId 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [result.data];
      } catch (error) {
        console.error('Error fetching topics by category:', error);
        throw error;
      }
    });
  }

  // Get topic by ID
  static async getTopicById(topicId: string): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/getTopicById`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              topic_id: topicId 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error fetching topic by ID:', error);
        throw error;
      }
    });
  }

  // Create new topic
  static async createTopic(topicData: Partial<Topic>): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/createTopic`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: topicData 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
      }
    });
  }

  // Update topic
  static async updateTopic(topicId: string, topicData: Partial<Topic>): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/updateTopic`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              topic_id: topicId,
              ...topicData 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error updating topic:', error);
        throw error;
      }
    });
  }

  // Delete topic
  static async deleteTopic(topicId: string): Promise<boolean> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();
      
      try {
        const response = await fetch(`${API_BASE_URL}/deleteTopic`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ 
            input: { 
              topic_id: topicId 
            } 
          })
        });

        if (response.status === 429) {
          throw new Error(`HTTP error! status: ${response.status} - Rate limited`);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || true;
      } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
      }
    });
  }
}

// Hook for using API in React components
export const useApi = () => {
  return {
    getAllCategories: ApiService.getAllCategories,
    getCategoryById: ApiService.getCategoryById,
    createCategory: ApiService.createCategory,
    updateCategory: ApiService.updateCategory,
    deleteCategory: ApiService.deleteCategory,
    getAllTopics: ApiService.getAllTopics,
    getTopicsByCategory: ApiService.getTopicsByCategory,
    getTopicById: ApiService.getTopicById,
    createTopic: ApiService.createTopic,
    updateTopic: ApiService.updateTopic,
    deleteTopic: ApiService.deleteTopic
  };
}; 