// Performance-optimized TopicList component following design guidelines
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { ApiService, Topic, Category } from "@/services/api";
import { getTagColor } from "@/lib/utils";
import CreateTopicModal from "@/components/ui/create-topic-modal";
import { queryKeys } from "@/services/queryClient";
import VirtualizedList from "./VirtualizedList";
import InfiniteScroll from "./InfiniteScroll";
import LazyImage from "./LazyImage";
import PerformanceMonitor from "./PerformanceMonitor";

interface OptimizedTopicListProps {
  sidebarOpen: boolean;
}

// Memoized topic item component
const TopicItem = React.memo<{
  topic: Topic;
  onNavigate: (id: string) => void;
  onLike: (id: string) => void;
  onShare: (topic: Topic) => void;
  onBookmark: (id: string) => void;
}>(({ topic, onNavigate, onLike, onShare, onBookmark }) => {
  const getCategoryBadge = useCallback((
    categoryName: string | undefined,
    categoryColor?: string
  ) => {
    if (!categoryName) return "bg-gray-100 text-gray-800 border-gray-200";

    if (categoryColor) {
      const colorMap: { [key: string]: string } = {
        blue: "bg-blue-100 text-blue-800 border-blue-200",
        red: "bg-red-100 text-red-800 border-red-200",
        green: "bg-green-100 text-green-800 border-green-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        orange: "bg-orange-100 text-orange-800 border-orange-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
      return colorMap[categoryColor] || "bg-gray-100 text-gray-800 border-gray-200";
    }

    const categoryColors: { [key: string]: string } = {
      Questions: "bg-blue-100 text-blue-800 border-blue-200",
      Announcements: "bg-red-100 text-red-800 border-red-200",
      "Best Practices": "bg-green-100 text-green-800 border-green-200",
      "Built with fastn": "bg-purple-100 text-purple-800 border-purple-200",
      Showcase: "bg-orange-100 text-orange-800 border-orange-200",
      Tutorials: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return categoryColors[categoryName] || "bg-gray-100 text-gray-800 border-gray-200";
  }, []);

  const getInitials = useCallback((username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }, []);

  const parseTags = useCallback((tags?: string[] | string): string[] => {
    if (!tags) return [];
    
    if (Array.isArray(tags)) {
      return tags.filter(tag => tag && tag.length > 0);
    }
    
    if (typeof tags === 'string') {
      try {
        const cleanTags = tags.replace(/[{}]/g, "");
        return cleanTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      } catch (error) {
        console.error("Error parsing tags:", error);
        return [];
      }
    }
    
    return [];
  }, []);

  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onNavigate(topic.id)}
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
                {topic.created_at ? formatDate(topic.created_at) : "Unknown"}
              </span>
              <Badge
                className={`${getCategoryBadge(
                  topic.category_name,
                  topic.category_color
                )} text-xs`}
              >
                {topic.category_name || "Uncategorized"}
              </Badge>
            </div>

            {/* Tags */}
            <div className="flex gap-1 mt-2">
              {topic.tags && (() => {
                const tags = parseTags(topic.tags);
                return tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-block px-2 py-1 text-xs rounded-full border ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="col-span-2 flex items-center justify-end">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span>{topic.reply_count || 0}</span>
        </div>
      </div>

      {/* Views */}
      <div className="col-span-2 flex items-center justify-end">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Eye className="h-4 w-4 text-green-600" />
          <span>{topic.view_count || 0}</span>
        </div>
      </div>

      {/* Activity */}
      <div className="col-span-2 flex items-center justify-end">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-purple-600" />
          <span>
            {topic.created_at ? formatDate(topic.created_at) : "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
});

TopicItem.displayName = 'TopicItem';

const OptimizedTopicList: React.FC<OptimizedTopicListProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch topics with React Query
  const {
    data: topics = [],
    isLoading: topicsLoading,
    error: topicsError,
    refetch: refetchTopics
  } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: ApiService.getAllTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch categories with React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: ApiService.getAllCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Read tag from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagParam = urlParams.get('tag');
    if (tagParam) {
      setSelectedTag(decodeURIComponent(tagParam));
    }
  }, [location.search]);

  // Memoized filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || topic.category_name === selectedFilter;
      const matchesTag = !selectedTag || (topic.tags && Array.isArray(topic.tags) && topic.tags.includes(selectedTag));
      
      return matchesSearch && matchesFilter && matchesTag;
    });
  }, [topics, searchQuery, selectedFilter, selectedTag]);

  // Memoized paginated topics
  const paginatedTopics = useMemo(() => {
    if (useInfiniteScroll) {
      return filteredTopics; // Show all for infinite scroll
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTopics.slice(startIndex, endIndex);
  }, [filteredTopics, currentPage, itemsPerPage, useInfiniteScroll]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTopics.length / itemsPerPage);
  }, [filteredTopics.length, itemsPerPage]);

  // Memoized callbacks
  const handleNavigate = useCallback((id: string) => {
    navigate(`/topic/${id}`);
  }, [navigate]);

  const handleLike = useCallback(async (topicId: string) => {
    try {
      console.log("Liking topic:", topicId);
      // Optimistic update would go here
    } catch (error) {
      console.error("Error liking topic:", error);
    }
  }, []);

  const handleShare = useCallback(async (topic: Topic) => {
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
  }, []);

  const handleBookmark = useCallback(async (topicId: string) => {
    try {
      console.log("Bookmarking topic:", topicId);
      // Optimistic update would go here
    } catch (error) {
      console.error("Error bookmarking topic:", error);
    }
  }, []);

  const clearTagFilter = useCallback(() => {
    setSelectedTag(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const handleLoadMore = useCallback(() => {
    // For infinite scroll implementation
    console.log("Loading more topics...");
  }, []);

  const renderTopicItem = useCallback(({ index, style, item }: { index: number; style: React.CSSProperties; item: Topic }) => (
    <div style={style}>
      <TopicItem
        topic={item}
        onNavigate={handleNavigate}
        onLike={handleLike}
        onShare={handleShare}
        onBookmark={handleBookmark}
      />
    </div>
  ), [handleNavigate, handleLike, handleShare, handleBookmark]);

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
              <p className="text-muted-foreground mb-6">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
              <Button
                onClick={() => refetchTopics()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PerformanceMonitor componentName="OptimizedTopicList">
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
              <Button
                onClick={() => setIsCreateTopicModalOpen(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Topic</span>
              </Button>
            </div>
          </div>

          {/* Performance Controls */}
          <div className="flex gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
            <Button
              variant={useVirtualization ? "default" : "outline"}
              size="sm"
              onClick={() => setUseVirtualization(!useVirtualization)}
            >
              Virtualization
            </Button>
            <Button
              variant={useInfiniteScroll ? "default" : "outline"}
              size="sm"
              onClick={() => setUseInfiniteScroll(!useInfiniteScroll)}
            >
              Infinite Scroll
            </Button>
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
              <MessageSquare className="h-4 w-4" />
              All Topics
            </Button>
            <Button
              variant={selectedFilter === "top" ? "default" : "outline"}
              onClick={() => setSelectedFilter("top")}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Top
            </Button>
            <Button
              variant={selectedFilter === "Questions" ? "default" : "outline"}
              onClick={() => setSelectedFilter("Questions")}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Questions
            </Button>
            <Button
              variant={selectedFilter === "Best Practices" ? "default" : "outline"}
              onClick={() => setSelectedFilter("Best Practices")}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Best Practices
            </Button>
            <Button
              variant={selectedFilter === "Announcements" ? "default" : "outline"}
              onClick={() => setSelectedFilter("Announcements")}
              className="flex items-center gap-2"
            >
              <Megaphone className="h-4 w-4" />
              Announcements
            </Button>
          </div>

          {/* Topics List */}
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
              ) : useVirtualization ? (
                <VirtualizedList
                  items={paginatedTopics}
                  height={600}
                  itemHeight={120}
                  renderItem={renderTopicItem}
                  className="divide-y"
                />
              ) : useInfiniteScroll ? (
                <InfiniteScroll
                  hasMore={currentPage < totalPages}
                  isLoading={false}
                  onLoadMore={handleLoadMore}
                >
                  <div className="divide-y">
                    {paginatedTopics.map((topic) => (
                      <TopicItem
                        key={topic.id}
                        topic={topic}
                        onNavigate={handleNavigate}
                        onLike={handleLike}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <div className="divide-y">
                  {paginatedTopics.map((topic) => (
                    <TopicItem
                      key={topic.id}
                      topic={topic}
                      onNavigate={handleNavigate}
                      onLike={handleLike}
                      onShare={handleShare}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {!useInfiniteScroll && totalPages > 1 && (
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
      </div>
      
      {/* Create Topic Modal */}
      <CreateTopicModal 
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        position="bottom"
      />
    </PerformanceMonitor>
  );
};

export default OptimizedTopicList;

