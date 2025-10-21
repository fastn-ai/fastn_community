import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";

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
  Settings,
} from "lucide-react";
import { ApiService, Topic, Category } from "@/services/api";
import { getTagColor } from "@/lib/utils";
import CreateTopicModal from "@/components/ui/create-topic-modal";
import { queryKeys } from "@/services/queryClient";

interface TopicListProps {
  sidebarOpen: boolean;
}

const TopicList: React.FC<TopicListProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated && auth.user;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use React Query to fetch data (shared with Sidebar)
  const { data: topics = [], isLoading: topicsLoading, error: topicsError, refetch: refetchTopics } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: ApiService.getAllTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

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

  // Filter topics based on search, filter, and tag
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || topic.category_name === selectedFilter;
    
    // Add tag filtering
    const matchesTag = !selectedTag || (topic.tags && Array.isArray(topic.tags) && topic.tags.includes(selectedTag));
    
    return matchesSearch && matchesFilter && matchesTag;
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
  const handleLike = async (topicId: string) => {
    try {
      console.log("Liking topic:", topicId);
      // TODO: Implement actual like functionality with API call
    } catch (error) {
      console.error("Error liking topic:", error);
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
        console.log("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing topic:", error);
    }
  };

  const handleBookmark = async (topicId: string) => {
    try {
      console.log("Bookmarking topic:", topicId);
      // TODO: Implement actual bookmark functionality with API call
    } catch (error) {
      console.error("Error bookmarking topic:", error);
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
      Tutorials: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      categoryColors[categoryName] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getCategoryDisplayName = (categoryName: string | undefined) => {
    if (!categoryName) {
      console.log("Category name is undefined/null");
      return "Uncategorized";
    }

    console.log(`Category name: ${categoryName}`);
    return categoryName;
  };

  const parseTags = (tags?: string[] | string | any): string[] => {
    console.log('parseTags input:', tags);
    if (!tags) return [];
    
    // If tags is already an array of objects with name property
    if (Array.isArray(tags)) {
      console.log('Processing array of tag objects');
      const result = tags.map((tag: any) => {
        if (typeof tag === 'object' && tag.name) {
          return tag.name;
        }
        return tag;
      }).filter((tag: string) => tag && tag.length > 0);
      console.log('Final parsed tags from array:', result);
      return result;
    }
    
    // Handle the new API structure where tags is an object with value property
    if (tags && typeof tags === 'object' && tags.value) {
      console.log('Processing tags.value:', tags.value);
      try {
        const parsedTags = JSON.parse(tags.value);
        console.log('Parsed JSON tags:', parsedTags);
        if (Array.isArray(parsedTags)) {
          const result = parsedTags.map((tag: any) => tag.name || tag).filter((tag: string) => tag && tag.length > 0);
          console.log('Final parsed tags:', result);
          return result;
        }
      } catch (error) {
        console.error('Error parsing tags JSON:', error);
        return [];
      }
    }
    
    // If tags is a string, parse it
    if (typeof tags === 'string') {
      try {
        const cleanTags = tags.replace(/[{}]/g, "");
        return cleanTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      } catch (error) {
        return [];
      }
    }
    
    return [];
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

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "all":
        return <MessageSquare className="h-4 w-4" />;
      case "top":
        return <Trophy className="h-4 w-4" />;
      case "Questions":
        return <HelpCircle className="h-4 w-4" />;
      case "Best Practices":
        return <Star className="h-4 w-4" />;
      case "Announcements":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getFilterIconColor = (filter: string) => {
    switch (filter) {
      case "all":
        return "text-blue-600";
      case "top":
        return "text-yellow-600";
      case "Questions":
        return "text-blue-600";
      case "Best Practices":
        return "text-green-600";
      case "Announcements":
        return "text-red-600";
      default:
        return "text-gray-600";
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
              <p className="text-muted-foreground mb-6">{error}</p>
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Topics</h1>
            <p className="text-muted-foreground">
              Latest discussions in the fastn community
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/categories")}
            >
              <FolderOpen className="h-4 w-4 text-blue-600" />
              Categories
            </Button>
            {isAuthenticated && (
              <Button
                onClick={() => setIsCreateTopicModalOpen(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Topic</span>
              </Button>
            )}
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </div>
        </div>

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
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            onClick={() => setSelectedFilter("all")}
            className="flex items-center gap-2"
          >
            <MessageSquare
              className={`h-4 w-4 ${
                selectedFilter === "all"
                  ? "text-white"
                  : getFilterIconColor("all")
              }`}
            />
            All Topics
          </Button>
          <Button
            variant={selectedFilter === "top" ? "default" : "outline"}
            onClick={() => setSelectedFilter("top")}
            className="flex items-center gap-2"
          >
            <Trophy
              className={`h-4 w-4 ${
                selectedFilter === "top"
                  ? "text-white"
                  : getFilterIconColor("top")
              }`}
            />
            Top
          </Button>
          <Button
            variant={selectedFilter === "Questions" ? "default" : "outline"}
            onClick={() => setSelectedFilter("Questions")}
            className="flex items-center gap-2"
          >
            <HelpCircle
              className={`h-4 w-4 ${
                selectedFilter === "Questions"
                  ? "text-white"
                  : getFilterIconColor("Questions")
              }`}
            />
            Questions
          </Button>
          <Button
            variant={
              selectedFilter === "Best Practices" ? "default" : "outline"
            }
            onClick={() => setSelectedFilter("Best Practices")}
            className="flex items-center gap-2"
          >
            <Star
              className={`h-4 w-4 ${
                selectedFilter === "Best Practices"
                  ? "text-white"
                  : getFilterIconColor("Best Practices")
              }`}
            />
            Best Practices
          </Button>
          <Button
            variant={selectedFilter === "Announcements" ? "default" : "outline"}
            onClick={() => setSelectedFilter("Announcements")}
            className="flex items-center gap-2"
          >
            <Megaphone
              className={`h-4 w-4 ${
                selectedFilter === "Announcements"
                  ? "text-white"
                  : getFilterIconColor("Announcements")
              }`}
            />
            Announcements
          </Button>
        </div>

        {/* Topics Table */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm">
              <div className="col-span-6">Topic</div>
              <div className="col-span-2 text-right">Replies</div>
              <div className="col-span-2 text-right">Views</div>
              <div className="col-span-2 text-right">Activity</div>
            </div>

            {/* Topics List */}
            {paginatedTopics.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || selectedFilter !== "all" || selectedTag
                    ? "No topics match your search criteria."
                    : "No topics found."}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {paginatedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/topic/${topic.id.toString()}`)}
                  >
                    {/* Topic Content */}
                    <div className="col-span-6">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                          {getInitials(topic.author_username)}
                        </div>

                        {/* Topic Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {topic.title}
                            </h3>
                            {/* Category Badge */}
                            <Badge
                              className={`${getCategoryBadge(
                                topic.category_name,
                                topic.category_color
                              )} text-xs`}
                            >
                              {getCategoryDisplayName(topic.category_name)}
                            </Badge>
                            {/* Tags beside category */}
                            
                            {topic.is_hot && (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 border-orange-200"
                              >
                                <Zap className="w-3 h-3 mr-1 text-orange-600" />
                                Hot
                              </Badge>
                            )}
                            {topic.is_featured && (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800 border-yellow-200"
                              >
                                <Star className="w-3 h-3 mr-1 text-yellow-600" />
                                Featured
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {topic.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="font-medium">
                              {topic.author_username}
                            </span>
                            <span>•</span>
                            <span>
                              {topic.created_at
                                ? formatDate(topic.created_at)
                                : "Unknown"}
                            </span>
                            {/* Tags beside author */}
                            {topic.tags && (() => {
                              const tags = parseTags(topic.tags);
                              console.log('Topic tags data:', topic.tags);
                              console.log('Parsed tags:', tags);
                              return tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className={`inline-block px-2 py-1 text-xs rounded-full border ${getTagColor(tag)}`}
                                >
                                  {tag}
                                </span>
                              ));
                            })()}
                          </div>

                          {/* Tags */}
                         
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MessageSquare
                          className={`h-4 w-4 ${getStatsIconColor("replies")}`}
                        />
                        <span>{topic.reply_count || 0}</span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye
                          className={`h-4 w-4 ${getStatsIconColor("views")}`}
                        />
                        <span>{topic.view_count || 0}</span>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock
                          className={`h-4 w-4 ${getStatsIconColor("activity")}`}
                        />
                        <span>
                          {topic.created_at
                            ? formatDate(topic.created_at)
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
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
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
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
