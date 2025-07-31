import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Filter, Clock, MessageSquare, Eye, Tag, Award, Star, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const OpenQuestions = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  const openQuestions = [
    {
      id: 1,
      title: "How to implement OAuth2 with fastn for Google API integration?",
      description: "I'm trying to integrate Google Calendar API using OAuth2 authentication in my fastn application. Can someone help me with the proper implementation steps and best practices?",
      category: "Authentication",
      difficulty: "Intermediate",
      bounty: 75,
      timeAgo: "2 hours ago",
      views: 23,
      answers: 0,
      tags: ["oauth", "authentication", "google-api", "security"],
      author: "dev_learner",
      authorAvatar: "DL",
      isUrgent: true,
      isFeatured: false
    },
    {
      id: 2,
      title: "Best practices for handling large datasets in fastn workflows",
      description: "I'm processing datasets with 100k+ records and experiencing performance issues. Looking for optimization strategies and best practices for handling large data volumes.",
      category: "Performance",
      difficulty: "Advanced",
      bounty: 100,
      timeAgo: "4 hours ago",
      views: 15,
      answers: 1,
      tags: ["performance", "data", "workflows", "optimization"],
      author: "data_engineer",
      authorAvatar: "DE",
      isUrgent: false,
      isFeatured: true
    },
    {
      id: 3,
      title: "Setting up webhook endpoints for real-time notifications",
      description: "Need help setting up webhook endpoints to receive real-time notifications from external services. Looking for a complete implementation guide.",
      category: "Integration",
      difficulty: "Intermediate",
      bounty: 50,
      timeAgo: "6 hours ago",
      views: 31,
      answers: 0,
      tags: ["webhooks", "notifications", "integration", "real-time"],
      author: "webhook_dev",
      authorAvatar: "WD",
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 4,
      title: "Error handling patterns for API rate limiting",
      description: "What are the best patterns for handling API rate limiting errors in fastn? Looking for robust error handling strategies.",
      category: "Best Practices",
      difficulty: "Intermediate",
      bounty: 60,
      timeAgo: "8 hours ago",
      views: 19,
      answers: 2,
      tags: ["error-handling", "rate-limiting", "api", "best-practices"],
      author: "error_handler",
      authorAvatar: "EH",
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 5,
      title: "Creating custom connectors for third-party services",
      description: "I need to create a custom connector for a service that doesn't have an existing connector. Looking for guidance on the connector development process.",
      category: "Development",
      difficulty: "Advanced",
      bounty: 80,
      timeAgo: "1 day ago",
      views: 42,
      answers: 0,
      tags: ["connectors", "third-party", "development", "custom"],
      author: "connector_dev",
      authorAvatar: "CD",
      isUrgent: true,
      isFeatured: false
    },
    {
      id: 6,
      title: "Database connection pooling in fastn applications",
      description: "How to implement connection pooling for database connections in fastn? Looking for performance optimization tips.",
      category: "Database",
      difficulty: "Intermediate",
      bounty: 45,
      timeAgo: "1 day ago",
      views: 28,
      answers: 1,
      tags: ["database", "connection-pooling", "performance"],
      author: "db_optimizer",
      authorAvatar: "DO",
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 7,
      title: "Testing strategies for fastn workflows",
      description: "What are the recommended testing strategies for fastn workflows? Looking for unit testing and integration testing approaches.",
      category: "Testing",
      difficulty: "Intermediate",
      bounty: 55,
      timeAgo: "2 days ago",
      views: 35,
      answers: 0,
      tags: ["testing", "workflows", "unit-testing", "integration"],
      author: "test_dev",
      authorAvatar: "TD",
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 8,
      title: "Deploying fastn applications to Kubernetes",
      description: "Looking for a step-by-step guide on deploying fastn applications to Kubernetes clusters with proper configuration.",
      category: "Deployment",
      difficulty: "Advanced",
      bounty: 90,
      timeAgo: "2 days ago",
      views: 18,
      answers: 0,
      tags: ["deployment", "kubernetes", "containers", "devops"],
      author: "k8s_dev",
      authorAvatar: "KD",
      isUrgent: false,
      isFeatured: true
    }
  ];

  const categories = [
    "Authentication",
    "Performance", 
    "Integration",
    "Best Practices",
    "Development",
    "Database",
    "Testing",
    "Deployment",
    "Security",
    "UI/UX"
  ];

  const difficulties = [
    { value: "all", label: "All Difficulties" },
    { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
    { value: "intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { value: "advanced", label: "Advanced", color: "bg-red-100 text-red-800" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "bounty", label: "Highest Bounty" },
    { value: "views", label: "Most Views" },
    { value: "urgent", label: "Urgent Questions" }
  ];

  const filteredQuestions = openQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty.toLowerCase() === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (selectedSort) {
      case "newest":
        return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
      case "oldest":
        return new Date(a.timeAgo).getTime() - new Date(b.timeAgo).getTime();
      case "bounty":
        return b.bounty - a.bounty;
      case "views":
        return b.views - a.views;
      case "urgent":
        return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/10";
      case "Intermediate": return "text-orange-400 bg-orange-500/10";
      case "Advanced": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const stats = [
    {
      title: "Open Questions",
      value: openQuestions.length.toString(),
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      title: "Total Bounty",
      value: `$${openQuestions.reduce((sum, q) => sum + q.bounty, 0)}`,
      icon: Award,
      color: "text-yellow-500"
    },
    {
      title: "Urgent Questions",
      value: openQuestions.filter(q => q.isUrgent).length.toString(),
      icon: TrendingUp,
      color: "text-red-500"
    },
    {
      title: "Featured Questions",
      value: openQuestions.filter(q => q.isFeatured).length.toString(),
      icon: Star,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-card"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Find Open Questions 🔍
              </h1>
              <p className="text-muted-foreground">
                Help others and earn points by answering questions from the fastn community.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search questions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {sortedQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                                  {question.title}
                                </h3>
                                {question.isUrgent && (
                                  <Badge variant="destructive" className="text-xs">
                                    Urgent
                                  </Badge>
                                )}
                                {question.isFeatured && (
                                  <Badge variant="secondary" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {question.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xl font-bold text-green-500">{question.bounty}</div>
                              <div className="text-xs text-muted-foreground">points</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                                    {question.authorAvatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{question.author}</span>
                              </div>
                              <span>•</span>
                              <span>{question.category}</span>
                              <span>•</span>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{question.timeAgo}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{question.answers} answers</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{question.views} views</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-3">
                            {question.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedDifficulty("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Call to Action */}
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-8 text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Ready to Help?</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Start answering questions and earn points while helping the community grow.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => navigate("/answer-earn")}
                    >
                      Learn How to Earn
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      View Leaderboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenQuestions; 