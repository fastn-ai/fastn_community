import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Heart,
  Share2,
  Bookmark,
  MessageSquare,
  Eye,
  Clock,
  User,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Star,
  FolderOpen,
  Plus,
  Trophy,
  HelpCircle,
  Zap,
  Megaphone,
  X,
 
  Rocket,

  Sparkles,
  Folder,

} from "lucide-react";
import { ApiService, Topic, Category, removeLikeFromTopicApi, submitLikesApi } from "@/services/api";
import { getTagColor } from "@/lib/utils";
import CreateTopicModal from "@/components/ui/create-topic-modal";
import { queryKeys } from "@/services/queryClient";
import { FASTN_API_KEY } from "@/constants";

interface TopicListProps {
  sidebarOpen: boolean;
}

const TopicList: React.FC<TopicListProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated && auth.user;
  
  // Check if user is admin
 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use React Query to fetch data with optimized caching
  const { data: allTopics = [], isLoading: topicsLoading, error: topicsError, refetch: refetchTopics } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: () => ApiService.getTopicsOptimized({ 
      forceRefresh: false, 
      includePending: true // Get all topics, filter client-side
    }),
    staleTime: 3 * 60 * 1000, // 3 minutes - shorter for public view
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on focus for public view
  });

  // Filter topics client-side to show only approved topics in public view
  const topics = allTopics.filter(topic => topic.status === 'approved');

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: ApiService.getAllCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Read tag from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagParam = urlParams.get('tag');
    if (tagParam) {
      setSelectedTag(decodeURIComponent(tagParam));
    }
  }, [location.search]);

  // Parse tags from various formats
  const parseTags = (tags?: string[] | string | any): string[] => {
    if (!tags) return [];
    
    let result: string[] = [];
    
    // If tags is already an array of strings
    if (Array.isArray(tags)) {
      result = tags.filter((tag: any) => {
        if (typeof tag === 'string' && tag.length > 0) {
          return true;
        }
        if (typeof tag === 'object' && tag.name && typeof tag.name === 'string') {
          return true;
        }
        return false;
      }).map((tag: any) => {
        if (typeof tag === 'string') {
          return tag;
        }
        if (typeof tag === 'object' && tag.name) {
          return tag.name;
        }
        return String(tag);
      });
    }
    // Handle the new API structure where tags is an object with value property
    else if (tags && typeof tags === 'object' && tags.value) {
      try {
        const parsedTags = JSON.parse(tags.value);
        if (Array.isArray(parsedTags)) {
          result = parsedTags.map((tag: any) => {
            if (typeof tag === 'string') {
              return tag;
            }
            if (typeof tag === 'object' && tag.name) {
              return tag.name;
            }
            return String(tag);
          }).filter((tag: string) => tag && tag.length > 0);
        }
      } catch (error) {
        return [];
      }
    }
    // If tags is a string, parse it
    else if (typeof tags === 'string') {
      try {
        // Handle JSON string format
        if (tags.startsWith('[') || tags.startsWith('{')) {
          const parsed = JSON.parse(tags);
          if (Array.isArray(parsed)) {
            result = parsed.map((tag: any) => {
              if (typeof tag === 'string') return tag;
              if (typeof tag === 'object' && tag.name) return tag.name;
              return String(tag);
            }).filter((tag: string) => tag && tag.length > 0);
          }
        } else {
          // Handle comma-separated string format
          const cleanTags = tags.replace(/[{}]/g, "");
          result = cleanTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        }
      } catch (error) {
        return [];
      }
    }
    
    // Remove duplicates by converting to Set and back to array
    const uniqueTags = Array.from(new Set(result));
    return uniqueTags;
  };

  // Filter topics based on search, filter, and tag
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === "all") {
      matchesFilter = true;
    } else if (selectedFilter === "top") {
      // Filter for top topics (you can customize this logic)
      matchesFilter = topic.is_hot || topic.is_featured || topic.like_count > 5;
    } else {
      matchesFilter = topic.category_name === selectedFilter;
    }
    
    // Add tag filtering
    const parsedTopicTags = parseTags(topic.tags);
    const matchesTag = !selectedTag || parsedTopicTags.includes(selectedTag);
    
    // Debug logging
    if (selectedTag && topic.tags) {
      // Tag matching logic
    }
    
    // Only show approved topics
    const isApproved = topic.status === 'approved' || !topic.status;
    
    return matchesSearch && matchesFilter && matchesTag && isApproved;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);

  // Paginate topics
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  // Handle tag filter removal
  const clearTagFilter = () => {
    setSelectedTag(null);
    navigate('/', { replace: true });
  };

  // Handle topic interactions
  const handleLike = async (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like button
    
    try {
      if (!isAuthenticated || !auth.user) {
        return;
      }

      const userId = auth.user.profile?.sub || auth.user.profile?.sid || auth.user.profile?.email;
      
      if (!userId) {
        return;
      }

      // Check if already liked
      const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
      const likeKey = `${userId}-${topicId}`;
      const isCurrentlyLiked = !!likedTopics[likeKey];

      if (isCurrentlyLiked) {
        // Unlike the topic
        const payload = {
          data: {
            user_id: userId,
            topic_id: parseInt(topicId)
          }
        };

        const authToken = auth.user.access_token || "";
        
        await removeLikeFromTopicApi(payload, authToken, FASTN_API_KEY);
        
        // Remove from localStorage
        delete likedTopics[likeKey];
        localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
        
        // Update local state immediately with functional update
        queryClient.setQueryData(queryKeys.topics, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          // Create a completely new array with spread operator
          return oldData.map((topic: any) => {
            const topicIdStr = typeof topic.id === 'number' ? topic.id.toString() : String(topic.id);
            if (topicIdStr === topicId) {
              const currentCount = typeof topic.like_count === 'number' ? topic.like_count : parseInt(String(topic.like_count || '0'), 10);
              return {
                ...topic,
                like_count: Math.max(0, currentCount - 1)
              };
            }
            return { ...topic };
          });
        });
      } else {
        // Like the topic
        const payload = {
          data: {
            userId: userId,
            topicId: parseInt(topicId)
          }
        };

        const authToken = auth.user.access_token || "";
        
        await submitLikesApi(payload, authToken, FASTN_API_KEY);
        
        // Save to localStorage
        likedTopics[likeKey] = true;
        localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
        
        // Update local state immediately with functional update
        queryClient.setQueryData(queryKeys.topics, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          // Create a completely new array with spread operator
          return oldData.map((topic: any) => {
            const topicIdStr = typeof topic.id === 'number' ? topic.id.toString() : String(topic.id);
            if (topicIdStr === topicId) {
              const currentCount = typeof topic.like_count === 'number' ? topic.like_count : parseInt(String(topic.like_count || '0'), 10);
              return {
                ...topic,
                like_count: currentCount + 1
              };
            }
            return { ...topic };
          });
        });
      }
      
    } catch (error) {
      // Handle duplicate like error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorJson = (error as any)?.errorJson;
      const responseText = (error as any)?.response?.text || '';
      
      // Check error message, error JSON, and response text for duplicate key indicators
      const isDuplicateError = 
        errorMessage.includes("duplicate key") || 
        errorMessage.includes("already exists") || 
        errorMessage.includes("likes_unique_topic") ||
        errorMessage.includes("INVALID_FLOW_ERROR") ||
        (errorJson && (
          errorJson.message?.includes("duplicate key") ||
          errorJson.message?.includes("already exists") ||
          errorJson.message?.includes("likes_unique_topic") ||
          errorJson.code === "INVALID_FLOW_ERROR"
        )) ||
        responseText.includes("duplicate key") ||
        responseText.includes("likes_unique_topic");
      
      if (isDuplicateError) {
        // Save to localStorage even if duplicate
        const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
        const userId = auth.user?.profile?.sub || auth.user?.profile?.sid || auth.user?.profile?.email;
        if (userId) {
          const likeKey = `${userId}-${topicId}`;
          likedTopics[likeKey] = true;
          localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
          
          // Update local state even for duplicate with functional update
          queryClient.setQueryData(queryKeys.topics, (oldData: any) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            // Create a completely new array with spread operator
            return oldData.map((topic: any) => {
              const topicIdStr = typeof topic.id === 'number' ? topic.id.toString() : String(topic.id);
              if (topicIdStr === topicId) {
                const currentCount = typeof topic.like_count === 'number' ? topic.like_count : parseInt(String(topic.like_count || '0'), 10);
                return {
                  ...topic,
                  like_count: currentCount + 1
                };
              }
              return { ...topic };
            });
          });
        }
      }
    }
  };

  const handleShare = async (topic: Topic) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: topic.title,
          text: topic.description,
          url: `${window.location.origin}/topic/${topic.id}`,
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/topic/${topic.id}`
        );
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleBookmark = async (topicId: string) => {
    try {
      // TODO: Implement actual bookmark functionality with API call
    } catch (error) {
      // Handle error silently
    }
  };

  const getCategoryBadge = (
    categoryName: string | undefined,
    categoryColor?: string
  ) => {
    if (!categoryName) return "bg-gray-100 text-gray-800 border-gray-200";

    // Use category_color if available, otherwise map by name
    if (categoryColor) {
      const colorMap: { [key: string]: string } = {
        blue: "bg-blue-100 text-blue-800 border-blue-200",
        red: "bg-red-100 text-red-800 border-red-200",
        green: "bg-green-100 text-green-800 border-green-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        orange: "bg-orange-100 text-orange-800 border-orange-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
      return (
        colorMap[categoryColor] || "bg-gray-100 text-gray-800 border-gray-200"
      );
    }

    // Fallback to name-based mapping
    const categoryColors: { [key: string]: string } = {
      Questions: "bg-blue-100 text-blue-800 border-blue-200",
      Announcements: "bg-red-100 text-red-800 border-red-200",
      "Best Practices": "bg-green-100 text-green-800 border-green-200",
      "Built with fastn": "bg-purple-100 text-purple-800 border-purple-200",
      Showcase: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      categoryColors[categoryName] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getCategoryDisplayName = (categoryName: string | undefined) => {
    if (!categoryName) {
      return "Uncategorized";
    }

    return categoryName;
  };


  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category?.icon) {
      switch (category.icon) {
     
        case 'folder':
          return <Folder className="h-4 w-4" />;
       
        
        default:
          return <MessageSquare className="h-4 w-4" />;
      }
    }
    
    // Fallback to name-based mapping with meaningful icons
    switch (categoryName.toLowerCase()) {
      case "questions":
      case "question":
        return <HelpCircle className="h-4 w-4" />;
      case "best practices":
        return <Star className="h-4 w-4" />;
      case "announcements":
        return <Megaphone className="h-4 w-4" />;
      case "built with fastn":
        return <Rocket className="h-4 w-4" />;
      case "showcase":
        return <Sparkles className="h-4 w-4" />;
     
      default:
        return <Folder className="h-4 w-4" />;
    }
  };

  const getCategoryIconColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category?.color) {
      // Convert hex color to text color class with more comprehensive mapping
      const colorMap: { [key: string]: string } = {
        '#3B82F6': 'text-blue-600',
        '#1D4ED8': 'text-blue-700',
        '#EF4444': 'text-red-600',
        '#DC2626': 'text-red-700',
        '#10B981': 'text-emerald-600',
        '#059669': 'text-emerald-700',
        '#8B5CF6': 'text-purple-600',
        '#7C3AED': 'text-purple-700',
        '#F59E0B': 'text-amber-600',
        '#D97706': 'text-amber-700',
        '#F97316': 'text-orange-600',
        '#EA580C': 'text-orange-700',
        '#EC4899': 'text-pink-600',
        '#DB2777': 'text-pink-700',
        '#06B6D4': 'text-cyan-600',
        '#0891B2': 'text-cyan-700',
        '#84CC16': 'text-lime-600',
        '#65A30D': 'text-lime-700',
 
     
      };
      return colorMap[category.color] || 'text-gray-600';
    }
    
    // Fallback to name-based mapping with vibrant colors
    switch (categoryName.toLowerCase()) {
      case "questions":
      case "question":
        return "text-blue-600"; // HelpCircle - blue for questions
      case "best practices":
        return "text-emerald-600"; // Star - emerald for excellence
      case "announcements":
        return "text-red-600"; // Megaphone - red for important
      case "built with fastn":
        return "text-purple-600"; // Rocket - purple for innovation
      case "showcase":
        return "text-orange-600"; // Sparkles - orange for highlights
      case "community":
        return "text-cyan-600"; // Users - cyan for community
      case "security":
        return "text-green-600"; // Shield - green for safety
      case "request feature":
        return "text-indigo-600"; // MessageCircle - indigo for requests
      case "feedback":
      case "feadback":
        return "text-pink-600"; // MessageSquare - pink for feedback
      case "technology":
        return "text-purple-600"; // Cpu - purple for technology
    
      default:
        return "text-gray-600";
    }
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "all":
        return <MessageSquare className="h-4 w-4" />;
      case "top":
        return <Trophy className="h-4 w-4" />;
      default:
        return getCategoryIcon(filter);
    }
  };

  const getFilterIconColor = (filter: string) => {
    switch (filter) {
      case "all":
        return "text-blue-600";
      case "top":
        return "text-yellow-600";
      default:
        return getCategoryIconColor(filter);
    }
  };

  const getStatsIconColor = (type: string) => {
    switch (type) {
      case "replies":
        return "text-blue-600";
      case "views":
        return "text-green-600";
      case "activity":
        return "text-purple-600";
      case "likes":
        return "text-red-600";
      case "bookmarks":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const loading = topicsLoading || categoriesLoading;
  const error = topicsError || categoriesError;

  if (loading) {
    return (
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading topics and categories...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Unable to Load Data
              </h3>
              <p className="text-muted-foreground mb-6">{error?.toString() || 'An error occurred'}</p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => refetchTopics()}
                  disabled={topicsLoading}
                  className="flex items-center gap-2"
                >
                  {topicsLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-0 transition-all duration-300">
      <div className="mx-auto w-full max-w-screen-2xl px-6 lg:px-10 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Topics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Latest discussions in the fastn community
            </p>
          </div>
          <div className="hidden md:flex gap-2 sm:gap-3 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => navigate("/categories")}
            >
              <FolderOpen className="h-4 w-4 text-blue-600 transition-transform duration-300 hover:scale-110" />
              <span className="hidden sm:inline">Categories</span>
              <span className="sm:hidden">Cat</span>
            </Button>
            {/*{isAuthenticated && (
              <Button
                onClick={() => setIsCreateTopicModalOpen(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Topic</span>
              </Button>
            )}*/}
           
          </div>
        </div>

        {/* Mock Data Info Banner */}
        {topics.length > 0 && topics.some(t => t.title === "Welcome to Fastn Community" || t.content?.includes("mock data")) && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                  API Rate Limit Reached
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  The API is currently rate-limited. Displaying sample data below. Your actual topics will appear once the rate limit resets (usually within 24 hours).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedTag || selectedFilter !== "all") && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedTag && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tag: {selectedTag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={clearTagFilter}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {selectedFilter !== "all" && (
              <Badge variant="secondary">
                Category: {selectedFilter}
              </Badge>
            )}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
          {/* All Topics Button */}
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
            style={{
              animationDelay: '0.1s',
              opacity: 0,
            }}
            className="flex items-center gap-2 flex-shrink-0 animate-fade-in-up transition-all duration-300 hover:scale-105"
          >
            <MessageSquare
              className={`h-4 w-4 transition-transform duration-300 hover:scale-110 ${
                selectedFilter === "all"
                  ? "text-white"
                  : getFilterIconColor("all")
              }`}
            />
            All Topics
          </Button>
          
          {/* Top Button */}
          <Button
            variant={selectedFilter === "top" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("top")}
            style={{
              animationDelay: '0.15s',
              opacity: 0,
            }}
            className="flex items-center gap-2 flex-shrink-0 animate-fade-in-up transition-all duration-300 hover:scale-105"
          >
            <Trophy
              className={`h-4 w-4 transition-transform duration-300 hover:scale-110 ${
                selectedFilter === "top"
                  ? "text-white"
                  : getFilterIconColor("top")
              }`}
            />
            Top
          </Button>
          
          {/* Dynamic Category Buttons */}
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={selectedFilter === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(category.name)}
              style={{
                animationDelay: `${0.2 + index * 0.05}s`,
                opacity: 0,
              }}
              className="flex items-center gap-2 flex-shrink-0 animate-fade-in-up transition-all duration-300 hover:scale-105"
            >
              {React.cloneElement(getCategoryIcon(category.name), {
                className: `h-4 w-4 transition-transform duration-300 hover:scale-110 ${
                  selectedFilter === category.name
                    ? "text-white"
                    : getCategoryIconColor(category.name)
                }`
              })}
              {category.name}
            </Button>
          ))}

          {/* Mobile Categories shortcut */}
          <div className="md:hidden ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate("/categories")}
            >
              <FolderOpen className="h-4 w-4 text-blue-600" />
              Categories
            </Button>
          </div>
        </div>

        {/* Topics Table */}
        <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-right">Replies</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTopics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery || selectedFilter !== "all" || selectedTag
                          ? "No topics match your search criteria."
                          : "No topics found."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTopics.map((topic, index) => (
                    <TableRow
                      key={topic.id}
                      style={{
                        animationDelay: `${0.4 + index * 0.05}s`,
                        opacity: 0,
                      }}
                      className="cursor-pointer hover:bg-muted/50 animate-fade-in-up transition-all duration-200 hover:shadow-sm"
                      onClick={() => navigate(`/topic/${topic.id.toString()}`)}
                    >
                      {/* Topic Column */}
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <Avatar className="w-10 h-10 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-sm">
                              {getInitials(topic.author_username)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Topic Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground break-words">
                                {topic.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {/* Category Badge */}
                                <Badge
                                  className={`${getCategoryBadge(
                                    topic.category_name,
                                    topic.category_color
                                  )} text-xs flex items-center gap-1`}
                                >
                                  {getCategoryDisplayName(topic.category_name)}
                                </Badge>
                                {/* Tags beside category */}
                                {topic.is_hot && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-orange-100 text-orange-800 border-orange-200 text-xs"
                                  >
                                    <Zap className="w-3 h-3 mr-1 text-orange-600" />
                                    Hot
                                  </Badge>
                                )}
                                {topic.is_featured && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"
                                  >
                                    <Star className="w-3 h-3 mr-1 text-yellow-600" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                              {topic.description}
                            </p>

                            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs text-gray-500">
                              <span className="font-medium">
                                {topic.author_username}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                {topic.created_at
                                  ? formatDate(topic.created_at)
                                  : "Unknown"}
                              </span>
                              {/* Tags beside author */}
                              {topic.tags && (() => {
                                const tags = parseTags(topic.tags);
                               
                                return tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block px-2 py-0.5 text-xs rounded-full border ${getTagColor(tag)}`}
                                  >
                                    {tag}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Replies Column */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                          <span>{topic.reply_count || 0}</span>
                        </div>
                      </TableCell>

                      {/* Likes Column */}
                      <TableCell className="text-right">
                        {(() => {
                          const userId = auth.user?.profile?.sub || auth.user?.profile?.sid || auth.user?.profile?.email;
                          const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
                          const likeKey = userId ? `${userId}-${topic.id.toString()}` : '';
                          const isLiked = userId ? !!likedTopics[likeKey] : false;
                          
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(topic.id.toString(), e);
                              }}
                              className={`flex items-center gap-1 text-sm transition-all duration-300 ml-auto hover:scale-110 ${
                                isLiked 
                                  ? "text-primary" 
                                  : "text-gray-600 hover:text-primary"
                              }`}
                              disabled={!isAuthenticated}
                              title={!isAuthenticated ? "Please sign in to like" : isLiked ? "Click to unlike" : "Click to like"}
                            >
                              <Heart
                                className={`h-4 w-4 transition-all duration-300 ${
                                  isLiked 
                                    ? "text-primary fill-primary scale-110" 
                                    : "text-gray-600"
                                }`}
                              />
                              <span key={`like-count-${topic.id}-${topic.like_count}`}>{topic.like_count || 0}</span>
                            </button>
                          );
                        })()}
                      </TableCell>

                      {/* Activity Column */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                          <span>
                            {topic.created_at
                              ? formatDate(topic.created_at)
                              : "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={`transition-all duration-300 hover:scale-110 ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:shadow-md"
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={`transition-all duration-300 hover:scale-110 ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:shadow-md"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      {/* Create Topic Modal */}
      <CreateTopicModal 
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        position="bottom"
      />
    </div>
  );
};

export default TopicList;
