import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Eye, Clock, Tag, Filter, TrendingUp, Star, Zap, MoreHorizontal, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TopicList = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const topics = [
    {
      id: 1,
      title: "How to implement OAuth2 with fastn?",
      content: "I'm trying to integrate Google Calendar API using OAuth2 authentication in my fastn application. Can someone help me with the proper implementation steps?",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      replies: 12,
      views: 156,
      activity: "2 hours ago",
      tags: ["oauth", "authentication", "google-api"],
      category: "Questions",
      isHot: true,
      isNew: false,
      publishedAt: "2024-01-15",
      readTime: "3 min"
    },
    {
      id: 2,
      title: "Best practices for handling large datasets in fastn workflows",
      content: "I'm processing datasets with 100k+ records and experiencing performance issues. Looking for optimization strategies.",
      author: "Alex Rodriguez",
      authorAvatar: "/avatars/alex.jpg",
      replies: 8,
      views: 89,
      activity: "4 hours ago",
      tags: ["performance", "data", "workflows"],
      category: "Best Practices",
      isHot: false,
      isNew: true,
      publishedAt: "2024-01-14",
      readTime: "2 min"
    },
    {
      id: 3,
      title: "Setting up webhook endpoints for real-time notifications",
      content: "Need help setting up webhook endpoints to receive real-time notifications from external services.",
      author: "Michael Park",
      authorAvatar: "/avatars/michael.jpg",
      replies: 5,
      views: 67,
      activity: "6 hours ago",
      tags: ["webhooks", "notifications", "integration"],
      category: "Questions",
      isHot: false,
      isNew: false,
      publishedAt: "2024-01-12",
      readTime: "1 min"
    },
    {
      id: 4,
      title: "Error handling patterns for API rate limiting",
      content: "What are the best patterns for handling API rate limiting errors in fastn? Looking for robust error handling strategies.",
      author: "Emma Thompson",
      authorAvatar: "/avatars/emma.jpg",
      replies: 15,
      views: 234,
      activity: "8 hours ago",
      tags: ["error-handling", "rate-limiting", "api"],
      category: "Best Practices",
      isHot: true,
      isNew: false,
      publishedAt: "2024-01-10",
      readTime: "4 min"
    },
    {
      id: 5,
      title: "Creating custom connectors for third-party services",
      content: "I need to create a custom connector for a service that doesn't have an existing connector. Looking for guidance.",
      author: "David Kim",
      authorAvatar: "/avatars/david.jpg",
      replies: 3,
      views: 45,
      activity: "1 day ago",
      tags: ["connectors", "third-party", "development"],
      category: "Questions",
      isHot: false,
      isNew: false,
      publishedAt: "2024-01-08",
      readTime: "2 min"
    },
    {
      id: 6,
      title: "Database connection pooling in fastn applications",
      content: "How to implement connection pooling for database connections in fastn? Looking for performance optimization tips.",
      author: "Lisa Wang",
      authorAvatar: "/avatars/lisa.jpg",
      replies: 7,
      views: 78,
      activity: "1 day ago",
      tags: ["database", "connection-pooling", "performance"],
      category: "Questions",
      isHot: false,
      isNew: false,
      publishedAt: "2024-01-05",
      readTime: "3 min"
    },
    {
      id: 7,
      title: "Testing strategies for fastn workflows",
      content: "What are the recommended testing strategies for fastn workflows? Looking for unit testing and integration testing approaches.",
      author: "James Wilson",
      authorAvatar: "/avatars/james.jpg",
      replies: 11,
      views: 123,
      activity: "2 days ago",
      tags: ["testing", "workflows", "unit-testing"],
      category: "Best Practices",
      isHot: false,
      isNew: false,
      publishedAt: "2024-01-03",
      readTime: "5 min"
    },
    {
      id: 8,
      title: "Deploying fastn applications to Kubernetes",
      content: "Looking for a step-by-step guide on deploying fastn applications to Kubernetes clusters with proper configuration.",
      author: "Maria Garcia",
      authorAvatar: "/avatars/maria.jpg",
      replies: 6,
      views: 92,
      activity: "2 days ago",
      tags: ["deployment", "kubernetes", "containers"],
      category: "Questions",
      isHot: false,
      isNew: false,
      publishedAt: "2024-01-01",
      readTime: "4 min"
    },
    {
      id: 9,
      title: "Community Guidelines and Rules",
      content: "Important information about community guidelines, posting rules, and best practices for engaging with the fastn community.",
      author: "Community Team",
      authorAvatar: "/avatars/community.jpg",
      replies: 25,
      views: 456,
      activity: "3 days ago",
      tags: ["guidelines", "rules", "community"],
      category: "Categories",
      isHot: true,
      isNew: false,
      publishedAt: "2024-01-01",
      readTime: "5 min"
    },
    {
      id: 10,
      title: "Getting Started with fastn - Complete Guide",
      content: "A comprehensive guide for newcomers to get started with fastn development, including installation, first project, and basic concepts.",
      author: "Fastn Team",
      authorAvatar: "/avatars/fastn.jpg",
      replies: 18,
      views: 789,
      activity: "4 days ago",
      tags: ["getting-started", "guide", "tutorial"],
      category: "Categories",
      isHot: true,
      isNew: false,
      publishedAt: "2023-12-30",
      readTime: "10 min"
    },
    {
      id: 11,
      title: "Advanced API Integration Patterns",
      content: "Deep dive into advanced patterns for integrating external APIs with fastn, including authentication, caching, and error handling.",
      author: "Expert Developer",
      authorAvatar: "/avatars/expert.jpg",
      replies: 22,
      views: 345,
      activity: "5 days ago",
      tags: ["api", "integration", "advanced"],
      category: "Best Practices",
      isHot: true,
      isNew: false,
      publishedAt: "2023-12-29",
      readTime: "8 min"
    }
  ];

  const filters = [
    { value: "all", label: "All Topics", icon: "📋" },
    { value: "top", label: "Top", icon: "🏆" },
    { value: "questions", label: "Questions", icon: "❓" },
    { value: "best-practices", label: "Best Practices", icon: "⭐" },
    { value: "announcements", label: "Announcements", icon: "📢" }
  ];

  const filteredTopics = topics.filter(topic => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "top") return topic.isHot || topic.replies > 10; // Top topics are hot or have many replies
    if (selectedFilter === "questions") return topic.category === "Questions";
    if (selectedFilter === "best-practices") return topic.category === "Best Practices";
    if (selectedFilter === "announcements") return topic.category === "Announcements";
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTopics = filteredTopics.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Questions": "bg-blue-100 text-blue-800",
      "Best Practices": "bg-green-100 text-green-800",
      "Announcements": "bg-red-100 text-red-800",
      "Built with fastn": "bg-purple-100 text-purple-800",
      "Categories": "bg-indigo-100 text-indigo-800"
    };
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 m-12">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Topics
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">Latest discussions in the fastn community</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate("/categories")} 
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <span>📂</span>
            <span>Categories</span>
          </Button>
          <Button 
            onClick={() => navigate("/create")} 
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Topic</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 m-12">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
            className="flex items-center space-x-2"
          >
            <span className="text-sm">{filter.icon}</span>
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] font-bold">Topic</TableHead>
              <TableHead className="w-[15%] font-bold">Replies</TableHead>
              <TableHead className="w-[15%] font-bold">Views</TableHead>
              <TableHead className="w-[20%] font-bold">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTopics.map((topic) => (
              <TableRow 
                key={topic.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <TableCell>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                        <AvatarFallback>{topic.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-1 text-lg">
                            {topic.title}
                          </h3>
                          {topic.isHot && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
                              <Zap className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                          {topic.isNew && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              <Star className="w-3 h-3 mr-1" />
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {topic.content}
                        </p>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs text-muted-foreground font-medium">{topic.author}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          {getCategoryBadge(topic.category)}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{topic.activity}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topic.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-semibold">{topic.replies}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">{topic.views}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{topic.activity}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tablet Table */}
      <div className="hidden md:block lg:hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%] font-bold">Topic</TableHead>
              <TableHead className="w-[15%] font-bold">Replies</TableHead>
              <TableHead className="w-[15%] font-bold">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTopics.map((topic) => (
              <TableRow 
                key={topic.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                        <AvatarFallback className="text-xs">{topic.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {topic.title}
                          </h3>
                          {topic.isHot && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {topic.content}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">{topic.author}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          {getCategoryBadge(topic.category)}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{topic.activity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{topic.replies}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold">{topic.views}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentTopics.map((topic) => (
          <Card
            key={topic.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/topic/${topic.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryBadge(topic.category)}
                    {topic.isHot && (
                      <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {topic.isNew && (
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {topic.content}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                    <AvatarFallback>{topic.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {topic.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {topic.publishedAt}
                    </span>
                    <span>{topic.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {topic.replies} replies
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {topic.views} views
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No topics found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or create a new topic
          </p>
          <Button 
            onClick={() => navigate("/create")}
          >
            Create New Topic
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicList;