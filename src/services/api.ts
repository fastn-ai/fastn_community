// Mock API Service for fastn community platform
// This is a frontend-only implementation with mock data

// Mock data interfaces
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

// Mock data storage
let mockTopics: Topic[] = [];
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

  // Mock Topics
  mockTopics = [
    {
      id: 'topic_1',
      title: 'Welcome to Fastn Community!',
      description: 'This is our first community post. Welcome everyone!',
      content: 'Welcome to the Fastn community platform. This is where developers can share knowledge, ask questions, and collaborate.',
      author_username: 'admin',
      author_avatar: '',
      author_id: 'user_1',
      category_name: 'Announcements',
      category_color: '#EF4444',
      category_id: 'cat_2',
      status: 'approved',
      is_featured: true,
      is_hot: false,
      is_new: true,
      view_count: 150,
      reply_count: 5,
      like_count: 25,
      bookmark_count: 10,
      share_count: 3,
      tags: ['welcome', 'community', 'fastn'],
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString(),
    },
    {
      id: 'topic_2',
      title: 'How to get started with Fastn?',
      description: 'Looking for guidance on getting started with Fastn development.',
      content: 'I am new to Fastn and would like to know the best way to get started. Any recommendations?',
      author_username: 'john_doe',
      author_avatar: '',
      author_id: 'user_2',
      category_name: 'Questions',
      category_color: '#3B82F6',
      category_id: 'cat_1',
      status: 'approved',
      is_featured: false,
      is_hot: true,
      is_new: false,
      view_count: 75,
      reply_count: 3,
      like_count: 8,
      bookmark_count: 5,
      share_count: 1,
      tags: ['getting-started', 'help', 'fastn'],
      created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      updated_at: new Date().toISOString(),
    },
    {
      id: 'topic_3',
      title: 'Best practices for Fastn development',
      description: 'Share your best practices and tips for Fastn development.',
      content: 'This is a pending post that needs admin approval.',
      author_username: 'john_doe',
      author_avatar: '',
      author_id: 'user_2',
      category_name: 'Best Practices',
      category_color: '#10B981',
      category_id: 'cat_3',
      status: 'pending',
      is_featured: false,
      is_hot: false,
      is_new: true,
      view_count: 0,
      reply_count: 0,
      like_count: 0,
      bookmark_count: 0,
      share_count: 0,
      tags: ['best-practices', 'development'],
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
if (mockTopics.length === 0) {
  initializeMockData();
}

// Mock API Service Class
export class ApiService {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCategories]), 100);
    });
  }

  // Get all topics
  static async getAllTopics(): Promise<Topic[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockTopics]), 100);
    });
  }

  // Get topics by status (for admin)
  static async getTopicsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Topic[]> {
    return new Promise((resolve) => {
      const filteredTopics = mockTopics.filter(topic => topic.status === status);
      setTimeout(() => resolve([...filteredTopics]), 100);
    });
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
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockTags]), 100);
    });
  }

  // Admin: Approve topic
  static async approveTopic(topicId: string): Promise<Topic> {
    return new Promise((resolve) => {
      const topic = mockTopics.find(t => t.id === topicId);
      if (topic) {
        topic.status = 'approved';
        topic.updated_at = new Date().toISOString();
      }
      setTimeout(() => resolve(topic!), 100);
    });
  }

  // Admin: Reject topic
  static async rejectTopic(topicId: string): Promise<Topic> {
    return new Promise((resolve) => {
      const topic = mockTopics.find(t => t.id === topicId);
      if (topic) {
        topic.status = 'rejected';
        topic.updated_at = new Date().toISOString();
      }
      setTimeout(() => resolve(topic!), 100);
    });
  }

  // Admin: Delete topic
  static async deleteTopic(topicId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const index = mockTopics.findIndex(t => t.id === topicId);
      if (index !== -1) {
        mockTopics.splice(index, 1);
      }
      setTimeout(() => resolve(true), 100);
    });
  }

  // Admin: Create new topic
  static async createTopic(topicData: Partial<Topic>): Promise<Topic> {
    return new Promise((resolve) => {
      const newTopic: Topic = {
        id: `topic_${Date.now()}`,
        title: topicData.title || 'Untitled',
        description: topicData.description || '',
        content: topicData.content || '',
        author_username: topicData.author_username || 'anonymous',
        author_avatar: topicData.author_avatar || '',
        author_id: topicData.author_id || 'user_2',
        category_name: topicData.category_name || 'Questions',
        category_color: topicData.category_color || '#3B82F6',
        category_id: topicData.category_id || 'cat_1',
        status: 'pending',
        is_featured: false,
        is_hot: false,
        is_new: true,
        view_count: 0,
        reply_count: 0,
        like_count: 0,
        bookmark_count: 0,
        share_count: 0,
        tags: topicData.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockTopics.push(newTopic);
      setTimeout(() => resolve(newTopic), 100);
    });
  }

  // Get topic by ID
  static async getAllTopicById(topicId: string): Promise<Topic> {
    return new Promise((resolve) => {
      const topic = mockTopics.find(t => t.id === topicId);
      setTimeout(() => resolve(topic!), 100);
    });
  }

  // Create reply
  static async createReply(replyData: Partial<Reply>): Promise<Reply> {
    return new Promise((resolve) => {
      const newReply: Reply = {
        id: `reply_${Date.now()}`,
        topic_id: replyData.topic_id || '',
        author_id: replyData.author_id || 'user_1',
        author_username: replyData.author_username || 'admin',
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
    return new Promise((resolve) => {
      const analytics = {
        totalUsers: mockUsers.length,
        totalTopics: mockTopics.length,
        totalReplies: mockReplies.length,
        pendingTopics: mockTopics.filter(t => t.status === 'pending').length,
        approvedTopics: mockTopics.filter(t => t.status === 'approved').length,
        rejectedTopics: mockTopics.filter(t => t.status === 'rejected').length,
        activeUsers: mockUsers.filter(u => u.is_active).length,
        totalViews: mockTopics.reduce((sum, t) => sum + t.view_count, 0),
        totalLikes: mockTopics.reduce((sum, t) => sum + t.like_count, 0),
      };
      setTimeout(() => resolve(analytics), 100);
    });
  }
}

// Hook for using API in React components
export const useApi = () => {
  return {
    getAllCategories: ApiService.getAllCategories,
    getAllTopics: ApiService.getAllTopics,
    getTopicsByStatus: ApiService.getTopicsByStatus,
    getAllUsers: ApiService.getAllUsers,
    getAllReplies: ApiService.getAllReplies,
    getAllTags: ApiService.getAllTags,
    approveTopic: ApiService.approveTopic,
    rejectTopic: ApiService.rejectTopic,
    deleteTopic: ApiService.deleteTopic,
    createTopic: ApiService.createTopic,
    getAllTopicById: ApiService.getAllTopicById,
    createReply: ApiService.createReply,
    editReply: ApiService.editReply,
    deleteReply: ApiService.deleteReply,
    getAnalytics: ApiService.getAnalytics,
  };
};