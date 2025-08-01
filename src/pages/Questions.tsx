import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Heart, Share2, Bookmark, MessageSquare, MoreHorizontal, Calendar, User, CheckCircle, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const Questions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const questions = [
    {
      id: 1,
      title: "How to implement authentication in fastn?",
      content: "I'm building a web application with fastn and need to implement user authentication. What's the best approach for handling login, registration, and session management?",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      status: "answered",
      category: "Authentication",
      likes: 45,
      shares: 12,
      comments: 8,
      bookmarks: 23,
      isLiked: false,
      isBookmarked: true,
      publishedAt: "2024-01-15",
      answers: 3,
      views: 234
    },
    {
      id: 2,
      title: "Database connection issues in production",
      content: "My fastn app works fine locally but I'm having trouble connecting to the database in production. The connection times out after a few seconds.",
      author: "Alex Rodriguez",
      authorAvatar: "/avatars/alex.jpg",
      status: "unanswered",
      category: "Database",
      likes: 23,
      shares: 5,
      comments: 12,
      bookmarks: 8,
      isLiked: true,
      isBookmarked: false,
      publishedAt: "2024-01-14",
      answers: 0,
      views: 156
    },
    {
      id: 3,
      title: "Best practices for API design with fastn",
      content: "I'm designing a REST API using fastn. What are the best practices for structuring endpoints, handling errors, and implementing pagination?",
      author: "Michael Park",
      authorAvatar: "/avatars/michael.jpg",
      status: "answered",
      category: "API Development",
      likes: 67,
      shares: 18,
      comments: 15,
      bookmarks: 34,
      isLiked: false,
      isBookmarked: false,
      publishedAt: "2024-01-12",
      answers: 5,
      views: 445
    },
    {
      id: 4,
      title: "Deployment to AWS with fastn",
      content: "What's the recommended way to deploy a fastn application to AWS? I'm looking for a step-by-step guide.",
      author: "Emma Thompson",
      authorAvatar: "/avatars/emma.jpg",
      status: "unanswered",
      category: "Deployment",
      likes: 34,
      shares: 9,
      comments: 6,
      bookmarks: 19,
      isLiked: false,
      isBookmarked: true,
      publishedAt: "2024-01-10",
      answers: 0,
      views: 189
    },
    {
      id: 5,
      title: "Performance optimization techniques",
      content: "My fastn application is running slowly. What are some effective techniques for optimizing performance?",
      author: "David Kim",
      authorAvatar: "/avatars/david.jpg",
      status: "answered",
      category: "Performance",
      likes: 89,
      shares: 25,
      comments: 22,
      bookmarks: 45,
      isLiked: true,
      isBookmarked: false,
      publishedAt: "2024-01-08",
      answers: 7,
      views: 678
    },
    {
      id: 6,
      title: "Testing strategies for fastn applications",
      content: "What testing frameworks and strategies work best with fastn? I want to implement comprehensive testing for my application.",
      author: "Lisa Wang",
      authorAvatar: "/avatars/lisa.jpg",
      status: "unanswered",
      category: "Testing",
      likes: 28,
      shares: 7,
      comments: 4,
      bookmarks: 12,
      isLiked: false,
      isBookmarked: false,
      publishedAt: "2024-01-05",
      answers: 0,
      views: 123
    }
  ];

  const categories = [
    "Authentication",
    "Database",
    "API Development",
    "Deployment",
    "Performance",
    "Testing",
    "UI/UX",
    "Security",
    "Best Practices"
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || question.status === filterStatus;
    const matchesCategory = filterCategory === "all" || question.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleLike = (id: number) => {
    // Handle like functionality
    console.log("Liked question:", id);
    // You can implement actual like functionality here
  };

  const handleShare = (id: number) => {
    // Handle share functionality
    console.log("Sharing question:", id);
    // You can implement actual share functionality here
    if (navigator.share) {
      navigator.share({
        title: 'fastn Community Question',
        text: 'Check out this question from the fastn community!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      console.log("Link copied to clipboard");
    }
  };

  const handleBookmark = (id: number) => {
    // Handle bookmark functionality
    console.log("Bookmarked question:", id);
    // You can implement actual bookmark functionality here
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      answered: "bg-green-100 text-green-800",
      unanswered: "bg-yellow-100 text-yellow-800"
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status === "answered" ? "Answered" : "Unanswered"}
      </Badge>
    );
  };

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
             
              <h1 className="text-3xl font-bold text-foreground mb-2">Questions</h1>
              <p className="text-muted-foreground">Get help from the community</p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{questions.length}</p>
                        <p className="text-sm text-muted-foreground">Total Questions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {questions.filter(q => q.status === "answered").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Answered</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {questions.filter(q => q.status === "unanswered").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Unanswered</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {questions.reduce((sum, q) => sum + q.answers, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Answers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="unanswered">Unanswered</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
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
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/topic/${question.id}`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusBadge(question.status)}
                            <Badge variant="outline">{question.category}</Badge>
                          </div>
                          <CardTitle className="text-xl">{question.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {question.content}
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
                            <AvatarImage src={question.authorAvatar} alt={question.author} />
                            <AvatarFallback>{question.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {question.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {question.publishedAt}
                            </span>
                            <span>{question.views} views</span>
                            <span>{question.answers} answers</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(question.id)}
                            className={question.isLiked ? "text-red-500" : ""}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${question.isLiked ? "fill-current" : ""}`} />
                            {question.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(question.id)}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            {question.shares}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(question.id)}
                            className={question.isBookmarked ? "text-blue-500" : ""}
                          >
                            <Bookmark className={`w-4 h-4 mr-1 ${question.isBookmarked ? "fill-current" : ""}`} />
                            {question.bookmarks}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {question.comments}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;