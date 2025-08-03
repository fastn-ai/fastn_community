import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, Loader2, AlertCircle, RefreshCw, ExternalLink, Github, Globe, Star, Heart, Share2, Bookmark, MessageSquare, Eye, Calendar, User, Zap, Trophy } from "lucide-react";
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

const BuiltWithFastn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSort, setFilterSort] = useState("latest");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch projects from API
  const fetchProjects = async (isRetry: boolean = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const allTopics = await ApiService.getAllTopics();
      
      // Filter for "Built with fastn" category projects
      const builtWithFastnProjects = allTopics.filter(topic => 
        topic.category_name === "Built with fastn" || 
        topic.category_name === "Showcase" ||
        topic.title.toLowerCase().includes("built with fastn") ||
        topic.description?.toLowerCase().includes("built with fastn")
      );

      setProjects(builtWithFastnProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "featured" && project.is_featured) ||
                         (filterStatus === "hot" && project.is_hot);
    return matchesSearch && matchesStatus;
  });

  // Sort projects based on filter
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (filterSort) {
      case "latest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return (b.like_count + b.reply_count) - (a.like_count + a.reply_count);
      case "views":
        return b.view_count - a.view_count;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleLike = (id: string) => {
    console.log("Liked project:", id);
    // You can implement actual like functionality here
  };

  const handleShare = (id: string) => {
    console.log("Sharing project:", id);
    if (navigator.share) {
      navigator.share({
        title: 'fastn Project',
        text: 'Check out this project built with fastn!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Project link copied to clipboard",
      });
    }
  };

  const handleBookmark = (id: string) => {
    console.log("Bookmarked project:", id);
    // You can implement actual bookmark functionality here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const parseTags = (tags?: string[] | string): string[] => {
    if (!tags) return [];
    
    // If tags is already an array, return it
    if (Array.isArray(tags)) {
      return tags.filter(tag => tag && tag.length > 0);
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
        console.error("Error parsing tags:", error);
        return [];
      }
    }
    
    return [];
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Built with fastn</h1>
                <p className="text-muted-foreground">Showcase your fastn projects</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading projects...</span>
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Built with fastn</h1>
                <p className="text-muted-foreground">Showcase your fastn projects</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading projects</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fetchProjects(true)}
                    disabled={retrying}
                    className="flex items-center gap-2"
                  >
                    {retrying ? (
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Built with fastn</h1>
              <p className="text-muted-foreground">Showcase your fastn projects</p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{projects.length}</p>
                        <p className="text-sm text-muted-foreground">Total Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {projects.filter(p => p.is_featured).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Featured</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {projects.filter(p => p.is_hot).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Trending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {projects.reduce((sum, p) => sum + p.like_count, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Likes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterSort} onValueChange={setFilterSort}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="hot">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/topic/${project.id}`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {project.is_featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {project.is_hot && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Zap className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-3">
                            {project.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Author Info */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={project.author_avatar} alt={project.author_username} />
                            <AvatarFallback>{getInitials(project.author_username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{project.author_username}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(project.created_at)}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        {project.tags && (() => {
                          const tags = parseTags(project.tags);
                          return tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          );
                        })()}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {project.view_count}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {project.reply_count}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(project.id);
                            }}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {project.like_count}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(project.id);
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            {project.share_count}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(project.id);
                            }}
                          >
                            <Bookmark className="w-4 h-4 mr-1" />
                            {project.bookmark_count}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedProjects.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
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

export default BuiltWithFastn;