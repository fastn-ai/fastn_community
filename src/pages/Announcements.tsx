import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone, Heart, Share2, Bookmark, MessageSquare, MoreHorizontal, Calendar, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { useApi } from "@/services/api";
import { useEffect } from "react";

const Announcements = () => {
  const navigate = useNavigate();
  const { getAllTopics } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements data
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const allTopics = await getAllTopics();
        
        // Filter topics that are announcements
        const announcementTopics = allTopics.filter(topic => 
          topic.category_name === "Announcements" || 
          topic.title.toLowerCase().includes("announcement") ||
          topic.description.toLowerCase().includes("announcement")
        );
        
        setAnnouncements(announcementTopics);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [getAllTopics]);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || announcement.category_name === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleLike = (id: number) => {
    // Handle like functionality
    console.log("Liked announcement:", id);
    // You can implement actual like functionality here
    // For now, just log the action
  };

  const handleShare = (id: number) => {
    // Handle share functionality
    console.log("Sharing announcement:", id);
    // You can implement actual share functionality here
    // For example, copy to clipboard or open share dialog
    if (navigator.share) {
      navigator.share({
        title: 'fastn Community Announcement',
        text: 'Check out this announcement from the fastn community!',
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
    console.log("Bookmarked announcement:", id);
    // You can implement actual bookmark functionality here
    // For now, just log the action
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      release: "bg-blue-100 text-blue-800",
      update: "bg-purple-100 text-purple-800",
      tutorial: "bg-green-100 text-green-800",
      event: "bg-orange-100 text-orange-800"
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type}
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Announcements</h1>
              <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Megaphone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{loading ? "..." : announcements.length}</p>
                        <p className="text-sm text-muted-foreground">Total Announcements</p>
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
                          {loading ? "..." : announcements.reduce((sum, a) => sum + (a.like_count || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Likes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {loading ? "..." : announcements.reduce((sum, a) => sum + (a.share_count || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Shares</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Bookmark className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {loading ? "..." : announcements.reduce((sum, a) => sum + (a.bookmark_count || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Bookmarks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">Loading announcements...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="release">Releases</SelectItem>
                    <SelectItem value="update">Updates</SelectItem>
                    <SelectItem value="tutorial">Tutorials</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Announcements List */}
              <div className="space-y-4">
                {!loading && !error && filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-blue-600 border-blue-600">
                              {announcement.category_name}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{announcement.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {announcement.description}
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
                            <AvatarFallback>{announcement.author_username?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {announcement.author_username}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {announcement.publishedAt}
                            </span>
                            <span>{announcement.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(announcement.id)}
                            className={announcement.isLiked ? "text-red-500" : ""}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${announcement.isLiked ? "fill-current" : ""}`} />
                            {announcement.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(announcement.id)}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            {announcement.shares}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(announcement.id)}
                            className={announcement.isBookmarked ? "text-blue-500" : ""}
                          >
                            <Bookmark className={`w-4 h-4 mr-1 ${announcement.isBookmarked ? "fill-current" : ""}`} />
                            {announcement.bookmarks}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {announcement.comments}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-12">
                  <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
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

export default Announcements;