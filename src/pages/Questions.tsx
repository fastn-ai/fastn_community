import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Heart, Share2, Bookmark, MessageSquare, MoreHorizontal, Calendar, User, CheckCircle, Clock, Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { ApiService, Topic } from "@/services/api";

const Questions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const topics = await ApiService.getAllTopics();
        setQuestions(topics);
        
        // Extract unique categories from topics
        const uniqueCategories = [...new Set(topics.map(topic => topic.category_name))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (question.description && question.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "answered" && question.reply_count > 0) ||
                         (filterStatus === "unanswered" && question.reply_count === 0);
    const matchesCategory = filterCategory === "all" || question.category_name === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleLike = (id: string) => {
    // Handle like functionality
    console.log("Liked question:", id);
    // You can implement actual like functionality here
  };

  const handleShare = (id: string) => {
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
      toast({
        title: "Link copied",
        description: "Question link copied to clipboard",
      });
    }
  };

  const handleBookmark = (id: string) => {
    // Handle bookmark functionality
    console.log("Bookmarked question:", id);
    // You can implement actual bookmark functionality here
  };

  const getStatusBadge = (replyCount: number) => {
    const status = replyCount > 0 ? "answered" : "unanswered";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">Questions</h1>
                <p className="text-muted-foreground">Get help from the community</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading questions...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">Questions</h1>
                <p className="text-muted-foreground">Get help from the community</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading questions</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                          {questions.filter(q => q.reply_count > 0).length}
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
                          {questions.filter(q => q.reply_count === 0).length}
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
                          {questions.reduce((sum, q) => sum + q.reply_count, 0)}
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
                            {getStatusBadge(question.reply_count)}
                            <Badge variant="outline">{question.category_name}</Badge>
                          </div>
                          <CardTitle className="text-xl">{question.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {question.description}
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
                            <AvatarImage src={question.author_avatar} alt={question.author_username} />
                            <AvatarFallback>{question.author_username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {question.author_username}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(question.created_at)}
                            </span>
                            <span>{question.view_count} views</span>
                            <span>{question.reply_count} answers</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(question.id);
                            }}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {question.like_count}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(question.id);
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            {question.share_count}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(question.id);
                            }}
                          >
                            <Bookmark className="w-4 h-4 mr-1" />
                            {question.bookmark_count}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {question.reply_count}
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