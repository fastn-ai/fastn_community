import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Eye, Clock, Tag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const TopicList = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const topics = [
    {
      id: 1,
      title: "How to implement OAuth2 with fastn?",
      description: "I'm trying to integrate Google Calendar API using OAuth2 authentication in my fastn application. Can someone help me with the proper implementation steps?",
      author: "sarah_chen",
      authorAvatar: "SC",
      replies: 12,
      views: 156,
      activity: "2 hours ago",
      tags: ["oauth", "authentication", "google-api"],
      category: "Questions"
    },
    {
      id: 2,
      title: "Best practices for handling large datasets in fastn workflows",
      description: "I'm processing datasets with 100k+ records and experiencing performance issues. Looking for optimization strategies.",
      author: "alex_rodriguez",
      authorAvatar: "AR",
      replies: 8,
      views: 89,
      activity: "4 hours ago",
      tags: ["performance", "data", "workflows"],
      category: "Best Practices"
    },
    {
      id: 3,
      title: "Setting up webhook endpoints for real-time notifications",
      description: "Need help setting up webhook endpoints to receive real-time notifications from external services.",
      author: "michael_park",
      authorAvatar: "MP",
      replies: 5,
      views: 67,
      activity: "6 hours ago",
      tags: ["webhooks", "notifications", "integration"],
      category: "Questions"
    },
    {
      id: 4,
      title: "Error handling patterns for API rate limiting",
      description: "What are the best patterns for handling API rate limiting errors in fastn? Looking for robust error handling strategies.",
      author: "emma_thompson",
      authorAvatar: "ET",
      replies: 15,
      views: 234,
      activity: "8 hours ago",
      tags: ["error-handling", "rate-limiting", "api"],
      category: "Best Practices"
    },
    {
      id: 5,
      title: "Creating custom connectors for third-party services",
      description: "I need to create a custom connector for a service that doesn't have an existing connector. Looking for guidance.",
      author: "david_kim",
      authorAvatar: "DK",
      replies: 3,
      views: 45,
      activity: "1 day ago",
      tags: ["connectors", "third-party", "development"],
      category: "Questions"
    },
    {
      id: 6,
      title: "Database connection pooling in fastn applications",
      description: "How to implement connection pooling for database connections in fastn? Looking for performance optimization tips.",
      author: "lisa_wang",
      authorAvatar: "LW",
      replies: 7,
      views: 78,
      activity: "1 day ago",
      tags: ["database", "connection-pooling", "performance"],
      category: "Questions"
    },
    {
      id: 7,
      title: "Testing strategies for fastn workflows",
      description: "What are the recommended testing strategies for fastn workflows? Looking for unit testing and integration testing approaches.",
      author: "james_wilson",
      authorAvatar: "JW",
      replies: 11,
      views: 123,
      activity: "2 days ago",
      tags: ["testing", "workflows", "unit-testing"],
      category: "Best Practices"
    },
    {
      id: 8,
      title: "Deploying fastn applications to Kubernetes",
      description: "Looking for a step-by-step guide on deploying fastn applications to Kubernetes clusters with proper configuration.",
      author: "maria_garcia",
      authorAvatar: "MG",
      replies: 6,
      views: 92,
      activity: "2 days ago",
      tags: ["deployment", "kubernetes", "containers"],
      category: "Questions"
    }
  ];

  const filters = [
    { value: "all", label: "All Topics" },
    { value: "questions", label: "Questions" },
    { value: "best-practices", label: "Best Practices" },
    { value: "announcements", label: "Announcements" }
  ];

  const filteredTopics = topics.filter(topic => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "questions") return topic.category === "Questions";
    if (selectedFilter === "best-practices") return topic.category === "Best Practices";
    if (selectedFilter === "announcements") return topic.category === "Announcements";
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 m-12">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Topics</h2>
          <p className="text-sm md:text-base text-muted-foreground">Latest discussions in the fastn community</p>
        </div>
        <Button onClick={() => navigate("/create")} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>New Topic</span>
        </Button>
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
            <Filter className="w-4 h-4" />
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
              <TableHead className="w-[50%]">Topic</TableHead>
              <TableHead className="w-[15%]">Replies</TableHead>
              <TableHead className="w-[15%]">Views</TableHead>
              <TableHead className="w-[20%]">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.map((topic) => (
              <TableRow 
                key={topic.id} 
                className="cursor-pointer hover:bg-accent"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {topic.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {topic.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">{topic.author}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{topic.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{topic.activity}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {topic.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{topic.replies}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{topic.views}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{topic.activity}</span>
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
              <TableHead className="w-[70%]">Topic</TableHead>
              <TableHead className="w-[15%]">Replies</TableHead>
              <TableHead className="w-[15%]">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.map((topic) => (
              <TableRow 
                key={topic.id} 
                className="cursor-pointer hover:bg-accent"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {topic.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {topic.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">{topic.author}</span>
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
                    <span>{topic.replies}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{topic.views}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredTopics.map((topic) => (
          <Card 
            key={topic.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/topic/${topic.id}`)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {topic.authorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{topic.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{topic.activity}</span>
                    </div>
                  </div>
                  <span className="text-xs">{topic.category}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {topic.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No topics found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or create a new topic
          </p>
          <Button onClick={() => navigate("/create")}>
            Create New Topic
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicList;