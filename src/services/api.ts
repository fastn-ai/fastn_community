// API Service for fastn community platform
const API_BASE_URL = "https://qa.fastn.ai/api/v1";
const API_KEY = "59b01ec6-8f4b-490f-8be4-cd2263d36584";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-fastn-api-key": API_KEY,
  "x-fastn-space-id": "ee032b0c-ebb1-45cb-9cb3-a835d276a8e4",
  "x-fastn-space-tenantid": "",
  stage: "DRAFT",
});

const waitForRateLimit = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
};

// Interfaces
export interface Topic {
  id: string;
  title: string;
  description: string;
  content?: string;
  author_username: string;
  author_avatar?: string;
  author_id?: string;
  category_name: string;
  category_color?: string;
  category_id?: string;
  status?: string;
  is_featured?: boolean;
  is_hot?: boolean;
  is_new?: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  tags?: string[]; // Changed to array of strings
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

export interface TopicTag {
  id: string;
  topic_id: string;
  tag_id: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiService {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getAllcategories`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ input: {} }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn("Unexpected API response format:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ input: {} }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn("Unexpected API response format:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
      }
    });
  }

  // Create topic using crudTopics endpoint
  static async createTopic(topicData: Partial<Topic>): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        // Validate that the author_id exists in the users table
        if (topicData.author_id) {
          try {
            const users = await this.getAllUsers();
            const userExists = users.some(user => user.id === topicData.author_id);
            if (!userExists) {
              console.warn(`User with ID ${topicData.author_id} does not exist in the database. Attempting to create user...`);
              
                             // Try to create the user if they don't exist
               try {
                 const userData = JSON.parse(localStorage.getItem('fastn_user') || '{}');
                 const createUserResponse = await fetch(`${API_BASE_URL}/crudUser`, {
                   method: "POST",
                   headers: getHeaders(),
                   body: JSON.stringify({
                     input: {
                       action: "insert",
                       users: [{
                         // Let the database generate the ID
                         username: userData.username || topicData.author_username || 'user',
                         email: userData.email || 'user@example.com',
                         password_hash: btoa('password_fastn_salt'),
                         bio: userData.bio || "",
                         avatar_url: userData.avatar_url || "",
                         location: userData.location || "",
                         website: userData.website || "",
                         twitter: "",
                         github: "",
                         linkedin: "",
                         is_verified: userData.is_verified || false,
                         is_active: userData.is_active !== false,
                         reputation_score: userData.reputation_score || 0,
                         topics_count: 0,
                         replies_count: 0,
                         likes_received: 0,
                         badges_count: 0
                       }]
                     }
                   })
                 });

                if (createUserResponse.ok) {
                  console.log("User created successfully for topic creation");
                } else {
                  console.error("Failed to create user for topic creation");
                  throw new Error(`User with ID ${topicData.author_id} does not exist in the database and could not be created. Please ensure you are properly authenticated.`);
                }
              } catch (createError) {
                console.error("Error creating user:", createError);
                throw new Error(`User with ID ${topicData.author_id} does not exist in the database. Please ensure you are properly authenticated.`);
              }
            }
          } catch (error) {
            console.warn("Could not validate user existence:", error);
            // Continue with topic creation even if user validation fails
          }
        }

        const response = await fetch(`${API_BASE_URL}/crudTopics`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            "x-fastn-custom-auth": "true",
          },
          body: JSON.stringify({
            input: {
              action: "insert",
              topics: [
                {
                  title: topicData.title,
                  description: topicData.description,
                  content: topicData.content,
                  author_id: topicData.author_id || "id_1754164424_145800", // Use provided author ID
                  category_id: topicData.category_id || "id_1754163675_740242", // Default category ID
                  is_featured: topicData.is_featured || false,
                  is_hot: topicData.is_hot || false,
                  is_new: topicData.is_new || true,
                  view_count: topicData.view_count || 0,
                  reply_count: topicData.reply_count || 0,
                  like_count: topicData.like_count || 0,
                  bookmark_count: topicData.bookmark_count || 0,
                  share_count: topicData.share_count || 0,
                  tags: topicData.tags || [], // Include tags as array
                },
              ],
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error creating topic:", error);
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
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              category_id: categoryId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [result.data];
      } catch (error) {
        console.error("Error fetching topics by category:", error);
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
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error fetching topic by ID:", error);
        throw error;
      }
    });
  }

  // Get all topic by ID (new endpoint)
  static async getAllTopicById(topicId: string): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getAllTopicById`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            "x-fastn-custom-auth": "true",
          },
          body: JSON.stringify({
            input: {
              id: topicId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error fetching topic by ID (getAllTopicById):", error);
        throw error;
      }
    });
  }

  // Update topic
  static async updateTopic(
    topicId: string,
    topicData: Partial<Topic>
  ): Promise<Topic> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/updateTopic`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
              ...topicData,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error updating topic:", error);
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
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || true;
      } catch (error) {
        console.error("Error deleting topic:", error);
        throw error;
      }
    });
  }

  // Get replies for a specific topic
  static async getRepliesByTopic(topicId: string): Promise<Reply[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getRepliesByTopic`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [result.data];
      } catch (error) {
        console.error("Error fetching replies by topic:", error);
        throw error;
      }
    });
  }

  // Get reply by ID
  static async getReplyById(replyId: string): Promise<Reply> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getReplyById`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              reply_id: replyId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error fetching reply by ID:", error);
        throw error;
      }
    });
  }

  // Create new reply
  static async createReply(replyData: Partial<Reply>): Promise<Reply> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/createReply`, {
          method: "POST",
          headers: {
            ...getHeaders(),
            "x-fastn-custom-auth": "true",
          },
          body: JSON.stringify({
            input: {
              replies: [
                {
                  content: replyData.content,
                  author_id: replyData.author_id || "id_1754164424_145800",
                  topic_id: replyData.topic_id,
                  tutorial_id: "",
                  parent_reply_id: replyData.parent_reply_id || "",
                  like_count: replyData.like_count || 0,
                  is_accepted: replyData.is_accepted || false,
                  is_helpful: replyData.is_helpful || false,
                  created_at: new Date().toISOString(),
                },
              ],
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error creating reply:", error);
        throw error;
      }
    });
  }

  // Update reply
  static async updateReply(
    replyId: string,
    replyData: Partial<Reply>
  ): Promise<Reply> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/updateReply`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              reply_id: replyId,
              ...replyData,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error updating reply:", error);
        throw error;
      }
    });
  }

  // Delete reply
  static async deleteReply(replyId: string): Promise<boolean> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/deleteReply`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              reply_id: replyId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || true;
      } catch (error) {
        console.error("Error deleting reply:", error);
        throw error;
      }
    });
  }

  // Edit reply
  static async editReply(replyData: {
    id: string;
    content: string;
    author_id: string;
    topic_id: string;
    tutorial_id?: string | null;
    parent_reply_id?: string | null;
    like_count?: number;
    is_accepted?: boolean;
    is_helpful?: boolean;
  }): Promise<any> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/editReply`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              replies: [replyData],
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("EditReply API response:", result); // Debug log
        
        // Check if the response indicates an error
        if (result.error || result.message) {
          throw new Error(result.message || result.error || "Edit reply failed");
        }
        
        // Handle different response formats for editReply
        if (result.data) {
          return result.data;
        } else if (result.success !== undefined) {
          // If it's a success response without data, return the result itself
          return result;
        } else {
          // If no data property, return the entire result
          return result;
        }
      } catch (error) {
        console.error("Error editing reply:", error);
        throw error;
      }
    });
  }

  // Like a reply
  static async likeReply(replyId: string): Promise<Reply> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/likeReply`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              reply_id: replyId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error liking reply:", error);
        throw error;
      }
    });
  }

  // Accept reply as answer
  static async acceptReply(replyId: string): Promise<Reply> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/acceptReply`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              reply_id: replyId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error accepting reply:", error);
        throw error;
      }
    });
  }

  // Get all tags
  static async getAllTags(): Promise<Tag[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getAllTags`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ input: {} }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn("Unexpected API response format:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
      }
    });
  }

  // Get tags for a specific topic
  static async getTagsByTopic(topicId: string): Promise<Tag[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getTagsByTopic`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [result.data];
      } catch (error) {
        console.error("Error fetching tags by topic:", error);
        throw error;
      }
    });
  }

  // Get topics by tag
  static async getTopicsByTag(tagId: string): Promise<Topic[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getTopicsByTag`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              tag_id: tagId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [result.data];
      } catch (error) {
        console.error("Error fetching topics by tag:", error);
        throw error;
      }
    });
  }

  // Add tag to topic
  static async addTagToTopic(
    topicId: string,
    tagId: string
  ): Promise<TopicTag> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/addTagToTopic`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
              tag_id: tagId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error adding tag to topic:", error);
        throw error;
      }
    });
  }

  // Remove tag from topic
  static async removeTagFromTopic(
    topicId: string,
    tagId: string
  ): Promise<boolean> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/removeTagFromTopic`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              topic_id: topicId,
              tag_id: tagId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || true;
      } catch (error) {
        console.error("Error removing tag from topic:", error);
        throw error;
      }
    });
  }

  // Get all topic-tag relationships
  static async getAllTopicTags(): Promise<TopicTag[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getAllTopicTags`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ input: {} }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn("Unexpected API response format:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching topic tags:", error);
        throw error;
      }
    });
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getAllUsers`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ input: {} }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn("Unexpected API response format:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    });
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User> {
    return retryWithBackoff(async () => {
      await waitForRateLimit();

      try {
        const response = await fetch(`${API_BASE_URL}/getUserById`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            input: {
              user_id: userId,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error(
            `HTTP error! status: ${response.status} - Rate limited`
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
      }
    });
  }
}

// Hook for using API in React components
export const useApi = () => {
  return {
    getAllCategories: ApiService.getAllCategories,
    getAllTopics: ApiService.getAllTopics,
    createTopic: ApiService.createTopic,
    getTopicsByCategory: ApiService.getTopicsByCategory,
    getTopicById: ApiService.getTopicById,
    getAllTopicById: ApiService.getAllTopicById,
    updateTopic: ApiService.updateTopic,
    deleteTopic: ApiService.deleteTopic,
    getRepliesByTopic: ApiService.getRepliesByTopic,
    getReplyById: ApiService.getReplyById,
    createReply: ApiService.createReply,
    updateReply: ApiService.updateReply,
    deleteReply: ApiService.deleteReply,
    editReply: ApiService.editReply,
    likeReply: ApiService.likeReply,
    acceptReply: ApiService.acceptReply,
    getAllTags: ApiService.getAllTags,
    getTagsByTopic: ApiService.getTagsByTopic,
    getTopicsByTag: ApiService.getTopicsByTag,
    addTagToTopic: ApiService.addTagToTopic,
    removeTagFromTopic: ApiService.removeTagFromTopic,
    getAllTopicTags: ApiService.getAllTopicTags,
    getAllUsers: ApiService.getAllUsers,
    getUserById: ApiService.getUserById,
  };
};
